/**
 * Runtime Internal Module
 * Author: Jim Chen
 */
module Runtime{
	export interface RegisterableObject{
		getId():string;
		dispatchEvent(event:string, data:any):void;
	}
	class MetaObject implements RegisterableObject {
		private _name:string;
		private _oncallback:Function = null;
		constructor(name:string, callback:Function = null){
			this._name = name;
			this._oncallback = callback;
		}
		public dispatchEvent(event:string, data:any):void{
			if(this._oncallback !== null){
				this._oncallback(event, data);
			}
		}
		public getId():string{
			return this._name;
		}
	}
	class TimerRuntime {
		public start():void{

		}
		public stop():void{

		}
		public setInterval():number{

		}
		public setTimeout():number{

		}
		public clearInterval(id:number):void{

		}
		public clearTimeout(id:number):void{

		}
		public clearAll():void{

		}
	}
	export class Timer{

	}
	/** Variables **/
	var objCount:number = 0;
	var registeredObjects:Object = {
		"__self":new MetaObject("__self"),
		"__player":new MetaObject("__player")
	};
	var masterTimer:TimerRuntime = new TimerRuntime();
	export function crash():void{
		__trace("Runtime.crash() : Manual crash", "fatal");
	}

	export function alert(msg:string):void{
		__achannel("Runtime::alert", "::Runtime" , msg);
	}

	export function hasObject(objectId:string):boolean{
		return registeredObjects.hasOwnProperty(objectId);
	}

	export function generateId(type:string = "obj"):string{
		var id:string = type + ":" + (new Date()).getTime() + "|" +
			Math.round(Math.random() * 4096) + ":" + objCount;
		while(this.hasObject(id)){
			id = type + ":" + (new Date()).getTime() + "|" +
				Math.round(Math.random() * 4096) + ":" + objCount;
		}
		return id;
	};
}