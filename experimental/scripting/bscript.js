// B-script offers a set of APIs that mimic the Biliplayer's Scritping API. We try to import the scripts from bili
CCLScripting = {
	"v":0.8
};

(function(){
	if(!CCLScripting)
		return;
	var ENTITIES = {
		"amp" : "&","gt" : ">","lt" : "<","quot" : "\"","apos" : "'"
	};
	var decodeHTMLEnt = function(s){
		s = s.replace(/&#(\d+);?/g, function (_, code) {
			return String.fromCharCode(code);
		}).replace(/&#[xX]([A-Fa-f0-9]+);?/g, function (_, hex) {
			return String.fromCharCode(parseInt(hex, 16));
		}).replace(/&([^;\W]+;?)/g, function (m, e) {
			var ee = e.replace(/;$/, '');
			var target = ENTITIES[e] || (e.match(/;$/) && ENTITIES[ee]);
			if (typeof target === 'number') {
				return String.fromCharCode(target);
			}else if (typeof target === 'string') {
				return target;
			}else {
				return m;
			}
		})
		return s;
	};
	var _ = function (type, props, children, callback) {
		var elem = null;
		if (type === "text") {
			return document.createTextNode(props);
		} else {
			elem = document.createElement(type);
		}
		for(var n in props){
			if(n !== "style" && n !== "className"){
				elem.setAttribute(n, props[n]);
			}else if(n === "className"){
				elem.className = props[n];
			}else{
				for(var x in props.style){
					elem.style[x] = props.style[x];
				}
			}
		}
		if (children) {
			for(var i = 0; i < children.length; i++){
				if(children[i] != null)
					elem.appendChild(children[i]);
			}
		}
		if (callback && typeof callback === "function") {
			callback(elem);
		}
		return elem;
	};
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
		var bridge = "var BASE_URL = '" + resolve("",document.URL) + "';" + 
			"importScripts('" + resolve("api.worker.js", document.URL ) + "');";

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
	};

	CCLScripting.BridgedSandbox = function(commentManager, stage){
		var listeners = {};
		var cm = commentManager;
		var stg = stage;
		var ctx = new CCLScripting.ScriptingContext(stage);
		var invokeEvent = function(event, data){
			if(listeners[event]){
				for(var i = 0; i < listeners[event].length; i++){
					try{
						listeners[event][i](data);
					}catch(e){
						console.log(e);
					}
				}
			}
		};
		this.getContext = function(){
			return ctx;
		};
		this.eval = function(code){
			var worker = CCLScripting.createWorkerFromCode(code);
			worker.onmessage = function(event){
				try{
					var resp = JSON.parse(event.data);
					switch(resp.action){
						case "Trace":
							invokeEvent("trace", resp.obj);
							console.log(resp.obj);
							break;
						case "RequestObject":
							ctx.get(resp.name);
							break;
						case "CallMethod":
							ctx.callMethod(resp.method, resp.params);
							break;
						case "AssignObject":
							ctx.set(resp.name, resp["class"], resp.serialized);
							break;
						default:
							break;
					}
				}catch(e){
					console.log("Error:" + e.message);
					console.log(event.data);
					return;
				}
			};
			return worker;
		};
		this.addEventListener = function(event, listener){
			if(!listeners[event]){
				listeners[event] = [];
			}
			listeners[event].push(listener);
		};
	};

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
	
		this.set = function(objname, objclass, serialized){
			boundObjects[objname] = new CCLScripting.CommonObject();
			console.log(objclass);
			switch(objclass){
				case "ButtonObject":{
					// Do some setup.
					var button = boundObjects[objname];
					if(serialized){
						button.text = serialized.text;
						button.x = serialized.x;
						button.y = serialized.y;
						button.dur = serialized.lifeTime * 1000;
						
					}
					boundObjects[objname].domParent = _("div", {
						"className":"button",
						"style":{
							"position":"absolute",
							"top": (button.y ? button.y : 0) + "px",
							"left": (button.x ? button.x : 0) + "px"
						}
					},[_("text",decodeHTMLEnt(button.text))]);
					console.log(boundObjects[objname].domParent);
					stage.appendChild(boundObjects[objname].domParent);
				}
			}
		};
		this.clear = function(){
			for(var i in boundObject){
				if(boundObject[i].domParent){
					stage.removeChild(boundObject[i].domParent);
				}
			}
		};
	};

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
		};
	
		this.domParent = null;
	};
})();


