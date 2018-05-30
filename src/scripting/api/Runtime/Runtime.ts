/// <reference path="../OOAPI.d.ts" />

/// <reference path="NotCrypto.ts" />
/// <reference path="Timer.ts" />
/// <reference path="ScriptManager.ts" />
/// <reference path="Permissions.ts" />
/// <reference path="Supports.ts" />

/**
* Runtime Internal Module
* @author Jim Chen
*/
module Runtime {
  type ObjectRegistry = {[objectName: string]: RegisterableObject};
  type IMetaObject = RegisterableObject & Listenable;
  /**
   * Global interface for Listenable objects
   */
  export interface Listenable {
    addEventListener(
      event:string,
      listener:Function,
      useCapture?:boolean,
      priority?:number):void;
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
    unload():void;
  }

  /**
   * Meta object that serves only to receive and send events
   */
  class MetaObject implements RegisterableObject, Listenable {
    private _name:string;
    private _listeners:{[name:string]: Array<Function>} = {};

    constructor(name:string) {
      if (name.slice(0, 2) !== '__') {
        throw new Error('MetaObject names must start with two underscores.');
      }
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

    public unload():void {
      throw new Error('Meta objects should not be unloaded!');
    }
  }

  /** Variables **/
  // objCount is uniformly increasing to make object names unique
  var objCount:number = 0;
  var _registeredObjects:ObjectRegistry = {
    '__self': new MetaObject('__self'),
    '__player': new MetaObject('__player'),
    '__root': new MetaObject('__root')
  };

  export var registeredObjects:ObjectRegistry;
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
   * @param {string} objectId - object to dispatch to
   * @param {string} event - event id
   * @param {any} payload - event object
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
   * @param {string} objectId - Id to check
   * @returns {boolean} - whether the objectid is registered
   */
  export function hasObject(objectId:string):boolean {
    return _registeredObjects.hasOwnProperty(objectId) &&
      _registeredObjects[objectId] !== null;
  }

  /**
   * Gets the object registered by id
   * @param {string} objectId - objectid of object
   * @returns {RegisterableObject} - object or undefined if not found
   */
  export function getObject<T extends RegisterableObject>(objectId:string):T {
    return <T> _registeredObjects[objectId];
  }

  /**
   * Registers an object to allow two way communication between the API
   * and the host.
   * @param {RegisterableObject} object - object to be registered.
   */
  export function registerObject(object:RegisterableObject):void{
    if (!object.getId) {
      __trace('Cannot register object without getId method.','warn');
      return;
    }
    if (!Runtime.hasObject(object.getId())) {
      _registeredObjects[object.getId()] = object;
      __pchannel('Runtime:RegisterObject', {
        'id': object.getId(),
        'data': object.serialize()
      });
      __schannel("object::(" + object.getId() + ")",  (payload:any) => {
        if (payload.hasOwnProperty('type') &&
          payload.type === 'event') {
          _dispatchEvent(object.getId(), payload.event, payload.data);
        }
      });
      objCount++;
      return;
    } else {
      __trace('Attempted to re-register object or id collision @ ' +
        object.getId(), 'warn');
      return;
    }
  }

  /**
   * De-Registers an object from the runtime. This not only removes the object
   * from the stage if it is onstage, but also prevents the element from
   * receiving any more events.
   *
   * @param {RegisterableObject} object - object to remove
   */
  export function deregisterObject(object:RegisterableObject):void {
    var objectId:string = object.getId();
    deregisterObjectById(objectId);
  }

  function deregisterObjectById(objectId:string) {
    if (Runtime.hasObject(objectId)) {
      if (objectId.substr(0,2) === '__') {
        __trace('Runtime.deregisterObject cannot de-register a MetaObject',
          'warn');
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

  function _getId(type:string = 'obj', container:string = 'rt'):string {
    var randomSeed:number = Math.random()
    var randomSegment:string = '';
    return;
  }

  /**
   * Generates an objectid that isn't registered
   * @param {string} type - object type
   * @returns {string} - objectid that has not been registered
   */
  export function generateId(type:string = "obj"):string {
    var id:string = [type, ':', Date.now(), '|',
      Runtime.NotCrypto.random(16), ':', objCount].join();
    while (Runtime.hasObject(id)) {
      id = type + ":" + Date.now() + "|" +
        Runtime.NotCrypto.random(16) + ":" + objCount;
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
        deregisterObjectById(i);
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
      if (typeof _registeredObjects[i].unload === 'function') {
        _registeredObjects[i].unload();
      }
    }
  }

  /**
   * Invoke termination of script from outside the sandbox
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
   * @param {string} msg - message for alert
   */
  export function alert(msg:string):void {
    __achannel("Runtime::alert", "::Runtime", msg);
  }
}
