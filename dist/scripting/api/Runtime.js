/*!Copyright(c) CommentCoreLibrary v0.11.1 (//github.com/jabbany/CommentCoreLibrary) - Licensed under the MIT License */
(function () {
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

  function _type_of(obj) {
      "@swc/helpers - typeof";

      return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
  }

  /**
   * Crypto-like wrappers that have no actual guarantees of safety.
   * These are just around to provide common interfaces since the sandbox may be
   * running in different environments.
   *
   * If safety is required, please use something else.
   */ var _rngState = [
      Math.floor(Date.now() / 1024) % 1024,
      Date.now() % 1024
  ];
  /**
   * (UNSAFE) Random value generator.
   * @param {number} bits - number of bits of randomness requested
   *                        must not be greater than 32
   * @returns {number} a number within requested number of bits
   */ function random(bits) {
      if (bits === void 0) bits = 16;
      // Use Math.random for this if it exists
      if (bits > 32) {
          throw new Error('NotCrypto.random expects 32 bits or less');
      }
      if (Math && Math.random) {
          var value = 0;
          for(var i = 0; i < bits; i++){
              value = (value << 1) + (Math.random() < 0.5 ? 0 : 1);
          }
          return value;
      } else {
          return fallbackRandom(Date.now() % 1024, bits);
      }
  }
  function xorshift128p() {
      var s0 = _rngState[1], s1 = _rngState[0];
      _rngState[0] = s0;
      s1 ^= s1 << 23;
      s1 ^= s1 >> 17;
      s1 ^= s0;
      s1 ^= s0 >> 26;
      _rngState[1] = s1;
  }
  /**
   * Generates a some randomness
   */ function fallbackRandom(seed, bits) {
      if (bits === void 0) bits = 16;
      if (bits > 32) {
          throw new Error('NotCrypto.fallbackRandom expects 32 bits or less');
      }
      for(var i = 0; i < seed; i++){
          xorshift128p();
      }
      var mask = 0;
      for(var i = 0; i < bits; i++){
          mask = (mask << 1) + 1;
      }
      return _rngState[0] + _rngState[1] & mask;
  }
  /**
   * Transforms an integer to a hex value.
   * @param {number} value - value to transform
   * @param {number} length - how many hex digits to use. 0 means no prefixed 0s
   * @return {string} hex value
   */ function toHex(value, length) {
      if (length === void 0) length = 0;
      if (length <= 0) {
          return value.toString(16);
      }
      var base = value.toString(16);
      while(base.length < length){
          base = '0' + base;
      }
      return base;
  }

  var NotCrypto = /*#__PURE__*/Object.freeze({
    __proto__: null,
    fallbackRandom: fallbackRandom,
    random: random,
    toHex: toHex
  });

  /**
   * Meta object that serves only to receive and send events
   */ var MetaObject = /*#__PURE__*/ function() {
      function MetaObject(name) {
          this._listeners = {};
          if (name.slice(0, 2) !== '__') {
              throw new Error('MetaObject names must start with two underscores.');
          }
          this._name = name;
      }
      var _proto = MetaObject.prototype;
      _proto.addEventListener = function addEventListener(event, listener, _useCapture, _priority) {
          if (!(event in this._listeners)) {
              this._listeners[event] = [];
          }
          this._listeners[event].push(listener);
      };
      _proto.removeEventListener = function removeEventListener(event, listener, _useCapture) {
          if (!(event in this._listeners)) {
              return;
          }
          var index = this._listeners[event].indexOf(listener);
          if (index >= 0) {
              this._listeners[event].splice(index, 1);
          }
      };
      _proto.hasEventListener = function hasEventListener(event) {
          return event in this._listeners && this._listeners[event].length > 0;
      };
      _proto.dispatchEvent = function dispatchEvent(event, data) {
          if (!(event in this._listeners)) {
              return; // Ignore
          }
          for(var i = 0; i < this._listeners[event].length; i++){
              this._listeners[event][i](data);
          }
      };
      _proto.getId = function getId() {
          return this._name;
      };
      _proto.serialize = function serialize() {
          return {
              "class": this._name
          };
      };
      _proto.unload = function unload() {
          throw new Error('Meta objects should not be unloaded!');
      };
      return MetaObject;
  }();
  /** Variables **/ // objCount is uniformly increasing to make object names unique
  var objCount = 0;
  var _registeredObjects = {
      '__self': new MetaObject('__self'),
      '__player': new MetaObject('__player'),
      '__root': new MetaObject('__root')
  };
  // Exposed as the read-only Runtime.registeredObjects (see ../Runtime.ts)
  var registeredObjects = _registeredObjects;
  /**
   * Dispatches an event to the corresponding object
   * @param {string} objectId - object to dispatch to
   * @param {string} event - event id
   * @param {any} payload - event object
   * @private
   */ function _dispatchEvent(objectId, event, payload) {
      var obj = _registeredObjects[objectId];
      if ((typeof obj === "undefined" ? "undefined" : _type_of(obj)) === "object") {
          if (obj.dispatchEvent) {
              obj.dispatchEvent(event, payload);
          }
      }
  }
  /**
   * Checks to see if an object is registered under the id given
   * @param {string} objectId - Id to check
   * @returns {boolean} - whether the objectid is registered
   */ function hasObject(objectId) {
      return _registeredObjects.hasOwnProperty(objectId) && _registeredObjects[objectId] !== null;
  }
  /**
   * Gets the object registered by id
   * @param {string} objectId - objectid of object
   * @returns {RegisterableObject} - object or undefined if not found
   */ function getObject(objectId) {
      return _registeredObjects[objectId];
  }
  /**
   * Registers an object to allow two way communication between the API
   * and the host.
   * @param {RegisterableObject} object - object to be registered.
   */ function registerObject(object) {
      if (!object.getId) {
          __trace('Cannot register object without getId method.', 'warn');
          return;
      }
      if (!hasObject(object.getId())) {
          _registeredObjects[object.getId()] = object;
          __pchannel('Runtime:RegisterObject', {
              'id': object.getId(),
              'data': object.serialize()
          });
          __schannel("object::(" + object.getId() + ")", function(payload) {
              if (payload.hasOwnProperty('type') && payload.type === 'event') {
                  _dispatchEvent(object.getId(), payload.event, payload.data);
              }
          });
          objCount++;
          return;
      } else {
          __trace('Attempted to re-register object or id collision @ ' + object.getId(), 'warn');
          return;
      }
  }
  /**
   * De-Registers an object from the runtime. This not only removes the object
   * from the stage if it is onstage, but also prevents the element from
   * receiving any more events.
   *
   * @param {RegisterableObject} object - object to remove
   */ function deregisterObject(object) {
      var objectId = object.getId();
      deregisterObjectById(objectId);
  }
  function deregisterObjectById(objectId) {
      if (hasObject(objectId)) {
          if (objectId.substr(0, 2) === '__') {
              __trace('Runtime.deregisterObject cannot de-register a MetaObject', 'warn');
              return;
          }
          __pchannel('Runtime:DeregisterObject', {
              'id': objectId
          });
          if (typeof _registeredObjects[objectId].unload === "function") {
              // Gracefully unload first
              _registeredObjects[objectId].unload();
          }
          _registeredObjects[objectId] = null;
          delete _registeredObjects[objectId];
      }
  }
  function _makeId(type) {
      if (type === void 0) type = "obj";
      return type + ":" + Date.now() + "|" + random(16) + ":" + objCount;
  }
  /**
   * Generates an objectid that isn't registered
   * @param {string} type - object type
   * @returns {string} - objectid that has not been registered
   */ function generateId(type) {
      if (type === void 0) type = "obj";
      var id = _makeId(type);
      while(hasObject(id)){
          id = _makeId(type);
      }
      return id;
  }
  /**
   * De-registers all objects. This also unloads them. Objects
   * will not receive any more events
   */ function reset() {
      for(var i in _registeredObjects){
          if (i.substr(0, 2) !== "__") {
              deregisterObjectById(i);
          }
      }
  }
  /**
   * Unloads all objects. Does not deregister them, so they may
   * still receive events.
   */ function clear() {
      for(var i in _registeredObjects){
          if (i.substr(0, 2) === "__") {
              continue;
          }
          if (typeof _registeredObjects[i].unload === 'function') {
              _registeredObjects[i].unload();
          }
      }
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
   * Data class to represent a timer record in the master timer.
   */ var RuntimeTimer = function RuntimeTimer(type, dur, key, callback) {
      this.ttl = dur;
      this.dur = dur;
      this.key = key;
      this.type = type;
      this.callback = callback;
  };
  /**
   * Master timer to control intervals and timeouts
   * @author Jim Chen
   */ var TimerRuntime = /*#__PURE__*/ function() {
      function TimerRuntime(precision) {
          if (precision === void 0) precision = 10;
          this._timer = -1;
          this._timers = [];
          this._lastToken = 0;
          this._key = 0;
          this._precision = precision;
      }
      var _proto = TimerRuntime.prototype;
      _proto.start = function start() {
          if (this._timer < 0) {
              this._lastToken = Date.now();
              var _self = this;
              this._timer = setInterval(function() {
                  var elapsed = Date.now() - _self._lastToken;
                  for(var i = 0; i < _self._timers.length; i++){
                      var timer = _self._timers[i];
                      if (timer.type === "timeout") {
                          timer.ttl -= elapsed;
                          if (timer.ttl <= 0) {
                              try {
                                  timer.callback();
                              } catch (e) {
                                  __trace(e.stack.toString(), 'err');
                              }
                              _self._timers.splice(i, 1);
                              i--;
                          }
                      } else if (timer.type === 'interval') {
                          timer.ttl -= elapsed;
                          if (timer.ttl <= 0) {
                              try {
                                  timer.callback();
                              } catch (e) {
                                  __trace(e.stack.toString(), 'err');
                              }
                              timer.ttl += timer.dur;
                          }
                      } else ;
                  }
                  _self._lastToken = Date.now();
              }, this._precision);
          }
      };
      _proto.stop = function stop() {
          if (this._timer > -1) {
              clearInterval(this._timer);
              this._timer = -1;
          }
      };
      _proto.setInterval = function setInterval1(f, interval) {
          var myKey = this._key++;
          this._timers.push(new RuntimeTimer('interval', interval, myKey, f));
          return myKey;
      };
      _proto.setTimeout = function setTimeout(f, timeout) {
          var myKey = this._key++;
          this._timers.push(new RuntimeTimer('timeout', timeout, myKey, f));
          return myKey;
      };
      _proto.clearInterval = function clearInterval1(id) {
          for(var i = 0; i < this._timers.length; i++){
              if (this._timers[i].type === 'interval' && this._timers[i].key === id) {
                  this._timers.splice(i, 1);
                  return;
              }
          }
      };
      _proto.clearTimeout = function clearTimeout(id) {
          for(var i = 0; i < this._timers.length; i++){
              if (this._timers[i].type === 'timeout' && this._timers[i].key === id) {
                  this._timers.splice(i, 1);
                  return;
              }
          }
      };
      _proto.clearAll = function clearAll(type) {
          if (type === void 0) type = 'all';
          if (type === 'timer') {
              this._timers = this._timers.filter(function(t) {
                  return t.type !== 'timer';
              });
          } else if (type === 'interval') {
              this._timers = this._timers.filter(function(t) {
                  return t.type !== 'interval';
              });
          } else {
              this._timers = [];
          }
      };
      _create_class(TimerRuntime, [
          {
              key: "isRunning",
              get: function get() {
                  return this._timer > -1;
              },
              set: function set(state) {
                  if (state == false) {
                      this.stop();
                  } else {
                      this.start();
                  }
              }
          }
      ]);
      return TimerRuntime;
  }();
  /**
   * Timers interface similar to AS3
   * @author Jim Chen
   */ var Timer = /*#__PURE__*/ function() {
      function Timer(delay, repeatCount) {
          if (repeatCount === void 0) repeatCount = 0;
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
      var _proto = Timer.prototype;
      _proto.start = function start() {
          if (!this.isRunning) {
              var lastTime = Date.now();
              var self = this;
              this._timer = setInterval(function() {
                  var elapsed = Date.now() - lastTime;
                  self._microtime += elapsed;
                  if (self._microtime > self._delay) {
                      self._microtime -= self._delay;
                      self.currentCount++;
                      self.dispatchEvent('timer');
                  }
                  lastTime = Date.now();
                  if (self._repeatCount > 0 && self._repeatCount <= self.currentCount) {
                      self.stop();
                      self.dispatchEvent('timerComplete');
                  }
              }, 20);
          }
      };
      _proto.stop = function stop() {
          if (this.isRunning) {
              clearInterval(this._timer);
              this._timer = -1;
          }
      };
      _proto.reset = function reset() {
          this.stop();
          this.currentCount = 0;
          this._microtime = 0;
      };
      _proto.addEventListener = function addEventListener(type, listener) {
          if (type === 'timer') {
              this._listeners.push(listener);
          } else if (type === 'timerComplete') {
              this._complete.push(listener);
          }
      };
      _proto.dispatchEvent = function dispatchEvent(event) {
          if (event === 'timer') {
              for(var i = 0; i < this._listeners.length; i++){
                  this._listeners[i]();
              }
          } else if (event === 'timerComplete') {
              for(var i = 0; i < this._complete.length; i++){
                  this._complete[i]();
              }
          }
      };
      _create_class(Timer, [
          {
              key: "isRunning",
              get: function get() {
                  return this._timer >= 0;
              },
              set: function set(_b) {
                  __trace('Timer.isRunning is read-only', 'warn');
              }
          }
      ]);
      return Timer;
  }();
  /**
   * Internal class to help other methods keep time without incurring processing
   * costs.
   */ var TimeKeeper = /*#__PURE__*/ function() {
      function TimeKeeper(clock) {
          if (clock === void 0) clock = function clock() {
              return Date.now();
          };
          this._clock = clock;
          this.reset();
      }
      var _proto = TimeKeeper.prototype;
      _proto.reset = function reset() {
          this._lastTime = this._clock();
      };
      _create_class(TimeKeeper, [
          {
              key: "elapsed",
              get: function get() {
                  return this._clock() - this._lastTime;
              }
          }
      ]);
      return TimeKeeper;
  }();
  /** Timer Related Items**/ /** Master timer instance (should only have one in whole runtime) */ var masterTimer = new TimerRuntime();
  /** Refresh timer instance (should only have one in whole runtime) */ var internalTimer = new Timer(40);
  var enterFrameDispatcher = function enterFrameDispatcher() {
      for(var object in registeredObjects){
          if (object.substring(0, 2) === '__' && object !== '__root') {
              continue;
          }
          try {
              registeredObjects[object].dispatchEvent('enterFrame');
          } catch (e) {}
      }
  };
  masterTimer.start();
  internalTimer.start();
  internalTimer.addEventListener('timer', enterFrameDispatcher);
  /**
   *  Get the master timer instance
   */ function getTimer() {
      return masterTimer;
  }
  /**
   * Update the rate in which the enterFrame event is broadcasted
   * This synchronizes the frameRate value of the Display object.
   * By default, the frame rate is around 24fps.
   * @param frameRate - number indicating frame rate
   */ function updateFrameRate(frameRate) {
      if (frameRate > 60 || frameRate < 0) {
          __trace('Frame rate should be in the range (0, 60]', 'warn');
          return;
      }
      if (frameRate === 0) {
          // Stop broadcasting of enterFrame
          internalTimer.stop();
          return;
      }
      internalTimer.stop();
      internalTimer = new Timer(Math.floor(1000 / frameRate));
      internalTimer.addEventListener('timer', enterFrameDispatcher);
      internalTimer.start();
  }

  var ScriptManagerImpl = /*#__PURE__*/ function() {
      function ScriptManagerImpl() {
          this._managedElements = {};
      }
      var _proto = ScriptManagerImpl.prototype;
      /**
     * Internal method to register an element's MotionManager with ScriptManager
     */ _proto._registerElement = function _registerElement(name, mM) {
          this._managedElements[name] = mM;
      };
      _proto.clearTimer = function clearTimer() {
          getTimer().clearAll('interval');
      };
      _proto.clearEl = function clearEl() {
          // Remove all elements drawn
          __trace("ScriptManager.clearEl may not be properly implemented.", "warn");
          clear();
      };
      _proto.clearTrigger = function clearTrigger() {
          __trace("ScriptManager.clearTrigger not implemented.", "warn");
      };
      _proto.pushEl = function pushEl(el) {
          __trace("ScriptManager.pushEl is not properly implemented.", "warn");
          if (el['motionManager']) {
              el['motionManager'].start();
          }
          el['visible'] = true;
      };
      _proto.popEl = function popEl(el) {
          __trace("ScriptManager.popEl is not properly implemented.", "warn");
          // TODO: Create some kind of thing to register motion managers properly
          if (el['motionManager']) {
              el['motionManager'].play();
          }
          el['visible'] = false;
      };
      _proto.pushTimer = function pushTimer(t) {
          __trace("ScriptManager.pushTimer not implemented.", "warn");
      };
      _proto.popTimer = function popTimer(t) {
          __trace("ScriptManager.popTimer not implemented.", "warn");
      };
      _proto.toString = function toString() {
          return '[scriptManager ScriptManager]';
      };
      return ScriptManagerImpl;
  }();
  var _defaultScriptManager = new ScriptManagerImpl();

  var permissions = {};
  function requestPermission(name, callback) {
      __channel("Runtime:RequestPermission", {
          "name": name
      }, function(result) {
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
  function hasPermission(name) {
      if (permissions.hasOwnProperty(name) && permissions[name]) {
          return true;
      }
      return false;
  }
  function openWindow(url, params, callback) {
      if (callback === void 0) callback = null;
      __channel("Runtime:PrivilegedAPI", {
          "method": "openWindow",
          "params": [
              url,
              params
          ]
      }, function(windowId) {
          // Create a small compact window object
          var WND = {
              "moveTo": function(x, y) {
                  __pchannel("Runtime:PrivilegedAPI", {
                      "method": "window",
                      "params": [
                          windowId,
                          "moveTo",
                          [
                              x,
                              y
                          ]
                      ]
                  });
              },
              "resizeTo": function(w, h) {
                  __pchannel("Runtime:PrivilegedAPI", {
                      "method": "window",
                      "params": [
                          windowId,
                          "resizeTo",
                          [
                              w,
                              h
                          ]
                      ]
                  });
              },
              "focus": function() {
                  __pchannel("Runtime:PrivilegedAPI", {
                      "method": "window",
                      "params": [
                          windowId,
                          "focus"
                      ]
                  });
              },
              "close": function() {
                  __pchannel("Runtime:PrivilegedAPI", {
                      "method": "window",
                      "params": [
                          windowId,
                          "close"
                      ]
                  });
              }
          };
          if (callback !== null) {
              callback(WND);
          }
      });
  }
  function injectStyle(referenceObject, style) {
      __pchannel("Runtime:PrivilegedAPI", {
          "method": "injectStyle",
          "params": [
              referenceObject,
              style
          ]
      });
  }
  function privilegedCode() {
      __trace('Runtime.privilegedCode not available.', 'warn');
  }

  var supported = {
      "js": [
          "*"
      ],
      "Runtime": [
          "*",
          "openWindow",
          "injectStyle"
      ],
      "Display": [
          "*"
      ],
      "Player": [
          "*"
      ],
      "Tween": [
          "*"
      ],
      "Utils": [
          "*"
      ]
  };
  /**
   * Check if a certain feature is supported by the Runtime
   * @param {string} featureName - feature to be checked
   * @param {string} subfeature - sub feature (defaults to all)
   * @return {boolean} indicator of whether feature is supported
   */ function supports(featureName, subfeature) {
      if (subfeature === void 0) subfeature = "*";
      if (!supported.hasOwnProperty(featureName)) {
          return false;
      } else {
          if (supported[featureName].indexOf(subfeature) >= 0) {
              return true;
          }
      }
      return false;
  }
  /**
   * Requests for a library and loads it. This is used by the load method
   * @param {string} libraryName - library to be loaded
   * @param {function} callback - function called after loading completes/fails
   */ function requestLibrary(libraryName, callback) {
      if (libraryName === 'libBitmap') {
          callback(null, {
              'type': 'noop'
          });
      } else {
          callback(new Error('Could not load unknown library [' + libraryName + ']'), null);
      }
  }

  /**
   * Invoke termination of script from outside the sandbox
   */ function crash() {
      __trace("Runtime.crash() : Manual crash", "fatal");
  }
  /**
   * Invoke graceful exit of script engine
   */ function exit() {
      __achannel("::worker:state", "worker", "terminated");
      self.close();
  }
  /**
   * Attempts to invoke an alert dialog.
   * Note: that this may not work if the Host policy does not allow it
   * @param {string} msg - message for alert
   */ function alert(msg) {
      __achannel("Runtime::alert", "::Runtime", msg);
  }

  var RuntimeModule = /*#__PURE__*/Object.freeze({
    __proto__: null,
    NotCrypto: NotCrypto,
    TimeKeeper: TimeKeeper,
    Timer: Timer,
    _defaultScriptManager: _defaultScriptManager,
    alert: alert,
    clear: clear,
    crash: crash,
    deregisterObject: deregisterObject,
    exit: exit,
    generateId: generateId,
    getObject: getObject,
    getTimer: getTimer,
    hasObject: hasObject,
    hasPermission: hasPermission,
    injectStyle: injectStyle,
    openWindow: openWindow,
    privilegedCode: privilegedCode,
    registerObject: registerObject,
    registeredObjects: registeredObjects,
    requestLibrary: requestLibrary,
    requestPermission: requestPermission,
    reset: reset,
    supports: supports,
    updateFrameRate: updateFrameRate
  });

  var Runtime = createModule(RuntimeModule, {
      'registeredObjects': {
          get: function get() {
              return registeredObjects;
          },
          set: function set(_value) {
              __trace('Runtime.registeredObjects is read-only', 'warn');
          }
      }
  });
  exportGlobal('Runtime', Runtime);
  exportGlobal('ScriptManager', Runtime._defaultScriptManager);

})();
