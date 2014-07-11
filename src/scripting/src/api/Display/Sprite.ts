/**
 * Sprite Polyfill for AS3.
 * Author: Jim Chen
 * Part of the CCLScripter
 */
/// <reference path="DisplayObject.ts" />
/// <reference path="Graphics.ts" />
module Display {
	export class Sprite extends DisplayObject {
		private _graphics:Graphics = new Graphics(this);

		constructor(id?:string) {
			super(id);
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
}