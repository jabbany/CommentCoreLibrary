/**
 * Compliant CommentField Polyfill For BiliScriptEngine
 */
module Display {
	class CommentField extends TextField implements IComment {
		private _mM:MotionManager = new MotionManager(this);

		constructor(text:string, params:Object) {
			this.initStyle(params);
		}

		get motionManager():MotionManager {
			return _mM;
		}

		set motionManager(m):void {
			__trace("IComment.motionManager is read-only", "warn");
		}

		public remove():void {
			this.unload();
		}

		public initStyle(style:Object):void {

		}
	}
}