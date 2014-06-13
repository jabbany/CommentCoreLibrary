/**
 * Runtime Internal Module
 * Author: Jim Chen
 */
/// <reference path="Timer.ts" />
/// <reference path="Permissions.ts" />
module Runtime {
	export interface RegisterableObject {
		getId():string;
		dispatchEvent(event:string, data:any):void;
	}

	class MetaObject implements RegisterableObject {
		private _name:string;
		private _oncallback:Function = null;

		constructor(name:string, callback:Function = null) {
			this._name = name;
			this._oncallback = callback;
		}

		public dispatchEvent(event:string, data:any):void {
			if (this._oncallback !== null) {
				this._oncallback(event, data);
			}
		}

		public getId():string {
			return this._name;
		}
	}
	/** Variables **/
	var objCount:number = 0;
	var registeredObjects:Object = {
		"__self": new MetaObject("__self"),
		"__player": new MetaObject("__player")
	};
	/** Timer Related **/
	var masterTimer:TimerRuntime = new TimerRuntime();
	var internalTimer:TimerRuntime = new TimerRuntime(20);
	var enterFrameDispatcher:Function = function () {
		for (var object in registeredObjects) {
			if (object.getId().substring(0, 2) === "__") {
				continue;
			}
			object.dispatchEvent("enterFrame");
		}
	};
	var enterFrameInterval:number = -1;

	/** Exported functions **/
	export function getTimer():any {
		return masterTimer;
	}

	export function updateFrameRate():void {
		var frameRate:number = Display.frameRate;
		internalTimer.clearInterval(enterFrameInterval);
		enterFrameInterval = internalTimer.setInterval(enterFrameDispatcher,
			Math.floor(1000 / frameRate));
	}

	export function crash():void {
		__trace("Runtime.crash() : Manual crash", "fatal");
	}

	export function alert(msg:string):void {
		__achannel("Runtime::alert", "::Runtime", msg);
	}

	export function hasObject(objectId:string):boolean {
		return registeredObjects.hasOwnProperty(objectId);
	}

	export function generateId(type:string = "obj"):string {
		var id:string = type + ":" + (new Date()).getTime() + "|" +
			Math.round(Math.random() * 4096) + ":" + objCount;
		while (this.hasObject(id)) {
			id = type + ":" + (new Date()).getTime() + "|" +
				Math.round(Math.random() * 4096) + ":" + objCount;
		}
		return id;
	};
}