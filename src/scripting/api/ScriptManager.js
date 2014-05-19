var ScriptManager = new function(){
	this.clearTimer = function(){
		Runtime.deregisterAllListeners("__self");
		Utils.clearTimers();
	};
	
	this.clearEL = function(){
		Runtime.clear();
	};
	
	this.clearTrigger = function(){
		Runtime.deregisterAllListeners("__player");
	};
};
