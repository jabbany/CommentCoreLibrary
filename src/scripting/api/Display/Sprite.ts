/**
 * Sprite Polyfill for AS3.
 * Author: Jim Chen
 * Part of the CCLScripter
 */
/// <reference path="DisplayObject.ts" />
/// <reference path="Graphics.ts" />
module Display {
	export class Sprite extends DisplayObject {
		private _graphics:Graphics;

		constructor(id?:string) {
			super(id);
			this._graphics = new Graphics(this);
		}

		get graphics():Graphics {
			return this._graphics;
		}

		public serialize():Object {
			var serialized:Object = super.serialize();
			serialized["class"] = "Sprite";
			return serialized;
		}
	}

	export class RootSprite extends Sprite{
		constructor(){
			super("__root");
		}

		get parent():DisplayObject{
			__trace("SecurityError: No access above root sprite.","err");
			return null;
		}
	}
}