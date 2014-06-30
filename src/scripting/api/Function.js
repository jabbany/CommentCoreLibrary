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
	// Shallow copy
	var b = {};
	for(var x in a){
		b[x] = a[x];
	}
	return b;
};

function foreach(dtype, f){
	for(var x in dtype){
		f(x, dtype[x]);
	}
	return;
};
