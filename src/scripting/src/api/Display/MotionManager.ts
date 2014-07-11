/**
 * MotionManager Polyfill for AS3.
 * Author: Jim Chen
 * Part of the CCLScripter
 */
/// <reference path="../Runtime.d.ts" />
/// <reference path="../Tween.d.ts" />

/// <reference path="DisplayObject.ts" />
module Display {
	export class MotionManager {
		private _isRunning:boolean = false;
		private _ttl:number;
		private _dur:number;
		private _parent:Display.DisplayObject;
		private _timer:Runtime.Timer;
		private _tween:Tween.ITween;
		public oncomplete:Function = null;

		constructor(o:Display.DisplayObject, dur:number = 1000) {
			this._ttl = dur;
			this._dur = dur;
			this._parent = o;
			this._timer = new Runtime.Timer(41, 0);
		}

		set dur(dur:number) {
			this._dur = dur;
			this._ttl = dur;
			this._timer.stop();
			this._timer = new Runtime.Timer(41, 0);
		}

		get dur():number {
			return this._dur;
		}

		get running():boolean {
			return this._isRunning;
		}

		public reset():void {
			this._ttl = this._dur;
		}

		public play():void {
			if (this._isRunning)
				return;
			if (this._dur === 0)
				return;
			this._isRunning = true;
			var self:MotionManager = this;
			var _lastTime:number = Date.now();
			this._timer.addEventListener("timer", function () {
				var dur:number = Date.now() - _lastTime;
				self._dur -= dur;
				if (self._dur <= 0) {
					self.stop();
					if (self.oncomplete) {
						self.oncomplete();
					}
					self._parent.unload();
				}
				_lastTime = Date.now();
			});
			this._timer.start();
			if (this._tween) {
				this._tween.play();
			}
		}

		public stop():void {
			if (!this._isRunning)
				return;
			this._isRunning = false;
			this._timer.stop();
			if (this._tween) {
				this._tween.stop();
			}
		}

		public forecasting(time:number):boolean {
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
				tweens.push(Tween.tween(this._parent, dst, src, mProp["lifeTime"], mProp["easing"]));
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