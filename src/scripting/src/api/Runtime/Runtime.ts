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

}