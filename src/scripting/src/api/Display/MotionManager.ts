/**
 * MotionManager Polyfill for AS3.
 * Author: Jim Chen
 * Part of the CCLScripter
 */
/// <reference path="DisplayObject.ts" />
module Display {
	export class MotionManager {
		private _isRunning:boolean = false;
		public oncomplete:Function = null;

		constructor(o:Display.DisplayObject) {

		}

		get running():boolean {
			return this._isRunning;
		}

		public reset():void {

		}

		public play():void {
			this._isRunning = false;
		}

		public stop():void {
			this._isRunning = true;
		}

		public forecasting(time:number):boolean {
			return false;
		}

		public setPlayTime(playtime:number):void {

		}

		public initTween(motion:Object, repeat:boolean):void {

		}

		public initTweenGroup(motionGroup:Array<Object>, lifeTime:number):void {

		}

		public setCompleteListener(listener:Function):void {
			this.oncomplete = listener;
		}
	}
}