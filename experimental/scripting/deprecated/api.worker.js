/** Basic method wrappers **/
function trace(text){
	self.postMessage(JSON.stringify({
		"action":"Trace",
		"obj":text
	}));
};

function foreach(dtype, f){
	for(var x in dtype){
		f(x, dtype[x]);
	}
	return;
};

function require(scriptname){
	var fn = BASE_URL + scriptname;
	importScripts(fn);
};

function load(library, onComplete){
	var libname = "";
	switch(library){
		default:
			break;
	};
	if(libname !== ""){
		try{
			require("libraries/" + libname + ".js");
		}catch(e){
			trace("Error: Import script failed.");
		}
	}
	if(onComplete)
		onComplete();
};

function clone(a){
	// Shallow copy
	var b = {};
	for(var x in a){
		b[x] = a[x];
	}
	return b;
};

/** Library Abstractions **/
require("libraries/libBase.js");

