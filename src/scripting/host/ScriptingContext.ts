/**
 * Scripting context used by the host end of KagerouEngine
 * @author Jim Chen
 */

module Kagerou {
    interface ScriptingContext {
    
    }
    interface IDimensions {
        stageWidth:number;
        stageHeight:number;
        screenWidth:number;
        screenHeight:number;
    }

    interface IBaseObject { }
    interface IEnvironment { }

    class BaseScriptingContext implements ScriptingContext {
        private _objects:{ [id: string] : IBaseObject; } = {};
        private stage:any;

        constructor (environment:IEnvironment, stage:any) {
        
        }

        public registerObject():void {
        
        }

        public deregisterObject():void {
        
        }

        public updateProperty():void {
        
        }

        public callMethod():void {
        
        }

        public getObject(id:string):IBaseObject {
        
        }

        public invokeError(message:string, mode:string) {
        
        }

        public clear():void {
        
        }

        public getDimensions():IDimensions {
            
        }

    }
}
