/**
 * Animation Library for CSS3 Timed Transitions
 * - Supports pause!
 * Author : Jim Chen (Jabbany)
 * License : MIT License
 */

var CCLAnim = {'v':0.9};
CCLAnim.Timer = function(tickFunc){
	var last = 0;
	var id = -1;
	var mode = "IVL";
	this.start = function(){
		last = (new Date()).getTime();
		// Use requestAnimationFrame when specified possible
		if(mode == "RAF" && window.requestAnimationFrame){
			var tick = function(){
				var now = (new Date()).getTime();
				tickFunc(now - last);
				last = now;
				id = window.requestAnimationFrame(tick);
			};
			id = window.requestAnimationFrame(tick);
		}else{
			id = window.setInterval(function(){
				var now = (new Date()).getTime();
				tickFunc(now - last);
				last = now;
			}, 100);
		}
	};
	
	this.stop = function(){
		try{
			if(mode === "IVL"){
				window.clearInterval(id);
			}else{
				window.cancelAnimationFrame(id);
			}
		}catch(e){}
		id = -1;
	};
	
	this.running = function(){
		return id != -1;
	};
};

CCLAnim.createAnimateContext = function(data){
	return new function(){
		this.animations = [];
		var timer = new CCLAnim.Timer(function(duration){
			for(var i = 0; i < anim.length; i++){
				anim[i].time(duration);
			}
		});
		var anim = this.animations;
		
		this.isStopped = function(){
			return !timer.running();
		};
		
		this.start = function(){
			timer.start();
			//Emit the start event
			for(var i = 0; i < this.animations.length; i++){
				this.animations[i].emitEvent("start")
			}
		};
		
		this.pause = function(){
			timer.stop();
			//Emit the stop event
			for(var i = 0; i < this.animations.length; i++){
				this.animations[i].emitEvent("stop");
			}
		};
		
		this.add = function(anim){
			this.animations.push(anim);
			if(timer != -1){
				anim.emitEvent("start");
			}
			var self = this;
			anim.addEventListener("end", function(){
				self.remove(anim, true);
			});
		};
		
		this.remove = function(anim, preventEmit){
			var idx = this.animations.indexOf(anim);
			if(idx >= 0){
				this.animations.splice(idx, 1);
				if(!preventEmit){
					anim.emitEvent("end");
				}
				return;
			}
		};
	};
};

CCLAnim.Animation = function(parent){
	this.type = "none"; // No animation actually occurs
	this.parent = parent; // Parent DOM Object
	this.ttl = 4000; // Time to live
	this.dur = 4000; // Total Duration
	this.listeners = {
		
	};
};

CCLAnim.Animation.prototype.toCSS = function(){
	return;
}

CCLAnim.Animation.prototype.emitEvent = function(event){
	if(!this.listeners || !this.listeners[event]){
		return; // Nothing to emit
	}
	var listeners = this.listeners[event];
	for(var i = 0; i < listeners.length; i++){
		try{
			listeners[i](this);
		}catch(e){}
	}
};

CCLAnim.Animation.prototype.addEventListener = function(event, listener){
	if(this.listeners[event]){
		this.listeners[event].push(listener);
	}else{
		this.listeners[event] = [listener];
	}
};

CCLAnim.Animation.prototype.time = function(time){
	this.ttl -= time;
	if(this.ttl <= 0){
		this.emitEvent("end");
		return;
	}
};

CCLAnim.setTransition= function(elem, transition){
	//TODO Fix browser vendor specific tags
	elem.style.transition = transition;
	elem.style.webkitTransition = transition;
	elem.style.MozTransition = transition;
	elem.style.OTransition= transition;
	elem.style.MSTransition = transition;
};

CCLAnim.setTransform = function(elem, transform){
	//TODO Fix browser vendor specific tags
	elem.style.transform = transform;
	elem.style.webkitTransform = transform;
	elem.style.MozTransform = transform;
	elem.style.OTransform = transform;
	elem.style.MSTransform = transform;
};

CCLAnim.setXY = function(elem, x, y){
	elem.style.top = y + "px";
	elem.style.left = x + "px";
}

