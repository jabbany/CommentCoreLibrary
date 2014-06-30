/** Experimental New Optimizer **/
function CommentList(){
	this.timeline = [];
	this.threshold = 1000;//Every 1 second
	this.count = 0;
	this.isOptimized = false;
}
CommentList.prototype.load = function (tl){
	tl.sort(function(a,b){
		if(a.stime > b.stime) return 2;
		else if(a.stime < b.stime) return -2;
		else{
			if(a.date > b.date) return 1;
			else if(a.date < b.date) return -1;
			else return 0;
		}
	});
	this.timeline = tl;
	this.count = tl.length;
	this.isOptimized = false;
};
CommentList.prototype.optimize = function(){
	if(this.isOptimized)
		return true;
	var pos = 0;
	var time = 0;
	var expr = {};
	for(;pos<this.count;pos++){
		if(this.timeline[pos].stime - this.time < this.threshold){
			//Add to optimize stack if it does not exist in the stack
			if(this.found(this.timeline[pos]))
				break;
			else
				this.pushfind(this.timeline[pos])
		}
	}
};