var Utils = new function(){
	var __timers = [], startTime = (new Date()).getTime(), __masterTimer = -1;
	var __key = 0;
	var stopMasterTimer= function(){
		if(__masterTimer >= 0){
			clearInterval(__masterTimer);
			__masterTimer = -1;
		}
	};
	
	var __masterTimerFunction = function(){
		var elapsed = (new Date()).getTime() - startTime;
		for(var i = 0; i < __timers.length; i++){
			if(__timers[i].type === "timeout" && 
				__timers[i].timeout <= (elapsed - __timers[i].startTime)){
				var t = __timers[i];
				__timers.splice(i, 1);
				i--;
				try{
					t.callback();
				}catch(e){
					if(e.stack){
						__trace(e.stack, 'err');
					}else{
						__trace(e.toString(), 'err');
					}
				}
			}else if(__timers[i].type === "interval" && 
					__timers[i].interval <= (elapsed - __timers[i].startTime)){
				__timers[i].startTime = (new Date()).getTime() - startTime;
				try{
					__timers[i].callback();
				}catch(e){
					if(e.stack){
						__trace(e.stack, 'err');
					}else{
						__trace(e.toString(), 'err');
					}
				}
			};
		};
		// Check to see if there are any more timers, if not stop the master
		if(__timers.length <= 0){
			stopMasterTimer();
		}
	}
	
	var startMasterTimer= function(){
		if(__masterTimer < 0){
			startTime = (new Date()).getTime()
			__masterTimer = setInterval(__masterTimerFunction, 10);
		}
	};
	
	var _setTimeout = function(callback, timeout){
		if(__masterTimer < 0)
			startMasterTimer();
		var thiskey = __key++;
		__timers.push({
			"callback":callback,
			"type":"timeout",
			"timeout":timeout,
			"startTime":(new Date()).getTime() - startTime,
			"key":thiskey,
		});
		return thiskey;
	};
	
	var _setInterval = function(callback, interval){
		if(__masterTimer < 0)
			startMasterTimer();
		var thiskey = __key++;
		__timers.push({
			"callback":callback,
			"type":"interval",
			"interval":interval,
			"startTime":(new Date()).getTime() - startTime,
			"key":thiskey,
		});
		return thiskey;
	};
	
	var _clearInterval = function(key){
		for(var i = 0; i < __timers.length; i++){
			if(__timers[i].type === "interval" && 
				__timers[i].key === key){
				__timers.splice(i, 1);
				return;
			}
		}
	};
	
	/** Allow the scripting global timer to be halted **/
	__schannel("Utils:Timer", function(pld){
		if(pld.action === "halt"){
			stopMasterTimer();
		}else if(pld.action === "resume"){
			startMasterTimer();
		}
	});
	
	this.clearTimers = function(){
		__timers = [];
		stopMasterTimer();
	};
	/** Utils **/
	this.rgb = function(r,g,b){
		return (r * 256 * 256 + g * 256 + b);
	};
	
	this.hue = function(v){
		var q = 1, p = 1;
		function hue2rgb(p, q, t){
			if(t < 0) t += 1;
			if(t > 1) t -= 1;
			if(t < 1/6) return p + (q - p) * 6 * t;
			if(t < 1/2) return q;
			if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
			return p;
		}
		var h = v / 360;
		var r = hue2rgb(p, q, h + 1/3);
		var g = hue2rgb(p, q, h);
		var b = hue2rgb(p, q, h - 1/3);
		return Utils.rgb(r,g,b);
	};
	
	this.formatTimes = function(time){
		
	};
	
	this.delay = function(f, time){
		var delay = time ? time : 1000;
		return _setTimeout(f, delay);
	};
	
	this.interval = function(f, time, times){
		var cycles = times ? times : 1;
		var interval = time ? time : 1000;
		if(cycles === 0){
			return _setInterval(f, interval);
		}else{
			var iv = _setInterval(function(){
				cycles--;
				f();
				if(cycles === 0){
					_clearInterval(iv);
				}
			},interval);
			return iv;
		}
	};
	
	this.distance = function(x1,y1,x2,y2){
		var dx = x2 - x1, dy = y2 - y1;
		return Math.sqrt(dx * dx + dy * dy);
	};
	
	this.rand = function(min,max){
		return min + Math.floor(Math.random() * (max - min));
	};
};

var interval = Utils.interval;
var timer = Utils.delay;
