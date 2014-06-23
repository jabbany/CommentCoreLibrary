/**
* Utils Library
* Author: Jim Chen
*/
/// <reference path="../OOAPI.d.ts" />
/// <reference path="../Runtime.d.ts" />
var Utils;
(function (Utils) {
    var _startTime = Date.now();
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
    * @param r - red component (0-255)
    * @param g - green component (0-255)
    * @param b - blue component (0-255)
    * @returns {number} - rgb number representation
    */
    function rgb(r, g, b) {
        return r << 16 | g << 8 | b;
    }
    Utils.rgb = rgb;

    /**
    * Convert HSV values to a single number
    * @param h - hue (0-360)
    * @param s - saturation (default 1, 0-1)
    * @param v - brightness (default 1, 0-1)
    * @returns {number} - rgb number representation
    */
    function hue(h, s, v) {
        if (typeof s === "undefined") { s = 1; }
        if (typeof v === "undefined") { v = 1; }
        return HSV2RGB(h, s, v);
    }
    Utils.hue = hue;

    /**
    * Converts seconds into displayable time mm:ss
    * @param time - seconds
    * @returns {string} - string formatted time
    */
    function formatTimes(time) {
        return Math.floor(time / 60) + ":" + (time % 60 > 9 ? time % 60 + "" : "0" + (time % 60));
    }
    Utils.formatTimes = formatTimes;

    /**
    * Returns the distance between two coordinates
    * @param x1 - point 1 x coordinate
    * @param y1 - point 1 y coordinate
    * @param x2 - point 2 x coordinate
    * @param y2 - point 2 y coordinate
    * @returns {number} - distance
    */
    function distance(x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    }
    Utils.distance = distance;

    /**
    * Finds a random integer between min and max
    * @param min - minimum
    * @param max - maximum
    * @returns {number} - random number
    */
    function rand(min, max) {
        return min + Math.floor(Math.random() * (max - min));
    }
    Utils.rand = rand;

    /**
    * Number of milliseconds since the runtime has started
    * @returns {number} - Current timestamp;
    */
    function getTimer() {
        return Date.now() - _startTime;
    }
    Utils.getTimer = getTimer;

    /**
    * Executes callback after an interval specified. Defaults to 1000ms.
    *
    * @param callback - Callback function to be executed
    * @param delay - delay in milliseconds (default 1000)
    */
    function timer(callback, delay) {
        if (typeof delay === "undefined") { delay = 1000; }
        return Runtime.getTimer().setTimeout(callback, delay);
    }
    Utils.timer = timer;

    /**
    * Executes callback once every interval specified. Defaults to 1000ms.
    * Will stop when executed for repeatCount times. Normally this will return
    * an interval id integer, but if specified this may return a Timer object
    * too.
    *
    * @param callback - Callback function to be executed every tick
    * @param interval - interval in milliseconds (default 1000)
    * @param repeatCount - repeat ticks (default 1)
    */
    function interval(callback, interval, repeatCount) {
        if (typeof interval === "undefined") { interval = 1000; }
        if (typeof repeatCount === "undefined") { repeatCount = 1; }
        if (repeatCount === 0) {
            return Runtime.getTimer().setInterval(callback, interval);
        }
        var ivl = Runtime.getTimer().setInterval(function () {
            repeatCount--;
            if (repeatCount < 0) {
                Runtime.getTimer().clearInterval(ivl);
            } else {
                callback();
            }
        }, interval);
        return ivl;
    }
    Utils.interval = interval;
})(Utils || (Utils = {}));

var getTimer = Utils.getTimer;
var interval = Utils.interval;
var timer = Utils.timer;
