var Runtime = new function(){
	/** Keeps track of rubbish collection **/
	var rtobjects = {}, rtlisteners = {};
	var counts = {objcount : 0, listenercount : 0};
	self.addEventListener("message", function(msg){
		try{
			var mdata = JSON.parse(msg.data);
			switch(mdata.action){
				case "ObjectRemoved":{
					if(rtobjects[mdata.id]){
						delete rtobjects[mdata.id];
						counts.objcount --;
					}
					if(rtlisteners[mdata.id]){
						counts.listenercount -= rtlisteners[mdata.id].length;
						delete rtlisteners[mdata.id];
					}
					Runtime.cleanup();
				}break;
				case "InvokeListener":{
					var obj = Runtime.getObject(mdata.id);
					if(obj && obj[mdata.listener]){
						obj[mdata.listener]();
					}
				}break;
				default:
					break;
			}
		}catch(e){
			console.log("Illegal InputMessage or things changed during execution.");
			console.log(e);
		}
	});
	
	this.registerObject = function(objectId, obj){
		if(rtobjects[objectId])
			return;
		counts.objcount ++;
		rtobjects[objectId] = obj;
	};
	
	this.getObject = function(objectId){
		return rtobjects[objectId];
	};
	
	this.registerListener = function(objectId, listenerId){
		if(!rtlisteners[objectId]){
			rtlisteners[objectId] = [];
		}
		if(rtlisteners[objectId].indexOf(listenerId) < 0){
			rtlisteners[objectId].push(listenerId);
			counts.listenercount ++;
		}
	};
	
	this.deregisterListener = function(objectId, listenerId){
		if(rtlisteners[objectId] && 
				rtlisteners[objectId].indexOf(listenerId) >= 0){
			rtlisteners[objectId].splice(listenerId, 1);
			counts.listenercount --;
			this.cleanup();
		}
	};
	
	this.generateIdent = function(){
		var id = "obj" + (new Date()).getTime() + "|" + Math.round(Math.random() * 100);
		while(rtobjects[id]){
			id = "obj" + (new Date()).getTime() + "|" + Math.round(Math.random() * 100);
		}
		return id;
	};
	
	this.cleanup = function(){
		console.log("oc:" + counts.objcount + "|lc:" + counts.listenercount);
		if(counts.objcount <= 0 && counts.listenercount <= 0){
			self.postMessage(JSON.stringify({
				"action":"CleanUp"
			}));// Invalidate the comment at this point
			self.close();
		}
	};
};

var $ = new function(){
	/** Inner Classes for Display **/
	function GraphicsContext(shape){
		// Send data across
		var toRGB = function(number){
			var string = parseInt(number).toString(16);
			while(string.length < 6){
				string = "0" + string;
			}
			return "#" + string;
		};
		var updateObject = function(method, params){
			self.postMessage(JSON.stringify({
				"action":"CallObjectMethod",
				"id": shape.id,
				"method":method,
				"params":params
			}));
		};
		this.lineTo = function(a,b){
			updateObject("lineTo", [a,b]);
		};
		this.moveTo = function(a,b){
			updateObject("moveTo", [a,b]);
		};
		this.curveTo = function(a,b,c,d){
			updateObject("curveTo", [a,b,c,d]);
		};
		this.lineStyle = function(thickness, color, alpha){
			updateObject("lineStyle", [thickness, toRGB(color), alpha]);
		};
		this.drawRect = function(x, y, w, h){
			updateObject("drawRect", [x, y, w, h]);
		};
		this.drawCircle = function(x, y, r){
			updateObject("drawCircle", [x, y, r]);
		};
		this.drawEllipse = function(cx, cy, rx, ry){
			updateObject("drawEllipse", [cx, cy, rx, ry]);
		};
		this.beginFill = function(color, alpha){
			updateObject("beginFill", [toRGB(color), alpha]);
		};
		this.endFill = function(){
			updateObject("endFill", []);
		};
		var s = this;
		Object.defineProperty(this, "filters", {
			get:function(){
				return s.filters;
			},
			set:function(filters){
				s.filters = filters;
				trace(filters);
				//Register filters.
			}
		});
	};
	function SVGShape(id){
		this.paths = [];
		this.id = id;
		this.graphics = new GraphicsContext(this);
	};
	function ButtonObject(data){
		this.toString = function(){return "Button " + data.text + " id:" + this.id};
	};
	function CommentObject(data){
		this.toString = function(){return "Comment " + data.text + " id:" + this.id};
	};
	/** End Inner classes for Display **/
	self.addEventListener("message", function(msg){
		try{
			var mdata = JSON.parse(msg.data);
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
	var create = function(obj_class, obj_name, serialized, object){
		if(!object)
			throw "No Object Instance, cannot create";
		Runtime.registerObject(obj_name, object);
		self.postMessage(JSON.stringify({
			"action":"AssignObject",
			"name":obj_name,
			"class":obj_class,
			"serialized": serialized
		}));
	};
	var listener = function(obj_name, listener_field){
		Runtime.registerListener(obj_name, listener_field);
		self.postMessage(JSON.stringify({
			"action":"RegisterListener",
			"name":obj_name,
			"listener":listener_field,
		}));
	};
	/** Begin Display Libaray Public methods **/
	this.alert = function(msg){
		invoke("alert", [msg]);
	};
	this.createButton = function(data){
		var button = new ButtonObject(data);
		var id = Runtime.generateIdent();
		create("ButtonObject", id, data, button);
		button.id = id;
		if(data.onclick){
			listener(id, "onclick");
			button.onclick = data.onclick;
		}
		return button;
	};
	this.createComment = function(text, data){
		data.text = text;
		var comment = new CommentObject(data);
		var id = Runtime.generateIdent();
		create("CommentObject", id, data, comment);
		comment.id = id;
		return comment;
	};
	this.createShape = function(data){
		var svg = new SVGShape(Runtime.generateIdent());
		create("SVGShape", svg.id, data, svg);
		return svg;
	};
	this.createBlurFilter = function(x,y){
		return;
	};
	this.createGlowFilter = function(x,y){
		return;
	};
};

var Global = new function(){
	var kvstore = {};
	var notifyUp = function(key, val){
		self.postMessage(JSON.stringify({
			"action":"UpdateGlobals",
			"key":key,
			"value":JSON.stringify(val)
		}));
	};
	this._set = function(key, val){
		kvstore[key] = val;
		notifyUp(key, val);
	};
	this._get = function(key){
		return kvstore[key];
	};
};

var Utils = new function(){
	this.rgb = function(r,g,b){
		return r * 256 * 256 + g * 256 + b;
	};
	this.rand = function(min, max){
		return min + Math.floor(Math.random() * (max - min));
	};
	this.distance = function(x1,y1,x2,y2){
		var dx = x2 - x1, dy = y2 - y1;
		return Math.sqrt(dx * dx + dy * dy);
	};
	this.delay = function(f, delay){
		delay = delay ? delay : 1000;
		return setTimeout(f, delay);
	};
	this.interval = function(f, interval, cycles){
		cycles = cycles ? cycles : 1;
		interval = interval ? interval : 1000;
		if(cycles === 0){
			return setInterval(f, interval);
		}else{
			var iv = setInterval(function(){
				cycles--;
				f();
				if(cycles === 0){
					clearInterval(iv);
				}
			},interval);
			return iv;
		}
	};
};

var Player = new function(){
	var invoke = function(method, params){
		self.postMessage(JSON.stringify({
			"action":"CallMethod",
			"method":method,
			"params":params
		}));
	};
	this.play = function(){
		invoke("play", []);
	};
	this.pause = function(){
		invoke("pause", []);
	};
	this.seek = function(time){
		invoke("seek", [time]);
	};
	this.jump = function(video, part, newwindow){
		invoke("jump", [video, part ? part : 1, newwindow ? newwindow : false]);
	};
};
