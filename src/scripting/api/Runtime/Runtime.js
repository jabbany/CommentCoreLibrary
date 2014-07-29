var Runtime = new function () {
	/** MetaObject **/
	function MetaObject(nm, callback) {
		this.unload = function () {
		};
		this.dispatchEvent = function (event, data) {
			if (callback) {
				callback(event, data);
			}
		};
		this.getId = function () {
			return nm;
		};
	};
	function TimerRuntime(m) {
		var __precision = m ? m : 10;
		var __timers = [],
			startTime = (new Date()).getTime(),
			__masterTimer = -1;
		var __key = 0;
		var self = this;
		var __masterTimerFunction = function () {
			var elapsed = (new Date()).getTime() - startTime;
			for (var i = 0; i < __timers.length; i++) {
				if (__timers[i].type === "timeout" &&
					__timers[i].timeout <= (elapsed - __timers[i].startTime)) {
					var t = __timers[i];
					__timers.splice(i, 1);
					i--;
					try {
						t.callback();
					} catch (e) {
						if (e.stack) {
							__trace(e.stack, 'err');
						} else {
							__trace(e.toString(), 'err');
						}
					}
				} else if (__timers[i].type === "interval" &&
					__timers[i].interval <= (elapsed - __timers[i].startTime)) {
					__timers[i].startTime = (new Date()).getTime() - startTime;
					try {
						__timers[i].callback();
					} catch (e) {
						if (e.stack) {
							__trace(e.stack, 'err');
						} else {
							__trace(e.toString(), 'err');
						}
					}
				}
				;
			}
			;
			// Check to see if there are any more timers, if not stop the master
			if (__timers.length <= 0) {
				self.stop();
			}
		}

		this.stop = function () {
			if (__masterTimer >= 0) {
				clearInterval(__masterTimer);
				__masterTimer = -1;
			}
		};

		this.start = function () {
			if (__masterTimer < 0) {
				startTime = (new Date()).getTime()
				__masterTimer = setInterval(__masterTimerFunction, 10);
			}
		};

		this.setTimeout = function (callback, timeout) {
			if (__masterTimer < 0)
				self.start();
			var thiskey = __key++;
			__timers.push({
				"callback": callback,
				"type": "timeout",
				"timeout": timeout,
				"startTime": (new Date()).getTime() - startTime,
				"key": thiskey,
			});
			return thiskey;
		};

		this.setInterval = function (callback, interval) {
			if (__masterTimer < 0)
				self.start();
			var thiskey = __key++;
			__timers.push({
				"callback": callback,
				"type": "interval",
				"interval": interval,
				"startTime": (new Date()).getTime() - startTime,
				"key": thiskey,
			});
			return thiskey;
		};

		this.clearAll = function () {
			__timers = [];
			this.stop();
		};

		this.clearInterval = function (key) {
			for (var i = 0; i < __timers.length; i++) {
				if (__timers[i].type === "interval" &&
					__timers[i].key === key) {
					__timers.splice(i, 1);
					return;
				}
			}
		};

		this.clearTimeout = function (key) {
			for (var i = 0; i < __timers.length; i++) {
				if (__timers[i].type === "timeout" &&
					__timers[i].key === key) {
					__timers.splice(i, 1);
					return;
				}
			}
		};
	};
	/********** END OF Inner Class Definition **********/
	var masterTimer = new TimerRuntime();
	var registeredObjects = {
		"__self": new MetaObject("__self"),
		"__player": new MetaObject("__player", function (event, data) {
			if (event === "keyup" || event === "keydown") {
				Player.dispatchTrigger("keyboard", event);
			} else if (event === "comment") {
				Player.dispatchTrigger("comment", data);
			}
		}),
	};
	var registeredListeners = {
		"__self": [],
	};
	var objCount = 0;
	var dispatchEvent = function (objectId, event, data) {
		if (registeredObjects[objectId]) {
			var cobj = registeredObjects[objectId];
			if (cobj.dispatchEvent) {
				cobj.dispatchEvent(event, data);
			}
		}
	};
	var dispatchListener = function (listenerId, event) {
		if (registeredListeners[listenerId]) {

		}
	};
	/********** END OF private objects Registration **********/

	__schannel("Runtime:Timer", function (pld) {
		if (pld.action === "halt") {
			masterTimer.stop();
		} else if (pld.action === "resume") {
			masterTimer.start();
		}
	});

	__schannel("Runtime:onListener", function (pld) {
		// Listener id
	});

	/*********** END OF Channel Registration ***********/
	this.getMasterTimer = function () {
		return masterTimer;
	};

	this.registerObject = function (object) {
		if (!object.getId) {
			__trace("Attempted to register non-named object", 'err');
			return;
		}
		var id = object.getId();
		if (!this.hasObject(id)) {
			registeredObjects[id] = object;
			__pchannel("Runtime:RegisterObject", {
				"id": id,
				"data": object.serialize()
			});
			__schannel("object::(" + id + ")", function (payload) {
				if (payload.type === "event") {
					dispatchEvent(id, payload.event, payload.data);
				}
			});
			objCount++;
			return;
		} else {
			__trace("Attempting to re-register taken id", 'err');
			return;
		}
	};

	this.deregisterObject = function (objectId) {
		if (this.hasObject(objectId)) {
			__schannel("Runtime:DeregisterObject", {
				"id": objectId
			});
			if (registeredObjects[objectId].unload != null) {
				if (typeof registeredObjects[objectId].unload === "function") {
					// Gracefully unload first
					registeredObjects[objectId].unload();
				}
			}
			registeredObjects[objectId] = null;
			delete registeredObjects[objectId];
			objCount--;
		}
	};

	this.registerListener = function (objectId, listener) {
		if (!this.hasObject(objectId)) {
			__trace("Attempting to register listener onto unregistered object "
				+ objectId);
			return;
		}

	};

	this.deregisterListener = function (objectId, listener) {

	};

	this.deregisterAllListeners = function (objectId) {

	};

	this.clear = function () {
		for (var i in registeredObjects) {
			if (registeredObjects[i].unload) {
				registeredObjects[i].unload();
			}
		}
		;
		__achannel("Runtime::clear", "::Runtime", {});
	};

	this.crash = function () {
		/* Crashes the main thread. Forces an exit on error */
		__trace("Manual:Runtime.crash()", "fatal");
	};

	this.alert = function (msg) {
		/* Sends an alert request to the main interface */
		__achannel("Runtime::alert", "::Runtime", msg);
	};

	this.hasObject = function (objId) {
		return (registeredObjects[objId] != null ? true : false);
	};

	this.generateIdent = function (type) {
		if (!type)
			type = "obj";
		var id = type + ":" + (new Date()).getTime() + "|" +
			Math.round(Math.random() * 4096) + ":" + objCount;
		while (this.hasObject(id)) {
			id = type + ":" + (new Date()).getTime() + "|" +
				Math.round(Math.random() * 4096) + ":" + objCount;
		}
		return id;
	};
	
	this.generateId = function (type) {
		return this.generateIdent(type);
	};
};
