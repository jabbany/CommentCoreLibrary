/**
 * The Wrapping API Worker. Here the OOAPI is defined
**/
var __OOAPI = function(){
	var channels = {
		
	};
	
	function dispatchMessage(msg){
		if(channels[msg.channel]){
			for(var i = 0; i < channels[msg.channel].length; i++){
				try{
					channels[msg.channel][i](msg.payload);
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
	
	this.addListenerChannel = function(channel, listener){
		if(!channels[channel])
			channels[channel] = [];
		
		channels[channel].push(listener);
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
		"action":"channel",
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
		"action":"channel",
		"payload":payload,
		"callback":false
	}));
};

function __achannel(id, auth, payload){
	self.postMessage(JSON.stringify({
		"action":"autorizedChannel",
		"auth":auth,
		"payload":payload,
		"callback":false
	}));
};
