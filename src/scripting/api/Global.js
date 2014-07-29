var Global = new function(){
	var kvstore = {};
	this._set = function(key, val){
		kvstore[key] = val;
	};
	this._get = function(key){
		return kvstore[key];
	};
	this._ = function(key){
		return this._get(key);
	};
};

var $G = Global;
