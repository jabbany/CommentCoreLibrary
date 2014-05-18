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

var ScriptManager = new function(){
	/** Bili abstraction of runtime **/
	this.clearEl = function(){
		
	};
	this.clearTimer = function(){
		
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
		this.lineStyle = function(thickness, color, alpha, hinting, scale, caps, joints, miterlim){
			if(caps === "none")
				caps = "butt";
			updateObject("lineStyle", [thickness, toRGB(color), alpha, caps, joints, miterlim]);
		};
		this.drawRect = function(x, y, w, h){
			updateObject("drawRect", [x, y, w, h]);
		};
		this.drawCircle = function(x, y, r){
			updateObject("drawCircle", [x , y , r]);
		};
		this.drawEllipse = function(cx, cy, rx, ry){
			updateObject("drawEllipse", [cx, cy, rx, ry]);
		};
		this.drawRoundRect= function(x, y, w, h, elw, elh){
			updateObject("drawRoundRect", [x, y, w, h, elw, elh]);
		};
		this.beginFill = function(color, alpha){
			updateObject("beginFill", [toRGB(color), alpha]);
		};
		this.endFill = function(){
			updateObject("endFill", []);
		};
		this.beginGradientFill = function(blendMode, colors, alphas, blendPoints, matrix, pad){
			trace("Gradient Fill not supported. Using fallback");
			var sumColors = 0;
			var sumAlphas = 0;
			for(var i = 0; i < colors.length; i++){
				sumColors += colors[i];
				sumAlphas += alphas[i];
			}
			updateObject("beginFill", [toRGB(Math.round(sumColors / colors.length)), 
										Math.round(sumAlphas / alphas.length)]);
		};
		var s = this;
		if(this.__defineSetter__){
			this.__defineSetter__("filters", function(filters){
				trace("Filter setting not supported yet");
			});
		}
	};
	function SVGShape(id, data){
		this.paths = [];
		this.id = id;
		this.x = data.x ? data.x : 0;
		this.y = data.y ? data.y : 0;
		this.dur = (data.lifeTime ? data.lifeTime : 4) * 1000;
		this.ttl = this.dur;
		this.motion = data.motion ? data.motion : {};
		var inst = this;
		if(this.motionGroup && this.motionGroup.length === 1){
			this.motion = this.motionGroup[0];
		}
		for(var m in this.motion){
			this[m] = this.motion[m].fromValue;
			var ivali = setInterval((function(copy){return function(){
				inst.ttl -= 100;
				inst[copy] = (inst.motion[copy].toValue - inst.motion[copy].fromValue) * 
								((inst.dur - inst.ttl) / inst.dur) + 
								inst.motion[copy].fromValue;
				updateObject(inst.id, copy, inst[copy]);
				if(inst.ttl <= 0){
					clearInterval(ivali);
				}
			}})(m),100);
		}
		this.graphics = new GraphicsContext(this);
	};
	function ButtonObject(data){
		this.toString = function(){return "Button " + data.text + " id:" + this.id};
	};
	function CommentObject(data){
		var text = "";
		this.setStyle = function(style){
			trace("setStyle not implemented");
		};
		this.toString = function(){return "Comment " + data.text + " id:" + this.id};
		if(this.__defineSetter__  && this.__defineGetter__){
			var inst = this;
			this.__defineSetter__("text", function(newval){
				updateObject(inst.id, "text", newval);
				text = newval;
			});
			this.__defineGetter__("text", function(newval){
				return text;
			});
		};
		this.setTextFormat = function(){
			//trace("setTextFormat not implemented");
		};
		this.getTextFormat = function(){
			//trace("getTextFormat not implemented");
			return {};
		};
	};
	function CanvasObject(data){
		this.addChild = function(){
			
		};
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
	function invoke(method, params){
		self.postMessage(JSON.stringify({
			"action":"CallMethod",
			"method":method,
			"params":params
		}));
	};
	function create(obj_class, obj_name, serialized, object){
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
	function listener(obj_name, listener_field){
		Runtime.registerListener(obj_name, listener_field);
		self.postMessage(JSON.stringify({
			"action":"RegisterListener",
			"name":obj_name,
			"listener":listener_field,
		}));
	};
	function updateObject(obj_name, field, newValue){
		self.postMessage(JSON.stringify({
			"action":"UpdateObject",
			"name":obj_name,
			"field":field,
			"value":newValue,
		}));
	};
	/** Some bad abstractions **/
	this.root = [];
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
		var toRGB = function(number){
			var string = parseInt(number).toString(16);
			while(string.length < 6){
				string = "0" + string;
			}
			return "#" + string;
		};
		if(data.color != null)
			data.color = toRGB(data.color);
		var comment = new CommentObject(data);
		var id = Runtime.generateIdent();
		create("CommentObject", id, data, comment);
		comment.id = id;
		return comment;
	};
	this.createShape = function(data){
		var svg = new SVGShape(Runtime.generateIdent(), data);
		create("SVGShape", svg.id, data, svg);
		return svg;
	};
	this.createBlurFilter = function(x,y){
		//trace("$.createBlurFilter not supported");
		return;
	};
	this.createGlowFilter = function(x,y){
		//trace("$.createGlowFilter not supported");
		return;
	};
	this.createMatrix = function(){
		//trace("$.createMatrix not supported");
		return [];
	};
	this.createCanvas = function(data){
		trace("$.createCanvas not supported");
		return new CanvasObject(data);
	};
	this.createTextFormat = function(){
		trace("$.createTextFormat not supported");
		return {};
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
		trace("Global is not supported. Fallback.");
		kvstore[key] = val;
		notifyUp(key, val);
	};
	this._get = function(key){
		return kvstore[key];
	};
	this._ = function(key){
		return this._get(key);
	};
};

var $G = Global;

var Utils = new function(){
	this.rgb = function(r,g,b){
		return (r * 256 * 256 + g * 256 + b);
	};
	this.hue = function(hue){
		var q = 1, p = 1;
		function hue2rgb(p, q, t){
			if(t < 0) t += 1;
			if(t > 1) t -= 1;
			if(t < 1/6) return p + (q - p) * 6 * t;
			if(t < 1/2) return q;
			if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
			return p;
		}
		var h = hue / 360;
		var r = hue2rgb(p, q, h + 1/3);
		var g = hue2rgb(p, q, h);
		var b = hue2rgb(p, q, h - 1/3);
		return Utils.rgb(r,g,b);
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
					var myName = "listener_ival:" + iv;
					Runtime.deregisterListener("__self", myName); 
				}
			},interval);
			var myName = "listener_ival:" + iv;
			Runtime.registerListener("__self", myName); 
			return iv;
		}
	};
};

/* -- Pull in important references */
var interval = Utils.interval;
var timer = Utils.delay;


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
