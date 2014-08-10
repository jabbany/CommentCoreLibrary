/** These are all defined in the global namespace **/
function trace(msg){
	__trace(msg, 'log');
}

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
	if(null === a || "object" != typeof a)
		return a;
	/** Call method's own clone if possible **/
	if(a.hasOwnProperty("clone") || typeof a["clone"] === "function"){
		return a.clone();
	}
	/** Perform a shallow clone */
	var b = {};
	b.constructor = a.constructor;
	b.prototype = a.prototype;
	for(var x in a){
		b[x] = a[x];
	}
	return b;
};

function foreach(dtype, f){
	if(null === dtype || "object" != typeof dtype)
		return;
	/** DisplayObjects do not have any enumerable properties **/
	if(dtype instanceof Display.DisplayObject){
		return;
	}
	/** Iterates through object **/
	for(var x in dtype){
		if(dtype.hasOwnProperty(x)){
			f(x, dtype[x]);
		}
	}
	return;
};

var none = null;
