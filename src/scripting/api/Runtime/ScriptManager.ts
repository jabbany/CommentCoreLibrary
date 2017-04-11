/**
 * Script Manager
 */
/// <reference path="../OOAPI.d.ts" />
/// <reference path="Timer.ts" />
module Runtime {
  export interface ScriptManager {
    clearTimer():void;
    clearEl():void;
    clearTrigger():void;
    pushEl(el:any):void;
    popEl(el:any):void;
    pushTimer(t:Timer):void;
    popTimer(t:Timer):void;
  }

  class ScriptManagerImpl implements ScriptManager {
    constructor() { }
    public clearTimer():void {
      Runtime.getTimer().clearAll('interval');
    }

    public clearEl():void {
      __trace("ScriptManager.clearEl not implemented.", "warn");
    }

    public clearTrigger():void {
      __trace("ScriptManager.clearTrigger not implemented.", "warn");
    }

    public pushEl(el:any):void {
      __trace("ScriptManager.pushEl not implemented.", "warn");
    }

    public popEl(el:any):void {
      __trace("ScriptManager.popEl not implemented.", "warn");
    }

    public pushTimer(t:Timer):void {
      __trace("ScriptManager.pushTimer not implemented.", "warn");
    }

    public popTimer(t:Timer):void {
      __trace("ScriptManager.popTimer not implemented.", "warn");
    }

    public toString():string {
      return '[scriptManager ScriptManager]';
    }
  }

  export var _defaultScriptManager:ScriptManager = new ScriptManagerImpl();
}

var ScriptManager:Runtime.ScriptManager = Runtime._defaultScriptManager;
