/**
 * Motion Abstraction for comments
**/

function CommentMotion(type, fields, object){
	this.type = type;
	this.fields = {};
	for(var key in fields){
		this.fields[key] = {
			"from":fields[key]["fromValue"] ? fields[key]["fromValue"] : object[fields[key]],
			"to":fields[key]["toValue"],
			"dur":fields[key]["lifeTime"] ? fields[key]["lifeTime"] : 4000,
			"ttl":fields[key]["lifeTime"] ? fields[key]["lifeTime"] : 4000,
			"delay":fields[key]["delay"] ? fields[key]["delay"] : 0,
			"fn":fields[key]["fn"] ? fields[key]["fn"] : "linear";
		};
	}
	this.isFinished = false;
}

CommentMotion.prototype.time = function(tdiff){
	// Increments the fields by tdiff
	for(var i in fields){
		fields[i]
	}
};
