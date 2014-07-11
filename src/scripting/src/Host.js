var CCLScripting = function(workerUrl){
	this.version = 1.0;
	this.workerUrl = workerUrl;
	this.logger = new function(){
		this.log = function(m){
			console.log(m);
		};
		this.error = function(m){
			console.error(m);
		};
		this.warn = function(m){
			console.warn(m);
		};
	};
	this.getWorker = function(){
		return new Worker(this.workerUrl);
	};
	this.getScriptingContext = function(stage){
		return new this.ScriptingContext(this, stage);
	};
	this.getSandbox = function(stage, player){
		return new this.BridgedSandbox(this, stage, player);
	};
};

(function(){
	if(!CCLScripting){
		throw new Error("CCL: Scripting engine not defined.");
		return;
	}
	
	CCLScripting.prototype.ScriptingContext = function(scripter, stage){
		// Here in the Scripting Context we also have a objects
		var objects = {};
		this.registerObject = function(objectId, serialized){
			if(typeof this.Unpack[serialized["class"]] === "function"){
				objects[objectId] = new this.Unpack[serialized["class"]](stage, 
					serialized, this);
			}else{
				scripter.logger.error("Cannot unpack class \"" + 
					serialized["class"] + "\". No valid unpacker found");
				return;
			}
		};
		
		this.deregisterObject = function(objectId){
			delete objects[objectId];
		};
		this.updateProperty = function(objectId, propName, value){
			if(!objects[objectId]){
				scripter.logger.error("Object (" + objectId + ") not found.");
				return;
			}
			if(objects[objectId][propName] === undefined){
				scripter.logger.error("Property \"" + propName 
					+ "\" not defined for object of type " + 
					objects[objectId].getClass() +".");
				return;
			}
			objects[objectId][propName] = value;
		};
		this.callMethod = function(objectId, methodName, params){
			if(!objects[objectId]){
				scripter.logger.error("Object (" + objectId + ") not found.");
				return;
			}
			if(!objects[objectId][methodName]){
				scripter.logger.error("Method \"" + methodName 
					+ "\" not defined for object of type " + 
					objects[objectId].getClass() +".");
				return;
			}
			try{
				objects[objectId][methodName](params);
			}catch(e){
				if(e.stack){
					scripter.logger.error(e.stack);
				}else{
					scripter.logger.error(e.toString());
				};
			}
		};
		this.getObject = function(objectId){
			if(!objects.hasOwnProperty(objectId)){
				scripter.logger.error("Object (" + objectId + ") not found.");
				return objects[objectId];
			}
			return objects[objectId];
		};
		this.invokeError = function(msg, mode){
			switch(mode){
				case "err":
					scripter.logger.error(msg);
					break;
				case "warn":
					scripter.logger.warn(msg);
					break;
				default:
				case "log":
					scripter.logger.log(msg);
					break;
			}
		};
		this.clear = function(){
			
		};
		
		this.getDimensions = function(){
			return {
				"stageWidth":stage.offsetWidth,
				"stageHeight":stage.offsetHeight,
				"screenWidth":window.screen.width,
				"screenHeight":window.screen.height
			};
		};
	};
	
	CCLScripting.prototype.ScriptingContext.prototype.Unpack = {};
	
	CCLScripting.prototype.BridgedSandbox = function(scripter, stage, player){
		var worker = scripter.getWorker();
		var context = scripter.getScriptingContext(stage);
		var playerAbst = player;
		var channels = {};
		var isRunning = false;
		var sandbox = this;
		
		if(!worker){
			throw new Error("SANDBOX: Worker pool exhausted.");
		}
		
		this.getLogger = function(){
			return scripter.logger;
		};
		
		this.getPlayer = function(){
			return playerAbst;
		};
		
		this.getContext = function(){
			return context;
		};
		
		this.addListener = function(channel, listener){
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
			if(channels[msg.channel] && channels[msg.channel].listeners){
				for(var i = 0; i < channels[msg.channel].listeners.length; i++){
					channels[msg.channel].listeners[i](msg.payload);
				}
			}else{
				scripter.logger.warn("Message for channel \"" + msg.channel + 
					"\" but channel not existant.");
			}
		};
		
		var WorkerHook = function(event){
			try{
				var resp = JSON.parse(event.data);	
			}catch(e){
				console.log(e);
				return;
			}
			if(resp.channel === ""){
				switch(resp.mode){
					case "log":
					default:{
						scripter.logger.log(resp.obj);
						break;
					}
					case "warn":{
						scripter.logger.warn(resp.obj);
						break;
					}
					case "err":{
						scripter.logger.error(resp.obj);
						break;
					}
					case "fatal":{
						scripter.logger.error(resp.obj);
						sandbox.resetWorker();
						return;
					}
				};
				return;
			}
			if(resp.channel.substring(0,8) === "::worker"){
				var RN = resp.channel.substring(8);
				switch(RN){
					case ":state":{
						if(resp.payload === "running" && resp.auth === "worker"){
							isRunning = true;
							channels = {};
							sandbox.init();
						}
						break;
					}
					default:{
						console.log(resp);
						break;
					}
				}
			}else{
				dispatchMessage(resp);
			}
		};
		
		this.resetWorker = function(){
			try{
				worker.terminate();
			}catch(e){}
			worker = scripter.getWorker();
			if(!worker){
				throw new Error("SANDBOX: Worker pool exhausted.");
			}
			worker.addEventListener("message", WorkerHook);
		};
		
		worker.addEventListener("message", WorkerHook);
		
		this.eval = function(code){
			// Pushes the code to be evaluated on the Worker
			if(!isRunning){
				throw new Error("Worker offline");
			}
			worker.postMessage(JSON.stringify({
				"channel":"::eval",
				"payload":code
			}));
		};
		
		this.send = function(channel, payload){
			// Low level send
			worker.postMessage(JSON.stringify({
				"channel":channel,
				"payload":payload
			}));
		};
	};
	CCLScripting.prototype.BridgedSandbox.prototype.init = function(){
		var self = this;
		/** Post whatever we need to **/
		self.send("Update:DimensionUpdate", self.getContext().getDimensions());
		/** Hook Listeners **/
		this.addListener("Runtime::alert", function(msg){
			alert(msg);
		});
		this.addListener("Runtime::clear", function(){
			self.getContext().clear();
		});
		this.addListener("Player::action", function(msg){
			try{
				if(self.getPlayer() == null){
					self.getLogger().warn("Player not initialized!");
					return;
				};
				switch(msg.action){
					default:return;
					case "play": self.getPlayer().play();break;
					case "pause": self.getPlayer().pause();break;
					case "seek": self.getPlayer().seek(msg.offset);break;
					case "jump": self.getPlayer().jump(msg.params);break;
				}
			}catch(e){
				if(e.stack){
					self.getLogger().error(e.stack);
				}else{
					self.getLogger().error(e.toString());	
				}
			}
		});
		this.addListener("Runtime:RegisterObject", function(pl){
			self.getContext().registerObject(pl.id, pl.data);
		});
		this.addListener("Runtime:DeregisterObject", function(pl){
			self.getContext().deregisterObject(pl.id);
		});
		this.addListener("Runtime:CallMethod", function(pl){
			self.getContext().callMethod(pl.id, pl.method, pl.params);
		});
		this.addListener("Runtime:UpdateProperty", function(pl){
			self.getContext().updateProperty(pl.id, pl.name, pl.value);
		});
		self.getContext().registerObject("__root", {"class":"SpriteRoot"});
	};
})();
