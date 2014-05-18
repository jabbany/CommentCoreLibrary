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
			var p = base_url.split("/");
			p.pop();
			p.push(url);
			return p.join("/");
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
					invokeEvent("cleanup", workers[i]);
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
				}catch(e){
					console.log("JSON ERROR");
					return;
				}
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
					case "UpdateObject":
						ctx.updateObjectField(resp.name, resp.field, resp.value);
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
				};
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
		
		this.updateObjectField = function(id, field, value){
			var obj = boundObjects[id];
			if(!obj)
				return;
			switch(obj.className){
				case "CommentObject":
					if(field === "text"){
						if(obj.domParent){
							obj.domParent.innerText = value;
							stage.appendChild(obj.domParent);
						}
						obj.text = value;
					}
					break
				default:
					if(field === "x"){
						if(obj.domParent){
							obj.domParent.style.left = value + "px";
						}
					}else if(field === "y"){
						if(obj.domParent){
							obj.domParent.style.top = value + "px";
						}
					}
					break;
			}
		};
		
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
			boundObjects[objname] = new CCLScripting.CommonObject(objclass);
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
					boundObjects[objname] = new CCLScripting.SVGObject();
					var svg = boundObjects[objname];
					svg.domParent = _("svg",{
						"width":stage.offsetWidth, 
						"height":stage.offsetHeight,
						"style":{
							"position":"absolute",
							"top": /*(serialized.y ? serialized.y : 0) + */"0px",
							"left":/*(serialized.x ? serialized.x : 0) + */"0px"
					}});
					svg.y = (serialized.y ? serialized.y : 0);
					svg.x = (serialized.x ? serialized.x : 0);
					setTimeout(function(){
						stage.appendChild(svg.domParent);
					},1000);
				}break;
				case "CommentObject":{
					var cmt = boundObjects[objname];
					cmt.domParent = _("div",{
						"className":"cmt",
						"style":{
							"fontSize":(serialized.fontsize ? serialized.fontsize : 16) + "px",
							"position":"absolute",
							"top":(serialized.y ? serialized.y : 0) + "px",
							"left":(serialized.x ? serialized.x : 0) + "px",
							"color":serialized.color
						}
					}, [_("text",serialized.text ? serialized.text : "")]);
					stage.appendChild(cmt.domParent);
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

	CCLScripting.CommonObject = function(className){
		this.data = {};
		this.className = className;
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
	
	CCLScripting.SVGObject = function(){
		this.line = {
			width:1,
			color:"#FFFFFF",
			alpha:1
		};
		this.fill = {
			fill:"none",
			alpha:1
		};
		
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
		
		var applyStroke = function(p, ref){
			p.setAttribute("stroke", ref.line.color);
			p.setAttribute("stroke-width", ref.line.width);
			p.setAttribute("stroke-opacity", ref.line.alpha);
			if(ref.line.caps){
				p.setAttribute("stroke-linecap", ref.line.caps);
			}
			if(ref.line.joints){
				p.setAttribute("stroke-linejoin", ref.line.joints);
			}
			if(ref.line.miterLimit){
				p.setAttribute("stroke-miterlimit", ref.line.miterLimit);
			}
		};
		
		var applyFill = function(p, ref){
			p.setAttribute("fill", ref.fill.fill);
			p.setAttribute("fill-opacity", ref.fill.alpha)
		};
		
		var state = {lastPath : null};
		this.moveTo = function(params){
			var p = document.createElementNS("http://www.w3.org/2000/svg", "path");
			p.setAttribute("d", "M" + params.join(" "));
			applyFill(p, this);
			state.lastPath = p;
			applyStroke(p, this);
			this.domParent.appendChild(state.lastPath);
		};
		this.lineTo = function(params){
			if(!state.lastPath){
				state.lastPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
				state.lastPath.setAttribute("d", "M0 0");
				applyFill(state.lastPath, this);
				applyStroke(state.lastPath, this);
			}
			state.lastPath.setAttribute("d", state.lastPath.getAttribute("d") + " L" + params.join(" "));
		};
		this.curveTo = function(params){
			if(!state.lastPath){
				state.lastPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
				state.lastPath.setAttribute("d", "M0 0");
				applyFill(state.lastPath, this);
				applyStroke(state.lastPath, this);
			}
			state.lastPath.setAttribute("d", state.lastPath.getAttribute("d") + " Q" + params.join(" "));
		};
		this.lineStyle = function(params){
			if(params.length < 3)
				return;
			this.line.width = params[0];
			this.line.color = params[1];
			this.line.alpha = params[2];
			if(params[3]){
				this.line.caps = params[3];
			}
			if(params[4]){
				this.line.joints = params[4];
			}
			if(params[5]){
				this.line.miterLimit = params[5];
			}
			if(state.lastPath){
				applyStroke(state.lastPath, this);
			}
		};
		this.beginFill = function(params){
			if(params.length === 0)
				return;
			this.fill.fill = params[0];
			if(params.length > 1){
				this.fill.alpha = params[1];
			}
		};
		this.endFill = function(params){
			this.fill.fill = "none";
		};
		this.drawRect = function(params){
			var r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
			r.setAttribute("x", params[0] + this.x);
			r.setAttribute("y", params[1] + this.y);
			r.setAttribute("width", params[2]);
			r.setAttribute("height", params[3]);
			applyFill(r, this);
			applyStroke(r, this);
			this.domParent.appendChild(r);
		};
		this.drawRoundRect = function(params){
			var r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
			r.setAttribute("x", params[0] + this.x);
			r.setAttribute("y", params[1] + this.y);
			r.setAttribute("width", params[2]);
			r.setAttribute("height", params[3]);
			r.setAttribute("rx", params[4]);
			r.setAttribute("ry", params[5]);
			applyFill(r, this);
			applyStroke(r, this);
			this.domParent.appendChild(r);
		};
		this.drawCircle = function(params){
			var c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
			c.setAttribute("cx", params[0] + this.x);
			c.setAttribute("cy", params[1] + this.y);
			c.setAttribute("r", params[2]);
			applyFill(c, this);
			applyStroke(c, this);
			this.domParent.appendChild(c);
		};
		
		this.drawEllipse = function(params){
			var e = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
			e.setAttribute("cx", params[0] + this.x);
			e.setAttribute("cy", params[1] + this.y);
			e.setAttribute("rx", params[2]);
			e.setAttribute("ry", params[3]);
			applyFill(e, this);
			applyStroke(e, this);
			this.domParent.appendChild(e);
		};
		this.domParent = null;
	};
})();


