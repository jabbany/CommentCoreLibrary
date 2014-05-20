/**
 * Shape Polyfill for AS3.
 * Author: Jim Chen
 * Part of the CCLScripter
 */
module Display {
	class Shape extends DisplayObject {
		private _graphics:Graphics;

		constructor() {
			_graphics = new Graphics(this);
		}

		get graphics():Graphics {
			return _graphics;
		}

		public serialize():Object {
			var serialized:Object = super.serialize();
			serialized["class"] = "Shape";
			return serialized;
		}
	}
}