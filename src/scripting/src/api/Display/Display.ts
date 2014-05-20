/**
 * Display Adapter
 * Author: Jim Chen
 */
/// <reference path="../OOAPI.d.ts" />

/// <reference path="Sprite.ts" />
/// <reference path="DisplayObject.ts" />

module Display {
	export var root:DisplayObject;
	var _root:DisplayObject = new Sprite();
	Object.defineProperty(Display, 'root', {
		get: function() { return _root; },
		set: function(value) {
			__trace("Display.root is read-only", "warn");
		}
	});
}

/// <reference path="CommentButton.ts" />
/// <reference path="CommentCanvas.ts" />
/// <reference path="CommentShape.ts" />
/// <reference path="CommentField.ts" />

var $ = Display;