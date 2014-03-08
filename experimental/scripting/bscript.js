// B-script offers a set of APIs that mimic the Biliplayer's Scritping API. We try to import the scripts from bili
CCLScripting = {"v":0.8}

CCLScripting.createWorkerFromCode = function(code){
	window.URL = window.URL || window.webkitURL;
	var resolve = function(url, base_url) {
		var doc      = document
			, old_base = doc.getElementsByTagName('base')[0]
			, old_href = old_base && old_base.href
			, doc_head = doc.head || doc.getElementsByTagName('head')[0]
			, our_base = old_base || doc_head.appendChild(doc.createElement('base'))
			, resolver = doc.createElement('a')
			, resolved_url;
		our_base.href = base_url;
		resolver.href = url;
		resolved_url  = resolver.href; // browser magic at work here
		if (old_base) old_base.href = old_href;
		else doc_head.removeChild(our_base);
		return resolved_url;
	}
	var bridge = "importScripts('" + resolve("api.worker.js", document.URL ) + "');";

	var blob;
	try {
		blob = new Blob([bridge, code], {type: 'application/javascript'});
	} catch (e) { // Backwards-compatibility
		window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
		blob = new BlobBuilder();
		blob.append(response);
		blob = blob.getBlob();
	}
	var worker = new Worker(URL.createObjectURL(blob));
	return worker;
}

CCLScripting.BridgedSandbox = function(commentManager, stage){
	var cm = commentManager;
	var stg = stage;
	var ctx = new CCLScripting.ScriptingContext(stage);
	//Create the sandbox worker thread.
	this.eval = function(code){
		var worker = CCLScripting.createWorkerFromCode(code);
		worker.onmessage = function(event){
			try{
				var resp = JSON.parse(event.data);
				switch(resp.action){
					case "RequestObject":
						ctx.get(resp.name);
						break;
					case "CallMethod":
						ctx.callMethod(resp.method, resp.params);
						break;
					case "AssignObject":
						ctx.set(resp.name, resp["class"]);
						ctx.get(resp.name).deserialize(resp.serialized);
						break;
					default:
						break;
				}
			}catch(e){
				console.log("Execute sandbox returned invalid result!");
				console.log(event.data);
				return;
			}
		};
		return worker;
	}
}

CCLScripting.ScriptingContext = function(stage){
	var boundObjects = {};
	
	this.callMethod = function (method, params){
		if(method === "alert"){
			if(params)
				alert(params[0]);
			return;
		}
	};
	
	this.get = function(objname){
		return boundObjects[objname];
	};
	
	this.set = function(objname, objclass){
		boundObjects[objname] = new CCLScripting.CommonObject();
	};

	this.clear = function(){
		for(var i = 0; i < boundObject.length; i++){
			stage.removeChild(boundObject);
		}
	};
}

CCLScripting.CommonObject = function(){
	this.data = {};
	this.deserialize = function(data){
		console.log(data);
		for(var field in data){
			this.data[field] = data[field];
		}
	};
	
	this.serialized = function(){
		return JSON.stringify(this.data);
	}
}


