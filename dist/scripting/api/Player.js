/*!Copyright(c) CommentCoreLibrary v0.11.1 (//github.com/jabbany/CommentCoreLibrary) - Licensed under the MIT License */
(function (Runtime) {
  'use strict';

  /**
   * Kagerou Engine Module Helpers
   * @author Jim Chen
   * @description Helpers used by the bundle entries (api/<Module>.ts) to build
   *    the global objects that scripts in the worker interact with.
   */ /**
   * Creates the global object for an API module.
   *
   * @param {Object} members - module namespace whose members are copied
   * @param {PropertyDescriptorMap} properties - accessor properties to define.
   *        Like BiliScriptEngine, these are not enumerable. Members with the same
   *        name are replaced by these properties.
   * @returns {Object} the module object
   */ function createModule(members, properties) {
      if (properties === void 0) properties = {};
      var module = {};
      for(var key in members){
          if (!properties.hasOwnProperty(key)) {
              module[key] = members[key];
          }
      }
      Object.defineProperties(module, properties);
      return module;
  }
  /**
   * Exposes a value as a global in the worker
   *
   * @param {string} name - name of the global
   * @param {any} value - value to expose
   */ function exportGlobal(name, value) {
      self[name] = value;
  }

  function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;

          if ("value" in descriptor) descriptor.writable = true;

          Object.defineProperty(target, descriptor.key, descriptor);
      }
  }
  function _create_class(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);

      return Constructor;
  }

  /**
   * Partially Compliant CommentData Adapter
   */ var CommentData = /*#__PURE__*/ function() {
      function CommentData(comment) {
          this._dbid = 0;
          this.blocked = false;
          this.blockType = 0;
          this.border = false;
          this.credit = false;
          this.date = "";
          this.deleted = false;
          this.id = 0;
          this.mode = 0;
          this.msg = "";
          this.live = true;
          this.locked = true;
          this.on = true;
          this.pool = 0;
          this.preview = false;
          this.reported = false;
          this.size = 25;
          this.stime = 0;
          this.text = "";
          this.type = "";
          this.uid = "";
          this._dbid = comment["dbid"];
          this.size = comment["size"];
          this.text = comment["text"];
          this.mode = comment["mode"];
          this.stime = comment["stime"];
          this.date = comment["date"];
      }
      _create_class(CommentData, [
          {
              key: "danmuId",
              get: function get() {
                  return this._dbid;
              }
          }
      ]);
      return CommentData;
  }();

  /**
   * Class for sound support
   */ var Sound = /*#__PURE__*/ function() {
      function Sound(type, onload) {
          this._isPlaying = false;
          this._id = Runtime.generateId('obj-snd');
          this.onload = onload;
          this._source = type;
      }
      var _proto = Sound.prototype;
      _proto.createFromURL = function createFromURL(url) {
          this._source = url;
      };
      _proto.play = function play() {
          if (this._isPlaying) {
              return;
          }
      };
      _proto.remove = function remove() {};
      _proto.stop = function stop() {
          if (!this._isPlaying) {
              return;
          }
      };
      _proto.loadPercent = function loadPercent() {
          return 0;
      };
      _proto.getId = function getId() {
          return this._id;
      };
      _proto.dispatchEvent = function dispatchEvent(_eventName, _params) {};
      _proto.unload = function unload() {
          this.stop();
      };
      _proto.serialize = function serialize() {
          return {
              'class': 'Sound',
              'url': this._source
          };
      };
      return Sound;
  }();
  function createSound(sample, onload) {
      if (onload === void 0) onload = null;
      return new Sound(sample, onload);
  }

  /**
   * Player Library
   * @author Jim Chen
   * @description The read-only properties of the Player (state, time, ...) are
   *    defined on the Player global (see ../Player.ts)
   */ /**
   * Requests the player to start playing.
   */ function play() {
      __pchannel("Player::action", {
          "action": "play"
      });
  }
  /**
   * Requests the player to pause
   */ function pause() {
      __pchannel("Player::action", {
          "action": "pause"
      });
  }
  /**
   * Seeks to a position (in milliseconds from start)
   * @param offset - milliseconds offset
   */ function seek(offset) {
      __pchannel("Player::action", {
          "action": "seek",
          "params": offset
      });
  }
  /**
   * Jump to another video
   * Note that this may not work if the Host policy does not allow it
   *
   * @param video - video id
   * @param page - video page (defaults to 1)
   * @param newWindow - open the video in a new window or not
   */ function jump(video, page, newWindow) {
      if (page === void 0) page = 1;
      if (newWindow === void 0) newWindow = false;
      __pchannel("Player::action", {
          "action": "jump",
          "params": {
              "vid": video,
              "page": page,
              "window": newWindow
          }
      });
  }
  function commentTrigger(callback, timeout) {
      if (!Runtime.hasObject('__player')) {
          __trace('Your environment does not support player triggers.', 'err');
          return;
      }
      if (timeout < 0) {
          return;
      }
      var listener = function listener(comment) {
          callback(comment);
      };
      var player = Runtime.getObject('__player');
      player.addEventListener('comment', listener);
  //TODO: remove the listener after timeout
  //player.removeEventListener('comment', listener);
  }
  function keyTrigger(callback, timeout, triggerOnUp) {
      if (timeout === void 0) timeout = 1000;
      if (triggerOnUp === void 0) triggerOnUp = false;
      if (!Runtime.hasObject('__player')) {
          __trace('Your environment does not support key triggers.', 'err');
          return;
      }
      if (timeout < 0) {
          return;
      }
      var eventName = 'key' + (triggerOnUp ? 'up' : 'down');
      var listener = function listener(key) {
          callback(key.keyCode);
      };
      var player = Runtime.getObject('__player');
      player.addEventListener(eventName, listener);
  //TODO: remove the listener after the timeout
  //player.removeEventListener(eventName, listener);
  }
  function setMask(_mask) {
      __trace('Masking not supported yet', 'warn');
  }
  function toString() {
      return '[player Player]';
  }

  var PlayerModule = /*#__PURE__*/Object.freeze({
    __proto__: null,
    commentTrigger: commentTrigger,
    createSound: createSound,
    jump: jump,
    keyTrigger: keyTrigger,
    pause: pause,
    play: play,
    seek: seek,
    setMask: setMask,
    toString: toString
  });

  var _state = '';
  var _time;
  var _commentList;
  var _refreshRate;
  var _width;
  var _height;
  var _videoWidth;
  var _videoHeight;
  var _lastUpdate = new Runtime.TimeKeeper();
  var Player = createModule(PlayerModule, {
      'state': {
          get: function get() {
              return _state;
          },
          set: function set(_value) {
              __trace('Player.state is read-only', 'warn');
          }
      },
      'time': {
          get: function get() {
              if (_state !== 'playing') {
                  return _time;
              } else {
                  return _time + _lastUpdate.elapsed;
              }
          },
          set: function set(_value) {
              __trace('Player.time is read-only', 'warn');
          }
      },
      'commentList': {
          get: function get() {
              return _commentList;
          },
          set: function set(_value) {
              __trace('Player.commentData is read-only', 'warn');
          }
      },
      'refreshRate': {
          get: function get() {
              return _refreshRate;
          },
          set: function set(_value) {
              __trace("Player.refreshRate deprecated. Please use Display.frameRate", "warn");
          }
      },
      'width': {
          get: function get() {
              return _width;
          },
          set: function set(_value) {
              __trace("Player.width is read-only", "warn");
          }
      },
      'height': {
          get: function get() {
              return _height;
          },
          set: function set(_value) {
              __trace("Player.height is read-only", "warn");
          }
      },
      'videoWidth': {
          get: function get() {
              return _videoWidth;
          },
          set: function set(_value) {
              __trace("Player.videoWidth is read-only", "warn");
          }
      },
      'videoHeight': {
          get: function get() {
              return _videoHeight;
          },
          set: function set(_value) {
              __trace("Player.videoHeight is read-only", "warn");
          }
      },
      'version': {
          get: function get() {
              return 'CCLPlayer/1.0 HTML5/* (bilibili, like BSE, like flash)';
          },
          set: function set(_value) {
              __trace('Player.version is read-only', 'warn');
          }
      }
  });
  /** Update Listeners **/ __schannel('Update:DimensionUpdate', function(payload) {
      _width = payload["stageWidth"];
      _height = payload["stageHeight"];
      if (payload.hasOwnProperty("videoWidth") && payload.hasOwnProperty("videoHeight")) {
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

})(Runtime);
