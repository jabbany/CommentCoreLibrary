var Utils;
(function (Utils) {
    var _startTime = Date.now();
    function HSV2RGB(hue, saturation, brightness) {
        var r, g, b;
        if (saturation == 0) {
            r = g = b = 1;
        }
        else {
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
    function rgb(r, g, b) {
        return r << 16 | g << 8 | b;
    }
    Utils.rgb = rgb;
    function hue(h, s, v) {
        if (s === void 0) { s = 1; }
        if (v === void 0) { v = 1; }
        return HSV2RGB(h, s, v);
    }
    Utils.hue = hue;
    function formatTimes(time) {
        return Math.floor(time / 60) + ":" + (time % 60 > 9 ? "" : "0") + time % 60;
    }
    Utils.formatTimes = formatTimes;
    function distance(x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    }
    Utils.distance = distance;
    function rand(min, max) {
        return min + Math.floor(Math.random() * (max - min));
    }
    Utils.rand = rand;
    function getTimer() {
        return Date.now() - _startTime;
    }
    Utils.getTimer = getTimer;
    function timer(callback, delay) {
        if (delay === void 0) { delay = 1000; }
        return Runtime.getTimer().setTimeout(callback, delay);
    }
    Utils.timer = timer;
    function interval(callback, interval, repeatCount) {
        if (interval === void 0) { interval = 1000; }
        if (repeatCount === void 0) { repeatCount = 1; }
        if (repeatCount === 0) {
            return Runtime.getTimer().setInterval(callback, interval);
        }
        var ivl = Runtime.getTimer().setInterval(function () {
            repeatCount--;
            if (repeatCount < 0) {
                Runtime.getTimer().clearInterval(ivl);
            }
            else {
                callback();
            }
        }, interval);
        return ivl;
    }
    Utils.interval = interval;
    function clearTimeout(tid) {
        Runtime.getTimer().clearTimeout(tid);
    }
    Utils.clearTimeout = clearTimeout;
    function clearInterval(iid) {
        Runtime.getTimer().clearInterval(iid);
    }
    Utils.clearInterval = clearInterval;
})(Utils || (Utils = {}));
var getTimer = Utils.getTimer;
var interval = Utils.interval;
var timer = Utils.timer;
