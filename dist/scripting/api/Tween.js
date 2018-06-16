var Tween;
(function (Tween) {
    function linear(t, b, c, d) {
        return t * c / d + b;
    }
    Tween.linear = linear;
    function quadratic(t, b, c, d) {
        t /= d / 2;
        if (t < 1)
            return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    Tween.quadratic = quadratic;
    function cubic(t, b, c, d) {
        t /= d / 2;
        if (t < 1)
            return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
    }
    Tween.cubic = cubic;
    function quartic(t, b, c, d) {
        t /= d / 2;
        if (t < 1)
            return c / 2 * t * t * t * t + b;
        t -= 2;
        return -c / 2 * (t * t * t * t - 2) + b;
    }
    Tween.quartic = quartic;
    function quintic(t, b, c, d) {
        t /= d / 2;
        if (t < 1)
            return c / 2 * t * t * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t * t * t + 2) + b;
    }
    Tween.quintic = quintic;
    function circular(t, b, c, d) {
        t /= d / 2;
        if (t < 1)
            return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        t -= 2;
        return c / 2 * (Math.sqrt(1 - t * t) + 1) + b;
    }
    Tween.circular = circular;
    function sine(t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    }
    Tween.sine = sine;
    function exponential(t, b, c, d) {
        t /= d / 2;
        if (t < 1)
            return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        t--;
        return c / 2 * (-Math.pow(2, -10 * t) + 2) + b;
    }
    Tween.exponential = exponential;
    function extendWithEasingFunctions(runtime) {
        var load = {
            linear: Tween.linear,
            back: null,
            bounce: null,
            circular: Tween.circular,
            cubic: Tween.cubic,
            elastic: null,
            exponential: Tween.exponential,
            sine: Tween.sine,
            quintic: Tween.quintic
        };
        for (var i in load) {
            runtime[i] = load[i];
        }
    }
    Tween.extendWithEasingFunctions = extendWithEasingFunctions;
    function getEasingFuncByName(easing) {
        if (easing === void 0) { easing = "None"; }
        easing = easing.toLowerCase();
        switch (easing) {
            case "none":
            case "linear":
            default:
                return Tween.linear;
            case "exponential":
                return Tween.exponential;
            case "circular":
                return Tween.circular;
            case "quadratic":
                return Tween.quadratic;
            case "cubic":
                return Tween.cubic;
            case "quartic":
                return Tween.quartic;
            case "quintic":
                return Tween.quintic;
            case "sine":
                return Tween.sine;
        }
    }
    Tween.getEasingFuncByName = getEasingFuncByName;
})(Tween || (Tween = {}));
Tween.extendWithEasingFunctions(self);
var Tween;
(function (Tween) {
    var ITween = (function () {
        function ITween(target, duration) {
            if (duration === void 0) { duration = 0; }
            this._target = null;
            this._isPlaying = false;
            this._currentTime = 0;
            this._repeats = 0;
            this.easing = Tween.linear;
            this.step = function () { };
            this._target = target;
            this._duration = duration;
            this._timeKeeper = new Runtime.TimeKeeper();
            this._timer = new Runtime.Timer(40);
            var self = this;
            this._timer.addEventListener("timer", function () {
                self._onTimerEvent();
            });
        }
        ITween.prototype._onTimerEvent = function () {
            if (this._isPlaying) {
                this._currentTime += this._timeKeeper.elapsed;
                this._timeKeeper.reset();
                this.step(this._target, this._currentTime, this._duration);
                if (this._currentTime >= this._duration) {
                    this._repeats--;
                    if (this._repeats < 0) {
                        this.stop();
                        this._currentTime = this._duration;
                    }
                    else {
                        this._currentTime = 0;
                    }
                    this.step(this._target, this._currentTime, this._duration);
                }
            }
        };
        Object.defineProperty(ITween.prototype, "duration", {
            get: function () {
                return this._duration;
            },
            set: function (dur) {
                this._duration = dur;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ITween.prototype, "position", {
            get: function () {
                return this._currentTime;
            },
            set: function (position) {
                this._currentTime = position;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ITween.prototype, "repeat", {
            get: function () {
                return this._repeats;
            },
            set: function (r) {
                this._repeats = r;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ITween.prototype, "target", {
            get: function () {
                return this._target;
            },
            set: function (a) {
                __trace("Deprecated: You should not set a new target for an old tween.", "warn");
                this._target = a;
            },
            enumerable: true,
            configurable: true
        });
        ITween.prototype.clone = function () {
            var clone = new ITween(this._target, this._duration);
            clone.easing = this.easing;
            clone.step = this.step;
            return clone;
        };
        ITween.prototype.scale = function (factor) {
            this._currentTime *= factor;
            this._duration *= factor;
        };
        ITween.prototype.play = function () {
            if (this._isPlaying) {
                return;
            }
            this.gotoAndPlay(this._currentTime);
        };
        ITween.prototype.stop = function () {
            if (!this._isPlaying) {
                return;
            }
            this.gotoAndStop(this._currentTime);
        };
        ITween.prototype.gotoAndStop = function (position) {
            this._currentTime = position;
            if (this._isPlaying) {
                this._isPlaying = false;
                this._timer.stop();
            }
            this.step(this._target, this._currentTime, this._duration);
        };
        ITween.prototype.gotoAndPlay = function (position) {
            this._currentTime = position;
            if (!this._isPlaying) {
                this._isPlaying = true;
                this._timer.start();
            }
            this.step(this._target, this._currentTime, this._duration);
        };
        ITween.prototype.togglePause = function () {
            if (this._isPlaying) {
                this.stop();
            }
            else {
                this.play();
            }
        };
        return ITween;
    }());
    Tween.ITween = ITween;
    function createStepFunction(object, dest, src, tween) {
        for (var property in dest) {
            if (!src.hasOwnProperty(property)) {
                src[property] = object[property];
            }
        }
        for (var property in src) {
            if (!dest.hasOwnProperty(property)) {
                dest[property] = src[property];
            }
        }
        return function (object, currentTime, totalTime) {
            for (var property in src) {
                if (!src.hasOwnProperty(property)) {
                    continue;
                }
                object[property] = tween.easing(currentTime, src[property], dest[property] - src[property], totalTime);
            }
        };
    }
    function tween(object, dest, src, duration, easing) {
        if (dest === void 0) { dest = {}; }
        if (src === void 0) { src = {}; }
        if (duration === void 0) { duration = 0; }
        if (easing === void 0) { easing = null; }
        var t = new ITween(object, duration * 1000);
        t.step = createStepFunction(object, dest, src, t);
        if (easing !== null) {
            t.easing = easing;
        }
        return t;
    }
    Tween.tween = tween;
    function to(object, dest, duration, easing) {
        if (dest === void 0) { dest = {}; }
        if (duration === void 0) { duration = 0; }
        if (easing === void 0) { easing = null; }
        var src = {};
        for (var x in dest) {
            if (dest.hasOwnProperty(x)) {
                if (typeof object[x] !== "undefined") {
                    src[x] = object[x];
                }
                else {
                    src[x] = 0;
                }
            }
        }
        return Tween.tween(object, dest, src, duration, easing);
    }
    Tween.to = to;
    function bezier(object, dest, src, control, duration, easing) {
        if (duration === void 0) { duration = 1.0; }
        if (easing === void 0) { easing = null; }
        var tween = new ITween(object, duration * 1000);
        if (easing !== null && typeof easing === 'function') {
            tween.easing = easing;
        }
        var finalControlPoints = {};
        for (var prop in control) {
            if (Array.isArray(control[prop]) && control[prop].length > 0) {
                finalControlPoints[prop] = control[prop];
            }
        }
        if (typeof src === 'undefined' || src === null) {
            src = {};
        }
        if (typeof dest === 'undefined' || dest === null) {
            dest = {};
        }
        for (var prop in finalControlPoints) {
            if (!(prop in src)) {
                src[prop] = tween.target[prop];
            }
            if (!(prop in dest)) {
                dest[prop] = finalControlPoints[prop][finalControlPoints[prop].length - 1];
            }
        }
        tween.step = function (target, currentTime, totalTime) {
            var t = Math.min(tween.easing(currentTime, 0, 1, totalTime), 1);
            for (var prop in finalControlPoints) {
                var controlPoints = finalControlPoints[prop];
                var numControl = controlPoints.length;
                var firstIndex = Math.floor(t * numControl);
                var segmentT = (t - firstIndex / numControl) * numControl;
                if (numControl === 1) {
                    target[prop] = src[prop] +
                        2 * t * (1 - t) * (controlPoints[0] - src[prop]) +
                        t * t * (dest[prop] - src[prop]);
                }
                else {
                    var p1 = 0;
                    var p2 = 0;
                    if (firstIndex === 0) {
                        p1 = src[prop];
                        p2 = (controlPoints[0] + controlPoints[1]) / 2;
                    }
                    else if (firstIndex === numControl - 1) {
                        p1 = (controlPoints[firstIndex - 1] + controlPoints[firstIndex]) / 2;
                        p2 = dest[prop];
                    }
                    else {
                        p1 = (controlPoints[firstIndex - 1] + controlPoints[firstIndex]) / 2;
                        p2 = (controlPoints[firstIndex] + controlPoints[firstIndex + 1]) / 2;
                    }
                    target[prop] = p1 +
                        2 * segmentT * (1 - segmentT) * (controlPoints[firstIndex] - p1) +
                        segmentT * segmentT * (p2 - p1);
                }
            }
        };
        return tween;
    }
    Tween.bezier = bezier;
    function scale(src, scale) {
        var clone = src.clone();
        clone.scale(scale);
        return clone;
    }
    Tween.scale = scale;
    function delay(src, delay) {
        var newTween = new ITween(src.target, src.duration + delay * 1000);
        newTween.step = function (target, currentTime, totalTime) {
            if (currentTime <= delay * 1000) {
                return;
            }
            src.step(target, currentTime - delay * 1000, totalTime - delay * 1000);
        };
        return newTween;
    }
    Tween.delay = delay;
    function reverse(src) {
        var newTween = new ITween(src.target, src.duration);
        newTween.step = function (target, currentTime, totalTime) {
            src.step(target, totalTime - currentTime, totalTime);
        };
        return newTween;
    }
    Tween.reverse = reverse;
    function repeat(src, times) {
        var newTween = new ITween(src.target, src.duration * times);
        newTween.step = function (target, currentTime, totalTime) {
            src.step(target, currentTime % src.duration, src.duration);
        };
        return newTween;
    }
    Tween.repeat = repeat;
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
        newTween.step = function (target, currentTime, totalTime) {
            src.step(target, from + currentTime, src.duration);
        };
        return newTween;
    }
    Tween.slice = slice;
    function serial() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args.length === 0) {
            return new ITween({}, 0);
        }
        var totalTime = 0;
        var end = [];
        var start = [];
        for (var i = 0; i < args.length; i++) {
            start.push(totalTime);
            totalTime += args[i].duration;
            end.push(totalTime);
        }
        var newTween = new ITween({}, totalTime);
        newTween["lastSeek"] = 0;
        newTween.step = function (target, currentTime, totalTime) {
            if (currentTime <= end[newTween["lastSeek"]]) {
                var currentTween = args[newTween["lastSeek"]];
                currentTween.step(currentTween.target, currentTime - start[newTween["lastSeek"]], currentTween.duration);
                return;
            }
            else {
                var oldTween = args[newTween["lastSeek"]];
                oldTween.step(oldTween.target, oldTween.duration, oldTween.duration);
            }
            for (var seek = 0; seek < end.length; seek++) {
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
    Tween.serial = serial;
    function parallel() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var totalTime = 0;
        for (var i = 0; i < args.length; i++) {
            totalTime = Math.max(args[i].duration, totalTime);
        }
        var tweens = args;
        var newTween = new ITween({}, totalTime);
        newTween.step = function (target, currentTime, totalTime) {
            for (var i = 0; i < tweens.length; i++) {
                tweens[i].step(tweens[i].target, Math.min(currentTime, tweens[i].duration), tweens[i].duration);
            }
        };
        return newTween;
    }
    Tween.parallel = parallel;
})(Tween || (Tween = {}));
