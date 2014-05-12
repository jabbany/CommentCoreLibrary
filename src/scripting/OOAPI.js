/**
 * The Wrapping API Worker. Here the OOAPI is defined
**/
var __OOAPI = function(){
	var channels = {};
	var channels
	function dispatchMessage(msg){
		if(channels[msg.channel]){
			for(var i = 0; i < channels[msg.channel].listeners.length; i++){
				try{
					channels[msg.channel].listeners[i](msg.payload);
				}catch(e){
					__trace(e, 'err');
				}
			}
		}
	};
	
	self.addEventListener("message",function(msg){
		if(msg){
			if(msg.action){
				if(msg.action === "reply"){
					dispatchMessage(msg);
				}
			}	
		}
	});
	
	this.deleteChannel = function(channelId, authToken){
		if(!channels[channelId])
			return true;
		if(authToken || channels[channelId].auth){
			if(authToken === channels[channelId].auth){
				delete channels[channelId];
				return true;
			}
			return false;
		}else{
			delete channels[channelId];
			return true;
		}
	};
	
	this.createChannel = function(channelId, maximum, authToken){
		if(!channels[channelId]){
			channels[channelId] = {
				"max": maximum ? maximum : 0,
				"auth": authToken,
				"listeners":[]
			};
			return true;
		}
		return false;
	};
	
	this.addListenerChannel = function(channel, listener){
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
};

function __trace(obj, traceMode){
	self.postMessage(JSON.stringify({
		"action":"trace",
		"obj":text,
		"mode": (traceMode ? traceMode : "log")
	}));
};

function __channel(id, payload, callback){
	self.postMessage(JSON.stringify({
		"channel":id,
		"payload":payload,
		"callback":true
	}));
	__OOAPI.addListenerChannel(id, callback, true);
};

function __schannel(id, callback){
	__OOAPI.addListenerChannel(id, callback);
};

function __pchannel(id, payload){
	self.postMessage(JSON.stringify({
		"channel":id,
		"payload":payload,
		"callback":false
	}));
};

function __achannel(id, auth, payload){
	self.postMessage(JSON.stringify({
		"channel":id,
		"auth":auth,
		"payload":payload,
		"callback":false
	}));
};
