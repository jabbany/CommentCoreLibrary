/// <reference path="../OOAPI.d.ts" />

/// <reference path="Timer.ts" />

module Runtime {

  /**
   * Script Manager polyfill for BiliScriptEngine
   * @author Jim Chen
   */
  export interface ScriptManager {
    clearTimer():void;
    clearEl():void;
    clearTrigger():void;
    pushEl(el:any):void;
    popEl(el:any):void;
    pushTimer(t:Timer):void;
    popTimer(t:Timer):void;
  }

  export interface IMotionManager {
    stop():void;
  }

  class ScriptManagerImpl implements ScriptManager {
    private _managedElements:{[name: string]: IMotionManager} = {};

    constructor() { }

    /**
     * Internal method to register an element's MotionManager with ScriptManager
     */
    public _registerElement(name:string, mM: IMotionManager):void {
      this._managedElements[name] = mM;
    }

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
      __trace("ScriptManager.popEl is not properly implemented.", "warn");
      // TODO: Create some kind of thing to register motion managers properly
      if (el['motionManager']) {
        <IMotionManager> el['motionManager'].stop();
      }
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
