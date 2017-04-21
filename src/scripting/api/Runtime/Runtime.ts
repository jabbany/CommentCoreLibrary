/**
 * Runtime Internal Module
 * Author: Jim Chen
 */
/// <reference path="../OOAPI.d.ts" />

/// <reference path="Timer.ts" />
/// <reference path="ScriptManager.ts" />
/// <reference path="Permissions.ts" />
/// <reference path="Supports.ts" />
module Runtime {

	/**
	 * Global interface for Listenable objects
	 */
	export interface Listenable {
		addEventListener(
			event:string,
			listener:Function,
			useCapture:boolean,
			priority:number):void;
		removeEventListener(
			event:string,
			listener:Function,
			useCapture:boolean
		):void;
		hasEventListener(event:string):boolean;
	}

	/**
	 * Interface to define an object that can be registered to the runtime
	 */
	export interface RegisterableObject {
		getId():string;
		dispatchEvent(event:string, data?:any):void;
		serialize():Object;
	}

	/**
	 * Meta object that serves only to receive and send events
	 */
	class MetaObject implements RegisterableObject, Listenable {
		private _name:string;
		private _listeners:{[name:string]: Array<Function>} = {};

		constructor(name:string) {
			this._name = name;
		}

		public addEventListener(event:string,
			listener:Function,
			useCapture:boolean = false,
			priority:number = 0):void {

  		if (!(event in this._listeners)) {
				this._listeners[event] = [];
			}
			this._listeners[event].push(listener);
		}

		public removeEventListener(event:string,
			listener:Function,
			useCapture:boolean = false):void {

		  if (!(event in this._listeners)) {
				return;
			}
			var index = this._listeners[event].indexOf(listener)
			if (index >= 0) {
				this._listeners[event].splice(index, 1);
			}
		}

		public hasEventListener(event:string):boolean {
			return event in this._listeners && this._listeners[event].length > 0;
		}

		public dispatchEvent(event:string, data?:any):void {
			if (!(event in this._listeners)) {
				return; // Ignore
			}
			for (var i:number = 0; i < this._listeners[event].length; i++) {
				this._listeners[event][i](data);
			}
		}

		public getId():string {
			return this._name;
		}

		public serialize():Object {
			return {
				"class":this._name
			};
		}
	}

	/** Variables **/
	var objCount:number = 0;
	var _registeredObjects:Object = {
		'__self': new MetaObject('__self'),
		'__player': new MetaObject('__player'),
		'__root': new MetaObject('__root')
	};

	export var registeredObjects:Object;
	Object.defineProperty(Runtime, 'registeredObjects', {
		get: function () {
			return _registeredObjects;
		},
		set: function (value) {
			__trace('Runtime.registeredObjects is read-only', 'warn');
		}
	});

	/**
	 * Dispatches an event to the corresponding object
	 * @param objectId - object to dispatch to
	 * @param event - event id
	 * @param payload - event object
	 * @private
	 */
	function _dispatchEvent(objectId:string, event:string, payload:any){
		var obj:RegisterableObject = _registeredObjects[objectId];
		if (typeof obj === "object") {
			if (obj.dispatchEvent) {
				obj.dispatchEvent(event, payload);
			}
		}
	}

	/**
	 * Checks to see if an object is registered under the id given
	 * @param objectId - Id to check
	 * @returns {boolean} - whether the objectid is registered
	 */
	export function hasObject(objectId:string):boolean {
		return _registeredObjects.hasOwnProperty(objectId) &&
			_registeredObjects[objectId] !== null;
	}

	/**
	 * Gets the object registered by id
	 * @param objectId - objectid of object
	 * @returns {any} - object or undefined if not found
	 */
	export function getObject(objectId:string):any{
		return _registeredObjects[objectId];
	}

	/**
	 * Registers an object to allow two way communication between the API
	 * and the host.
	 * @param object - object to be registered. Must have getId method.
	 */
	export function registerObject(object:RegisterableObject):void{
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
			__schannel("object::(" + object.getId() + ")",  (payload:any) => {
				if (payload.hasOwnProperty("type") &&
					payload.type === "event") {
					_dispatchEvent(object.getId(), payload.event, payload.data);
				}
			});
			objCount++;
			return;
		} else {
			__trace('Attempted to re-register object or id collision', 'warn');
			return;
		}
	}

	/**
	 * De-Registers an object from the runtime. This not only removes the object
	 * from the stage if it is onstage, but also prevents the element from
	 * receiving any more events.
	 *
	 * @param objectId - objectid to remove
	 */
	export function deregisterObject(objectId:string):void {
		if (Runtime.hasObject(objectId)) {
			if (objectId.substr(0,2) === "__") {
				__trace("Runtime.deregisterObject cannot de-register a MetaObject","warn");
				return;
			}
			__pchannel("Runtime:DeregisterObject", {
				"id": objectId
			});
			if (typeof _registeredObjects[objectId].unload === "function") {
			  // Gracefully unload first
				_registeredObjects[objectId].unload();
			}
			_registeredObjects[objectId] = null;
			delete _registeredObjects[objectId];
			objCount--;
		}
	}

	/**
	 * Generates an objectid that isn't registered
	 * @param type - object type
	 * @returns {string} - objectid that has not been registered
	 */
	export function generateId(type:string = "obj"):string {
		var id:string = type + ":" + (new Date()).getTime() + "|" +
			Math.round(Math.random() * 4096) + ":" + objCount;
		while (Runtime.hasObject(id)) {
			id = type + ":" + (new Date()).getTime() + "|" +
				Math.round(Math.random() * 4096) + ":" + objCount;
		}
		return id;
	};

	/**
	 * De-registers all objects. This also unloads them. Objects
	 * will not receive any more events
	 */
	export function reset():void {
		for (var i in _registeredObjects) {
			if (i.substr(0,2) !== "__") {
				Runtime.deregisterObject(i);
			}
		}
	}

	/**
	 * Unloads all objects. Does not deregister them, so they may
	 * still receive events.
	 */
	export function clear():void {
		for (var i in _registeredObjects) {
			if (i.substr(0,2) === "__") {
				continue;
			}
			if (_registeredObjects[i].unload) {
				_registeredObjects[i].unload();
			}
		}
	}

	/**
	 * Invoke termination of script
	 */
	export function crash():void {
		__trace("Runtime.crash() : Manual crash", "fatal");
	}

	/**
	 * Invoke graceful exit of script engine
	 */
	export function exit():void{
		__achannel("::worker:state", "worker", "terminated");
		self.close();
	}

	/**
	 * Attempts to invoke an alert dialog.
	 * Note: that this may not work if the Host policy does not allow it
	 * @param msg - message for alert
	 */
	export function alert(msg:string):void {
		__achannel("Runtime::alert", "::Runtime", msg);
	}
}
