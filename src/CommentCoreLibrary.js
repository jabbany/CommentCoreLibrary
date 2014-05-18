/******
 * Comment Core For HTML5 VideoPlayers
 * Author : Jim Chen
 * Licensing : MIT License
 ******/
Array.prototype.remove = function(obj){
	for(var a = 0; a < this.length;a++)
	  if(this[a] == obj){
		  this.splice(a,1);
		  break;
	  }
};
Array.prototype.bsearch = function(what,how){
	if(this.length == 0) return 0;
	if(how(what,this[0]) < 0) return 0;
	if(how(what,this[this.length - 1]) >=0) return this.length;
	var low =0;
	var i = 0;
	var count = 0;
	var high = this.length - 1;
	while(low<=high){
		i = Math.floor((high + low + 1)/2);
		count++;
		if(how(what,this[i-1])>=0 && how(what,this[i])<0){
			return i;
		}else if(how(what,this[i-1])<0){
			high = i-1;
		}else if(how(what,this[i])>=0){
			low = i;
		}else
		  console.error('Program Error');
		if(count > 1500) console.error('Too many run cycles.');
	}
	return -1;
};
Array.prototype.binsert = function(what,how){
	this.splice(this.bsearch(what,how),0,what);
};
/****** Load Core Engine Classes ******/
function CommentManager(stageObject){
	var __timer = 0;
	this.stage = stageObject;
	this.def = {
		opacity:1,
		globalScale:1,
		scrollScale:1
	};
	this.timeline = [];
	this.runline = [];
	/////
	this.pdiv = [];
	this.pdivbreak = 1 * this.def.globalScale ; 
	this.eachDivTime = 4000 * this.pdivbreak ; 
	this.pdivshow = [];
	this.pdivpool = [0];
	this.pdivheight = 29;
	/////
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
	/** Private **/
	this.initCmt = function(cmt,data){
		cmt.className = 'cmt';
		cmt.stime = data.stime;
		cmt.mode = data.mode;
		cmt.data = data;
		if(cmt.mode === 17){

		}else{
			cmt.appendChild(document.createTextNode(data.text));
			cmt.innerText = data.text;
			cmt.style.fontSize = data.size + "px";
		}
		if(data.font != null && data.font != '')
		  cmt.style.fontFamily = data.font;
		if(data.shadow === false)
		  cmt.className = 'cmt noshadow';
		if(data.color == "#000000" && (data.shadow || data.shadow == null))
		  cmt.className += ' rshadow';
		if(data.margin != null)
		  cmt.style.margin = data.margin;
		if(data.color != null)
		  cmt.style.color = data.color;
		if(this.def.opacity != 1 && data.mode == 1)
		  cmt.style.opacity = this.def.opacity;
		if(data.alphaFrom != null)
		  cmt.style.opacity = data.alphaFrom;
		if(data.border)
		  cmt.style.border = "1px solid #00ffff";
		cmt.ttl = Math.round(4000 * this.def.globalScale);
		cmt.dur = cmt.ttl;
		if(cmt.mode === 1 || cmt.mode === 6 || cmt.mode === 2){
			cmt.ttl *= this.def.scrollScale;
			cmt.dur = cmt.ttl;
		}
		return cmt;
	};
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
	/////
	this.preload();
	/////
};
/////
CommentManager.prototype.preload = function(){
	this.pdiv = [];
	this.pdivshow = [];
	this.pdivpool = [0];
	while(this.stage.children.length > 0){
		this.stage.removeChild(this.stage.children[0]);
	}
	totalDivTime = this.timeline[this.timeline.length-1].stime;
	totalDivNum = Math.floor(totalDivTime/this.eachDivTime)+1;
	for(i = 0; i < totalDivNum; i++){
		this.pdiv[i] = document.createElement("div");
		this.pdiv[i].show = false;
		this.pdiv[i].id = "pdiv_"+i;
		this.pdiv[i].pnum = i;
		this.pdiv[i].className = "container";
	}
	for(i = 0; i < this.timeline.length; i++){
		if(this.timeline[i].mode == 1){
			if(this.filter != null){
				data=this.timeline[i];
				if(this.filter.doModify(data) == null) 
				  continue;
			}
			cmt = document.createElement('div');
			cmt = this.initCmt(cmt,this.timeline[i]);
			cmt.width = Math.floor(cmt.data.text.length*cmt.data.size)+1;
			if(isNaN(cmt.width))cmt.width=0;
			cmt.height = Math.floor(cmt.data.size*1.15)+1;
			j = 0;
			while(j <= this.pdivpool.length){
				if(j == this.pdivpool.length)
				  this.pdivpool[j] = 0;
				if(cmt.stime >= this.pdivpool[j]){
					cmt.totop = j* this.pdivheight;
					while(cmt.totop + cmt.height > this.stage.height)
					  cmt.totop-=this.stage.height;
					endtime = cmt.stime+cmt.width/this.stage.width*4000*this.def.globalScale;
					k=0;
					while(k*this.pdivheight<cmt.height){
						this.pdivpool[j+k]=endtime;
						k++
					}
					break;
				}else
				  j++;
			}
			cmt.style.left = -this.stage.width-cmt.width + "px";
			cmt.style.top = cmt.totop + "px";
			this.pdiv[Math.floor(this.timeline[i].stime/this.eachDivTime)].appendChild(cmt);
			this.timeline[i].cmt=cmt;
		}
	}
}
CommentManager.prototype.pdivsety = function(){
	this.pdivpool=[0];
	for(i = 0; i < this.timeline.length; i++){
		if(this.timeline[i].mode !== 1)
		  continue;
		if(!this.timeline[i].cmt)
		  continue;
		cmt=this.timeline[i].cmt;
		j = 0;
		while(j <= this.pdivpool.length){
			if(j == this.pdivpool.length)
			  this.pdivpool[j] = 0;
			if(cmt.stime >= this.pdivpool[j]){
				cmt.totop = j* this.pdivheight;
				while(cmt.totop + cmt.height > this.stage.height)
				  cmt.totop-=this.stage.height;
				endtime = cmt.stime+cmt.width/this.stage.width*4000*this.def.globalScale;
				k=0;
				while(k*this.pdivheight<cmt.height){
					this.pdivpool[j+k]=endtime;
					k++
				}
				break;
			}else
			  j++;
		}
		cmt.style.top = cmt.totop + "px";
	}
}
CommentManager.prototype.pdivupdate = function(){
	time=this.lastPos;
	nowDivNum = Math.floor(time/this.eachDivTime);
	if(this.pdiv[nowDivNum]){
		if(this.pdiv[nowDivNum].show == false){
			this.pdiv[nowDivNum].show = true;
			pdiv=this.pdiv[nowDivNum];
			for(i=0;i<pdiv.children.length;i++)
			  pdiv.children[i].style.left =  -this.stage.width-pdiv.children[i].width + "px";
			this.stage.appendChild(this.pdiv[nowDivNum]);
			this.pdivshow.push(this.pdiv[nowDivNum]);
		}
		finish=Math.floor(1/this.pdivbreak)+1;
		if(this.pdivshow[0])
		  while(this.pdivshow[0].pnum < nowDivNum - finish){
			  this.stage.removeChild(this.pdivshow[0]);
			  this.pdivshow[0].show = false;
			  this.pdivshow.shift();
		  }
	}
}
CommentManager.prototype.pdivclear = function(){
	for(i=0;i<this.pdivshow.length;i++)
	  this.stage.removeChild(this.pdivshow[i]);
	this.pdivshow=[];
	for(i=0;i<this.pdiv.length;i++)
	  this.pdiv[i].show=false;
	for(i = 0; i < this.timeline.length; i++){
		if(this.timeline[i].mode==1)
		  if(this.timeline[i].cmt)
			this.timeline[i].cmt.ttl=this.timeline[i].cmt.dur;
	}
}
/////
CommentManager.prototype.clear = function(){
	for(var i=0;i<this.runline.length;i++){
		this.finish(this.runline[i]);
		if(this.runline[i].mode!==1)
		  this.stage.removeChild(this.runline[i]);
	}
	//while(this.stage.children[0])
	//  this.stage.removeChild(this.stage.children[0]);
	//for(i = 0; i < this.pdiv.length; i++)
	//  this.pdiv[i].show = false;
	//this.pdivshow = [];
	this.runline = [];
	this.pdivclear();
};
CommentManager.prototype.setBounds = function(){
	for(var comAlloc in this.csa){
		this.csa[comAlloc].setBounds(this.stage.offsetWidth,this.stage.offsetHeight);
	}
	this.stage.width = this.stage.offsetWidth;
	this.stage.height= this.stage.offsetHeight;
	// Update 3d perspective
	this.stage.style.perspective = this.stage.width * Math.tan(40 * Math.PI/180) / 2 + "px";
	this.stage.style.webkitPerspective = this.stage.width * Math.tan(40 * Math.PI/180) / 2 + "px";
	for(i = 0; i < this.pdiv.length; i++)
	  this.pdiv[i].style.left = this.stage.width + "px";
	this.pdivsety();
};
CommentManager.prototype.init = function(){
	this.setBounds();
	if(this.filter == null)
	  this.filter = new CommentFilter(); //Only create a filter if none exist
};
CommentManager.prototype.time = function(time){
	time = time - 1;
	if(this.position >= this.timeline.length || Math.abs(this.lastPos - time) >= 500){
		this.seek(time);
		this.lastPos = time;
		if(this.timeline.length <= this.position)
		  return;
	}else this.lastPos = time;
	for(;this.position < this.timeline.length;this.position++){
		if(this.limiter > 0 && this.runline.length > this.limiter) break;
		if(this.validate(this.timeline[this.position]) && this.timeline[this.position]['stime']<=time) 
		  this.sendComment(this.timeline[this.position]);
		else break;
	}
};
CommentManager.prototype.rescale = function(){
	for(var i = 0; i < this.runline.length; i++){
		this.runline[i].dur = Math.round(this.runline[i].dur * this.def.globalScale);
		this.runline[i].ttl = Math.round(this.runline[i].ttl * this.def.globalScale);
	}
};
CommentManager.prototype.sendComment = function(data){
	if(data.mode === 8){
		console.log(data);
		if(this.scripting){
			console.log(this.scripting.eval(data.code));
		}
		return;
	}
	if(data.mode === 1){
		cmt = data.cmt;
	}else{
		var cmt = document.createElement('div');
		if(this.filter != null){
			data = this.filter.doModify(data);
			if(data == null) return;
		}
		cmt = this.initCmt(cmt,data);
		this.stage.appendChild(cmt);
		cmt.width = cmt.offsetWidth;
		cmt.height = cmt.offsetHeight;
		cmt.style.width = (cmt.w + 1) + "px";
		cmt.style.height = (cmt.h - 3) + "px";
		cmt.style.left = this.stage.width + "px";
	}

	if(this.filter != null && !this.filter.beforeSend(cmt)){
		this.stage.removeChild(cmt);
		cmt = null;
		return;
	}
	switch(cmt.mode){
		default:
		case 1: break;
				//case 1:{this.csa.scroll.add(cmt);}break;
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
	this.runline.push(cmt);
};
CommentManager.prototype.finish = function(cmt){
	switch(cmt.mode){
		default:
		case 1: break;
				//case 1:{this.csa.scroll.remove(cmt);}break;
		case 2:{this.csa.scrollbtm.remove(cmt);}break;
		case 4:{this.csa.bottom.remove(cmt);}break;
		case 5:{this.csa.top.remove(cmt);}break;
		case 6:{this.csa.reverse.remove(cmt);}break;
		case 7:break;
	}
};
/** Static Functions **/
CommentManager.prototype.onTimerEvent = function(timePassed,cmObj){
	this.pdivupdate();
	for(var i= 0;i < cmObj.runline.length; i++){
		var cmt = cmObj.runline[i];
		if(cmt.hold){
			continue;
		}
		cmt.ttl -= timePassed;
		if(cmt.mode == 1 || cmt.mode == 2) {
			cmt.style.left = (cmt.ttl / cmt.dur) * (cmObj.stage.width + cmt.width) - cmt.width + "px";
		}else if(cmt.mode == 6) {
			cmt.style.left = (1 - cmt.ttl / cmt.dur) * (cmObj.stage.width + cmt.width) - cmt.width + "px";
		}else if(cmt.mode == 4 || cmt.mode == 5 || cmt.mode >= 7){
			if(cmt.dur == null)
			  cmt.dur = 4000;
			if(cmt.data.alphaFrom != null && cmt.data.alphaTo != null){
				cmt.style.opacity = (cmt.data.alphaFrom - cmt.data.alphaTo) * 
					(cmt.ttl/cmt.dur) + cmt.data.alphaTo;
			}
			if(cmt.mode == 7 && cmt.data.movable){
				var posT = Math.min(Math.max(cmt.dur - cmt.data.moveDelay - cmt.ttl,0),
							cmt.data.moveDuration) / cmt.data.moveDuration;
				if(cmt.data.position !== "relative"){
					cmt.style.top = ((cmt.data.toY - cmt.data.y) * posT + cmt.data.y) + "px";
					cmt.style.left= ((cmt.data.toX - cmt.data.x) * posT + cmt.data.x) + "px";
				}else{
					cmt.style.top = (((cmt.data.toY - cmt.data.y) * posT + cmt.data.y) * cmObj.stage.height) + "px";
					cmt.style.left= (((cmt.data.toX - cmt.data.x) * posT + cmt.data.x) * cmObj.stage.width) + "px";
				}
			}
		}
		if(cmObj.filter != null){
			cmt = cmObj.filter.runtimeFilter(cmt);
		}
		if(cmt.ttl <= 0){
			if(cmt.mode!==1)
			  cmObj.stage.removeChild(cmt);
			cmObj.runline.splice(i,1);//remove the comment
			cmObj.finish(cmt);
		}
	}
};
