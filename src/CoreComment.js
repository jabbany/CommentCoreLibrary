/** This is the element for a comment **/
function CoreComment(data, motion, parent){
	/** Parent designates the comment's type, if supplied = a dom comment **/
	this.render = parent ? "DOM" : "CANVAS";
	this.mode = data.mode;
	this.parent = parent;
	this.data = data;
	//Motion is a motion factory or the manager
	this.motion = motion;

	// Initialize the cached object
	this.getBounds();
}

CoreComment.prototype.set = function(styleParam, value){
	switch(styleParam){
		case "top":
		case "left":
		case "right":
		case "bottom":{
			this.parent.style[styleParam] = value ? (value + "px") : "";
		}break;
	}
}

CoreComment.prototype.getTTL = function(){
	return this.motion ? this.motion.ttl : this.data.dur;
}

CoreComment.prototype.getBounds = function(){
	this.width = this.parent.offsetWidth;
	this.height = this.parent.offsetHeight;
	this.x = this.parent.offsetLeft;
	this.y = this.parent.offsetTop;
	this.top = this.y;
	this.bottom = this.y + this.height;
	this.left = this.x;
	this.right = this.x + this.width;
};

CoreComment.prototype.estimateBounds = function(){
};

CoreComment.prototype.setMotion = function(m){
	this.motion = m;
};
