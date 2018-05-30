/// <reference path="../OOAPI.d.ts" />
/// <reference path="../Runtime.d.ts" />

/**
* Utilities Library drop-in replacement for BiliScriptEngine equivalent
* @author Jim Chen
*/
module Utils {
  var _startTime:number = Date.now();

  function HSV2RGB(hue, saturation, brightness) {
    // Conversion taken from Foley, van Dam, et al
    var r, g, b;
    if (saturation == 0) {
      r = g = b = 1;
    } else {
      var h = (hue % 360) / 60;
      var i = h | 0;
      var f = h - i;
      var p = 1 - saturation;
      var q = 1 - saturation * f;
      var t = 1 - saturation * (1 - f);
      switch (i) {
        case 0: r = 1; g = t; b = p; break;
        case 1: r = q; g = 1; b = p; break;
        case 2: r = p; g = 1; b = t; break;
        case 3: r = p; g = q; b = 1; break;
        case 4: r = t; g = p; b = 1; break;
        case 5: r = 1; g = p; b = q; break;
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
   */
  export function rgb(r:number, g:number, b:number):number {
    return r << 16 | g << 8 | b;
  }

  /**
   * Convert HSV values to a single number
   * @param {number} h - hue (0-360)
   * @param {number} s - saturation (default 1, 0-1)
   * @param {number} v - brightness (default 1, 0-1)
   * @returns {number} rgb number representation
   */
  export function hue(h:number, s:number = 1, v:number = 1):number {
    return HSV2RGB(h, s, v);
  }

  /**
   * Converts seconds into displayable time mm:ss
   * @param {number} time - seconds
   * @returns {string} string formatted time
   */
  export function formatTimes(time:number):string {
    return Math.floor(time / 60) + ":" + (time % 60 > 9 ? "" : "0") + time % 60;
  }

  /**
   * Returns the distance between two coordinates
   * @param {number} x1 - point 1 x coordinate
   * @param {number} y1 - point 1 y coordinate
   * @param {number} x2 - point 2 x coordinate
   * @param {number} y2 - point 2 y coordinate
   * @returns {number} distance
   */
  export function distance(x1:number, y1:number, x2:number, y2:number):number {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
  }

  /**
   * Finds a random integer between min and max
   * @param {number} min - minimum
   * @param {number} max - maximum
   * @returns {number} random number
   */
  export function rand(min:number, max:number):number {
    return min + Math.floor(Math.random() * (max - min));
  }

  /**
   * Number of milliseconds since the runtime has started
   * @returns {number} Current relative timestamp
   */
  export function getTimer():number {
    return Date.now() - _startTime;
  }

  /**
   * Executes callback after a timeout specified. Defaults to 1000ms.
   *
   * @param {function} callback - Callback function to be executed
   * @param {number} delay - delay in milliseconds (default 1000)
   * @return {number} indicator of timeout used to cancel it
   */
  export function timer(callback:Function, delay:number = 1000):number {
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
   */
  export function interval(
    callback:Function,
    interval:number = 1000,
    repeatCount:number = 1):number{

    if (repeatCount === 0) {
      return Runtime.getTimer().setInterval(callback, interval);
    }
    var ivl = Runtime.getTimer().setInterval(function(){
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
   */
  export function clearTimeout(tid:number):void {
    Runtime.getTimer().clearTimeout(tid);
  }

  /**
   * Clears an interval timer. If we are in timers mode then do nothing
   * @param {number} iid - interval id
   */
  export function clearInterval(iid:number):void {
    Runtime.getTimer().clearInterval(iid);
  }
}

var getTimer:Function = Utils.getTimer;
var interval:Function = Utils.interval;
var timer:Function = Utils.timer;
