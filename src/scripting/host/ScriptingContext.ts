/// <reference path="Unpacker/Unpacker.ts" />
/**
 * Scripting context used by the host end of KagerouEngine
 * @author Jim Chen
 */

import { StageElement, IScriptingContext } from "./IScripter.ts";

export module KagerouScripting {
  interface IDimensions {
    stageWidth:number;
    stageHeight:number;
    screenWidth:number;
    screenHeight:number;
  }

  interface ISerializedData {
    class:string;
  }
  interface IBaseObject {
    unpackedObject:any;
    destroy():void;
  }
  interface IEnvironment { }

  class ScriptingContextError extends Error {
    constructor(message:string) {
      super(message);
    }
  }

  class StageObject implements IBaseObject {
    public unpackedObject:Unpacker.DOMObject;
    private _stage:StageElement;

    constructor(stage:StageElement, obj:Unpacker.DOMObject) {
      this.unpackedObject = obj;
      this._stage = stage;
    }

    public construct():void {
      this._stage.appendChild(this.unpackedObject.DOM);
    }

    public destroy():void {
      this._stage.removeChild(this.unpackedObject.DOM);
    }
  }

  class BaseScriptingContext implements IScriptingContext {
    private _objects:{ [id: string] : IBaseObject; } = {};
    private stage:StageElement;

    constructor (environment:IEnvironment, stage:StageElement) {
      this.stage = stage;
    }

    public registerObject(objectId:string, serialized:ISerializedData):void {
      if (this.hasObject(objectId)) {
        throw new ScriptingContextError('Attempting to register object (' +
          objectId + ') but object already present.');
      }
      var obj = new StageObject(this.stage,
        Unpacker.unpack(serialized.class, serialized));
      obj.construct();

      this._objects[objectId] = obj;
    }

    public deregisterObject(objectId:string):void {
      // Forces a destruction of the object
      if (this.hasObject(objectId)) {
        this._objects[objectId].destroy();
        delete this._objects[objectId];
      }
    }

    public updateProperty(objectId:string, propertyName:string,
      propertyValue:any):void {

      this.getObject(objectId)[propertyName] = propertyValue;
    }

    public callMethod(objectId:string, methodName:string,
      parameters:any[]):void {

      var obj = this.getObject(objectId);
      if(typeof obj[methodName] !== 'function') {
        throw new ScriptingContextError('Object(' + objectId +
          ') does not have method "' + methodName + '".');
      } else {
        obj[methodName](parameters);
      }
    }

    public hasObject(id:string):boolean {
      return id in this._objects;
    }

    public getObject(id:string):IBaseObject {
      if (this.hasObject(id)) {
        return this._objects[id].unpackedObject;
      }
      throw new ScriptingContextError('Object (' + id + ') not found.');
    }

    public reset():void {
      for (var objectId in this._objects) {
        this._objects[objectId].destroy();
      }
      this._objects = {};
    }

    public getDimensions():IDimensions {
      return {
        'stageWidth': this.stage.offsetWidth,
        'stageHeight': this.stage.offsetHeight,
        'screenWidth': window.screen.width,
        'screenHeight': window.screen.height
      };
    }
  }

  export function getContext(stage:StageElement):IScriptingContext {
    return new BaseScriptingContext({}, stage);
  }
}
