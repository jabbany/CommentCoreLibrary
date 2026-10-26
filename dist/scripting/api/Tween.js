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
   * Easing functions for the Tween Library
   * Adapted from Flash ActionScript
   * http://www.robertpenner.com/easing/penner_chapter7_tweening.pdf
   */ /**
   * Standard linear tween.
   * @param {number} t - time *dynamic
   * @param {number} b - begin value *static
   * @param {number} c - change from b *static
   * @param {number} d - duration of tween *static
   * @return {number} a relative ratio value of what time we are at (0 - 1)
   */ function linear(t, b, c, d) {
      return t * c / d + b;
  }
  function quadratic(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
  }
  function cubic(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t * t + b;
      t -= 2;
      return c / 2 * (t * t * t + 2) + b;
  }
  function quartic(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t * t * t + b;
      t -= 2;
      return -c / 2 * (t * t * t * t - 2) + b;
  }
  function quintic(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t * t * t * t + b;
      t -= 2;
      return c / 2 * (t * t * t * t * t + 2) + b;
  }
  function circular(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
      t -= 2;
      return c / 2 * (Math.sqrt(1 - t * t) + 1) + b;
  }
  function sine(t, b, c, d) {
      return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
  }
  function exponential(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
      t--;
      return c / 2 * (-Math.pow(2, -10 * t) + 2) + b;
  }
  /**
   * Extends the input object with easing functions
   * @param runtime - Runtime to extend the easing function to
   */ function extendWithEasingFunctions(runtime) {
      /** TODO: Remove when BSE no longer requires this **/ var load = {
          linear: linear,
          back: null,
          bounce: null,
          circular: circular,
          cubic: cubic,
          elastic: null,
          exponential: exponential,
          sine: sine,
          quintic: quintic
      };
      for(var i in load){
          runtime[i] = load[i];
      }
  }
  function getEasingFuncByName(easing) {
      if (easing === void 0) easing = "None";
      easing = easing.toLowerCase();
      switch(easing){
          case "none":
          case "linear":
          default:
              return linear;
          case "exponential":
              return exponential;
          case "circular":
              return circular;
          case "quadratic":
              return quadratic;
          case "cubic":
              return cubic;
          case "quartic":
              return quartic;
          case "quintic":
              return quintic;
          case "sine":
              return sine;
      }
  }

  var ITween = /*#__PURE__*/ function() {
      function ITween(target, duration) {
          if (duration === void 0) duration = 0;
          this._target = null;
          this._isPlaying = false;
          this._currentTime = 0;
          this._repeats = 0;
          this.easing = linear;
          this.step = function() {};
          this._target = target;
          this._duration = duration;
          this._timeKeeper = new Runtime.TimeKeeper();
          this._timer = new Runtime.Timer(40);
          // Timer related
          var self = this;
          this._timer.addEventListener("timer", function() {
              self._onTimerEvent();
          });
      }
      var _proto = ITween.prototype;
      _proto._onTimerEvent = function _onTimerEvent() {
          // Ignore all the timer events if we're not playing
          if (this._isPlaying) {
              this._currentTime += this._timeKeeper.elapsed;
              this._timeKeeper.reset();
              this.step(this._target, this._currentTime, this._duration);
              if (this._currentTime >= this._duration) {
                  this._repeats--;
                  if (this._repeats < 0) {
                      this.stop();
                      this._currentTime = this._duration;
                  } else {
                      this._currentTime = 0;
                  }
                  this.step(this._target, this._currentTime, this._duration);
              }
          }
      };
      _proto.clone = function clone() {
          var clone = new ITween(this._target, this._duration);
          clone.easing = this.easing;
          clone.step = this.step;
          return clone;
      };
      _proto.scale = function scale(factor) {
          this._currentTime *= factor;
          this._duration *= factor;
      };
      _proto.play = function play() {
          if (this._isPlaying) {
              return;
          }
          this.gotoAndPlay(this._currentTime);
      };
      _proto.stop = function stop() {
          if (!this._isPlaying) {
              return;
          }
          this.gotoAndStop(this._currentTime);
      };
      _proto.gotoAndStop = function gotoAndStop(position) {
          this._currentTime = position;
          if (this._isPlaying) {
              this._isPlaying = false;
              this._timer.stop();
          }
          this.step(this._target, this._currentTime, this._duration);
      };
      _proto.gotoAndPlay = function gotoAndPlay(position) {
          this._currentTime = position;
          if (!this._isPlaying) {
              this._isPlaying = true;
              this._timer.start();
          }
          this.step(this._target, this._currentTime, this._duration);
      };
      _proto.togglePause = function togglePause() {
          if (this._isPlaying) {
              this.stop();
          } else {
              this.play();
          }
      };
      _create_class(ITween, [
          {
              key: "duration",
              get: function get() {
                  return this._duration;
              },
              set: function set(dur) {
                  this._duration = dur;
              }
          },
          {
              key: "position",
              get: function get() {
                  return this._currentTime;
              },
              set: function set(position) {
                  this._currentTime = position;
              }
          },
          {
              key: "repeat",
              get: function get() {
                  return this._repeats;
              },
              set: function set(r) {
                  this._repeats = r;
              }
          },
          {
              key: "target",
              get: function get() {
                  return this._target;
              },
              set: function set(a) {
                  __trace("Deprecated: You should not set a new target for an old tween.", "warn");
                  this._target = a;
              }
          }
      ]);
      return ITween;
  }();
  function createStepFunction(object, dest, src, tween) {
      for(var property in dest){
          if (!src.hasOwnProperty(property)) {
              src[property] = object[property];
          }
      }
      for(var property in src){
          if (!dest.hasOwnProperty(property)) {
              dest[property] = src[property];
          }
      }
      return function(object, currentTime, totalTime) {
          for(var property in src){
              if (!src.hasOwnProperty(property)) {
                  continue;
              }
              object[property] = tween.easing(currentTime, src[property], dest[property] - src[property], totalTime);
          }
      };
  }
  function tween(object, dest, src, duration, easing) {
      if (dest === void 0) dest = {};
      if (src === void 0) src = {};
      if (duration === void 0) duration = 0;
      if (easing === void 0) easing = null;
      var t = new ITween(object, duration * 1000);
      t.step = createStepFunction(object, dest, src, t);
      if (easing !== null) {
          t.easing = easing;
      }
      return t;
  }
  function to(object, dest, duration, easing) {
      if (dest === void 0) dest = {};
      if (duration === void 0) duration = 0;
      if (easing === void 0) easing = null;
      var src = {};
      for(var x in dest){
          if (dest.hasOwnProperty(x)) {
              if (typeof object[x] !== "undefined") {
                  src[x] = object[x];
              } else {
                  src[x] = 0;
              }
          }
      }
      return tween(object, dest, src, duration, easing);
  }
  function bezier(object, dest, src, control, duration, easing) {
      if (duration === void 0) duration = 1.0;
      if (easing === void 0) easing = null;
      var tween = new ITween(object, duration * 1000);
      if (easing !== null && typeof easing === 'function') {
          tween.easing = easing;
      }
      // Create real control arrays
      var finalControlPoints = {};
      for(var prop in control){
          if (Array.isArray(control[prop]) && control[prop].length > 0) {
              finalControlPoints[prop] = control[prop];
          }
      }
      // Sanity
      if (typeof src === 'undefined' || src === null) {
          src = {};
      }
      if (typeof dest === 'undefined' || dest === null) {
          dest = {};
      }
      // Prepopulate the control points
      for(var prop in finalControlPoints){
          if (!(prop in src)) {
              src[prop] = tween.target[prop];
          }
          if (!(prop in dest)) {
              dest[prop] = finalControlPoints[prop][finalControlPoints[prop].length - 1];
          }
      }
      /**
     * Code from https://github.com/minodisk/minodisk-as/blob/master/thirdparty/org/libspark/betweenas3/core/updaters/BezierUpdater.as
     * Used under permission of MIT License for betweenaas3.
     * See linked file for full license text.
     **/ tween.step = function(target, currentTime, totalTime) {
          var t = Math.min(tween.easing(currentTime, 0, 1, totalTime), 1);
          for(var prop in finalControlPoints){
              var controlPoints = finalControlPoints[prop];
              var numControl = controlPoints.length;
              // Figure out which three control points to use
              var firstIndex = Math.floor(t * numControl);
              // Figure out how far along that segment
              var segmentT = (t - firstIndex / numControl) * numControl;
              if (numControl === 1) {
                  // 3 control points
                  target[prop] = src[prop] + 2 * t * (1 - t) * (controlPoints[0] - src[prop]) + t * t * (dest[prop] - src[prop]);
              } else {
                  var p1 = 0;
                  var p2 = 0;
                  if (firstIndex === 0) {
                      p1 = src[prop];
                      p2 = (controlPoints[0] + controlPoints[1]) / 2;
                  } else if (firstIndex === numControl - 1) {
                      p1 = (controlPoints[firstIndex - 1] + controlPoints[firstIndex]) / 2;
                      p2 = dest[prop];
                  } else {
                      p1 = (controlPoints[firstIndex - 1] + controlPoints[firstIndex]) / 2;
                      p2 = (controlPoints[firstIndex] + controlPoints[firstIndex + 1]) / 2;
                  }
                  target[prop] = p1 + 2 * segmentT * (1 - segmentT) * (controlPoints[firstIndex] - p1) + segmentT * segmentT * (p2 - p1);
              }
          }
      };
      return tween;
  }
  function scale(src, scale) {
      var clone = src.clone();
      clone.scale(scale);
      return clone;
  }
  function delay(src, delay) {
      var newTween = new ITween(src.target, src.duration + delay * 1000);
      newTween.step = function(target, currentTime, totalTime) {
          if (currentTime <= delay * 1000) {
              return;
          }
          src.step(target, currentTime - delay * 1000, totalTime - delay * 1000);
      };
      return newTween;
  }
  function reverse(src) {
      var newTween = new ITween(src.target, src.duration);
      newTween.step = function(target, currentTime, totalTime) {
          src.step(target, totalTime - currentTime, totalTime);
      };
      return newTween;
  }
  function repeat(src, times) {
      var newTween = new ITween(src.target, src.duration * times);
      newTween.step = function(target, currentTime, totalTime) {
          src.step(target, currentTime % src.duration, src.duration);
      };
      return newTween;
  }
  function slice(src, from, to) {
      if (to === null) {
          to = src.duration;
      }
      if (to < from) {
          to = from;
      }
      from *= 1000;
      to *= 1000;
      var newTween = new ITween(src.target, to - from);
      newTween.step = function(target, currentTime, totalTime) {
          src.step(target, from + currentTime, src.duration);
      };
      return newTween;
  }
  function serial() {
      for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
          args[_key] = arguments[_key];
      }
      // Check if there are any tweens
      if (args.length === 0) {
          return new ITween({}, 0);
      }
      var totalTime = 0;
      var end = [];
      var start = [];
      for(var i = 0; i < args.length; i++){
          start.push(totalTime);
          totalTime += args[i].duration;
          end.push(totalTime);
      }
      var newTween = new ITween({}, totalTime);
      newTween["lastSeek"] = 0;
      newTween.step = function(target, currentTime, totalTime) {
          if (currentTime <= end[newTween["lastSeek"]]) {
              var currentTween = args[newTween["lastSeek"]];
              currentTween.step(currentTween.target, currentTime - start[newTween["lastSeek"]], currentTween.duration);
              return;
          } else {
              var oldTween = args[newTween["lastSeek"]];
              oldTween.step(oldTween.target, oldTween.duration, oldTween.duration);
          }
          for(var seek = 0; seek < end.length; seek++){
              if (currentTime < end[seek]) {
                  newTween["lastSeek"] = seek;
                  var currentTween = args[newTween["lastSeek"]];
                  currentTween.step(currentTween.target, currentTime - start[newTween["lastSeek"]], currentTween.duration);
                  return;
              }
          }
      };
      return newTween;
  }
  function parallel() {
      for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
          args[_key] = arguments[_key];
      }
      var totalTime = 0;
      for(var i = 0; i < args.length; i++){
          totalTime = Math.max(args[i].duration, totalTime);
      }
      var tweens = args;
      var newTween = new ITween({}, totalTime);
      newTween.step = function(target, currentTime, totalTime) {
          for(var i = 0; i < tweens.length; i++){
              tweens[i].step(tweens[i].target, Math.min(currentTime, tweens[i].duration), tweens[i].duration);
          }
      };
      return newTween;
  }

  var TweenModule = /*#__PURE__*/Object.freeze({
    __proto__: null,
    ITween: ITween,
    bezier: bezier,
    circular: circular,
    cubic: cubic,
    delay: delay,
    exponential: exponential,
    extendWithEasingFunctions: extendWithEasingFunctions,
    getEasingFuncByName: getEasingFuncByName,
    linear: linear,
    parallel: parallel,
    quadratic: quadratic,
    quartic: quartic,
    quintic: quintic,
    repeat: repeat,
    reverse: reverse,
    scale: scale,
    serial: serial,
    sine: sine,
    slice: slice,
    to: to,
    tween: tween
  });

  var Tween = createModule(TweenModule);
  exportGlobal('Tween', Tween);
  /** TODO: Remove when unnecessary **/ Tween.extendWithEasingFunctions(self);

})(Runtime);
