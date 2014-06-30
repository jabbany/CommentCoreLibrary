/******
* Comment Canvas Core For HTML5 VideoPlayers
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
function CommentCore(stage){
	function Comment(data){
		this.position = {x:0,y:0};
		this.width = 0;
		this.height = 0;
		this.parent = null;
		this.ttl = 4000;
		this.dur = 4000;
		this.data = data;
		this.canvas = document.createElement('canvas');
		var context = this.canvas.getContext('2d');
		context.font = "bold " + data.size + "px " + data.font;
		context.fillStyle = data.color;
		context.strokeStyle = "#000000";
		context.globalAlpha = data.alpha;
		context.textBaseline = "top";
		this.width = context.measureText(data.text).width;
		//Measure the height
		this.height = data.size;
		context.strokeText(data.text,0,0);
		context.fillText(data.text,0,0);
	};
	Comment.prototype.draw = function(){
		var ctx = this.parent.getContext("2d");
		if((this.data.mode == 4 || this.data.mode == 5 || this.data.mode == 7) && this.data.alphaFrom != null && this.data.alphaTo != null){
			ctx.globalAlpha = (this.data.alphaFrom - this.data.alphaTo) * (this.ttl/this.dur) + this.data.alphaTo;
		}
		//Border problem
		if(this.data.border == true){
			ctx.strokeStyle="#00ffff";
			ctx.strokeRect(this.position.x,this.position.y,this.width,this.height);
			ctx.strokeRect(this.position.x-0.5,this.position.y-0.5,this.width+1,this.height+1);
			ctx.strokeStyle="#000000";
		}
		ctx.drawImage(this.canvas,this.position.x,this.position.y);
		ctx.globalAlpha = 1;//Reset
	};
	//End comment Definition
	
	function TimeKeeper(tick){
		var _timer = 0;
		var _lastTick = 0;
		this.interval = tick;
		this.isRunning = false;
		this.refobj = null;//Reference Object
		this.onTick = function(){
			var elapsed = new Date().getTime() - _lastTick;
			_lastTick = new Date().getTime();
			if(this.onTimer != null)
				this.onTimer(elapsed,this.refobj);
		};
		this.start = function(){
			if(this.isRunning)
				return;
			_lastTick = new Date().getTime();
			var _self = this;
			_timer = window.setInterval(function(){_self.onTick();},this.interval);
			this.isRunning = true;
		};
		this.stop = function(){
			window.clearInterval(_timer);
			_timer = 0;
			this.isRunning = false;
		}
	}
	//End TimeKeeper
	
	function CommentManager(stage){
		this.stage = stage;
		this.scaleFactor = 1;
		this.time = new TimeKeeper(10);
		this.timeline = [];//Timeline is filled with Pre-Rendered Comment Data
		this.runline = [];
		this.position = 0;
		this.filter = null;
		this.csa = {
			scroll: new CommentSpaceAllocator(0,0),
			top:new TopCommentSpaceAllocator(0,0),
			bottom:new BottomCommentSpaceAllocator(0,0),
			reverse:new ReverseCommentSpaceAllocator(0,0),
			scrollbtm:new BottomScrollCommentSpaceAllocator(0,0)
		};
		var cmObj = this;
		this.time.refobj = cmObj;
		this.time.onTimer = function(elapsed,ref){
			ref.render(elapsed);
		};
		//End
		this.setBounds();
	};
	CommentManager.prototype.start = function(){
		this.time.start();
	};
	CommentManager.prototype.stop = function(){
		this.time.stop();
	};
	CommentManager.prototype.setBounds = function(){
		for(var comAlloc in this.csa){
			this.csa[comAlloc].setBounds(this.stage.width,this.stage.height);
		}
	};
	CommentManager.prototype.render = function (timePassed){
		if(this.runline.length > 0)
			this.stage.getContext('2d').clearRect(0,0,this.stage.width,this.stage.height);//Clear
		for(var i=0;i<this.runline.length;i++){
			var cmt = this.runline[i];
			cmt.ttl -= timePassed;
			if(cmt.data.mode == 1 || cmt.data.mode == 2){
				cmt.position.x = (cmt.ttl / (cmt.dur * this.scaleFactor)) * (this.stage.width + cmt.width) - cmt.width;
			}else if(cmt.data.mode == 6){
				cmt.position.x = (1 - cmt.ttl / cmt.dur) * (this.stage.width + cmt.width) - cmt.width;
			}else if(cmt.data.mode == 7 && cmt.data.movable){
				cmt.position.y = ((cmt.data.toY - cmt.data.y) * (Math.min(Math.max(cmt.dur - cmt.data.moveDelay - cmt.ttl,0),cmt.data.moveDuration) / cmt.data.moveDuration) + parseInt(cmt.data.y));
				cmt.position.x = ((cmt.data.toX - cmt.data.x) * (Math.min(Math.max(cmt.dur - cmt.data.moveDelay - cmt.ttl,0),cmt.data.moveDuration) / cmt.data.moveDuration) + parseInt(cmt.data.x));
			}
			/*if(cmObj.filter != null){
				cmt = cmObj.filter.runtimeFilter(cmt);
			}*/
			if(cmt.ttl <= 0){
				this.runline.remove(cmt);//remove the comment
				this.finish(cmt);
			}else{
				cmt.draw();
			}
		}
	};
	CommentManager.prototype.seek = function (time){
		this.position = this.timeline.bsearch(time,function(a,b){
			if(a < b.stime) return -1
			else if(a > b.stime) return 1;
			else return 0;
		});
	};
	CommentManager.prototype.sendComment = function(data){
		var cmt = new Comment(data);
		cmt.parent = this.stage;
		switch(cmt.data.mode){
			default:
			case 1:{this.csa.scroll.add(cmt);}break;
			case 2:{this.csa.scrollbtm.add(cmt);}break;
			case 4:{this.csa.bottom.add(cmt);}break;
			case 5:{this.csa.top.add(cmt);}break;
			case 6:{this.csa.reverse.add(cmt);}break;
		}
		this.runline.push(cmt);
	};
	CommentManager.prototype.finish = function(cmt){
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
	//Do the core stuff now
	this.cm = new CommentManager(stage);
}
