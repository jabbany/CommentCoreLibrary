/** This is the API part of the worker **/
function ButtonObject(){
	
};
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
	var invoke = function(method, params){
		self.postMessage(JSON.stringify({
			"action":"CallMethod",
			"method":method,
			"params":params
		}));
	};
	var create = function(obj_class, obj_name, serialized){
		self.postMessage(JSON.stringify({
			"action":"AssignObject",
			"name":obj_name,
			"class":obj_class,
			"serialized": serialized
		}));
	};
	this.alert = function(msg){
		invoke("alert", [msg]);
	};
	this.createButton = function(data){
		var button = new ButtonObject(data);
		create("button", "ButttonObject", "{}");
		return button;
	};
};
