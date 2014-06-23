var Utils = new function(){
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
		if(delay < 10){
			return setTimeout(f, delay);
		}else{
			return _setTimeout(f, delay);
		}
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
	/** Extra percision timers **/
	this.getTimer = function(){
		return Date.now();
	};
};

var interval = Utils.interval;
var timer = Utils.delay;
var getTimer = Utils.getTimer;
