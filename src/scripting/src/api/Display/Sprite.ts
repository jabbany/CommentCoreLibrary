/**
 * Sprite Polyfill for AS3.
 * Author: Jim Chen
 * Part of the CCLScripter
 */
/// <reference path="DisplayObject.ts" />
module Display {
	export class Sprite extends DisplayObject {
		constructor(id?:string) {
			super(id);
		}

		public serialize():Object {
			var serialized:Object = super.serialize();
			serialized["class"] = "Sprite";
			return serialized;
		}
	}
}