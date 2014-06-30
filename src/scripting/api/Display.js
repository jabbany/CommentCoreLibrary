var $ = new function(){
	/**
	 * Inner classes
	**/
	function Matrix(a,b,c,d,tx,ty){
		// TODO: http://help.adobe.com/zh_CN/FlashPlatform/reference/actionscript/3/flash/geom/Matrix.html
		var data = [[a,c,tx],[b,d,ty],[0,0,1]];
		var dotProduct = function(other){
			var n = [[0,0,0],[0,0,0],[0,0,0]]
			for(var i = 0; i < 3; i++){
				for(var j = 0; j < 3; j++){
					for(var k = 0; j < 3; k++){
						n[i][j] += data[i][k] * other[k][j];
					}
				}
			}
			return n;
		};
		this.clone = function(){
			return new this(a,b,c,d,tx,ty);
		};
		this.setTo = function(a,b,c,d,tx,ty){
			data = [[a,c,tx],[b,d,ty],[0,0,1]];
		};
		this.createBox = function(sX, sY, q, tX, tYs){
			this.identity();
			this.rotate(q);
			this.scale(sX, sY);
			this.translate(tX, tY);
		};
		this.translate = function(tX, tY){
			this.setTo(data[0][0],data[1][0],data[0][1],
				data[1][1],data[0][2] + tX,data[1][2] + tY);
		};
		this.rotate = function(q){
			data = dotProduct([Math.cos(q), -Math.sin(q), 0],
				[Math.sin(q), Math.cos(q), 0], [0, 0, 1]);
		};
		this.scale = function(sx, sy){
			data = dotProduct([[sx, 0, 0],[0, sy, 0], [0, 0, 1]]);
		};
		this.identity = function(){
			this.setTo(1,0,0,1,0,0);
		};
		this.concat = function(matrix){
			var other = matrix.getData();
			data = dotProduct(other);
		};
		this.toString = function(){
			return "(a=" + data[0][0] + ", b=" + data[1][0] + ", c=" + 
				data[0][1] + ", d=" + data[1][1] + ", tx=" + data[0][2] +", ty="
				+ data[1][2] + ")";
		};
		this.getData = function(){
			return data;
		};
	};
	
	function Matrix3D(iv){
		var m = (iv && iv.length === 16) ? iv : 
			[1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
		var multiply = function(a,b){
			var c = [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]
			for(var i = 0; i < 4; i++){
				for(var j = 0; j < 4; j++){
					for(var k = 0; k < 4; k++){
						c[i*4 + j] = a[i*4 + k] * b[k*4 + j];
					}
				}
			}
			return c;
		};
		
		if(this.__defineGetter__){
			this.__defineGetter__("determinant", function(){
				var det = 0;
				for(var i = 0; i < 4; i++){
					var detC = 0;
					var r = 0 < i ? 0 : 1  , 
						c = 1 < i ? 1 : 2, 
						l = 2 < i ? 2 : 3;
					detC = m[r + 4] * m[c + 8] * m[l + 12] + m[c + 4] * m[l + 8]
							* m[r + 12] + m[l + 4] * m[r + 8] * m[c + 12] - 
							m[l + 4] * m[c + 8] * m[r + 12] - m[c + 4] * 
							m[r + 8] * m[l + 12] - m[r + 4] * m[l + 8] * 
							m[c + 12];
					det += (i % 2 == 0 ? 1 : -1) * m[i] * detC;
				}
				return det;
			});
		}	
		
		this.append = function(other){
			m = multiply(other.getData(), m);
		};
		
		this.prepend = function(other){
			m = multiply(m, other.getData());
		};
		
		this.appendRotation = function(){
			
		};
		
		this.prependRotation = function(){
			
		};
		
		this.appendScale = function(){
		
		};
		
		this.prependScale = function(){
		
		};
		
		this.appendTranslation = function(){
		
		};
		
		this.prependTranslation = function(){
		
		};
		
		this.clone = function(){
			return new this(m);
		};
		
		this.copyColumnFrom = function(){
		
		};
		
		this.copyColumnTo = function(){
		
		};
		
		this.copyFrom = function(){
		
		};
		
		this.identity = function(){
			m = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
		};
		
		this.invert = function(){
			if(this.determinant === 0){
				return false;
			}
		};
		
		this.getData = function(){
			return m;
		};
	};
	
	function Vector3D(x,y,z,w){
		var v = [x,y,z,w];
		if(this.__defineGetter__){
			this.__defineGetter__("lengthSquared", function(){
				return x * x + y * y + z * z;
			});
			this.__defineGetter__("length", function(){
				return Math.sqrt(x * x + y * y + z * z);
			});
			this.__defineGetter__("x", function(){
				return v[0];
			});
			this.__defineGetter__("y", function(){
				return v[1];
			});
			this.__defineGetter__("z", function(){
				return v[2];
			});
			this.__defineGetter__("w", function(){
				return v[3];
			});
			this.__defineGetter__("X_AXIS", function(){
				return Vector3D.X_AXIS;
			});
			this.__defineGetter__("Y_AXIS", function(){
				return Vector3D.Y_AXIS;
			});
			this.__defineGetter__("Z_AXIS", function(){
				return Vector3D.Z_AXIS;
			});
		}
		this.toString = function(){
			return "(" + v.toString() + ")";
		};
	};
	
	Vector3D.X_AXIS = new Vector3D(1,0,0,0);
	Vector3D.Y_AXIS = new Vector3D(0,1,0,0);
	Vector3D.Z_AXIS = new Vector3D(0,0,1,0);
	
	function TextFormat(font, size, color, bold, italic, underline, url, target,
		align, leftMargin, rightMargin, indent, leading) {
		var config = {
			"font":font ? font : "SimHei",
			"size":size ? size : 25, 
			"color":color ? color : 0xFFFFFF,
			"bold":bold ? bold : false,
			"italic":italic ? italic : false, 
			"underline":underline ? underline : false, 
			"url":url ? url : "", 
			"target":target ? target : "", 
			"align":align ? align : "left", 
			"margin":(leftMargin ? leftMargin : 0) + "px 0 " + 
				(rightMargin ? rightMargin : 0) + "px 0",
			"indent":indent ? indent : 0, 
			"leading":leading ? leading : 0
		};
		if(this.__defineSetter__){
			this.__defineSetter__("font", function(font){
				config.font = font;
			});
			this.__defineSetter__("size", function(size){
				config.size = size;
			});
			this.__defineSetter__("color", function(color){
				config.color = color;
			});
			this.__defineSetter__("bold", function(bold){
				config.bold = bold;
			});
			this.__defineSetter__("italic", function(italic){
				config.italic = italic;
			});
			this.__defineSetter__("underline", function(underline){
				config.underline = underline;
			});
		}
		
		if(this.__defineGetter__){
			this.__defineGetter__("font", function(){
				return config.font;
			});
			this.__defineGetter__("size", function(){
				return config.size;
			});
			this.__defineGetter__("color", function(){
				return config.color;
			});
			this.__defineGetter__("bold", function(){
				return config.bold;
			});
			this.__defineGetter__("italic", function(){
				return config.italic;
			});
			this.__defineGetter__("underline", function(){
				return config.underline;
			});
		}
		this.serialize = function(){
			return config;
		};
	};
	
	function Graphics(id){
		// Graphics Context for SVG
		var toRGB = function(number){
			var string = parseInt(number).toString(16);
			while(string.length < 6){
				string = "0" + string;
			}
			return "#" + string;
		};
		var updateObject = function(method, params){
			__pchannel("Runtime:CallMethod", {
				"id":id,
				"method":method,
				"params":params
			});
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
		this.lineStyle = function(thickness, color, alpha, hinting, scale, caps,
			 joints, miterlim){
			if(caps === "none")
				caps = "butt";
			updateObject("lineStyle", [thickness, toRGB(color), alpha, caps, 
				joints, miterlim]);
		};
		this.drawRect = function(x, y, w, h){
			updateObject("drawRect", [x, y, w, h]);
		};
		this.drawCircle = function(x, y, r){
			updateObject("drawCircle", [x, y , r]);
		};
		this.drawEllipse = function(cx, cy, rx, ry){
			updateObject("drawEllipse", [cx + rx/2, cy + ry/2, rx/2, ry/2]);
		};
		this.drawRoundRect= function(x, y, w, h, elw, elh){
			updateObject("drawRoundRect", [x, y, w, h, elw, elh]);
		};
		this.beginFill = function(color, alpha){
			updateObject("beginFill", [toRGB(color), (alpha ? alpha : 1)]);
		};
		this.drawPath = function(commands, params){
			for(var i = 0; i < commands.length; i++){
				switch(commands[i]){
					case 1:{
						this.moveTo(params.shift(), params.shift());break;
					}
					case 2:{
						this.lineTo(params.shift(), params.shift());break;
					}
					case 3:{
						this.curveTo(params.shift(), params.shift(),params.shift(), params.shift());break;
					}
				}
			}
		};
		this.beginGradientFill = function(){
			__trace("Gradient not supported yet", 'warn');
		};
		this.endFill = function(){
			updateObject("endFill", []);
		};
		this.setGlobalFilters = function(filters){
			updateObject("setFilters", [filters]);
		};
	};
	
	function SVGShape(params){
		var id = Runtime.generateIdent();
		if(!params){
			params = {};
		}
		var data = {
			"x":params.x ? params.x : 0,
			"y":params.y ? params.y : 0,
			"alpha":params.alpha ? params.alpha : 1,
			"lifeTime":params.lifeTime
		};
		this.graphics = new Graphics(id);
		if(this.__defineSetter__){
			this.__defineSetter__("filters", function(filters){
				// Send the filters over
				var f = [];
				for(var i = 0; i < filters.length; i++){
					f.push(filters[i].serialize());
				}
				this.graphics.setGlobalFilters(f);
			});
			
			this.__defineSetter__("x", function(x){
				data.x = x;
				__pchannel("Runtime:CallMethod", {
					"id":id,
					"method":"setX",
					"params":x
				});
			});
			
			this.__defineSetter__("y", function(y){
				data.y = y;
				__pchannel("Runtime:CallMethod", {
					"id":id,
					"method":"setY",
					"params":y
				});
			});
		}
		if(this.__defineGetter__){
			this.__defineGetter__("filters", function(){
				return [];
			});
			
			this.__defineGetter__("x", function(){
				return data.x;
			});
			
			this.__defineGetter__("y", function(){
				return data.y;
			});
		}
		// Life time monitor
		if(data.lifeTime){
			var self = this;
			Utils.delay(function(){
				self.unload();
			}, data.lifeTime * 1000);
		}
		
		this.dispatchEvent = function(){
			
		};
		
		this.removeEventListener = function(event, listener){
			
		};
		
		this.addEventListener = function(event, listener){
			
		};
		
		/** Common **/
		this.unload = function(){
			__pchannel("Runtime:CallMethod", {
				"id":id,
				"method":"unload",
				"params":null
			});
		};
		this.getId = function(){
			return id;
		};
		this.serialize = function(){
			return {
				"class":"Shape",
				"x":data.x,
				"y":data.y,
				"alpha":data.alpha
			};
		};
		Runtime.registerObject(this);
	};
	
	function CanvasObject(params){
		var id = Runtime.generateIdent();
		if(!params)
			params = {};
		var data = {
			"x":params.x ? params.x : 0,
			"y":params.y ? params.y : 0,
			"width":params.width ? params.width : null,
			"height":params.height ? params.height : null,
		}
				
		this.addChild = function(displayObject){
		
		};
		
		/** Common **/
		this.unload = function(){
			__pchannel("Runtime:CallMethod", {
				"id":id,
				"method":"unload",
				"params":null
			});
		};
		this.getId = function(){
			return id;
		};
		this.serialize = function(){
			return {
				"class":"Canvas",
				"x":data.x,
				"y":data.y,
				"width":data.width,
				"height":data.height
			};
		};
		Runtime.registerObject(this);
	};
	
	function ButtonObject(){
		var id = Runtime.generateIdent();
		
		this.setStyle = function(property, value){
		
		};
		
		/** Common **/
		this.unload = function(){
			__pchannel("Runtime:CallMethod", {
				"id":id,
				"method":"unload",
				"params":null
			});
		};
		this.getId = function(){
			return id;
		};
		this.serialize = function(){
			return {
				"class":"Button",
			};
		};
		Runtime.registerObject(this);
	};
	
	function CommentObject(text, params){
		var id = Runtime.generateIdent();
		var data = {};
		// Init
		data.text = text;
		data.textFormat = new TextFormat();
		for(var x in params){
			data[x] = params[x];
		}
		if(data.fontsize){
			data.textFormat.size = data.fontsize;
		}
		if(data.color){
			data.textFormat.color = data.color;
		}
		// Unpack params
		if(this.__defineSetter__){
			this.__defineSetter__("text", function(text){
				data.text = text;
				__pchannel("Runtime:CallMethod", {
					"id":id,
					"method":"setText",
					"params":text
				});
			});
			this.__defineSetter__("x", function(x){
				data.x = x;
				__pchannel("Runtime:CallMethod", {
					"id":id,
					"method":"setX",
					"params":data.x
				});
			});
			this.__defineSetter__("y", function(y){
				data.y = y;
				__pchannel("Runtime:CallMethod", {
					"id":id,
					"method":"setY",
					"params":data.y
				});
			});
			this.__defineSetter__("filters", function(filters){
				__pchannel("Runtime:CallMethod", {
					"id":id,
					"method":"setFilters",
					"params":[filters]
				});
			});
		}
		
		if(this.__defineGetter__){
			this.__defineGetter__("text", function(){
				return data.text ? data.text : "";
			});
			this.__defineGetter__("x", function(){
				return data.x;
			});
			this.__defineGetter__("y", function(){
				return data.y;
			});
		}
		
		this.getTextFormat = function(s, e){
			if(s && s > 0 || e && this.text && e < this.text.length){
				__trace("Partial text format not supported", "warn");
			}
			return data.textFormat;
		};
		
		this.setTextFormat = function(fmt, s, e){
			if(s && s > 0 || e && this.text && e < this.text.length){
				__trace("Partial text format not supported", "warn");
			}
			data.textFormat = fmt;
			__pchannel("Runtime:CallMethod", {
				"id":id,
				"method":"setTextFormat",
				"params":fmt.serialize()
			});
		};
		
		this.setText = function(text){
			this.text = text;
		};
		// Life time monitor
		if(data.lifeTime){
			var self = this;
			Utils.delay(function(){
				self.unload();
			}, data.lifeTime * 1000);
		}
		/** Common **/
		this.unload = function(){
			__pchannel("Runtime:CallMethod", {
				"id":id,
				"method":"unload",
				"params":null
			});
		};
		this.getId = function(){
			return id;
		};
		this.serialize = function(){
			return {
				"class":"Comment",
				"x":data.x,
				"y":data.y,
				"text":data.text,
				"textFormat":data.textFormat.serialize(),
			};
		};
		Runtime.registerObject(this);
	};
	
	function FilterObject(type, params){
		this.type = type ? type : "blur";
		
		this.params = params ? params : {"blurX":0, "blurY":0};
		
		this.serialize = function(){
			return {
				"class":"filter",
				"type":this.type,
				"params":this.params
			};
		};
	};
	/**
	 * Private Variable stubs
	**/
	var stage = {
		width:-1,
		height:-1,
		fsWidth:-1,
		fsHeight:-1
	};
	
	/**
	 * Private method stubs
	**/
	var _fullScreenWidth = function(){
		return stage.fsWidth;
	};
	
	var _fullScreenHeight = function(){
		return stage.fsHeight;
	};
	
	var _width = function(){
		return stage.width;
	};
	
	var _height = function(){
		return stage.height;
	};
	
	/**
	 * Bind listeners
	**/
	__schannel("Update:dimension", function(dim){
		stage.width = dim.stageWidth;
		stage.height = dim.stageHeight;
		stage.fsWidth = dim.screenWidth;
		stage.fsHeight = dim.screenHeight;
	});
	
	
	/**
	 * Public method stubs
	**/
	this.createMatrix = function(){
		return new Matrix(1,0,0,1,0,0);
	};
	
	this.createPoint = function(x, y){
		
	};
	
	this.createComment = function(text, param){
		return new CommentObject(text, param);
	};
	
	this.createShape = function(param){
		return new SVGShape(param);
	};
	
	this.createCanvas = function(param){
		return new CanvasObject();
	};
	
	this.createButton = function(param){
		return new ButtonObject();
	};
	
	this.createGlowFilter = function(color, alpha, blurX, blurY, strength, 
		quality, inner, knockout){
		return new FilterObject("glow",{
			"color":color ? color : 16711680,
			"alpha":alpha ? alpha : 1.0,
			"blurX":blurX ? blurX : 6.0,
			"blurY":blurY ? blurY : 6.0,
			"strength":strength ? strength : 2,
			"inner": inner == null ? false : inner,
			"knockout": knockout == null ? false : knockout
		});
	};
	
	this.createBlurFilter = function(blurX, blurY, quality){
		return new FilterObject("blur", {
			"blurX":blurX ? blurX : 4.0,
			"blurY":blurY ? blurY : 4.0
		});
	};
	
	this.toIntVector = function(arr){
		// Vectors are arrays
		for(var i = 0; i < arr.length; i++){
			arr[i] = Math.floor(arr[i]);
		}
		arr.isVector = true;
		return arr;
	};
	
	this.toUIntVector = function(arr){
		for(var i = 0; i < arr.length; i++){
			arr[i] = Math.floor(Math.abs(arr[i]));
		}
		arr.isVector = true;
		return arr;
	};
	
	this.toNumberVector = function(arr){
		arr.isVector = true;
		return arr;
	};
	
	this.createVector3D = function(x,y,z,w){
		if(!x)
			x = 0;
		if(!y)
			y = 0;
		if(!z)
			z = 0;
		if(!w)
			w = 0;
		return new Vector3D(x,y,z,w);
	};
	
	this.createMatrix3D = function(iv){
		return new Matrix3D(iv);
	};
	
	this.createColorTransform = function(rM, gM, bM, aM, rO, gO, bO, aO){
		
	};
	
	this.createTextFormat = function(font, size, color, bold, italic, 
		underline, url, target, align, leftMargin, rightMargin, indent, 
		leading){
		return new TextFormat(font ? font : "SimHei",
			 size ? size : 25, color ? color : 0x000000,
			 bold ? bold : false, italic ? italic : false, 
			 underline ? underline : false, url ? url : "", 
			 target ? target : "", align ? align : "left", 
			 leftMargin ? leftMargin : 0, rightMargin ? rightMargin : 0,
			 indent ? indent : 0, leading ? leading : 0);
	};
	
	this.toString = function(){
		return "[display Display]";
	};
	/**
	 * Initializer for all the getter/setter fields
	 */
	if(this.__defineGetter__){
		this.__defineGetter__("fullScreenWidth", function(){
			return _fullScreenWidth();
		});
		this.__defineGetter__("fullScreenHeight", function(){
			return _fullScreenHeight();
		});
		this.__defineGetter__("width", function(){
			return _width();
		});
		this.__defineGetter__("height", function(){
			return _height();
		});
		this.__defineGetter__("version", function(){
			return "CCLDisplay/1.0 HTML5/* (bilibili, like BSE, like flash)";
		});
	}
	
	if(this.__defineSetter__){
		this.__defineSetter__("fullScreenWidth", function(){
			__trace("Attempted to assign to read-only field", 'warn');
		});
		this.__defineSetter__("fullScreenHeight", function(){
			__trace("Attempted to assign to read-only field", 'warn');
		});
		this.__defineSetter__("width", function(){
			__trace("Attempted to assign to read-only field", 'warn');
		});
		this.__defineSetter__("fullScreenHeight", function(){
			__trace("Attempted to assign to read-only field", 'warn');
		});
		this.__defineSetter__("version", function(){
			__trace("Attempted to assign to read-only field", 'warn');
		});
	}
};

/** Create alias **/
var Display = $;
