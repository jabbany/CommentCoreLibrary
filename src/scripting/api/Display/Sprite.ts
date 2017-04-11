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
		private _mouseEnabled:boolean = true;
		private _mousePosition:Point = new Point(0, 0);
		private _useHandCursor:boolean = false;

		constructor(id?:string) {
			super(id);
			this._graphics = new Graphics(this);
		}

		get graphics():Graphics {
			return this._graphics;
		}

		set graphics(g:Graphics) {
			__trace('Sprite.graphics is read-only.', 'warn');
		}

		get mouseEnabled():boolean {
			return this._mouseEnabled;
		}

		set mouseEnabled(enabled:boolean) {
			this._mouseEnabled = enabled;
			this.propertyUpdate('mouseEnabled', enabled);
		}

		get useHandCursor():boolean {
			return this._useHandCursor;
		}

		set useHandCursor(use:boolean) {
			this._useHandCursor = use;
			this.propertyUpdate('useHandCursor', use);
		}

		public serialize():Object {
			var serialized:Object = super.serialize();
			serialized['class'] = 'Sprite';
			return serialized;
		}
	}

	export class RootSprite extends Sprite {
		constructor() {
			super('__root');
		}

		get parent():DisplayObject {
			__trace('SecurityError: No access above root sprite.','err');
			return null;
		}
	}
}
