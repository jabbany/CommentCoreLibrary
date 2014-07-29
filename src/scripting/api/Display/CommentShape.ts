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
			this.initStyle(params);
			Runtime.registerObject(this);
			this.bindParent(params);
			this._mM.play();
		}

		get motionManager():MotionManager {
			return this._mM;
		}

		set motionManager(m:MotionManager) {
			__trace("IComment.motionManager is read-only", "warn");
		}

		private bindParent(params:Object):void {
			if (params.hasOwnProperty("parent")) {
				(<DisplayObject> params["parent"]).addChild(this);
			}
		}

		public initStyle(style:Object):void {
			if (style["lifeTime"]) {
				this._mM.dur = style["lifeTime"] * 1000;
			}
			if (style.hasOwnProperty("motionGroup")) {
				this._mM.initTweenGroup(style["motionGroup"], this._mM.dur);
			} else if (style.hasOwnProperty("motion")) {
				this._mM.initTween(style["motion"], false);
			}
		}

	}

	export function createShape(params:Object):any {
		return new CommentShape(params);
	}
}