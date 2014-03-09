/** Basic method wrappers **/
function trace(text){
	self.postMessage(JSON.stringify({
		"action":"Trace",
		"obj":text
	}));
}

function foreach(dtype, f){
	for(var x in dtype){
		f(x, dtype[x]);
	}
	return;
}

function require(scriptname){
	importScripts(BASE_URL + scriptname);
};

function load(library, onComplete){
	var libname = "";
	switch(library){
		default:
			break;
	};
	if(libname !== ""){
		try{
			require(libname);
		}catch(e){
			trace("Error: Import script failed.");
		}
	}
	if(onComplete)
		onComplete();
};

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
		create("ButtonObject", "button", data);
		button.id = "button";
		return button;
	};
	this.createComment = function(data){
		
	};
	this.createShape = function(data){
	
	};
};

/** Util Library Abstraction **/
require("libUtil.js");
//require("libPlayer.js");
//require("lib"
