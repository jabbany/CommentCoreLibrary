/**
* AS3 Like Timer Control for Runtime
*/
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
    })();

    var TimerRuntime = (function () {
        function TimerRuntime(precision) {
            if (typeof precision === "undefined") { precision = 10; }
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
                } else {
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
                                try  {
                                    timer.callback();
                                } catch (e) {
                                    __trace(e.stack.toString(), "err");
                                }
                                _self._timers.splice(i, 1);
                                i--;
                            }
                        } else if (timer.type === "interval") {
                            timer.ttl -= elapsed;
                            if (timer.ttl <= 0) {
                                try  {
                                    timer.callback();
                                } catch (e) {
                                    __trace(e.stack.toString(), "err");
                                }
                                timer.ttl += timer.dur;
                            }
                        } else {
                            // Do nothing
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
            this._timers.push(new RuntimeTimer("interval", interval, myKey, f));
            return myKey;
        };

        TimerRuntime.prototype.setTimeout = function (f, timeout) {
            var myKey = this._key++;
            this._timers.push(new RuntimeTimer("timeout", timeout, myKey, f));
            return myKey;
        };

        TimerRuntime.prototype.clearInterval = function (id) {
            for (var i = 0; i < this._timers.length; i++) {
                if (this._timers[i].type === "interval" && this._timers[i].key === id) {
                    this._timers.splice(i, 1);
                    return;
                }
            }
        };

        TimerRuntime.prototype.clearTimeout = function (id) {
            for (var i = 0; i < this._timers.length; i++) {
                if (this._timers[i].type === "timeout" && this._timers[i].key === id) {
                    this._timers.splice(i, 1);
                    return;
                }
            }
        };

        TimerRuntime.prototype.clearAll = function () {
            this._timers = [];
        };
        return TimerRuntime;
    })();

    /**
    * Timers interface similar to AS3
    */
    var Timer = (function () {
        function Timer(delay, repeatCount) {
            if (typeof repeatCount === "undefined") { repeatCount = 0; }
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
                __trace("Timer.isRunning is read-only", "warn");
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
                        self.dispatchEvent("timer");
                    }
                    lastTime = Date.now();
                    if (self._repeatCount > 0 && self._repeatCount <= self.currentCount) {
                        self.stop();
                        self.dispatchEvent("timerComplete");
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
            if (type === "timer") {
                this._listeners.push(listener);
            } else if (type === "timerComplete") {
                this._complete.push(listener);
            }
        };

        Timer.prototype.dispatchEvent = function (event) {
            if (event === "timer") {
                for (var i = 0; i < this._listeners.length; i++) {
                    this._listeners[i]();
                }
            } else if (event === "timerComplete") {
                for (var i = 0; i < this._complete.length; i++) {
                    this._complete[i]();
                }
            }
        };
        return Timer;
    })();
    Runtime.Timer = Timer;

    /** Timer Related **/
    var masterTimer = new TimerRuntime();
    var internalTimer = new Timer(50);
    var enterFrameDispatcher = function () {
        for (var object in Runtime.registeredObjects) {
            if (object.substring(0, 2) === "__") {
                continue;
            }
            Runtime.registeredObjects[object].dispatchEvent("enterFrame");
        }
    };
    masterTimer.start();
    internalTimer.start();
    internalTimer.addEventListener("timer", enterFrameDispatcher);

    /**
    *  Get the master timer instance
    */
    function getTimer() {
        return masterTimer;
    }
    Runtime.getTimer = getTimer;

    /**
    * Update the rate in which the enterFrame event is broadcasted
    * This synchronizes the frameRate value of the Display object.
    * By default, the frame rate is 24fps.
    */
    function updateFrameRate(frameRate) {
        if (frameRate > 60) {
            return;
        }
        internalTimer.stop();
        internalTimer = new Timer(Math.floor(1000 / frameRate));
        internalTimer.addEventListener("timer", enterFrameDispatcher);
    }
    Runtime.updateFrameRate = updateFrameRate;
})(Runtime || (Runtime = {}));
/**
* Runtime permissions
*/
var Runtime;
(function (Runtime) {
    var permissions = {};
    function requestPermission(name, callback) {
        __channel("Runtime:RequestPermission", {
            "name": name
        }, function (result) {
            if (result === true) {
                permissions[name] = true;
            } else {
                permissions[name] = false;
            }
            if (typeof callback === "function") {
                callback(result);
            }
        });
    }
    Runtime.requestPermission = requestPermission;

    function hasPermission(name) {
        if (permissions.hasOwnProperty(name) && permissions[name]) {
            return true;
        }
        return false;
    }
    Runtime.hasPermission = hasPermission;

    function openWindow(url, params, callback) {
        if (typeof callback === "undefined") { callback = null; }
        __channel("Runtime:PrivilegedAPI", {
            "method": "openWindow",
            "params": [url, params]
        }, function (windowId) {
            // Create a small compact window object
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
        __trace("Runtime.privilegedCode not available.", "warn");
    }
    Runtime.privilegedCode = privilegedCode;
})(Runtime || (Runtime = {}));
/**
* Runtime Internal Module
* Author: Jim Chen
*/
/// <reference path="../OOAPI.d.ts" />
/// <reference path="Timer.ts" />
/// <reference path="Permissions.ts" />
var Runtime;
(function (Runtime) {
    var MetaObject = (function () {
        function MetaObject(name, callback) {
            if (typeof callback === "undefined") { callback = null; }
            this._oncallback = null;
            this._name = name;
            this._oncallback = callback;
        }
        MetaObject.prototype.dispatchEvent = function (event, data) {
            if (this._oncallback !== null) {
                this._oncallback(event, data);
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
        return MetaObject;
    })();

    /** Variables **/
    var objCount = 0;
    var _registeredObjects = {
        "__self": new MetaObject("__self"),
        "__player": new MetaObject("__player"),
        "__root": new MetaObject("__root")
    };

    Runtime.registeredObjects;
    Object.defineProperty(Runtime, 'registeredObjects', {
        get: function () {
            return _registeredObjects;
        },
        set: function (value) {
            __trace("Runtime.registeredObjects is read-only", "warn");
        }
    });

    /**
    * Dispatches an event to the corresponding object
    * @param objectId - object to dispatch to
    * @param event - event id
    * @param payload - event object
    * @private
    */
    function _dispatchEvent(objectId, event, payload) {
        var obj = _registeredObjects[objectId];
        if (typeof obj === "object") {
            if (obj.dispatchEvent)
                obj.dispatchEvent(event, payload);
        }
    }

    /**
    * Checks to see if an object is registered under the id given
    * @param objectId - Id to check
    * @returns {boolean} - whether the objectid is registered
    */
    function hasObject(objectId) {
        return _registeredObjects.hasOwnProperty(objectId) && _registeredObjects[objectId] !== null;
    }
    Runtime.hasObject = hasObject;

    /**
    * Gets the object registered by id
    * @param objectId - objectid of object
    * @returns {any} - object or undefined if not found
    */
    function getObject(objectId) {
        return _registeredObjects[objectId];
    }
    Runtime.getObject = getObject;

    /**
    * Registers an object to allow two way communication between the API
    * and the host.
    * @param object - object to be registered. Must have getId method.
    */
    function registerObject(object) {
        if (!object.getId) {
            __trace("Attempted to register unnamed object", "warn");
            return;
        }
        if (!Runtime.hasObject(object.getId())) {
            _registeredObjects[object.getId()] = object;
            __pchannel("Runtime:RegisterObject", {
                "id": object.getId(),
                "data": object.serialize()
            });
            __schannel("object::(" + object.getId() + ")", function (payload) {
                if (payload.hasOwnProperty("type") && payload.type === "event") {
                    _dispatchEvent(object.getId(), payload.event, payload.data);
                }
            });
            objCount++;
            return;
        } else {
            __trace("Attempted to re-register object or id collision", "warn");
            return;
        }
    }
    Runtime.registerObject = registerObject;

    /**
    * De-Registers an object from the runtime. This not only removes the object
    * from the stage if it is onstage, but also prevents the element from
    * receiving any more events.
    *
    * @param objectId - objectid to remove
    */
    function deregisterObject(objectId) {
        if (Runtime.hasObject(objectId)) {
            if (objectId.substr(0, 2) === "__") {
                __trace("Runtime.deregisterObject cannot de-register a MetaObject", "warn");
                return;
            }
            __pchannel("Runtime:DeregisterObject", {
                "id": objectId
            });
            if (_registeredObjects[objectId].unload != null) {
                if (typeof _registeredObjects[objectId].unload === "function") {
                    // Gracefully unload first
                    _registeredObjects[objectId].unload();
                }
            }
            _registeredObjects[objectId] = null;
            delete _registeredObjects[objectId];
            objCount--;
        }
    }
    Runtime.deregisterObject = deregisterObject;

    /**
    * Generates an objectid that isn't registered
    * @param type - object type
    * @returns {string} - objectid that has not been registered
    */
    function generateId(type) {
        if (typeof type === "undefined") { type = "obj"; }
        var id = type + ":" + (new Date()).getTime() + "|" + Math.round(Math.random() * 4096) + ":" + objCount;
        while (Runtime.hasObject(id)) {
            id = type + ":" + (new Date()).getTime() + "|" + Math.round(Math.random() * 4096) + ":" + objCount;
        }
        return id;
    }
    Runtime.generateId = generateId;
    ;

    /**
    * De-registers all objects. This also unloads them. Objects
    * will not receive any more events
    */
    function reset() {
        for (var i in _registeredObjects) {
            if (i.substr(0, 2) !== "__") {
                Runtime.deregisterObject(i);
            }
        }
    }
    Runtime.reset = reset;

    /**
    * Unloads all objects. Does not deregister them, so they may
    * still receive events.
    */
    function clear() {
        for (var i in _registeredObjects) {
            if (i.substr(0, 2) === "__")
                continue;
            if (_registeredObjects[i].unload) {
                _registeredObjects[i].unload();
            }
        }
    }
    Runtime.clear = clear;

    /**
    * Invoke termination of script
    */
    function crash() {
        __trace("Runtime.crash() : Manual crash", "fatal");
    }
    Runtime.crash = crash;

    /**
    * Invoke exit of script engine
    */
    function exit() {
        self.close();
    }
    Runtime.exit = exit;

    /**
    * Attempts to invoke an alert dialog.
    * Note that this may not work if the Host policy does not allow it
    * @param msg - message for alert
    */
    function alert(msg) {
        __achannel("Runtime::alert", "::Runtime", msg);
    }
    Runtime.alert = alert;
})(Runtime || (Runtime = {}));
