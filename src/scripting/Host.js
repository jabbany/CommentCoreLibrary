var CCLScripting = function(workerUrl){
	this.version = 1.0;
	this.workerUrl = workerUrl;
	this.getWorker = function(){
		return new Worker(this.workerUrl);
	};
	this.getScriptingContext(stage){
		return new this.ScriptingContext(stage);
	};
};

(function(){
	if(!CCLScripting){
		throw new Error("CCL: Scripting engine not defined.");
		return;
	}
	
	CCLScripting.prototype.ScriptingContext = function(stage){
		// Here in the Scripting Context we also have a objects
		
	};
	
	CCLScripting.prototype.BridgedSandbox = function(stage){
		var worker = this.getWorker();
		var context = this.getScriptingContext(stage);
		var channels = {
			"::worker:state":{
				"max":0,
				"listeners":[]
			}
		};
		var isRunning = false;
		
		if(!worker){
			throw new Error("SANDBOX: Worker pool exhausted.");
		}
		
		var addListener = function(channel, listener){
			if(!channels[channel]){
				channels[channel] = {
					"max":0,
					"listeners":[]
				};
			}
			if(channels[channel].max > 0){
				if(channels[channel].listeners.length >= channels[channel].max){
					return false;
				}
			}
			channels[channel].listeners.push(listener);
			return true;
		};
		
		var dispatchMessage = function(msg){
			if(channels[msg.channel]){
				for(var i = 0; i < channels[msg.channel].listeners.length; i++){
					try{
						channels[msg.channel].listeners[i](msg.payload);
					}catch(e){
						__trace(e, 'err');
					}
				}
			}else{
				console.log("Message for channel:" + msg.channel + 
					" but channel not existant.");
			}
		};
		
		worker.onmessage = function(event){
			try{
				var resp = JSON.parse(event.data);	
			}catch(e){
				console.log(e);
				return;
			}
			if(!isRunning){
				if(resp.channel === "::worker:state"){
					if(resp.payload === "running" && resp.auth === "worker"){
						isRunning = true;
					}
				}
				return;
			}else{
				dispatchMessage(resp);
			}
		};
		
		this.eval = function(code){
			// Pushes the code to be evaluated on the Worker
			worker.postMessage(JSON.stringify({
				"channel":"::eval",
				"payload":code
			}));
		};
	};
})();
