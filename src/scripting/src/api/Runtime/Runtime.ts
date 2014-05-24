/**
 * Runtime Internal Module
 * Author: Jim Chen
 */
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
	class TimerRuntime {
		private _precision:number;
		private _timer:number = -1;
		private _timers:Array<Object> = [];
		private _startTime:number = 0;
		private _key:number = 0;

		constructor(precision:number = 10) {
			this._precision = precision;
		}

		public start():void {
			if (this._timer < 0) {
				this._startTime = Date.now();
				var _self:TimerRuntime = this;
				this._timer = setInterval(function () {
					var elapsed:number = Date.now() - _self._startTime;
					for (var i = 0; i < _self._timers.length; i++) {
						var timer:Object = _self._timers[i];
						if (!timer.hasOwnProperty("type"))
							continue;
						if (timer.type === "interval") {

						} else if (timer.type === "timeout") {

						}
					}
				}, this._precision);
			}
		}

		public stop():void {
			if (this._timer > -1) {
				clearInterval(this._timer);
				this._timer = -1;
			}
		}

		public setInterval(f:Function, interval:number):number {
			var myKey = this._key++;
			this._timers.push({
				"type": "interval",
				"startTime": Date.now(),
				"key": myKey,
				"interval": interval,
				"callback": f
			});
			return myKey;
		}

		public setTimeout(f:Function, timeout:number):number {
			var myKey = this._key++;
			this._timers.push({
				"type": "timeout",
				"startTime": Date.now(),
				"key": myKey,
				"timeout": timeout,
				"callback": f
			});
			return myKey;
		}

		public clearInterval(id:number):void {
			for (var i = 0; i < this._timers.length; i++) {
				if (this._timers[i].hasOwnProperty("type") &&
					this._timers[i].type === "interval" &&
					this._timers[i].key === id) {
					this._timers.splice(i, 1);
					return;
				}
			}
		}

		public clearTimeout(id:number):void {
			for (var i = 0; i < this._timers.length; i++) {
				if (this._timers[i].hasOwnProperty("type") &&
					this._timers[i].type === "timeout" &&
					this._timers[i].key === id) {
					this._timers.splice(i, 1);
					return;
				}
			}
		}

		public clearAll():void {
			this._timers = [];
		}
	}
	export class Timer {

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