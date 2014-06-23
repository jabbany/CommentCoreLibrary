/**
 * MotionManager Polyfill for AS3.
 * Author: Jim Chen
 * Part of the CCLScripter
 */
/// <reference path="../Runtime.d.ts" />

/// <reference path="DisplayObject.ts" />
module Display {
	export class MotionManager {
		private _isRunning:boolean = false;
		private _ttl:number;
		private _dur:number;
		private _parent:Display.DisplayObject;
		private _timer:Runtime.Timer;

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
			this._isRunning = true;
			var self:MotionManager = this;
			var _lastTime:number = Date.now();
			this._timer.addEventListener("timer", function(){
				var dur:number = Date.now() - _lastTime;
				self._dur -= dur;
				if(self._dur <= 0){
					self.stop();
					if(self.oncomplete){
						self.oncomplete();
					}
					self._parent.unload();
				}
				_lastTime = Date.now();
			});
			this._timer.start();
		}

		public stop():void {
			if (!this._isRunning)
				return;
			this._isRunning = false;
			this._timer.stop();
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