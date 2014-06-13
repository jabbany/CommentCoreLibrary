/**
 * Compliant CommentButton Polyfill For BiliScriptEngine
 */
/// <reference path="Sprite.ts" />
/// <reference path="IComment.ts" />
/// <reference path="MotionManager.ts" />
module Display {
	class CommentButton extends Sprite implements IComment {
		private _mM:MotionManager = new MotionManager(this);

		constructor(params:Object) {
			super();
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

	export function createButton(params:Object):any {
		return new CommentButton(params);
	}
}