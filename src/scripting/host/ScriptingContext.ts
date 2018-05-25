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

    interface IBaseObject { }
    interface IEnvironment { }

    class ScriptingContextError extends Error {
      constructor(message:string) {
        super(message);
      }
    }

    class BaseScriptingContext implements IScriptingContext {
        private _objects:{ [id: string] : IBaseObject; } = {};
        private stage:StageElement;

        constructor (environment:IEnvironment, stage:StageElement) {

        }

        public registerObject(objectId:string, serialized:Object):void {

        }

        public deregisterObject(objectId:string):void {

        }

        public updateProperty(objectId:string, propertyName:string, propertyValue:any):void {

        }

        public callMethod(objectId:string, methodName:string, parameters:any[]):void {

        }

        public getObject(id:string):IBaseObject {
          if (id in this._objects) {
            return this._objects[id];
          }
          throw new ScriptingContextError('Object (' + id + ') not found.');
        }

        public reset():void {

        }

        public getDimensions():IDimensions {
          return;
        }

    }

    export function getContext(stage:StageElement):IScriptingContext {
      return new BaseScriptingContext({}, stage);
    }
}
