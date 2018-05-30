var Runtime;
(function (Runtime) {
    var NotCrypto;
    (function (NotCrypto) {
        var _rngState = [
            Math.floor(Date.now() / 1024) % 1024,
            Date.now() % 1024
        ];
        var Rc4 = (function () {
            function Rc4(key) {
                this._s = [];
                for (var i = 0; i < 256; i++) {
                    this._s[i] = i;
                }
                var j = 0;
                for (var i = 0; i < 256; i++) {
                    j = j + this._s[i] + key[i % key.length] % 256;
                    var m = this._s[i];
                    this._s[i] = this._s[j];
                    this._s[j] = m;
                }
            }
            return Rc4;
        }());
        function random(bits) {
            if (bits === void 0) { bits = 16; }
            if (bits > 32) {
                throw new Error('NotCrypto.random expects 32 bits or less');
            }
            if (Math && Math.random) {
                var value = 0;
                for (var i = 0; i < bits; i++) {
                    value = (value << 1) + (Math.random() < 0.5 ? 0 : 1);
                }
                return value;
            }
            else {
                return Runtime.NotCrypto.fallbackRandom(Date.now() % 1024, bits);
            }
        }
        NotCrypto.random = random;
        function xorshift128p() {
            var s0 = _rngState[1], s1 = _rngState[0];
            _rngState[0] = s0;
            s1 ^= s1 << 23;
            s1 ^= s1 >> 17;
            s1 ^= s0;
            s1 ^= s0 >> 26;
            _rngState[1] = s1;
        }
        function fallbackRandom(seed, bits) {
            if (bits === void 0) { bits = 16; }
            if (bits > 32) {
                throw new Error('NotCrypto.fallbackRandom expects 32 bits or less');
            }
            for (var i = 0; i < seed; i++) {
                xorshift128p();
            }
            var mask = 0;
            for (var i = 0; i < bits; i++) {
                mask = (mask << 1) + 1;
            }
            return (_rngState[0] + _rngState[1]) & mask;
        }
        NotCrypto.fallbackRandom = fallbackRandom;
        function toHex(value, length) {
            if (length === void 0) { length = 0; }
            if (length <= 0) {
                return value.toString(16);
            }
            var base = value.toString(16);
            while (base.length < length) {
                base = '0' + base;
            }
            return base;
        }
        NotCrypto.toHex = toHex;
    })(NotCrypto = Runtime.NotCrypto || (Runtime.NotCrypto = {}));
})(Runtime || (Runtime = {}));
var Runtime;
(function (Runtime) {
    var RuntimeTimer = (function () {
        function RuntimeTimer(type, dur, key, callback) {
            this.ttl = dur;
            this.dur = dur;
            this.key = key;
            this.type = type;
            this.callback = callback;
        }
        return RuntimeTimer;
    }());
    var TimerRuntime = (function () {
        function TimerRuntime(precision) {
            if (precision === void 0) { precision = 10; }
            this._timer = -1;
            this._timers = [];
            this._lastToken = 0;
            this._key = 0;
            this._precision = precision;
        }
        Object.defineProperty(TimerRuntime.prototype, "isRunning", {
            get: function () {
                return this._timer > -1;
            },
            set: function (state) {
                if (state == false) {
                    this.stop();
                }
                else {
                    this.start();
                }
            },
            enumerable: true,
            configurable: true
        });
        TimerRuntime.prototype.start = function () {
            if (this._timer < 0) {
                this._lastToken = Date.now();
                var _self = this;
                this._timer = setInterval(function () {
                    var elapsed = Date.now() - _self._lastToken;
                    for (var i = 0; i < _self._timers.length; i++) {
                        var timer = _self._timers[i];
                        if (timer.type === "timeout") {
                            timer.ttl -= elapsed;
                            if (timer.ttl <= 0) {
                                try {
                                    timer.callback();
                                }
                                catch (e) {
                                    __trace(e.stack.toString(), 'err');
                                }
                                _self._timers.splice(i, 1);
                                i--;
                            }
                        }
                        else if (timer.type === 'interval') {
                            timer.ttl -= elapsed;
                            if (timer.ttl <= 0) {
                                try {
                                    timer.callback();
                                }
                                catch (e) {
                                    __trace(e.stack.toString(), 'err');
                                }
                                timer.ttl += timer.dur;
                            }
                        }
                        else {
                        }
                    }
                    _self._lastToken = Date.now();
                }, this._precision);
            }
        };
        TimerRuntime.prototype.stop = function () {
            if (this._timer > -1) {
                clearInterval(this._timer);
                this._timer = -1;
            }
        };
        TimerRuntime.prototype.setInterval = function (f, interval) {
            var myKey = this._key++;
            this._timers.push(new RuntimeTimer('interval', interval, myKey, f));
            return myKey;
        };
        TimerRuntime.prototype.setTimeout = function (f, timeout) {
            var myKey = this._key++;
            this._timers.push(new RuntimeTimer('timeout', timeout, myKey, f));
            return myKey;
        };
        TimerRuntime.prototype.clearInterval = function (id) {
            for (var i = 0; i < this._timers.length; i++) {
                if (this._timers[i].type === 'interval' &&
                    this._timers[i].key === id) {
                    this._timers.splice(i, 1);
                    return;
                }
            }
        };
        TimerRuntime.prototype.clearTimeout = function (id) {
            for (var i = 0; i < this._timers.length; i++) {
                if (this._timers[i].type === 'timeout' &&
                    this._timers[i].key === id) {
                    this._timers.splice(i, 1);
                    return;
                }
            }
        };
        TimerRuntime.prototype.clearAll = function (type) {
            if (type === void 0) { type = 'all'; }
            if (type === 'timer') {
                this._timers = this._timers.filter(function (t) { return t.type !== 'timer'; });
            }
            else if (type === 'interval') {
                this._timers = this._timers.filter(function (t) { return t.type !== 'interval'; });
            }
            else {
                this._timers = [];
            }
        };
        return TimerRuntime;
    }());
    var Timer = (function () {
        function Timer(delay, repeatCount) {
            if (repeatCount === void 0) { repeatCount = 0; }
            this._repeatCount = 0;
            this._delay = 0;
            this._microtime = 0;
            this._timer = -1;
            this._listeners = [];
            this._complete = [];
            this.currentCount = 0;
            this._delay = delay;
            this._repeatCount = repeatCount;
        }
        Object.defineProperty(Timer.prototype, "isRunning", {
            get: function () {
                return this._timer >= 0;
            },
            set: function (b) {
                __trace('Timer.isRunning is read-only', 'warn');
            },
            enumerable: true,
            configurable: true
        });
        Timer.prototype.start = function () {
            if (!this.isRunning) {
                var lastTime = Date.now();
                var self = this;
                this._timer = setInterval(function () {
                    var elapsed = Date.now() - lastTime;
                    self._microtime += elapsed;
                    if (self._microtime > self._delay) {
                        self._microtime -= self._delay;
                        self.currentCount++;
                        self.dispatchEvent('timer');
                    }
                    lastTime = Date.now();
                    if (self._repeatCount > 0 &&
                        self._repeatCount <= self.currentCount) {
                        self.stop();
                        self.dispatchEvent('timerComplete');
                    }
                }, 20);
            }
        };
        Timer.prototype.stop = function () {
            if (this.isRunning) {
                clearInterval(this._timer);
                this._timer = -1;
            }
        };
        Timer.prototype.reset = function () {
            this.stop();
            this.currentCount = 0;
            this._microtime = 0;
        };
        Timer.prototype.addEventListener = function (type, listener) {
            if (type === 'timer') {
                this._listeners.push(listener);
            }
            else if (type === 'timerComplete') {
                this._complete.push(listener);
            }
        };
        Timer.prototype.dispatchEvent = function (event) {
            if (event === 'timer') {
                for (var i = 0; i < this._listeners.length; i++) {
                    this._listeners[i]();
                }
            }
            else if (event === 'timerComplete') {
                for (var i = 0; i < this._complete.length; i++) {
                    this._complete[i]();
                }
            }
        };
        return Timer;
    }());
    Runtime.Timer = Timer;
    var TimeKeeper = (function () {
        function TimeKeeper(clock) {
            if (clock === void 0) { clock = function () { return Date.now(); }; }
            this._clock = clock;
            this.reset();
        }
        Object.defineProperty(TimeKeeper.prototype, "elapsed", {
            get: function () {
                return this._clock() - this._lastTime;
            },
            enumerable: true,
            configurable: true
        });
        TimeKeeper.prototype.reset = function () {
            this._lastTime = this._clock();
        };
        return TimeKeeper;
    }());
    Runtime.TimeKeeper = TimeKeeper;
    var masterTimer = new TimerRuntime();
    var internalTimer = new Timer(40);
    var enterFrameDispatcher = function () {
        for (var object in Runtime.registeredObjects) {
            if (object.substring(0, 2) === '__') {
                continue;
            }
            try {
                Runtime.registeredObjects[object].dispatchEvent('enterFrame');
            }
            catch (e) { }
        }
    };
    masterTimer.start();
    internalTimer.start();
    internalTimer.addEventListener('timer', enterFrameDispatcher);
    function getTimer() {
        return masterTimer;
    }
    Runtime.getTimer = getTimer;
    function updateFrameRate(frameRate) {
        if (frameRate > 60 || frameRate < 0) {
            __trace('Frame rate should be in the range (0, 60]', 'warn');
            return;
        }
        if (frameRate === 0) {
            internalTimer.stop();
            return;
        }
        internalTimer.stop();
        internalTimer = new Timer(Math.floor(1000 / frameRate));
        internalTimer.addEventListener('timer', enterFrameDispatcher);
        internalTimer.start();
    }
    Runtime.updateFrameRate = updateFrameRate;
})(Runtime || (Runtime = {}));
var Runtime;
(function (Runtime) {
    var ScriptManagerImpl = (function () {
        function ScriptManagerImpl() {
            this._managedElements = {};
        }
        ScriptManagerImpl.prototype._registerElement = function (name, mM) {
            this._managedElements[name] = mM;
        };
        ScriptManagerImpl.prototype.clearTimer = function () {
            Runtime.getTimer().clearAll('interval');
        };
        ScriptManagerImpl.prototype.clearEl = function () {
            __trace("ScriptManager.clearEl not implemented.", "warn");
        };
        ScriptManagerImpl.prototype.clearTrigger = function () {
            __trace("ScriptManager.clearTrigger not implemented.", "warn");
        };
        ScriptManagerImpl.prototype.pushEl = function (el) {
            __trace("ScriptManager.pushEl not implemented.", "warn");
        };
        ScriptManagerImpl.prototype.popEl = function (el) {
            __trace("ScriptManager.popEl is not properly implemented.", "warn");
            if (el['motionManager']) {
                el['motionManager'].stop();
            }
        };
        ScriptManagerImpl.prototype.pushTimer = function (t) {
            __trace("ScriptManager.pushTimer not implemented.", "warn");
        };
        ScriptManagerImpl.prototype.popTimer = function (t) {
            __trace("ScriptManager.popTimer not implemented.", "warn");
        };
        ScriptManagerImpl.prototype.toString = function () {
            return '[scriptManager ScriptManager]';
        };
        return ScriptManagerImpl;
    }());
    Runtime._defaultScriptManager = new ScriptManagerImpl();
})(Runtime || (Runtime = {}));
var ScriptManager = Runtime._defaultScriptManager;
var Runtime;
(function (Runtime) {
    var permissions = {};
    function requestPermission(name, callback) {
        __channel("Runtime:RequestPermission", {
            "name": name
        }, function (result) {
            if (result === true) {
                permissions[name] = true;
            }
            else {
                permissions[name] = false;
            }
            if (typeof callback === "function") {
                callback(result);
            }
        });
    }
    Runtime.requestPermission = requestPermission;
    function hasPermission(name) {
        if (permissions.hasOwnProperty(name) &&
            permissions[name]) {
            return true;
        }
        return false;
    }
    Runtime.hasPermission = hasPermission;
    function openWindow(url, params, callback) {
        if (callback === void 0) { callback = null; }
        __channel("Runtime:PrivilegedAPI", {
            "method": "openWindow",
            "params": [url, params]
        }, function (windowId) {
            var WND = {
                "moveTo": function (x, y) {
                    __pchannel("Runtime:PrivilegedAPI", {
                        "method": "window",
                        "params": [windowId, "moveTo", [x, y]]
                    });
                },
                "resizeTo": function (w, h) {
                    __pchannel("Runtime:PrivilegedAPI", {
                        "method": "window",
                        "params": [windowId, "resizeTo", [w, h]]
                    });
                },
                "focus": function () {
                    __pchannel("Runtime:PrivilegedAPI", {
                        "method": "window",
                        "params": [windowId, "focus"]
                    });
                },
                "close": function () {
                    __pchannel("Runtime:PrivilegedAPI", {
                        "method": "window",
                        "params": [windowId, "close"]
                    });
                }
            };
            if (callback !== null) {
                callback(WND);
            }
        });
    }
    Runtime.openWindow = openWindow;
    function injectStyle(referenceObject, style) {
        __pchannel("Runtime:PrivilegedAPI", {
            "method": "injectStyle",
            "params": [referenceObject, style]
        });
    }
    Runtime.injectStyle = injectStyle;
    function privilegedCode() {
        __trace('Runtime.privilegedCode not available.', 'warn');
    }
    Runtime.privilegedCode = privilegedCode;
})(Runtime || (Runtime = {}));
var Runtime;
(function (Runtime) {
    var supported = {
        "js": ["*"],
        "Runtime": ["*", "openWindow", "injectStyle"],
        "Display": ["*"],
        "Player": ["*"],
        "Tween": ["*"],
        "Utils": ["*"]
    };
    function supports(featureName, subfeature) {
        if (subfeature === void 0) { subfeature = "*"; }
        if (!supported.hasOwnProperty(featureName)) {
            return false;
        }
        else {
            if (supported[featureName].indexOf(subfeature) >= 0) {
                return true;
            }
        }
        return false;
    }
    Runtime.supports = supports;
    ;
    function requestLibrary(libraryName, callback) {
        if (libraryName === 'libBitmap') {
            callback(null, {
                'type': 'noop'
            });
        }
        else {
            callback(new Error('Could not load unknown library [' + libraryName + ']'), null);
        }
    }
    Runtime.requestLibrary = requestLibrary;
})(Runtime || (Runtime = {}));
var Runtime;
(function (Runtime) {
    var MetaObject = (function () {
        function MetaObject(name) {
            this._listeners = {};
            if (name.slice(0, 2) !== '__') {
                throw new Error('MetaObject names must start with two underscores.');
            }
            this._name = name;
        }
        MetaObject.prototype.addEventListener = function (event, listener, useCapture, priority) {
            if (useCapture === void 0) { useCapture = false; }
            if (priority === void 0) { priority = 0; }
            if (!(event in this._listeners)) {
                this._listeners[event] = [];
            }
            this._listeners[event].push(listener);
        };
        MetaObject.prototype.removeEventListener = function (event, listener, useCapture) {
            if (useCapture === void 0) { useCapture = false; }
            if (!(event in this._listeners)) {
                return;
            }
            var index = this._listeners[event].indexOf(listener);
            if (index >= 0) {
                this._listeners[event].splice(index, 1);
            }
        };
        MetaObject.prototype.hasEventListener = function (event) {
            return event in this._listeners && this._listeners[event].length > 0;
        };
        MetaObject.prototype.dispatchEvent = function (event, data) {
            if (!(event in this._listeners)) {
                return;
            }
            for (var i = 0; i < this._listeners[event].length; i++) {
                this._listeners[event][i](data);
            }
        };
        MetaObject.prototype.getId = function () {
            return this._name;
        };
        MetaObject.prototype.serialize = function () {
            return {
                "class": this._name
            };
        };
        MetaObject.prototype.unload = function () {
            throw new Error('Meta objects should not be unloaded!');
        };
        return MetaObject;
    }());
    var objCount = 0;
    var _registeredObjects = {
        '__self': new MetaObject('__self'),
        '__player': new MetaObject('__player'),
        '__root': new MetaObject('__root')
    };
    Object.defineProperty(Runtime, 'registeredObjects', {
        get: function () {
            return _registeredObjects;
        },
        set: function (value) {
            __trace('Runtime.registeredObjects is read-only', 'warn');
        }
    });
    function _dispatchEvent(objectId, event, payload) {
        var obj = _registeredObjects[objectId];
        if (typeof obj === "object") {
            if (obj.dispatchEvent) {
                obj.dispatchEvent(event, payload);
            }
        }
    }
    function hasObject(objectId) {
        return _registeredObjects.hasOwnProperty(objectId) &&
            _registeredObjects[objectId] !== null;
    }
    Runtime.hasObject = hasObject;
    function getObject(objectId) {
        return _registeredObjects[objectId];
    }
    Runtime.getObject = getObject;
    function registerObject(object) {
        if (!object.getId) {
            __trace('Cannot register object without getId method.', 'warn');
            return;
        }
        if (!Runtime.hasObject(object.getId())) {
            _registeredObjects[object.getId()] = object;
            __pchannel('Runtime:RegisterObject', {
                'id': object.getId(),
                'data': object.serialize()
            });
            __schannel("object::(" + object.getId() + ")", function (payload) {
                if (payload.hasOwnProperty('type') &&
                    payload.type === 'event') {
                    _dispatchEvent(object.getId(), payload.event, payload.data);
                }
            });
            objCount++;
            return;
        }
        else {
            __trace('Attempted to re-register object or id collision @ ' +
                object.getId(), 'warn');
            return;
        }
    }
    Runtime.registerObject = registerObject;
    function deregisterObject(object) {
        var objectId = object.getId();
        deregisterObjectById(objectId);
    }
    Runtime.deregisterObject = deregisterObject;
    function deregisterObjectById(objectId) {
        if (Runtime.hasObject(objectId)) {
            if (objectId.substr(0, 2) === '__') {
                __trace('Runtime.deregisterObject cannot de-register a MetaObject', 'warn');
                return;
            }
            __pchannel('Runtime:DeregisterObject', {
                'id': objectId
            });
            if (typeof _registeredObjects[objectId].unload === "function") {
                _registeredObjects[objectId].unload();
            }
            _registeredObjects[objectId] = null;
            delete _registeredObjects[objectId];
        }
    }
    function _getId(type, container) {
        if (type === void 0) { type = 'obj'; }
        if (container === void 0) { container = 'rt'; }
        var randomSeed = Math.random();
        var randomSegment = '';
        return;
    }
    function generateId(type) {
        if (type === void 0) { type = "obj"; }
        var id = [type, ':', Date.now(), '|',
            Runtime.NotCrypto.random(16), ':', objCount].join();
        while (Runtime.hasObject(id)) {
            id = type + ":" + Date.now() + "|" +
                Runtime.NotCrypto.random(16) + ":" + objCount;
        }
        return id;
    }
    Runtime.generateId = generateId;
    ;
    function reset() {
        for (var i in _registeredObjects) {
            if (i.substr(0, 2) !== "__") {
                deregisterObjectById(i);
            }
        }
    }
    Runtime.reset = reset;
    function clear() {
        for (var i in _registeredObjects) {
            if (i.substr(0, 2) === "__") {
                continue;
            }
            if (typeof _registeredObjects[i].unload === 'function') {
                _registeredObjects[i].unload();
            }
        }
    }
    Runtime.clear = clear;
    function crash() {
        __trace("Runtime.crash() : Manual crash", "fatal");
    }
    Runtime.crash = crash;
    function exit() {
        __achannel("::worker:state", "worker", "terminated");
        self.close();
    }
    Runtime.exit = exit;
    function alert(msg) {
        __achannel("Runtime::alert", "::Runtime", msg);
    }
    Runtime.alert = alert;
})(Runtime || (Runtime = {}));
