/**
 * Compliant CommentBitmap Polyfill For BiliScriptEngine
 */
module Display {
	export class CommentBitmap extends DisplayObject implements IComment {
		private _mM:MotionManager = new MotionManager(this);

		constructor(params:Object) {
			this.initStyle(params);
			Runtime.registerObject(this);
		}

		get motionManager():MotionManager {
			return _mM;
		}

		set motionManager(m):void {
			__trace("IComment.motionManager is read-only", "warn");
		}

		public initStyle(style:Object):void {
			__trace("CommentBitmap.initStyle not available", "warn");
		}

	}
}