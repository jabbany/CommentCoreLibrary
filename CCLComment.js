/** This is the element for the comment **/
function CCLComment(data, motion, parent){
	/** Parent designates the comment's type **/
	this.render = parent ? "DOM" : "CANVAS";
	this.mode = data.mode;
	this.parent = parent;
	this.data = data;
	//Motion is a motion factory or the manager
	this.motion = motion;

	this.width = -1;
	this.height = -1;
	this.x = 0;
	this.y = 0;
}

CCLComment.prototype.getBounds = function(){
	this.width = this.parent.offsetWidth;
	this.height = this.parent.offsetHeight;
	this.x = this.parent.offsetLeft;
	this.y = this.parent.offsetTop;
};

CCLComment.prototype.setMotion = function(m){
	this.motion = m;
}

CCLComment.prototype.destroy = function(){
	//Destroys references to aid gc?
	delete this.parent;
	delete this.motion;
	this.render = "NONE";
	this.type = -1;
}
