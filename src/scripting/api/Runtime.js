var Runtime = new function(){
	this.registerObject = function(){
	
	};
	
	this.registerListener = function(objectId, listenerId){
	
	};
	
	this.deregisterListener = function(objectId, listenerId){
	
	};
	
	this.deregisterAllListeners = function(objectId){
	
	};
	
	this.clear = function(){
	
	};
	
	this.crash = function(){
		/* Crashes the main thread */
		__trace("Manual:Runtime.crash()", "fatal");
	};
	
	this.alert = function(msg){
		/* Sends an alert request to the main interface */
		__achannel("alert", "::Runtime", msg);
	};
	
	this.hasObject = function(obj){
		return false;
	};
	
	this.generateIdent = function(){
		var id = "obj:" + (new Date()).getTime() + "|" + Math.round(Math.random() * 4096);
		while(!this.hasObject(id)){
			id = "obj:" + (new Date()).getTime() + "|" + Math.round(Math.random() * 4096);
		}
		return id;
	};
};
