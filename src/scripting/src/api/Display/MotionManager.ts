/**
 * MotionManager Polyfill for AS3.
 * Author: Jim Chen
 * Part of the CCLScripter
 */
/// <reference path="DisplayObject.ts" />
module Display {
	export class MotionManager {
		private _isRunning:boolean = false;
		private _ttl:number;
		private _dur:number;
		private _parent:Display.DisplayObject;
		private _timer:number;
		private _lastTick:number;

		public oncomplete:Function = null;

		constructor(o:Display.DisplayObject, dur:number = 1000) {
			this._ttl = dur;
			this._dur = dur;
			this._parent = o;
		}

		set dur(dur:number) {
			this._dur = dur;
			this._ttl = dur;
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
			this._isRunning = true;
			this._lastTick = Date.now();
			var self:MotionManager = this;

			this._timer = setInterval(function () {
				var dur:number = Date.now() - self._lastTick;
				this._ttl -= dur;
				if (this._ttl <= 0) {
					this._ttl = 0;
					this.stop();
					if (this.oncomplete) {
						this.oncomplete();
					}
					/* TODO: Update this to use remove() instead*/
					this._parent.unload();
				}
				self._lastTick = Date.now();
			}, 1000 / Display.frameRate);
		}

		public stop():void {
			if (!this._isRunning)
				return;
			this._isRunning = false;
			clearInterval(this._timer);
		}

		public forecasting(time:number):boolean {
			return false;
		}

		public setPlayTime(playtime:number):void {

		}

		public initTween(motion:Object, repeat:boolean):void {
			if (motion.hasOwnProperty("lifeTime")) {
				this._ttl = motion["lifeTime"] * 1000;
				if (isNaN(this._ttl)) {
					this._ttl = 3000;
				}
			}
		}

		public initTweenGroup(motionGroup:Array<Object>, lifeTime:number):void {

		}

		public setCompleteListener(listener:Function):void {
			this.oncomplete = listener;
		}
	}
}