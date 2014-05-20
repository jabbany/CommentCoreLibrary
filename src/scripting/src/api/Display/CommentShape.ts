/**
 * Compliant CommentShape Polyfill For BiliScriptEngine
 */
/// <reference path="Shape.ts" />
/// <reference path="IComment.ts" />
/// <reference path="MotionManager.ts" />
module Display {
	class CommentShape extends Shape implements IComment {
		private _mM:MotionManager = new MotionManager(this);

		constructor(params:Object) {
			super();
			this.initStyle(params);
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

	export function createShape(params:Object):any {
		return new CommentShape(params);
	}
}