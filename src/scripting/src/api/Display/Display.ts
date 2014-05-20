/**
 * Display Adapter
 * Author: Jim Chen
 */

/// <reference path="ISerializable.ts" />
/// <reference path="MotionManager.ts" />
/// <reference path="DisplayObject.ts" />
/// <reference path="IComment.ts" />
/// <reference path="Sprite.ts" />
/// <reference path="Bitmap.ts" />
/// <reference path="Filter.ts" />
/// <reference path="Graphics.ts" />
/// <reference path="Shapes.ts" />
module Display {
	var _root:DisplayObject;
	Object.defineProperty(Bar, 'qua', {
		get: function() { return _qua; },
		set: function(value) { _qua = value; }
	});
	export function createComment(text:string, params:Object):CommentField {
		return new CommentField(text, params);
	}

	export function createCanvas(params:Object):CommentCanvas {
		return new CommentCanvas(params);
	}

	export function createShape(params:Object):CommentShape {
		return new CommentShape(params);
	}

	export function createButton(params:Object):CommentButton {
		return new CommentButton(params);
	}

	export function createGlowFilter(color:number, alpha:number = 1.0, blurX:number = 6.0, blurY:number = 6.0, strength:number = 2, quality, inner:boolean = false, knockout:boolean = false) {

	}
}