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

  /**
  * Utilities Library drop-in replacement for BiliScriptEngine equivalent
  * @author Jim Chen
  */ var _startTime = Date.now();
  function HSV2RGB(hue, saturation, brightness) {
      // Conversion taken from Foley, van Dam, et al
      var r, g, b;
      if (saturation == 0) {
          r = g = b = 1;
      } else {
          var h = hue % 360 / 60;
          var i = h | 0;
          var f = h - i;
          var p = 1 - saturation;
          var q = 1 - saturation * f;
          var t = 1 - saturation * (1 - f);
          switch(i){
              case 0:
                  r = 1;
                  g = t;
                  b = p;
                  break;
              case 1:
                  r = q;
                  g = 1;
                  b = p;
                  break;
              case 2:
                  r = p;
                  g = 1;
                  b = t;
                  break;
              case 3:
                  r = p;
                  g = q;
                  b = 1;
                  break;
              case 4:
                  r = t;
                  g = p;
                  b = 1;
                  break;
              case 5:
                  r = 1;
                  g = p;
                  b = q;
                  break;
          }
      }
      r *= 255 * brightness;
      g *= 255 * brightness;
      b *= 255 * brightness;
      return r << 16 | g << 8 | b;
  }
  /**
   * Concats RGB values to a single number
   * @param {number} r - red component (0-255)
   * @param {number} g - green component (0-255)
   * @param {number} b - blue component (0-255)
   * @returns {number} rgb number representation
   */ function rgb(r, g, b) {
      return r << 16 | g << 8 | b;
  }
  /**
   * Convert HSV values to a single number
   * @param {number} h - hue (0-360)
   * @param {number} s - saturation (default 1, 0-1)
   * @param {number} v - brightness (default 1, 0-1)
   * @returns {number} rgb number representation
   */ function hue(h, s, v) {
      if (s === void 0) s = 1;
      if (v === void 0) v = 1;
      return HSV2RGB(h, s, v);
  }
  /**
   * Converts seconds into displayable time mm:ss
   * @param {number} time - seconds
   * @returns {string} string formatted time
   */ function formatTimes(time) {
      return Math.floor(time / 60) + ":" + (time % 60 > 9 ? "" : "0") + time % 60;
  }
  /**
   * Returns the distance between two coordinates
   * @param {number} x1 - point 1 x coordinate
   * @param {number} y1 - point 1 y coordinate
   * @param {number} x2 - point 2 x coordinate
   * @param {number} y2 - point 2 y coordinate
   * @returns {number} distance
   */ function distance(x1, y1, x2, y2) {
      return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
  }
  /**
   * Finds a random integer between min and max
   * @param {number} min - minimum
   * @param {number} max - maximum
   * @returns {number} random number
   */ function rand(min, max) {
      return min + Math.floor(Math.random() * (max - min));
  }
  /**
   * Number of milliseconds since the runtime has started
   * @returns {number} Current relative timestamp
   */ function getTimer() {
      return Date.now() - _startTime;
  }
  /**
   * Executes callback after a timeout specified. Defaults to 1000ms.
   *
   * @param {function} callback - Callback function to be executed
   * @param {number} delay - delay in milliseconds (default 1000)
   * @return {number} indicator of timeout used to cancel it
   */ function timer(callback, delay) {
      if (delay === void 0) delay = 1000;
      return Runtime.getTimer().setTimeout(callback, delay);
  }
  /**
   * Executes callback once every interval specified. Defaults to 1000ms.
   * Will stop when executed for repeatCount times. Normally this will return
   * an interval id integer, but if specified this may return a Timer object
   * too.
   *
   * @param {function} callback - Callback function to be executed every tick
   * @param {number} interval - interval in milliseconds (default 1000)
   * @param {number} repeatCount - repeat ticks (default 1)
   * @return {number} indicator of interval to allow cancelling
   */ function interval(callback, interval, repeatCount) {
      if (interval === void 0) interval = 1000;
      if (repeatCount === void 0) repeatCount = 1;
      if (repeatCount === 0) {
          return Runtime.getTimer().setInterval(callback, interval);
      }
      var ivl = Runtime.getTimer().setInterval(function() {
          repeatCount--;
          if (repeatCount < 0) {
              Runtime.getTimer().clearInterval(ivl);
          } else {
              callback();
          }
      }, interval);
      return ivl;
  }
  /**
   * Clears a scheduled timeout. If timeout id is not recognized no action
   * is performed
   * @param {number} tid - timeout id, returned by timer
   */ function clearTimeout(tid) {
      Runtime.getTimer().clearTimeout(tid);
  }
  /**
   * Clears an interval timer. If we are in timers mode then do nothing
   * @param {number} iid - interval id
   */ function clearInterval(iid) {
      Runtime.getTimer().clearInterval(iid);
  }

  var UtilsModule = /*#__PURE__*/Object.freeze({
    __proto__: null,
    clearInterval: clearInterval,
    clearTimeout: clearTimeout,
    distance: distance,
    formatTimes: formatTimes,
    getTimer: getTimer,
    hue: hue,
    interval: interval,
    rand: rand,
    rgb: rgb,
    timer: timer
  });

  var Utils = createModule(UtilsModule);
  exportGlobal('Utils', Utils);
  exportGlobal('getTimer', Utils.getTimer);
  exportGlobal('interval', Utils.interval);
  exportGlobal('timer', Utils.timer);

})(Runtime);
