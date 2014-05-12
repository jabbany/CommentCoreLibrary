var Player = function(){
	var player = {
		state: "unloaded",
		time:0,
		commentList:[],
		width:-1,
		height:-1,
		videoWidth:-1,
		videoHeight:-1
	};
	/**
	 * Private methods
	**/
	var _state = function(){
	
	};
	
	var _time = function(){
	
	};
	
	var _commentList = function(){
	
	};
	
	var _get_refreshRate = function(){
	
	};
	
	var _set_refreshRate = function(){
		
	};
	
	var _width = function(){
	
	};
	
	var _height = function(){
	
	};
	
	var _videoWidth = function(){
	
	};
	
	var _videoHeight = function(){
	
	};
	
	__schannel("update:player", function(){
		
	});
	
	/**
	 * Public methods
	**/
	this.play = function(){
		__pchannel("player", {
			"action":"play"
		});
	};
	
	this.pause = function(){
		__pchannel("player", {
			"action":"pause"
		});
	};
	
	this.seek = function(offset){
		__pchannel("player", {
			"action":"seek",
			"params":offset
		});
	};
	
	this.jump = function(vid, page, newWindow){
		__pchannel("player", {
			"action":"jump",
			"params":{
				"vid":vid,
				"page":page ? page : 1,
				"window":newWindow === true ? newWindow : false
			}
		});
	};
	
	this.commentTrigger = function(callback, timeout){
		
	};
	
	this.keyTrigger = function(callback, timeout, up){
		
	};
	
	this.setMask = function(maskObj){
		__trace("Not supported", 'warn');
	};
	
	this.createSound = function(){
		
	};
	
	this.toString = function(){
		return "[player Player]";
	};
	/**
	 * Initializer for all the getter/setter fields
	 */
	if(this.__defineGetter__){
		this.__defineGetter__("state", function(){
			return _state();
		});
		this.__defineGetter__("time", function(){
			return _time();
		});
		this.__defineGetter__("commentList", function(){
			return _commentList();
		});
		this.__defineGetter__("refreshRate", function(){
			return _get_refreshRate();
		});
		this.__defineGetter__("width", function(){
			return _width();
		});
		this.__defineGetter__("height", function(){
			return _height();
		});
		this.__defineGetter__("videoWidth", function(){
			return _videoWidth();
		});
		this.__defineGetter__("videoHeight", function(){
			return _videoHeight();
		});
		this.__defineGetter__("version", function(){
			return "CCLPlayer/1.0 HTML5/* (bilibili, like BSE, like flash)";
		});
	}
	
	if(this.__defineSetter__){
		this.__defineGetter__("state", function(){
			__trace("Attempted to assign to read-only field", 'warn');
		});
		this.__defineGetter__("time", function(){
			__trace("Attempted to assign to read-only field", 'warn');
		});
		this.__defineGetter__("commentList", function(){
			__trace("Attempted to assign to read-only field", 'warn');
		});
		this.__defineGetter__("refreshRate", function(r){
			_set_refreshRate(r);
		});
		this.__defineGetter__("width", function(){
			__trace("Attempted to assign to read-only field", 'warn');
		});
		this.__defineGetter__("height", function(){
			__trace("Attempted to assign to read-only field", 'warn');
		});
		this.__defineGetter__("videoWidth", function(){
			__trace("Attempted to assign to read-only field", 'warn');
		});
		this.__defineGetter__("videoHeight", function(){
			__trace("Attempted to assign to read-only field", 'warn');
		});
	}
};
