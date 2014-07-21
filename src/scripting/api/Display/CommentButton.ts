/**
 * Compliant CommentButton Polyfill For BiliScriptEngine
 */
/// <reference path="Sprite.ts" />
/// <reference path="IComment.ts" />
/// <reference path="MotionManager.ts" />
module Display {
	class CommentButton extends Sprite implements IComment {
		private _mM:MotionManager = new MotionManager(this);
		private _label:string = "";

		constructor(params:Object) {
			super();
			this.setDefaults(params);
			this.initStyle(params);
			Runtime.registerObject(this);
			this.bindParent(params);
			this._mM.play();
		}

		/**
		 * Set the style for the UIComponent which this is
		 * @param styleProp - style to set
		 * @param value - value to set the style to
		 */
		public setStyle(styleProp:string, value:any):void {
			__trace("UIComponent.setStyle not implemented", "warn");
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
			if (style.hasOwnProperty("text")) {
				this._label = style["text"];
			}
			if (style.hasOwnProperty("motionGroup")) {
				this._mM.initTweenGroup(style["motionGroup"], this._mM.dur);
			} else if (style.hasOwnProperty("motion")) {
				this._mM.initTween(style["motion"], false);
			}
		}

		public serialize():Object {
			var serialized:Object = super.serialize();
			serialized["class"] = "Button";
			serialized["text"] = this._label;
			return serialized;
		}
	}

	export function createButton(params:Object):any {
		return new CommentButton(params);
	}
}