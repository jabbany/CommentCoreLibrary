var Util = new function(){
	this.rand = function(min, max){
		return min + Math.floor(Math.random() * (max - min));
	};
	this.distance = function(x1,y1,x2,y2){
		var dx = x2 - x1, dy = y2 - y1;
		return Math.sqrt(dx * dx + dy * dy);
	};
	this.delay = function(f, delay){
		delay = delay ? delay : 1000;
		return setTimeout(f, delay);
	};
	this.interval = function(f, interval, cycles){
		cycles = cycles ? cycles : 1;
		interval = interval ? interval : 1000;
		if(cycles === 0){
			return setInterval(f, interval);
		}else{
			var iv = setInterval(function(){
				cycles--;
				f();
				if(cycles === 0){
					clearInterval(iv);
				}
			},interval);
			return iv;
		}
	};
};
