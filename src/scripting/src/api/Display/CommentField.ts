/**
 * Compliant CommentField Polyfill For BiliScriptEngine
 */
/// <reference path="TextField.ts" />
/// <reference path="IComment.ts" />
/// <reference path="MotionManager.ts" />
module Display {
	class CommentField extends TextField implements IComment {
		private _mM:MotionManager = new MotionManager(this);

		constructor(text:string, params:Object) {
			super(text, 0xffffff);
			this.initStyle(params);
			Runtime.registerObject(this);
		}

		get motionManager():MotionManager {
			return this._mM;
		}

		set motionManager(m:MotionManager) {
			__trace("IComment.motionManager is read-only", "warn");
		}

		public remove():void {
			this.unload();
		}

		public initStyle(style:Object):void {

		}
	}

	export function createComment(text:string, params:Object):any {
		return new CommentField(text, params);
	}

}