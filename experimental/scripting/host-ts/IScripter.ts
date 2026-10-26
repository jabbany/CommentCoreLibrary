export type StageElement = HTMLDivElement | HTMLCanvasElement;

export interface IPlayer {
  play():void;
  pause():void;
  seek(position:number):void;
  jump(item:string):void;
  addEventListener(eventName:string, listener:Function):void;
  triggerAction(actionName:string, parameters?:Object):void;
}

export interface IScriptingContext {
  reset():void;
}

export interface ISandbox {
  eval(code:string):void;
  reset():void;
}

export interface Logger{
	log(msg:any):void;
	error(msg:any):void;
	warn(msg:any):void;
}

export interface IScripter {
  backendVersion:string;
  frontendVersion:string;
  logger:Logger;

  getWorker():Worker;
  getSandbox(stage:StageElement, player:IPlayer):ISandbox;
}
