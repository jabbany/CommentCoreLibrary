var $ = new function(){
	/**
	 * Inner classes
	**/
	function Matrix(a,b,c,d,tx,ty){
		// TODO: http://help.adobe.com/zh_CN/FlashPlatform/reference/actionscript/3/flash/geom/Matrix.html
		var data = [[a,c,tx],[b,d,ty],[0,0,1]];
		this.clone = function(){
			return new this(a,b,c,d,tx,ty);
		};
		this.concat = function(matrix){
			return;
		};
		this.
	};
	
	function SVGShape(){
		var id = Runtime.generateIdent();
	};
	
	function CanvasObject(){
		var id = Runtime.generateIdent();
	};
	
	function ButtonObject(){
		var id = Runtime.generateIdent();
	};
	
	function CommentObject(){
		var id = Runtime.generateIdent();
	};
	
	function FilterObject(){
		var id = Runtime.generateIdent();
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
	__schannel("update:dimension", function(dim){
		stage.width = dim.stageWidth;
		stage.height = dim.stageHeight;
		stage.fsWidth = dim.screenWidth;
		stage.fsHeight = dim.screenHeight;
	});
	
	
	/**
	 * Public method stubs
	**/
	this.createMatrix = function(){
		
	};
	
	this.createPoint = function(x, y){
		
	};
	
	this.createComment = function(text, param){
	
	};
	
	this.createShape = function(param){
		
	};
	
	this.createCanvas = function(param){
		
	};
	
	this.createButton = function(param){
		
	};
	
	this.createGlowFilter = function(color, alpha, blurX, blurY, strength, quality, inner, knockout){
		
	};
	
	this.createBlurFilter = function(blurX, blurY, quality){
	
	};
	
	this.toIntVector = function(arr){
		
	};
	
	this.toUIntVector = function(arr){
		
	};
	
	this.toNumberVector = function(arr){
		
	};
	
	this.createVector3D = function(x,y,z,w){
		
	};
	
	this.createMatrix3D = function(x,y,z,w){
		
	};
	
	this.createColorTransform = function(rM, gM, bM, aM, rO, gO, bO, aO){
		
	};
	
	this.createTextFormat = function(font, size, color, bold, italic, underline, url, target, align, leftMargin, rightMargin, indent, leading){
		
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
	}
};

/** Create alias **/
var Display = $;
