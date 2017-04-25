/// <reference path="../OOAPI.d.ts" />
/// <reference path="../Runtime.d.ts" />
/// <reference path="../Tween.d.ts" />

/// <reference path="DisplayObject.ts" />
module Display {

  /**
   * MotionManager Polyfill for AS3.
   * @author Jim Chen
   */
  export class MotionManager {
    private _isRunning:boolean = false;
    private _ttl:number;
    private _dur:number;
    private _parent:DisplayObject;
    private _timer:Runtime.Timer;
    private _timeKeeper:Runtime.TimeKeeper;
    private _independentTimer:boolean;
    private _tween:Tween.ITween;
    public oncomplete:Function = null;

    constructor(o:DisplayObject,
      dur:number = 1000,
      independentTimer:boolean = false) {

      if (typeof o === 'undefined' || o === null) {
        throw new Error('MotionManager must be bound to a DisplayObject.');
      }

      this._ttl = dur;
      this._dur = dur;
      this._parent = o;
      this._independentTimer = independentTimer;
      this._timeKeeper = new Runtime.TimeKeeper();

      var self = this;
      if (this._independentTimer) {
        this._timer = new Runtime.Timer(41, 0);
        this._timer.addEventListener('timer', () => {
          self._onTimerEvent();
        });
        this._timer.start();
      } else {
        this._parent.addEventListener('enterFrame', () => {
          self._onTimerEvent();
        });
      }
    }

    set dur(dur:number) {
      this._timeKeeper.reset();
      this._ttl = dur;
      this._dur = dur;
    }

    get dur():number {
      return this._dur;
    }

    get running():boolean {
      return this._isRunning;
    }

    /**
     * Private method invoked every time a timer event is fired
     */
    private _onTimerEvent():void {
      // Ignore timer events if this is not running
      if (!this._isRunning) {
        return;
      }
      this._ttl -= this._timeKeeper.elapsed;
      this._timeKeeper.reset();
      if (this._ttl <= 0) {
        this.stop();
        if (typeof this.oncomplete === 'function') {
          this.oncomplete();
        }
        this._parent.unload();
      }
    }

    public reset():void {
      this._ttl = this._dur;
      this._timeKeeper.reset();
    }

    public play():void {
      if (this._isRunning) {
        return;
      }
      if (this._dur === 0 || this._ttl <= 0) {
        return;
      }
      this._isRunning = true;
      this._timeKeeper.reset();
      if (this._tween) {
        this._tween.play();
      }
    }

    public stop():void {
      if (!this._isRunning) {
        return;
      }
      this._isRunning = false;
      this._timeKeeper.reset();
      if (this._tween) {
        this._tween.stop();
      }
    }

    public forecasting(time:number):boolean {
      __trace('MotionManager.forecasting always returns false', 'warn');
      return false;
    }

    public setPlayTime(playtime:number):void {
      this._ttl = this._dur - playtime;
      if (this._tween) {
        if (this._isRunning) {
          this._tween.gotoAndPlay(playtime);
        } else {
          this._tween.gotoAndStop(playtime);
        }
      }
    }

    private motionSetToTween(motion:Object):Tween.ITween {
      var tweens:Array<Tween.ITween> = [];
      for (var movingVars in motion) {
        if (!motion.hasOwnProperty(movingVars)) {
          continue;
        }
        var mProp:Object = motion[movingVars];
        if (!mProp.hasOwnProperty("fromValue")) {
          continue;
        }
        if (!mProp.hasOwnProperty("toValue")) {
          mProp["toValue"] = mProp["fromValue"];
        }
        if (!mProp.hasOwnProperty("lifeTime")) {
          mProp["lifeTime"] = this._dur;
        }
        var src:Object = {}, dst:Object = {};
        src[movingVars] = mProp["fromValue"];
        dst[movingVars] = mProp["toValue"];
        if (typeof mProp["easing"] === "string") {
          mProp["easing"] = Tween.getEasingFuncByName(mProp["easing"]);
        }
        if (mProp.hasOwnProperty("startDelay")) {
          tweens.push(Tween.delay(
            Tween.tween(
              this._parent,
              dst,
              src,
              mProp["lifeTime"],
              mProp["easing"]),
              mProp["startDelay"] / 1000));
        }else {
          tweens.push(
            Tween.tween(
              this._parent,
              dst,
              src,
              mProp["lifeTime"],
              mProp["easing"]));
        }
      }
      return Tween.parallel.apply(Tween, tweens);
    }

    public initTween(motion:Object, repeat:boolean):void {
      this._tween = this.motionSetToTween(motion);
    }

    public initTweenGroup(motionGroup:Array<Object>, lifeTime:number):void {
      var tweens:Array<Tween.ITween> = [];
      for (var i = 0; i < motionGroup.length; i++) {
        tweens.push(this.motionSetToTween(motionGroup[i]));
      }
      this._tween = Tween.serial.apply(Tween, tweens);
    }

    public setCompleteListener(listener:Function):void {
      this.oncomplete = listener;
    }
  }
}
