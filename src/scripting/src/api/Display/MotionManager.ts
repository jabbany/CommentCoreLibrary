/**
 * MotionManager Polyfill for AS3.
 * Author: Jim Chen
 * Part of the CCLScripter
 */
module Display {
	class MotionManager {
		private _isRunning:boolean = false;
		private onComplete = null;

		constructor(o:DisplayObject) {

		}

		get running():boolean {
			return _isRunning;
		}

		public reset():void {

		}

		public play():void {

		}

		public stop():void {

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

		}
	}
}