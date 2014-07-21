/**
 * Shape Polyfill for AS3.
 * Author: Jim Chen
 * Part of the CCLScripter
 */
/// <reference path="DisplayObject.ts" />
/// <reference path="Graphics.ts" />
module Display {
	export class Shape extends DisplayObject {
		private _graphics:Graphics;

		constructor() {
			super();
			this._graphics = new Graphics(this);
		}

		get graphics():Graphics {
			return this._graphics;
		}

		public serialize():Object {
			var serialized:Object = super.serialize();
			serialized["class"] = "Shape";
			return serialized;
		}
	}
}