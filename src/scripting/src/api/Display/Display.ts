/**
 * Display Adapter
 * Author: Jim Chen
 */
/// <reference path="../OOAPI.d.ts" />

/// <reference path="Matrix.ts" />
/// <reference path="Sprite.ts" />
/// <reference path="DisplayObject.ts" />
/// <reference path="CommentButton.ts" />
/// <reference path="CommentCanvas.ts" />
/// <reference path="CommentShape.ts" />
/// <reference path="CommentField.ts" />

module Display {
	export var root:DisplayObject;
	export var loaderInfo:Object;
	export var stage:DisplayObject;
	export var version:string;
	export var width:number;
	export var height:number;
	export var fullScreenWidth:number;
	export var fullScreenHeight:number;
	export var frameRate:number;

	var _root:DisplayObject = new Sprite("__root");
	var _width:number = 0;
	var _height:number = 0;
	var _fullScreenWidth:number = 0;
	var _fullScreenHeight:number = 0;
	var _frameRate:number = 24;

	Object.defineProperty(Display, 'root', {
		get: function () {
			return _root;
		},
		set: function (value) {
			__trace("Display.root is read-only", "warn");
		}
	});
	Object.defineProperty(Display, 'loaderInfo', {
		get: function () {
			return {};
		},
		set: function (value) {
			__trace("Display.loaderInfo is disabled", "warn");
		}
	});
	Object.defineProperty(Display, 'stage', {
		get: function () {
			return _root;
		},
		set: function (value) {
			__trace("Display.stage is read-only", "warn");
		}
	});
	Object.defineProperty(Display, 'version', {
		get: function () {
			return "CCLDisplay/1.0 HTML5/* (bilibili, like BSE, like flash, AS3 compatible) KagerouEngine/v1";
		},
		set: function (value) {
			__trace("Display.version is read-only", "warn");
		}
	});
	Object.defineProperty(Display, 'width', {
		get: function () {
			return _width;
		},
		set: function (value) {
			__trace("Display.width is read-only", "warn");
		}
	});
	Object.defineProperty(Display, 'height', {
		get: function () {
			return _height;
		},
		set: function (value) {
			__trace("Display.height is read-only", "warn");
		}
	});
	Object.defineProperty(Display, 'fullScreenWidth', {
		get: function () {
			return _fullScreenWidth;
		},
		set: function (value) {
			__trace("Display.fullScreenWidth is read-only", "warn");
		}
	});
	Object.defineProperty(Display, 'fullScreenHeight', {
		get: function () {
			return _fullScreenHeight;
		},
		set: function (value) {
			__trace("Display.fullScreenHeight is read-only", "warn");
		}
	});
	Object.defineProperty(Display, 'frameRate', {
		get: function () {
			return _frameRate;
		},
		set: function (value) {
			_frameRate = value;
			__pchannel("Display:SetFrameRate", value);
		}
	});

	export function toString() {
		return "[display Display]";
	}

	/** Update Listeners **/
	__schannel("Update:DimensionUpdate", function (payload) {
		_width = payload["stageWidth"];
		_height = payload["stageHeight"];
		if (payload.hasOwnProperty("screenWidth") && payload.hasOwnProperty("screenHeight")) {
			_fullScreenWidth = payload["screenWidth"];
			_fullScreenHeight = payload["screenHeight"];
		}
	});
}

var $ = Display;
