var ScriptManager = new function(){
	this.clearTimer = function(){
		//Runtime.deregisterAllListeners("__self");
		//Runtime.getMasterTimer().clearAll();
	};
	
	this.clearEl = function(){
		Runtime.clear();
	};
	
	this.clearTrigger = function(){
		Runtime.deregisterAllListeners("__player");
	};
	
	this.pushEl = function(e){
		
	};
	
	this.popEl = function(e){
		
	};
	
	this.pushTimer = function(e){
		
	};
	
	this.popTimer = function(e){
		
	};
};
