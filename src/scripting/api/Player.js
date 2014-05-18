var Player = new function(){
	var player = {
		state: "unloaded",
		time:0,
		commentList:[],
		width:-1,
		height:-1,
		videoWidth:-1,
		videoHeight:-1,
		refreshRate:170,
	};
	/**
	 * Private methods
	**/
	var _state = function(){
		return player.state;
	};
	
	var _time = function(){
		return player.time;
	};
	
	var _commentList = function(){
		return player.commentList;
	};
	
	var _get_refreshRate = function(){
		return player.refreshRate;
	};
	
	var _set_refreshRate = function(r){
		if(r < 10)
			return;
		__pchannel("Player::Set",{
			"key":"refreshRate",
			"value":r
		});
	};
	
	var _width = function(){
		return player.width;
	};
	
	var _height = function(){
		return player.height;
	};
	
	var _videoWidth = function(){
		return player.videoWidth;
	};
	
	var _videoHeight = function(){
		return player.videoHeight;
	};
	
	var triggers = {
		"keyboard":[],
		"comment":[]
	};
	
	__schannel("update:player", function(){
		
	});
	
	/**
	 * Public methods
	**/
	this.play = function(){
		__pchannel("Player::action", {
			"action":"play"
		});
	};
	
	this.pause = function(){
		__pchannel("Player::action", {
			"action":"pause"
		});
	};
	
	this.seek = function(offset){
		__pchannel("Player::action", {
			"action":"seek",
			"params":offset
		});
	};
	
	this.jump = function(vid, page, newWindow){
		__pchannel("Player::action", {
			"action":"jump",
			"params":{
				"vid":vid,
				"page":page ? page : 1,
				"window":newWindow === true ? newWindow : false
			}
		});
	};
	
	this.commentTrigger = function(callback, timeout){
		if(!timeout)
			timeout = 0;
		triggers["comment"].push(callback);
		if(timeout > 0){
			setTimeout(function(){
				triggers["comment"].splice(triggers.indexOf(callback),1);
			}, timeout);
		};
	};
	
	this.keyTrigger = function(callback, timeout, up){
		if(!timeout)
			timeout = 0;
		var oc = callback;
		if(!up){
			callback = function(event){
				if(event == "keydown") {
					oc(event);
				}
			};
		}else{
			callback = function(event){
				if(event == "keyup") {
					oc(event);
				}
			};
		}
		triggers["keyboard"].push(callback);
		if(timeout > 0){
			setTimeout(function(){
				triggers["keyboard"].splice(triggers.indexOf(callback),1);
			}, timeout);
		};
	};
	
	this.dispatchTrigger = function(trigger, data){
		if(triggers[trigger]){
			for(var i in triggers){
				try{
					triggers[i](data);
				}catch(e){
					if(e.stack){
						__trace(e.stack, "err");
					}else{
						__trace(e.toString(), "err");
					}
				};
			}
		}
	};
	
	this.setMask = function(maskObj){
		__trace("Masking not supported", 'warn');
	};
	
	this.createSound = function(){
		__trace("Sound not supported", 'warn');
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
