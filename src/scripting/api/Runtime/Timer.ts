/**
 * AS3 Like Timer Control for Runtime
 */

module Runtime{
	class RuntimeTimer{
		public ttl:number;
		public dur:number;
		public key:number;
		public type:string;
		public callback:Function;
		constructor(type:string, dur:number, key:number, callback:Function){
			this.ttl = dur;
			this.dur = dur;
			this.key = key;
			this.type = type;
			this.callback = callback;
		}
	}

	class TimerRuntime {
		private _precision:number;
		private _timer:number = -1;
		private _timers:Array<RuntimeTimer> = [];
		private _lastToken:number = 0;
		private _key:number = 0;

		constructor(precision:number = 10) {
			this._precision = precision;
		}

		set isRunning(state:boolean){
			if(state == false){
				this.stop();
			}else{
				this.start();
			}
		}

		get isRunning():boolean{
			return this._timer > -1;
		}

		public start():void {
			if (this._timer < 0) {
				this._lastToken = Date.now();
				var _self:TimerRuntime = this;
				this._timer = setInterval(function () {
					var elapsed:number = Date.now() - _self._lastToken;
					for (var i = 0; i < _self._timers.length; i++) {
						var timer:RuntimeTimer = _self._timers[i];
						if (timer.type === "timeout") {
							timer.ttl -= elapsed;
							if (timer.ttl <= 0) {
								try {
									timer.callback();
								}catch(e){
									__trace(e.stack.toString(),"err");
								}
								_self._timers.splice(i, 1);
								i--;
							}
						} else if (timer.type === "interval") {
							timer.ttl -= elapsed;
							if (timer.ttl <= 0) {
								try {
									timer.callback();
								}catch(e){
									__trace(e.stack.toString(),"err");
								}
								timer.ttl += timer.dur;
							}
						}else{
							// Do nothing
						}
					}
					_self._lastToken = Date.now();
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
			this._timers.push(new RuntimeTimer("interval", interval, myKey, f));
			return myKey;
		}

		public setTimeout(f:Function, timeout:number):number {
			var myKey = this._key++;
			this._timers.push(new RuntimeTimer("timeout", timeout, myKey, f));
			return myKey;
		}

		public clearInterval(id:number):void {
			for (var i = 0; i < this._timers.length; i++) {
				if (this._timers[i].type === "interval" &&
					this._timers[i].key === id) {
					this._timers.splice(i, 1);
					return;
				}
			}
		}

		public clearTimeout(id:number):void {
			for (var i = 0; i < this._timers.length; i++) {
				if (this._timers[i].type === "timeout" &&
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
	/**
	 * Timers interface similar to AS3
	 */
	export class Timer {
		private _repeatCount:number = 0;
		private _delay:number = 0;
		private _microtime:number = 0;
		private _timer:number = -1;
		private _listeners:Array<Function> = [];
		private _complete:Array<Function> = [];
		public currentCount:number = 0;

		constructor(delay:number, repeatCount:number = 0){
			this._delay = delay;
			this._repeatCount = repeatCount;
		}

		set isRunning(b:boolean){
			__trace("Timer.isRunning is read-only","warn");
		}

		get isRunning():boolean{
			return this._timer >= 0;
		}

		public start():void{
			if(!this.isRunning){
				var lastTime = Date.now();
				var self = this;
				this._timer = setInterval(function(){
					var elapsed = Date.now() - lastTime;
					self._microtime += elapsed;
					if(self._microtime > self._delay){
						self._microtime -= self._delay;
						self.currentCount++;
						self.dispatchEvent("timer");
					}
					lastTime = Date.now();
					if(self._repeatCount > 0 &&
						self._repeatCount <= self.currentCount){
						self.stop();
						self.dispatchEvent("timerComplete");
					}
				}, 20);
			}
		}

		public stop():void{
			if(this.isRunning){
				clearInterval(this._timer);
				this._timer = -1;
			}
		}

		public reset():void{
			this.stop();
			this.currentCount = 0;
			this._microtime = 0;
		}

		public addEventListener(type:string, listener:Function):void{
			if(type === "timer"){
				this._listeners.push(listener);
			}else if(type === "timerComplete"){
				this._complete.push(listener);
			}
		}

		public dispatchEvent(event:string){
			if(event === "timer"){
				for(var i = 0; i < this._listeners.length; i++){
					this._listeners[i]();
				}
			}else if(event === "timerComplete"){
				for(var i = 0; i < this._complete.length; i++){
					this._complete[i]();
				}
			}
		}
	}

	/** Timer Related **/
	var masterTimer:TimerRuntime = new TimerRuntime();
	var internalTimer:Timer = new Timer(50);
	var enterFrameDispatcher:Function = function () {
		for (var object in Runtime.registeredObjects) {
			if (object.substring(0, 2) === "__") {
				continue;
			}
			Runtime.registeredObjects[object].dispatchEvent("enterFrame");
		}
	};
	masterTimer.start();
	internalTimer.start();
	internalTimer.addEventListener("timer", enterFrameDispatcher);
	/**
	 *  Get the master timer instance
	 */
	export function getTimer():any {
		return masterTimer;
	}

	/**
	 * Update the rate in which the enterFrame event is broadcasted
	 * This synchronizes the frameRate value of the Display object.
	 * By default, the frame rate is 24fps.
	 */
	export function updateFrameRate(frameRate:number):void {
		if(frameRate > 60){
			return;
		}
		internalTimer.stop();
		internalTimer = new Timer(Math.floor(1000 / frameRate));
		internalTimer.addEventListener("timer", enterFrameDispatcher);
	}
}
