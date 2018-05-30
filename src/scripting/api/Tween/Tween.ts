/// <reference path="../Runtime.d.ts" />

/// <reference path="Easing.ts" />

/**
 * Tween Library
 * @author Jim Chen
 */
module Tween {
  // Property shorthand
  type ValueMap = {[prop:string]: number};
  type ValueListMap = {[prop:string]: Array<number>};

  export class ITween {
    private _target:any = null;
    private _duration:number;
    private _isPlaying:boolean = false;
    private _currentTime:number = 0;
    private _repeats:number = 0;
    private _timeKeeper:Runtime.TimeKeeper;
    private _timer:Runtime.Timer;
    public easing:Function = Tween.linear;
    public step:Function = () => {};

    constructor(target:any, duration:number = 0) {
      this._target = target;
      this._duration = duration;
      this._timeKeeper = new Runtime.TimeKeeper();
      this._timer = new Runtime.Timer(40);

      // Timer related
      var self:ITween = this;
      this._timer.addEventListener("timer", () => {
        self._onTimerEvent();
      });
    }

    private _onTimerEvent():void {
      // Ignore all the timer events if we're not playing
      if (this._isPlaying) {
        this._currentTime += this._timeKeeper.elapsed;
        this._timeKeeper.reset();
        this.step(this._target, this._currentTime, this._duration);
        if (this._currentTime >= this._duration) {
          this._repeats--;
          if (this._repeats < 0) {
            this.stop();
            this._currentTime = this._duration;
          } else {
            this._currentTime = 0;
          }
          this.step(this._target, this._currentTime, this._duration);
        }
      }
    }

    set duration(dur:number) {
      this._duration = dur;
    }

    get duration():number {
      return this._duration;
    }

    set position(position:number) {
      this._currentTime = position;
    }

    get position():number {
      return this._currentTime;
    }

    set repeat(r:number) {
      this._repeats = r;
    }

    get repeat():number {
      return this._repeats;
    }

    set target(a:any) {
      __trace("Deprecated: You should not set a new target for an old tween.",
        "warn");
      this._target = a;
    }

    get target():any {
      return this._target;
    }

    public clone():ITween {
      var clone:ITween = new ITween(this._target, this._duration);
      clone.easing = this.easing;
      clone.step = this.step;
      return clone;
    }

    public scale(factor:number):void {
      this._currentTime *= factor;
      this._duration *= factor;
    }

    public play():void {
      if (this._isPlaying) {
        return;
      }
      this.gotoAndPlay(this._currentTime);
    }

    public stop():void {
      if (!this._isPlaying) {
        return;
      }
      this.gotoAndStop(this._currentTime);
    }

    public gotoAndStop(position:number):void {
      this._currentTime = position;
      if (this._isPlaying) {
        this._isPlaying = false;
        this._timer.stop();
      }
      this.step(this._target, this._currentTime, this._duration);
    }

    public gotoAndPlay(position:number):void {
      this._currentTime = position;
      if (!this._isPlaying) {
        this._isPlaying = true;
        this._timer.start();
      }
      this.step(this._target, this._currentTime, this._duration);
    }

    public togglePause():void {
      if (this._isPlaying) {
        this.stop();
      } else {
        this.play();
      }
    }
  }

  function createStepFunction(object:any, dest:ValueMap, src:ValueMap, tween:ITween) {
    for (var property in dest) {
      if (!src.hasOwnProperty(property)) {
        src[property] = object[property];
      }
    }
    for (var property in src) {
      if (!dest.hasOwnProperty(property)) {
        dest[property] = src[property];
      }
    }
    return function (object:any, currentTime:number, totalTime:number) {
      for (var property in src) {
        if (!src.hasOwnProperty(property)) {
          continue;
        }
        object[property] = tween.easing(currentTime,
            src[property],
            dest[property] - src[property],
            totalTime);
      }
    };
  }

  export function tween(object:any,
      dest:ValueMap = {},
      src:ValueMap = {},
      duration:number = 0,
      easing:Function = null):ITween {

    var t:ITween = new ITween(object, duration * 1000);
    t.step = createStepFunction(object, dest, src, t);
    if (easing !== null) {
      t.easing = easing;
    }
    return t;
  }

  export function to(object:any,
      dest:ValueMap = {},
      duration:number = 0,
      easing:Function = null):ITween {

    var src:ValueMap = {};
    for (var x in dest) {
      if (dest.hasOwnProperty(x)) {
        if (typeof object[x] !== "undefined") {
          src[x] = object[x];
        } else {
          src[x] = 0;
        }
      }
    }
    return Tween.tween(object, dest, src, duration, easing);
  }

  export function bezier(object:any,
      dest:ValueMap,
      src:ValueMap,
      control:ValueListMap,
      duration:number = 1.0,
      easing:Function = null):ITween {

    var tween:ITween = new ITween(object, duration * 1000);
    if (easing !== null && typeof easing === 'function') {
      tween.easing = easing;
    }
    // Create real control arrays
    var finalControlPoints:ValueListMap = {};
    for (var prop in control) {
      if (Array.isArray(control[prop]) && control[prop].length > 0) {
        finalControlPoints[prop] = control[prop];
      }
    }
    // Sanity
    if (typeof src === 'undefined' || src === null) {
      src = {};
    }
    if (typeof dest === 'undefined' || dest === null) {
      dest = {};
    }
    // Prepopulate the control points
    for (var prop in finalControlPoints) {
      if (!(prop in src)) {
        src[prop] = tween.target[prop];
      }
      if (!(prop in dest)) {
        dest[prop] = finalControlPoints[prop][finalControlPoints[prop].length - 1];
      }
    }
    /**
     * Code from https://github.com/minodisk/minodisk-as/blob/master/thirdparty/org/libspark/betweenas3/core/updaters/BezierUpdater.as
     * Used under permission of MIT License for betweenaas3.
     * See linked file for full license text.
     **/
    tween.step = function (target:any, currentTime:number, totalTime:number) {
      var t:number = Math.min(tween.easing(currentTime, 0, 1, totalTime), 1);
      for (var prop in finalControlPoints) {
        var controlPoints:Array<number> = finalControlPoints[prop];
        var numControl:number = controlPoints.length;
        // Figure out which three control points to use
        var firstIndex:number = Math.floor(t * numControl);
        // Figure out how far along that segment
        var segmentT:number = (t - firstIndex / numControl) * numControl;
        if (numControl === 1) {
          // 3 control points
          target[prop] = src[prop] +
            2 * t * (1 - t) * (controlPoints[0] - src[prop]) +
            t * t * (dest[prop] - src[prop]);
        } else {
          var p1:number = 0;
          var p2:number = 0;
          if (firstIndex === 0) {
            p1 = src[prop];
            p2 = (controlPoints[0] + controlPoints[1]) / 2;
          } else if (firstIndex === numControl - 1) {
            p1 = (controlPoints[firstIndex - 1] + controlPoints[firstIndex]) / 2
            p2 = dest[prop];
          } else {
            p1 = (controlPoints[firstIndex - 1]  + controlPoints[firstIndex]) / 2;
            p2 = (controlPoints[firstIndex] + controlPoints[firstIndex + 1]) / 2;
          }
          target[prop] = p1 +
            2 * segmentT * (1 - segmentT) * (controlPoints[firstIndex] - p1) +
            segmentT * segmentT * (p2 - p1);
        }
      }
    }
    return tween;
  }

  export function scale(src:ITween, scale:number):ITween {
    var clone:ITween = src.clone();
    clone.scale(scale);
    return clone;
  }

  export function delay(src:ITween, delay:number):ITween {
    var newTween:ITween = new ITween(src.target, src.duration + delay * 1000);
    newTween.step = function (target:any, currentTime:number, totalTime:number) {
      if (currentTime <= delay * 1000) {
        return;
      }
      src.step(target, currentTime - delay * 1000, totalTime - delay * 1000);
    }
    return newTween;
  }

  export function reverse(src:ITween):ITween {
    var newTween:ITween = new ITween(src.target, src.duration);
    newTween.step = function (target:any, currentTime:number, totalTime:number) {
      src.step(target, totalTime - currentTime, totalTime);
    }
    return newTween;
  }

  export function repeat(src:ITween, times:number):ITween {
    var newTween:ITween = new ITween(src.target, src.duration * times);
    newTween.step = function(target:any, currentTime:number, totalTime:number){
      src.step(target, currentTime % src.duration, src.duration);
    };
    return newTween;
  }

  export function slice(src:ITween, from:number, to:number):ITween {
    if (to === null) {
      to = src.duration;
    }
    if (to < from) {
      to = from;
    }
    from *= 1000;
    to *= 1000;
    var newTween:ITween = new ITween(src.target, to - from);
    newTween.step = function (target:any, currentTime:number, totalTime:number) {
      src.step(target, from + currentTime, src.duration);
    }
    return newTween;
  }

  export function serial(...args:ITween[]):ITween {
    // Check if there are any tweens
    if (args.length === 0) {
      return new ITween({}, 0);
    }
    var totalTime:number = 0;
    var end:Array<number> = [];
    var start:Array<number> = [];
    for (var i = 0; i < args.length; i++) {
      start.push(totalTime);
      totalTime += args[i].duration;
      end.push(totalTime);
    }
    var newTween:ITween = new ITween({}, totalTime);
    newTween["lastSeek"] = 0;
    newTween.step = function (target:any, currentTime:number, totalTime:number) {
      if (currentTime <= end[newTween["lastSeek"]]) {
        var currentTween:ITween = args[newTween["lastSeek"]];
        currentTween.step(currentTween.target, currentTime - start[newTween["lastSeek"]], currentTween.duration);
        return;
      } else {
        var oldTween:ITween = args[newTween["lastSeek"]];
        oldTween.step(oldTween.target, oldTween.duration, oldTween.duration);
      }
      for (var seek:number = 0; seek < end.length; seek++) {
        if (currentTime < end[seek]) {
          newTween["lastSeek"] = seek;
          var currentTween:ITween = args[newTween["lastSeek"]];
          currentTween.step(currentTween.target, currentTime - start[newTween["lastSeek"]], currentTween.duration);
          return;
        }
      }
    }
    return newTween;
  }

  export function parallel(...args:ITween[]):ITween {
    var totalTime:number = 0;
    for (var i = 0; i < args.length; i++) {
      totalTime = Math.max(args[i].duration, totalTime);
    }
    var tweens:ITween[] = args;
    var newTween:ITween = new ITween({}, totalTime);
    newTween.step = function (target:any, currentTime:number, totalTime:number) {
      for (var i = 0; i < tweens.length; i++) {
        tweens[i].step(tweens[i].target, Math.min(currentTime, tweens[i].duration), tweens[i].duration);
      }
    }
    return newTween;
  }
}
