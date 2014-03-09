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
		} else if(type === "svg"){
			elem = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		}else {
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
		var cleanup = ";;/**/if(Runtime && Runtime.cleanup) { Runtime.cleanup(); }";
		var blob;
		try {
			blob = new Blob([bridge, code, cleanup], {type: 'application/javascript'});
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
		var workers = [];
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
		this.clear = function(){
			ctx.clear();
			for(var i = 0; i < workers.length; i++){
				try{
					workers[i].terminate();
				}catch(e){}
			}
		};
		this.workers = function(){
			return workers;
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
						case "CleanUp":
							workers.splice(workers.indexOf(worker), 1);
							invokeEvent("cleanup", worker);
							return;
						case "Trace":
							invokeEvent("trace", resp.obj);
							console.log(resp.obj);
							break;
						case "RequestObject":
							ctx.get(resp.name);
							break;
						case "CallObjectMethod":
							ctx.callObjectMethod(resp.id, resp.method, resp.params);
							break;
						case "CallMethod":
							ctx.callMethod(resp.method, resp.params);
							break;
						case "AssignObject":
							ctx.set(resp.name, resp["class"], resp.serialized);
							if(resp.serialized.lifeTime){
								setTimeout(function(){
									worker.postMessage(JSON.stringify({
										"action":"ObjectRemoved",
										"id":resp.name
									}));
									var obj = ctx.get(resp.name);
									if(obj && obj.domParent){
										try{
											stage.removeChild(obj.domParent);
										}catch(e){}
									}
								},resp.serialized.lifeTime * 1000);
							}
							break;
						case "RegisterListener":
							var obj = ctx.get(resp.name);
							if(obj.domParent){
								obj.domParent.addEventListener(
									obj.translateListener(resp.listener), 
									function(){
										worker.postMessage(JSON.stringify({
											"action":"InvokeListener",
											"id":resp.name,
											"listener":resp.listener
										}));
									}
								);
							}
							break;
						default:
							break;
					}
				}catch(e){
					console.log("Error:" + e.message + " Line:" + e.lineno);
					console.log(event.data);
					return;
				}
			};
			// Pass some information to the worker
			worker.postMessage(JSON.stringify({
				"action":"update",
				"values":{
					"screenWidth": screen.width,
					"screenHeight": screen.height,
					"width":stage.offsetWidth,
					"height":stage.offsetHeight,
					"videoWidth":0,
					"videoHeight":0
				}
			}));
			workers.push(worker);
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
			switch(method){
				case "seek":{}break;
				case "play":{}break;
				case "pause":{}break;
				default:break;
			}
		};
		
		this.callObjectMethod = function(id, method, params){
			if(boundObjects[id] && boundObjects[id][method]){
				boundObjects[id][method](params);
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
						button.width = serialized.width;
					}
					boundObjects[objname].domParent = _("div", {
						"className":"button",
						"style":{
							"position":"absolute",
							"fontSize":"12px",
							"top": (button.y ? button.y : 0) + "px",
							"left": (button.x ? button.x : 0) + "px",
							"width":(button.width ? button.width + "px" : "auto")
						}
					},[_("text",decodeHTMLEnt(button.text))]);
					stage.appendChild(boundObjects[objname].domParent);
				}break;
				case "SVGShape":{
					var svg = boundObjects[objname];
					svg.domParent = _("svg",{
						"width":stage.offsetWidth, 
						"height":stage.offsetHeight,
						"style":{
							"position":"absolute",
							"top":"0px",
							"left":"0px"
						}});
					var lastPath = null;
					svg.moveTo = function(params){
						var p = document.createElementNS("http://www.w3.org/2000/svg", "path");
						p.setAttribute("d", "M" + params.join(" "));
						p.setAttribute("stroke", "#fff");
						lastPath = p;
						svg.domParent.appendChild(lastPath);
					};
					svg.lineTo = function(params){
						lastPath.setAttribute("d", lastPath.getAttribute("d") + " L" + params.join(" "));
					};
					svg.curveTo = function(params){
						lastPath.setAttribute("d", lastPath.getAttribute("d") + " Q" + params.join(" "));
					};
					setTimeout(function(){
						stage.appendChild(svg.domParent);
					},1000);
				}break;
				case "CommentObject":{
					
				}break;
				default:break;
			}
		};
		this.clear = function(){
			for(var i in boundObjects){
				if(boundObjects[i].domParent){
					stage.removeChild(boundObjects[i].domParent);
				}
			}
			boundObjects = {}
		};
	};

	CCLScripting.CommonObject = function(){
		this.data = {};
		this.deserialize = function(data){
			for(var field in data){
				this.data[field] = data[field];
			}
		};
		this.translateListener = function(n){
			switch(n.toLowerCase()){
				case "onclick":return "click";
				case "onmouseover": return "mouseOver";
				case "onmousedown": return "mouseDown";
				default: return "click";
			}
		};
		this.serialized = function(){
			return JSON.stringify(this.data);
		};
		
		this.domParent = null;
	};
})();


