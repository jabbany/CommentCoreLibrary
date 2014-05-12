var ScriptManager = new function(){
	this.clearTimer = function(){
		Runtime.deregisterAllListeners("__self");
	};
	
	this.clearEL = function(){
		Runtime.clear();
	};
	
	this.clearTrigger = function(){
		Runtime.deregisterAllListeners("__player:kbd");
		Runtime.deregisterAllListeners("__player:cmt");
	};
};
