/**
 * Tween Library
 * Author: Jim Chen
 */
/// <reference path="../Runtime.d.ts" />
/// <reference path="Easing.ts" />
module Tween {
	export class ITween {
		private _target:any = null;
		private _duration:number;
		private _isPlaying:boolean = false;
		private _currentTime:number = 0;
		private _repeats:number = 0;
		private _timer:Runtime.Timer = new Runtime.Timer(40);
		public easing:Function = Tween.linear;
		public step:Function;

		constructor(target:any, duration:number = 0) {
			this._target = target;
			this._duration = duration;
			/** Set timer **/
			var timer:Runtime.Timer = this._timer;
			var tween:ITween = this;
			this._timer.addEventListener("timer", function () {
				if (timer.hasOwnProperty("wallTime")) {
					var elapsed = Date.now() - timer["wallTime"];
					tween._currentTime += elapsed;
					timer["wallTime"] = Date.now();
					tween.step(tween._target, tween._currentTime, tween._duration);
					if (tween._currentTime >= tween._duration) {
						tween._repeats--;
						if (tween._repeats < 0) {
							tween.stop();
							tween._currentTime = tween._duration;
							tween.step(tween._target, tween._currentTime, tween._duration);
						}
					}
				}
			})
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
			__trace("Deprecated: You should not set a new target for an old tween.", "warn");
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
			if (this._isPlaying)
				return;
			this.gotoAndPlay(this._currentTime);
		}

		public stop():void {
			if (!this._isPlaying)
				return;
			this.gotoAndStop(this._currentTime);
		}

		public gotoAndStop(position:number):void {
			this._currentTime = position;
			if (this._isPlaying) {
				this._timer.stop();
				this._isPlaying = false;
			}
			this.step(this._target, this._currentTime, this._duration);
		}

		public gotoAndPlay(position:number):void {
			this._currentTime = position;
			if (!this._isPlaying) {
				this._timer["wallTime"] = Date.now();
				this._timer.start();
				this._isPlaying = true;
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

	function createStepFunction(object:any, dest:Object, src:Object, tween:ITween) {
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
				if (!src.hasOwnProperty(property))
					continue;
				object[property] = tween.easing(currentTime, src[property], dest[property] - src[property], totalTime);
			}
		};
	}

	export function tween(object:any, dest:Object = {}, src:Object = {}, duration:number = 0, easing:Function = null):ITween {
		var t:ITween = new ITween(object, duration * 1000);
		t.step = createStepFunction(object, dest, src, t);
		if (easing !== null) {
			t.easing = easing;
		}
		return t;
	}

	export function to(object:any, dest:Object = {}, duration:number = 0, easing:Function = null):ITween {
		var src:Object = {};
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

	export function beizer():ITween {
		return null;
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
			src.step(target, currentTime - delay * 1000, totalTime);
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
		var clone:ITween = src.clone();
		clone.repeat = times;
		return clone;
	}

	export function slice(src:ITween, from:number, to:number):ITween {
		from *= 1000;
		to *= 1000;
		var newTween:ITween = new ITween(src.target, to - from);
		newTween.step = function (target:any, currentTime:number, totalTime:number) {
			src.step(target, from + currentTime, src.duration);
		}
		return newTween;
	}

	export function serial(...args:ITween[]):ITween {
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