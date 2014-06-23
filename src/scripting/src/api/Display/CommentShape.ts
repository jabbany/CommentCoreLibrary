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
			this.setDefaults(params);
			this.initStyle(params);// This is for the special styles
			Runtime.registerObject(<any> this);
		}

		get motionManager():MotionManager {
			return this._mM;
		}

		set motionManager(m:MotionManager) {
			__trace("IComment.motionManager is read-only", "warn");
		}

		public initStyle(style:Object):void {
			if (style["lifeTime"]) {
				this._mM.dur = style["lifeTime"] * 1000;
			}
			this._mM.play();
		}

	}

	export function createShape(params:Object):any {
		return new CommentShape(params);
	}
}