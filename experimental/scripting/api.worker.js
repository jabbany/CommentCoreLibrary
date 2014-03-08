/** This is the API part of the worker **/
var $ = new function(){
	self.addEventListener("message", function(msg){
		console.log(msg.data);
		try{
			var mdata = JSON.parse(msg);
			switch(mdata.action){
				default:break;
			}
		}catch(e){
			console.log("Illegal InputMessage or things changed during execution.");
			console.log(e);
		}
	});
	this.invoke = function(method, params){
		self.postMessage(JSON.stringify({
			"action":"CallMethod",
			"method":method,
			"params":params
		}));
	};
	this.alert = function(msg){
		this.invoke("alert", [msg]);
	};
};
