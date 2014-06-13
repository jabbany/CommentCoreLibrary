/**
 * AS3 Like Timer Control for Runtime
 */

module Runtime{
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
}
