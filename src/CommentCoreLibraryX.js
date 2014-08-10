/*!
 * Comment Core For HTML5 VideoPlayers
 * Copyright (c) 2014 Jim Chen
 * License: MIT
 */

/****** Load Core Engine Classes ******/
function CommentManager(stageObject){
	var __timer = 0;
	this.stage = stageObject;
	this.options = {
		opacity:1,
		globalScale:1,
		scrollScale:1
	};
	this.timeline = [];
	this.runline = [];
	this.position = 0;
	this.limiter = 0;
	this.filter = null;
	this.csa = {
		scroll: new CommentSpaceAllocator(0,0),
		top:new TopCommentSpaceAllocator(0,0),
		bottom:new BottomCommentSpaceAllocator(0,0),
		reverse:new ReverseCommentSpaceAllocator(0,0),
		scrollbtm:new BottomScrollCommentSpaceAllocator(0,0)
	};
	/** Precompute the offset width **/
	this.stage.width = this.stage.offsetWidth;
	this.stage.height= this.stage.offsetHeight;
	this.width = this.stage.width;
	this.height = this.stage.height;
	this.startTimer = function(){
		if(__timer > 0)
			return;
		var lastTPos = new Date().getTime();
		var cmMgr = this;
		__timer = window.setInterval(function(){
			var elapsed = new Date().getTime() - lastTPos;
			lastTPos = new Date().getTime();
			cmMgr.onTimerEvent(elapsed,cmMgr);
		},10);
	};
	this.stopTimer = function(){
		window.clearInterval(__timer);
		__timer = 0;
	};
}

/** Public **/
CommentManager.prototype.seek = function(time){
	this.position = this.timeline.bsearch(time,function(a,b){
		if(a < b.stime) return -1
		else if(a > b.stime) return 1;
		else return 0;
	});
};

CommentManager.prototype.validate = function(cmt){
	if(cmt == null)
		return false;
	return this.filter.doValidate(cmt);
};

CommentManager.prototype.load = function(a){
	this.timeline = a;
	this.timeline.sort(function(a,b){
		if(a.stime > b.stime) return 2;
		else if(a.stime < b.stime) return -2;
		else{
			if(a.date > b.date) return 1;
			else if(a.date < b.date) return -1;
			else if(a.dbid != null && b.dbid != null){
				if(a.dbid > b.dbid) return 1;
				else if(a.dbid < b.dbid) return -1;
				return 0;
			}else
				return 0;
		}
	});
};

CommentManager.prototype.clear = function(){
	for(var i=0;i<this.runline.length;i++){
		this.finish(this.runline[i]);
		this.stage.removeChild(this.runline[i].dom);
	}
	this.runline = [];
};

CommentManager.prototype.setBounds = function(){
	for(var comAlloc in this.csa){
		this.csa[comAlloc].setBounds(this.stage.offsetWidth,this.stage.offsetHeight);
	}
	this.stage.width = this.stage.offsetWidth;
	this.stage.height= this.stage.offsetHeight;
	this.width = this.stage.width;
	this.height = this.stage.height;
	// Update 3d perspective
	this.stage.style.perspective = this.stage.width * Math.tan(40 * Math.PI/180) / 2 + "px";
	this.stage.style.webkitPerspective = this.stage.width * Math.tan(40 * Math.PI/180) / 2 + "px";
};
CommentManager.prototype.init = function(){
	this.setBounds();
	if(this.filter == null)
		this.filter = new CommentFilter(); //Only create a filter if none exist
};
CommentManager.prototype.time = function(time){
	time = time - 1;
	if(this.position >= this.timeline.length || Math.abs(this.lastPos - time) >= 2000){
		this.seek(time);
		this.lastPos = time;
		if(this.timeline.length <= this.position)
			return;
	}else{
		this.lastPos = time;
	}
	for(;this.position < this.timeline.length;this.position++){
		if(this.limiter > 0 && this.runline.length > this.limiter) break;
		if(this.validate(this.timeline[this.position]) && this.timeline[this.position]['stime']<=time){
			this.sendComment(this.timeline[this.position]);
		}else{
			break;
		}
	}
};
CommentManager.prototype.rescale = function(){
	
};
CommentManager.prototype.sendComment = function(data){
	if(data.mode === 8){
		console.log(data);
		if(this.scripting){
			console.log(this.scripting.eval(data.code));
		}
		return;
	}
	if(this.filter != null){
		data = this.filter.doModify(data);
		if(data == null) return;
	}
	if(data.mode === 1 || data.mode === 2 || data.mode === 4){
		var cmt = new ScrollComment(this, data);
	}else{
		var cmt = new CoreComment(this, data);
	}
	cmt.init();
	this.stage.appendChild(cmt.dom);

	if(this.filter != null && !this.filter.beforeSend(cmt)){
		this.stage.removeChild(cmt);
		cmt = null;
		return;
	}
	switch(cmt.mode){
		default:
		case 1:{this.csa.scroll.add(cmt);}break;
		case 2:{this.csa.scrollbtm.add(cmt);}break;
		case 4:{this.csa.bottom.add(cmt);}break;
		case 5:{this.csa.top.add(cmt);}break;
		case 6:{this.csa.reverse.add(cmt);}break;
		case 17:
		case 7:{
			if(cmt.data.position !== "relative"){
				cmt.style.top = cmt.data.y + "px";
				cmt.style.left = cmt.data.x + "px";
			}else{
				cmt.style.top = cmt.data.y * this.stage.height + "px";
				cmt.style.left = cmt.data.x * this.stage.width + "px";
			}
			cmt.ttl = Math.round(data.duration * this.def.globalScale);
			cmt.dur = Math.round(data.duration * this.def.globalScale);
			if(data.rY !== 0 || data.rZ !== 0){
				/** TODO: revise when browser manufacturers make up their mind on Transform APIs **/
				var getRotMatrix = function(yrot, zrot) {
					// Courtesy of @StarBrilliant, re-adapted to look better
					var DEG2RAD = Math.PI/180;
					var yr = yrot * DEG2RAD;
					var zr = zrot * DEG2RAD;
					var COS = Math.cos;
					var SIN = Math.sin;
					var matrix = [
						COS(yr) * COS(zr)    , COS(yr) * SIN(zr)     , SIN(yr)  , 0,
						(-SIN(zr))           , COS(zr)               , 0        , 0,
						(-SIN(yr) * COS(zr)) , (-SIN(yr) * SIN(zr))  , COS(yr)  , 0,
						0                    , 0                     , 0        , 1
					];
					// CSS does not recognize scientific notation (e.g. 1e-6), truncating it.
					for(var i = 0; i < matrix.length;i++){
						if(Math.abs(matrix[i]) < 0.000001){
							matrix[i] = 0;
						}
					}
					return "matrix3d(" + matrix.join(",") + ")";
				}
				cmt.style.transformOrigin = "0% 0%";
				cmt.style.webkitTransformOrigin = "0% 0%";
				cmt.style.OTransformOrigin = "0% 0%";
				cmt.style.MozTransformOrigin = "0% 0%";
				cmt.style.MSTransformOrigin = "0% 0%";
				cmt.style.transform = getRotMatrix(data.rY, data.rZ);
				cmt.style.webkitTransform = getRotMatrix(data.rY, data.rZ);
				cmt.style.OTransform = getRotMatrix(data.rY, data.rZ);
				cmt.style.MozTransform = getRotMatrix(data.rY, data.rZ);
				cmt.style.MSTransform = getRotMatrix(data.rY, data.rZ);
			}
		}break;
	}
	cmt.y = cmt.y;
	this.runline.push(cmt);
};
CommentManager.prototype.finish = function(cmt){
	var index = this.runline.indexOf(cmt);
	if(index >= 0){
		this.runline.splice(index, 1);
	}
	switch(cmt.mode){
		default:
		case 1:{this.csa.scroll.remove(cmt);}break;
		case 2:{this.csa.scrollbtm.remove(cmt);}break;
		case 4:{this.csa.bottom.remove(cmt);}break;
		case 5:{this.csa.top.remove(cmt);}break;
		case 6:{this.csa.reverse.remove(cmt);}break;
		case 7:break;
	}
};
/** Static Functions **/
CommentManager.prototype.onTimerEvent = function(timePassed,cmObj){
	for(var i= 0;i < cmObj.runline.length; i++){
		var cmt = cmObj.runline[i];
		if(cmt.hold){
			continue;
		}
		cmt.time(timePassed);
	}
};
