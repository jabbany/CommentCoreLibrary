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

CCLComment.prototype.set = function(styleParam, value){
	switch(styleParam){
		case "top":
		case "left":
		case "right":
		case "bottom":{
			this.parent.style[styleParam] = value ? (value + "px") : "";
		}break;
	}
}

CCLComment.prototype.getTTL = function(){
	return this.motion ? this.motion.ttl : this.data.dur;
}

CCLComment.prototype.getBounds = function(){
	this.width = this.parent.offsetWidth;
	this.height = this.parent.offsetHeight;
	this.x = this.parent.offsetLeft;
	this.y = this.parent.offsetTop;
	this.top = this.y;
	this.bottom = this.y + this.height;
	this.left = this.x;
	this.right = this.x + this.width;
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
/** 
Comment Filters/Filter Lang
Licensed Under MIT License
**/

function CommentFilter(){
	this.rulebook = {"all":[]};
	this.modifiers = [];
	this.runtime = null;
	this.allowTypes = {
		"1":true,
		"4":true,
		"5":true,
		"6":true,
		"7":true,
		"17":true
	};
	this.doModify = function(cmt){
		for(var k=0;k<this.modifiers.length;k++){
			cmt = this.modifiers[k](cmt);
		}
		return cmt;
	};
	this.isMatchRule = function(cmtData,rule){
		switch(rule['operator']){
			case '==':if(cmtData[rule['subject']] == rule['value']){return false;};break;
			case '>':if(cmtData[rule['subject']] > rule['value']){return false;};break;
			case '<':if(cmtData[rule['subject']] < rule['value']){return false;};break;
			case 'range':if(cmtData[rule['subject']] > rule.value.min && cmtData[rule['subject']] < rule.value.max){return false;};break;
			case '!=':if(cmtData[rule['subject']] != rule.value){return false;}break;
			case '~':if(new RegExp(rule.value).test(cmtData[rule[subject]])){return false;}break;
			case '!~':if(!(new RegExp(rule.value).test(cmtData[rule[subject]]))){return false;}break;
		}
		return true;
	};
	this.beforeSend = function(cmt){
		//Check with the rules upon size
		var cmtMode = cmt.data.mode;
		if(this.rulebook[cmtMode]!=null){
			for(var i=0;i<this.rulebook[cmtMode].length;i++){
				if(this.rulebook[cmtMode][i].subject == 'width' || this.rulebook[cmtMode][i].subject == 'height'){
					if(this.rulebook[cmtMode][i].subject == 'width'){
						switch(this.rulebook[cmtMode][i].operator){
							case '>':if(this.rulebook[cmtMode][i].value < cmt.offsetWidth)return false;break;
							case '<':if(this.rulebook[cmtMode][i].value > cmt.offsetWidth)return false;break;
							case 'range':if(this.rulebook[cmtMode][i].value.max > cmt.offsetWidth && this.rulebook[cmtMode][i].min < cmt.offsetWidth)return false;break;
							case '==':if(this.rulebook[cmtMode][i].value == cmt.offsetWidth)return false;break;
							default:break;
						}
					}else{
						switch(this.rulebook[cmtMode][i].operator){
							case '>':if(this.rulebook[cmtMode][i].value < cmt.offsetHeight)return false;break;
							case '<':if(this.rulebook[cmtMode][i].value > cmt.offsetHeight)return false;break;
							case 'range':if(this.rulebook[cmtMode][i].value.max > cmt.offsetHeight && this.rulebook[cmtMode][i].min < cmt.offsetHeight)return false;break;
							case '==':if(this.rulebook[cmtMode][i].value == cmt.offsetHeight)return false;break;
							default:break;
						}
					}
				}
			}
			return true;
		}else{return true;}
	}
	this.doValidate = function(cmtData){
		if(!this.allowTypes[cmtData.mode])
			return false;
		/** Create abstract cmt data **/
		abstCmtData = {
			text:cmtData.text,
			mode:cmtData.mode,
			color:cmtData.color,
			size:cmtData.size,
			stime:cmtData.stime,
			hash:cmtData.hash,
		}
		if(this.rulebook[cmtData.mode] != null && this.rulebook[cmtData.mode].length > 0){
			for(var i=0;i<this.rulebook[cmtData.mode];i++){
				if(!this.isMatchRule(abstCmtData,this.rulebook[cmtData.mode][i]))
					return false;
			}
		}
		for(var i=0;i<this.rulebook[cmtData.mode];i++){
			if(!this.isMatchRule(abstCmtData,this.rulebook[cmtData.mode][i]))
				return false;
		}
		return true;
	};
	this.addRule = function(rule){
		if(this.rulebook[rule.mode + ""] == null)
			this.rulebook[rule.mode + ""] = [];
		/** Normalize Operators **/
		switch(rule.operator){
			case 'eq':
			case 'equals':
			case '=':rule.operator='==';break;
			case 'ineq':rule.operator='!=';break;
			case 'regex':
			case 'matches':rule.operator='~';break;
			case 'notmatch':
			case 'iregex':rule.operator='!~';break;
		}
		this.rulebook[rule.mode].push(rule);
		return (this.rulebook[rule.mode].length - 1);
	};
	this.addModifier = function(f){
		this.modifiers.push(f);
	};
	this.runtimeFilter = function(cmt){
		if(this.runtime == null)
			return cmt;
		return this.runtime(cmt);
	};
	this.setRuntimeFilter = function(f){
		this.runtime = f;
	}
}/** 
Comment Space Allocators Classes
Licensed Under MIT License
You may create your own.
**/
function CommentSpaceAllocator(w, h){
	this.width = w;
	this.height = h;
	this.pools = [[]];
	this.pool = this.pools[0];
	this.setBounds = function(w,h){this.width = w;this.height = h;};
	this.add = function(cmt){
		if(cmt.height >= this.height){
			cmt.cindex = this.pools.indexOf(this.pool);
			cmt.set("top",0);
		}else{
			cmt.cindex = this.pools.indexOf(this.pool);
			cmt.set("top",this.setY(cmt));
		}
	};
	this.remove = function(cmt){
		var tpool = this.pools[cmt.cindex];
		tpool.remove(cmt);
	};
	this.validateCmt = function(cmt){
		cmt.getBounds();
		return cmt;
	};
	this.setY = function(cmt,index){
		if(!index)
			var index = 0;
		cmt = this.validateCmt(cmt);
		if(this.pools.length <= index){
			this.pools.push([]);
		}
		this.pool = this.pools[index];
		if(this.pool.length == 0){
			this.pool.push(cmt);	
			return 0;
		}
		else if(this.vCheck(0,cmt)){
			this.pool.binsert(cmt,function(a,b){
					if(a.bottom < b.bottom){
						return -1;
					}else if (a.bottom == b.bottom){
						return 0;
					}else{return 1;}
				});
			return cmt.y;
		}
		var y=0;
		for(var k=0;k<this.pool.length;k++){
			y = this.pool[k].bottom + 1;
			if(y + cmt.offsetHeight > this.height){
				break;
			}
			if(this.vCheck(y,cmt)){
				this.pool.binsert(cmt,function(a,b){
					if(a.bottom < b.bottom){
						return -1;
					}else if (a.bottom == b.bottom){
						return 0;
					}else{return 1;}
				});
				return cmt.y;
			}
		}
		this.setY(cmt,index+1);
	};
	this.vCheck = function(y,cmt){
		var bottom = y + cmt.height;
		var right = cmt.x + cmt.width;
		this.validateCmt(cmt);
		for(var i=0;i<this.pool.length;i++){
			this.pool[i] = this.validateCmt(this.pool[i]);
			if(this.pool[i].y > bottom || this.pool[i].bottom < y)
				continue;
			else if(this.pool[i].right < cmt.x || this.pool[i].x > right){
				if(this.getEnd(this.pool[i]) < this.getMiddle(cmt))
					continue;
				else
					return false;
			}else{
				return false;}
		}
		cmt.y = y;
		cmt.bottom = cmt.height + y;
		return true;
	};
	this.getEnd  = function(cmt){
		return cmt.data.stime + cmt.getTTL();
	};
	this.getMiddle = function(cmt){
		return cmt.data.stime + (cmt.getTTL() / 2);
	};
}
function TopCommentSpaceAllocator(w,h){
	var csa = new CommentSpaceAllocator(w,h);
	csa.add = function (cmt){
		csa.validateCmt(cmt);
		cmt.set("left", (csa.width - cmt.width)/2);
		if(cmt.height >= csa.height){
			cmt.cindex = csa.pools.indexOf(csa.pool);
			cmt.set("top", 0);
		}else{
			cmt.cindex = csa.pools.indexOf(csa.pool);
			cmt.set("top", csa.setY(cmt));
		}
	};
	csa.vCheck = function(y,cmt){
		var bottom = y + cmt.height;
		for(var i=0;i<csa.pool.length;i++){
			var c = csa.validateCmt(csa.pool[i]);
			if(c.y > bottom || c.bottom < y){
				continue;
			}else{
				return false;
			}
		}
		cmt.y = y;
		cmt.bottom = cmt.bottom + y;
		return true;
	};
	this.setBounds = function(w,h){csa.setBounds(w,h);};
	this.add = function(what){csa.add(what);};
	this.remove = function(d){csa.remove(d);};
}
function BottomCommentSpaceAllocator(w,h){
	var csa = new CommentSpaceAllocator(w,h);
	csa.add = function (cmt){
		cmt.set("top", null);
		cmt.set("bottom", 0);
		csa.validateCmt(cmt);
		cmt.set("left",(csa.width - cmt.width)/2);
		if(cmt.height >= csa.height){
			cmt.cindex = csa.pools.indexOf(csa.pool);
			cmt.set("bottom",0);
		}else{
			cmt.cindex = csa.pools.indexOf(csa.pool);
			cmt.set("bottom", csa.setY(cmt));
		}
	};
	csa.validateCmt = function(cmt){
		cmt.getBounds();
		cmt.y = csa.height - (cmt.parent.offsetTop + cmt.parent.offsetHeight);
		cmt.bottom = cmt.y + cmt.offsetHeight;
		cmt.x = cmt.offsetLeft;
		cmt.right = cmt.offsetLeft + cmt.offsetWidth;
		cmt.height = cmt.offsetHeight;
		cmt.width = cmt.offsetWidth;
		cmt.top = cmt.y;
		cmt.left = cmt.offsetLeft;
		return cmt;
	};
	csa.vCheck = function(y,cmt){
		var bottom = y + cmt.height;
		for(var i=0;i<csa.pool.length;i++){
			var c = csa.validateCmt(csa.pool[i]);
			if(c.y > bottom || c.bottom < y){
				continue;
			}else{
				return false;
			}
		}
		cmt.y = y;
		cmt.bottom = cmt.bottom + y;
		return true;
	};
	this.setBounds = function(w,h){csa.setBounds(w,h);};
	this.add = function(what){csa.add(what);};
	this.remove = function(d){csa.remove(d);};
}
function ReverseCommentSpaceAllocator(w,h){
	var csa= new CommentSpaceAllocator(w,h);
	csa.vCheck = function(y,cmt){
		var bottom = y + cmt.height;
		var right = cmt.x + cmt.width;
		this.validateCmt(cmt);
		for(var i=0;i<this.pool.length;i++){
			var c = this.validateCmt(this.pool[i]);
			if(c.y > bottom || c.bottom < y)
				continue;
			else if(c.x > right || c.right < cmt.x){
				if(this.getEnd(c) < this.getMiddle(cmt))
					continue;
				else
					return false;
			}else{
				return false;}
		}
		cmt.y = y;
		cmt.bottom = cmt.height + y;
		return true;
	}
	this.setBounds = function(w,h){csa.setBounds(w,h);};
	this.add = function(what){csa.add(what);};
	this.remove = function(d){csa.remove(d);};
}
function BottomScrollCommentSpaceAllocator(w,h){
	var csa = new CommentSpaceAllocator(w,h);
	csa.validateCmt = function(cmt){
		cmt.y = csa.height - (cmt.offsetTop + cmt.offsetHeight);
		cmt.bottom = cmt.y + cmt.offsetHeight;
		cmt.x = cmt.offsetLeft;
		cmt.right = cmt.offsetLeft + cmt.offsetWidth;
		cmt.height = cmt.offsetHeight;
		cmt.width = cmt.offsetWidth;
		cmt.top = cmt.y;
		cmt.left = cmt.offsetLeft;
		return cmt;
	};
	csa.add = function (cmt){
		cmt.style.top = "";
		cmt.style.bottom = "0px";
		csa.validateCmt(cmt);
		cmt.style.left = csa.width + "px";
		if(cmt.height >= csa.height){
			cmt.cindex = csa.pools.indexOf(csa.pool);
			cmt.style.bottom = "0px";
		}else{
			cmt.cindex = csa.pools.indexOf(csa.pool);
			cmt.style.bottom = csa.setY(cmt) + "px";
		}
	};
	this.setBounds = function(w,h){csa.setBounds(w,h);};
	this.add = function(what){csa.add(what);};
	this.remove = function(d){csa.remove(d);};
}

/******
* Comment Core For HTML5 VideoPlayers
* Author : Jim Chen
* Licensing : MIT License
******/
$ = function(a){return document.getElementById(a);};
var ABGlobal = {
	is_webkit:function(){
		try{
			if(/webkit/.test( navigator.userAgent.toLowerCase())) return true;
		}catch(e){return false;}
		return false;
	}
};
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
	if(!CCLAnim || CCLAnim.v < 0.9)
		throw "Animation Library Not Supported!"
	var lastpos = 0;
	this.stage = stageObject;
	this.def = {
		opacity:1,
		globalScale:1,
		scrollScale:1
	};
	this.timeline = [];
	this.runline = CCLAnim.createAnimateContext();
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
	/** Private **/
	this.initCommentDOM = function(domObject, data){
		domObject.className = 'cmt';
		if(ABGlobal.is_webkit() && data.mode < 7) domObject.className+=" webkit-helper";
		if(data.mode == 17){
			
		}else{
			domObject.appendChild(document.createTextNode(data.text));
			domObject.innerText = data.text;
			domObject.style.fontSize = data.size + "px";
		}
		if(data.font != null && data.font != '')
			domObject.style.fontFamily = data.font;
		if(data.shadow == false && data.shadow != null)
			domObject.className = 'cmt noshadow';
		if(data.color == "#000000")
			domObject.className += ' rshadow';
		if(data.color != null)
			domObject.style.color = data.color;
		if(this.def.opacity != 1 && data.mode == 1)
			domObject.style.opacity = this.def.opacity;
		if(data.alphaFrom != null)
			domObject.style.opacity = data.alphaFrom;
		return domObject;
	};
	
	this.initCommentMovement = function(cmtObj){
		var move = null;
		var stg = this.stage;
		var cmMgr = this;
		switch(cmtObj.data.mode){
			default:
			case 1:
			case 2:{
				//console.log(cmtObj);
				move = new CCLAnim.Translate({
					"from":{
						"x":stg.offsetWidth,
						"y":cmtObj.parent.offsetTop
					},
					"to":{
						"x":0 - cmtObj.width,
						"y":cmtObj.parent.offsetTop
					},
					"dur": cmtObj.data.dur
				}, cmtObj.parent, function(){
					stg.removeChild(cmtObj.parent);
					cmMgr.finish(cmtObj);
					cmtObj.destroy();
					
				});
			}break;
			case 4:
			case 5:{
				move = new CCLAnim.Animation();
				if(cmtObj.data.dur){
					move.dur = cmtObj.data.dur;
					move.ttl = cmtObj.data.dur;
				}
				move.addEventListener("end", function(){
					stg.removeChild(cmtObj.parent);
					cmMgr.finish(cmtObj);
					cmtObj.destroy();
				});
			}break;
		}
		if(move == null){
			console.log("Create Motion Failed");
			return null;
		}
		cmtObj.motion = move;
		cmtObj.setMotion(move);
		return cmtObj;
	};
	
	this.startTimer = function(){
		this.runline.start();
	};
	this.stopTimer = function(){
		this.runline.pause();
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
	//this.runline.clear();
};
CommentManager.prototype.setBounds = function(){
	for(var comAlloc in this.csa){
		this.csa[comAlloc].setBounds(this.stage.offsetWidth,this.stage.offsetHeight);
	}
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
	}else this.lastPos = time;
	for(;this.position < this.timeline.length;this.position++){
		if(this.validate(this.timeline[this.position]) && this.timeline[this.position]['stime']<=time) this.sendComment(this.timeline[this.position]);
		else break;
	}
};
CommentManager.prototype.rescale = function(){
	return;
	for(var i = 0; i < this.runline.length; i++){
		this.runline[i].dur = Math.round(this.runline[i].dur * this.def.globalScale);
		this.runline[i].ttl = Math.round(this.runline[i].ttl * this.def.globalScale);
	}
};
CommentManager.prototype.sendComment = function(data){
	// Setup the comment abstract representation
	var dom = document.createElement('div');
	var cmt = new CCLComment(data, null, dom);
	// Initialize it in the dom
	this.initCommentDOM(dom, data);
	
	this.stage.appendChild(cmt.parent);
	
	cmt.getBounds();
	// Fix the comment size
	cmt.parent.style.width = (cmt.width + 1) + "px";
	cmt.parent.style.height = (cmt.height - 3) + "px";
	cmt.parent.style.left = this.stage.offsetWidth + "px";
	
	
	
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
			return;
			cmt.style.top = data.y + "px";
			cmt.style.left = data.x + "px";
			cmt.ttl = Math.round(data.duration * this.def.globalScale);
			cmt.dur = Math.round(data.duration * this.def.globalScale);
			if(data.rY!=0 || data.rZ!=0){
				/** TODO: revise when browser manufacturers make up their mind on Transform APIs **/
				cmt.style.transformOrigin = "0% 0%";
				cmt.style.webkitTransformOrigin = "0% 0%";
				cmt.style.OTransformOrigin = "0% 0%";
				cmt.style.MozTransformOrigin = "0% 0%";
				cmt.style.MSTransformOrigin = "0% 0%";
				cmt.style.transform = "rotateY(" + (data.rY > 180 && data.rY < 270?(0-data.rY):data.rY) + "deg) rotateZ(" + (data.rZ > 180 && data.rZ < 270?(0-data.rZ):data.rZ) + "deg)";
				cmt.style.webkitTransform = "rotateY(" + (data.rY > 180 && data.rY < 270?(0-data.rY):data.rY) + "deg) rotateZ(" + (data.rZ > 180 && data.rZ < 270?(0-data.rZ):data.rZ) + "deg)";
				cmt.style.OTransform = "rotateY(" + (data.rY > 180 && data.rY < 270?(0-data.rY):data.rY)  + "deg) rotateZ(" + (data.rZ > 180 && data.rZ < 270?(0-data.rZ):data.rZ) + "deg)";
				cmt.style.MozTransform = "rotateY(" + (data.rY > 180 && data.rY < 270?(0-data.rY):data.rY)  + "deg) rotateZ(" + (data.rZ > 180 && data.rZ < 270?(0-data.rZ):data.rZ) + "deg)";
				cmt.style.MSTransform = "rotateY(" + (data.rY > 180 && data.rY < 270?(0-data.rY):data.rY)  + "deg) rotateZ(" + (data.rZ > 180 && data.rZ < 270?(0-data.rZ):data.rZ) + "deg)";
			}
		}break;
	}
	if(data.border) cmt.style.border = "1px solid #00ffff";
	// Make ght movement
	this.initCommentMovement(cmt);
	this.runline.add(cmt.motion);
};
CommentManager.prototype.finish = function(cmt){
	console.log("Finished " + cmt.data.text);
	switch(cmt.data.mode){
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
	for(var i=0;i<cmObj.runline.length;i++){
		var cmt = cmObj.runline[i];
		cmt.ttl -= timePassed;
		if(cmt.mode == 1 || cmt.mode == 2) cmt.style.left = (cmt.ttl / cmt.dur) * (cmObj.stage.offsetWidth + cmt.offsetWidth) - cmt.offsetWidth + "px";
		else if(cmt.mode == 6) cmt.style.left = (1 - cmt.ttl / cmt.dur) * (cmObj.stage.offsetWidth + cmt.offsetWidth) - cmt.offsetWidth + "px";
		else if(cmt.mode == 4 || cmt.mode == 5 || cmt.mode >= 7){
			if(cmt.dur == null)
				cmt.dur = 4000;
			if(cmt.data.alphaFrom != null && cmt.data.alphaTo != null){
				cmt.style.opacity = (cmt.data.alphaFrom - cmt.data.alphaTo) * (cmt.ttl/cmt.dur) + cmt.data.alphaTo;
			}
			if(cmt.mode == 7 && cmt.data.movable){
				cmt.style.top = ((cmt.data.toY - cmt.data.y) * (Math.min(Math.max(cmt.dur - cmt.data.moveDelay - cmt.ttl,0),cmt.data.moveDuration) / cmt.data.moveDuration) + parseInt(cmt.data.y)) + "px";
				cmt.style.left = ((cmt.data.toX - cmt.data.x) * (Math.min(Math.max(cmt.dur - cmt.data.moveDelay - cmt.ttl,0),cmt.data.moveDuration) / cmt.data.moveDuration) + parseInt(cmt.data.x)) + "px";
			}
		}
		if(cmObj.filter != null){
			cmt = cmObj.filter.runtimeFilter(cmt);
		}
		if(cmt.ttl <= 0){
			cmObj.stage.removeChild(cmt);
			cmObj.finish(cmt);
		}
	}
};
