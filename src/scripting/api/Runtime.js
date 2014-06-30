var Runtime = new function(){
	function MetaObject (nm, callback){
		this.unload = function(){};
		this.dispatchEvent = function(event, data){
			if(callback){
				callback(event, data);
			}
		};
		this.getId = function(){
			return nm;
		};
	};
	var registeredObjects = {
		"__self":new MetaObject("__self"),
		"__player":new MetaObject("__player", function(event, data){
			if(event === "keyup" || event === "keydown"){
				Player.dispatchTrigger("keyboard", event);
			}else if(event === "comment"){
				Player.dispatchTrigger("comment", data);
			}
		}),
	};
	var registeredListeners = {
		"__self":[],
	};
	var objCount = 0;
	var dispatchEvent = function(objectId, event, data){
		if(registeredObjects[objectId]){
			var cobj = registeredObjects[objectId];
			if(cobj.dispatchEvent){
				cobj.dispatchEvent(event, data);
			}
		}
	};
	
	this.registerObject = function(object){
		if(!object.getId){
			__trace("Attempted to register non-named object", 'err');
			return;
		}
		var id = object.getId();
		if(!this.hasObject(id)){
			registeredObjects[id] = object;
			__pchannel("Runtime:RegisterObject", {
				"id":id,
				"data":object.serialize()
			});
			__schannel("object::(" + id + ")", function(payload){
				if(payload.type === "event"){
					dispatchEvent(id, payload.event, payload.data);
				}
			});
			objCount++;
			return;
		}else{
			__trace("Attempting to re-register taken id", 'err');
			return;
		}
	};
	
	this.deregisterObject = function(objectId){
		if(this.hasObject(objectId)){
			__schannel("Runtime:DeregisterObject", {
				"id":objectId
			});
			registeredObjects[objectId] = null;
			delete registeredObjects[objectId];
			objCount--;
		}
	};
	
	this.registerListener = function(objectId, listener){
		if(!this.hasObject(objectId)){
			__trace("Attempting to register listener onto unregistered object " 
					+ objectId);
			return;
		}
		
	};
	
	this.deregisterListener = function(objectId, listener){
		
	};
	
	this.deregisterAllListeners = function(objectId){
	
	};
	
	this.clear = function(){
		for(var i in registeredObjects){
			if(registeredObjects[i].unload){
				registeredObjects[i].unload();
			}
		};
		__achannel("Runtime::clear", "::Runtime", {});
	};
	
	this.crash = function(){
		/* Crashes the main thread. Forces an exit on error */
		__trace("Manual:Runtime.crash()", "fatal");
	};
	
	this.alert = function(msg){
		/* Sends an alert request to the main interface */
		__achannel("Runtime::alert", "::Runtime", msg);
	};
	
	this.hasObject = function(objId){
		return (registeredObjects[objId] != null ? true : false);
	};
	
	this.generateIdent = function(type){
		if(!type)
			type = "obj";
		var id = type + ":" + (new Date()).getTime() + "|" + 
			Math.round(Math.random() * 4096) + ":" + objCount;
		while(this.hasObject(id)){
			id = type + ":" + (new Date()).getTime() + "|" + 
				Math.round(Math.random() * 4096) + ":" + objCount;
		}
		return id;
	};
};
