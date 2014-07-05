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

		/**
		 * Set the style for the UIComponent which this is
		 * @param styleProp - style to set
		 * @param value - value to set the style to
		 */
		public setStyle(styleProp:string, value:any):void{
			__trace("UIComponent.setStyle not implemented","warn");
		}

		get motionManager():MotionManager {
			return this._mM;
		}

		set motionManager(m:MotionManager) {
			__trace("IComment.motionManager is read-only", "warn");
		}

		public initStyle(style:Object):void {

		}

		public serialize():Object{
			var serialized:Object = super.serialize();
			serialized["class"] = "Button";
			return serialized;
		}
	}

	export function createButton(params:Object):any {
		return new CommentButton(params);
	}
}