/**
 * Player Module for the Kagerou Engine worker
 * @author Jim Chen
 * @description Builds the Player global (and the CommentData global). The
 *    read-only properties of the player are kept up to date by the host.
 */
import * as Runtime from './Runtime/Runtime';
import { createModule, exportGlobal } from './Module';
import { CommentData } from './CommentData';
import * as PlayerModule from './Player/Player';

var _state:string = '';
var _time:string;
var _commentList:string;
var _refreshRate:number;
var _width:number;
var _height:number;
var _videoWidth:number;
var _videoHeight:number;
var _lastUpdate:Runtime.TimeKeeper = new Runtime.TimeKeeper();

var Player = createModule(PlayerModule, {
  'state': {
    get: function() { return _state; },
    set: function(_value) {
      __trace('Player.state is read-only', 'warn');
    }
  },
  'time': {
    get: function() {
      if (_state !== 'playing') {
        return _time;
      }else{
        return _time + _lastUpdate.elapsed;
      }
    },
    set: function(_value) {
      __trace('Player.time is read-only', 'warn');
    }
  },
  'commentList': {
    get: function() {
      return _commentList;
    },
    set: function(_value) {
      __trace('Player.commentData is read-only', 'warn');
    }
  },
  'refreshRate': {
    get: function() {
      return _refreshRate;
    },
    set: function(_value) {
      __trace("Player.refreshRate deprecated. Please use Display.frameRate",
        "warn");
    }
  },
  'width': {
    get: function() { return _width; },
    set: function(_value) {
      __trace("Player.width is read-only", "warn");
    }
  },
  'height': {
    get: function() { return _height; },
    set: function(_value) {
      __trace("Player.height is read-only", "warn");
    }
  },
  'videoWidth': {
    get: function() { return _videoWidth; },
    set: function(_value) {
      __trace("Player.videoWidth is read-only", "warn");
    }
  },
  'videoHeight': {
    get: function() { return _videoHeight; },
    set: function(_value) {
      __trace("Player.videoHeight is read-only", "warn");
    }
  },
  'version': {
    get: function() {
      return 'CCLPlayer/1.0 HTML5/* (bilibili, like BSE, like flash)'; },
    set: function(_value) {
      __trace('Player.version is read-only', 'warn');
    }
  }
});

/** Update Listeners **/
__schannel('Update:DimensionUpdate', function(payload) {
  _width = payload["stageWidth"];
  _height = payload["stageHeight"];
  if (payload.hasOwnProperty("videoWidth") &&
    payload.hasOwnProperty("videoHeight")) {

    _videoWidth = payload["videoWidth"];
    _videoHeight = payload["videoHeight"];
  }
});

__schannel("Update:TimeUpdate", function(payload) {
  _state = payload["state"];
  _time = payload["time"];
  _lastUpdate.reset();
});

exportGlobal('Player', Player);
exportGlobal('CommentData', CommentData);
