/**
* Remote Connection
* Ver 1.0 Author Jabbany
* Part of the CommentCoreLibrary
**/
function RConnect(){
	this.socket = null;
	this.mode = 'websocket';
	/**
	* States
	* -1 : Not Connected
	* 0 : Closed
	* 1 : Connected
	* 2 : Connecting
	**/
	this.state = -1;
	
	this.hooks = {
		'onopen':[this.hookOpen],
		'onclose':[this.hookClose],
		'message':[]
	};
	this.hookOpen = function(){
		if(this.socket.readyState == 1)
			this.state = 1; //Connected
	};
}
RConnect.prototype.dispatchEvent = function(eventName,obj){
	for(var f in this.hooks[eventName]){
		if(obj!=null)
			f(obj);
		else
			f();
	};
	return;//All events dispatched
};

RConnect.prototype.establish = function (server,authCode){
	if(this.mode != 'websocket')	
		return false;
	try{
		this.socket = new WebSocket(server);
	}catch(e){
		console.log('WebSocket not supported or disabled. Fallback to normal request');
		this.mode = 'fallback';
		return false;
	}
	if(this.socket != null){
		//Socket is setup
		try{
			var inst = this;
			this.socket.onopen = function(){
				inst.dispatchEvent('onopen');
			};
			this.socket.onclose = function(){
				inst.dispatchEvent('onclose');
			};
			this.socket.onmessage = function(msg){
				inst.dispatchEvent('message',msg);
			};
		}catch(e){
			console.log('Bind failed');
			return false;
		}
	}
	return true;
}