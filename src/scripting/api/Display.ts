/**
 * Display Module for the Kagerou Engine worker
 * @author Jim Chen
 * @description Builds the Display global (aliased as $) and the Bitmap global
 *    (libBitmap). The read-only properties of the stage are kept up to date by
 *    the host.
 */
import { createModule, exportGlobal } from './Module';
import * as DisplayModule from './Display/Display';
import * as LibBitmap from './Display/LibBitmap';
import { getRoot, setRoot } from './Display/Root';

var _width:number = 0;
var _height:number = 0;
var _fullScreenWidth:number = 0;
var _fullScreenHeight:number = 0;
var _frameRate:number = 24;

setRoot(new DisplayModule.RootSprite());

var Display = createModule(DisplayModule, {
  'root': {
    get: function () {
      return getRoot();
    },
    set: function (_value) {
      __trace("Display.root is read-only", "warn");
    }
  },
  'loaderInfo': {
    get: function () {
      return {};
    },
    set: function (_value) {
      __trace("Display.loaderInfo is disabled", "warn");
    }
  },
  'stage': {
    get: function () {
      return getRoot();
    },
    set: function (_value) {
      __trace("Display.stage is read-only", "warn");
    }
  },
  'version': {
    get: function () {
      return "CCLDisplay/1.0 HTML5/* (bilibili, like BSE, like flash, AS3 compatible) KagerouEngine/v1";
    },
    set: function (_value) {
      __trace("Display.version is read-only", "warn");
    }
  },
  'width': {
    get: function () {
      return _width;
    },
    set: function (_value) {
      __trace("Display.width is read-only", "warn");
    }
  },
  'height': {
    get: function () {
      return _height;
    },
    set: function (_value) {
      __trace("Display.height is read-only", "warn");
    }
  },
  'fullScreenWidth': {
    get: function () {
      return _fullScreenWidth;
    },
    set: function (_value) {
      __trace("Display.fullScreenWidth is read-only", "warn");
    }
  },
  'fullScreenHeight': {
    get: function () {
      return _fullScreenHeight;
    },
    set: function (_value) {
      __trace("Display.fullScreenHeight is read-only", "warn");
    }
  },
  'frameRate': {
    get: function () {
      return _frameRate;
    },
    set: function (value) {
      _frameRate = value;
      __pchannel("Display:SetFrameRate", value);
    }
  }
});

/** Update Listeners **/
__schannel("Update:DimensionUpdate", function (payload) {
  _width = payload["stageWidth"];
  _height = payload["stageHeight"];
  if (payload.hasOwnProperty("screenWidth") && payload.hasOwnProperty("screenHeight")) {
    _fullScreenWidth = payload["screenWidth"];
    _fullScreenHeight = payload["screenHeight"];
  }
});

exportGlobal('Display', Display);
exportGlobal('$', Display);
exportGlobal('Bitmap', createModule(LibBitmap));
