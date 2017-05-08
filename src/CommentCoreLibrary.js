/*!
 * Comment Core Library CommentManager
 * @license MIT
 * @author Jim Chen
 *
 * Copyright (c) 2014 Jim Chen
 */
var CommentManager = (function() {
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
	};

	function CommentManager(stageObject){
		var __timer = 0;
		
		this._listeners = {};
		this._lastPosition = 0;
		
		this.stage = stageObject;
		this.options = {
			global:{
				opacity:1,
				scale:1,
				className:"cmt"
			},
			scroll:{
				opacity:1,
				scale:1
			},
			limit: 0
		};
		this.timeline = [];
		this.runline = [];
		this.position = 0;
		this.limiter = 0;
		this.filter = null;
		this.csa = {
			scroll: new CommentSpaceAllocator(0,0),
			top:new AnchorCommentSpaceAllocator(0,0),
			bottom:new AnchorCommentSpaceAllocator(0,0),
			reverse:new CommentSpaceAllocator(0,0),
			scrollbtm:new CommentSpaceAllocator(0,0)
		};
		
		/** Precompute the offset width **/
		this.width = this.stage.offsetWidth;
		this.height = this.stage.offsetHeight;
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
	CommentManager.prototype.stop = function(){
		this.stopTimer();
	};

	CommentManager.prototype.start = function(){
		this.startTimer();
	};

	CommentManager.prototype.seek = function(time){
		this.position = BinArray.bsearch(this.timeline, time, function(a,b){
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
		this.dispatchEvent("load");
	};

	CommentManager.prototype.insert = function(c){
		var index = BinArray.binsert(this.timeline, c, function(a,b){
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
		if(index <= this.position){
			this.position++;
		}
		this.dispatchEvent("insert");
	};

	CommentManager.prototype.clear = function(){
		while(this.runline.length > 0){
			this.runline[0].finish();
		}
		this.dispatchEvent("clear");
	};

	CommentManager.prototype.setBounds = function(){
		this.width = this.stage.offsetWidth;
		this.height= this.stage.offsetHeight;
		this.dispatchEvent("resize");
		for(var comAlloc in this.csa){
			this.csa[comAlloc].setBounds(this.width,this.height);
		}
		// Update 3d perspective
		this.stage.style.perspective = this.width * Math.tan(40 * Math.PI/180) / 2 + "px";
		this.stage.style.webkitPerspective = this.width * Math.tan(40 * Math.PI/180) / 2 + "px";
	};
	CommentManager.prototype.init = function(){
		this.setBounds();
		if(this.filter == null) {
			this.filter = new CommentFilter(); //Only create a filter if none exist
		}
	};
	CommentManager.prototype.time = function(time){
		time = time - 1;
		if(this.position >= this.timeline.length || Math.abs(this._lastPosition - time) >= 2000){
			this.seek(time);
			this._lastPosition = time;
			if(this.timeline.length <= this.position) {
				return;
			}
		}else{
			this._lastPosition = time;
		}
		for(;this.position < this.timeline.length;this.position++){
			if(this.timeline[this.position]['stime']<=time){
				if(this.options.limit > 0 && this.runline.length > this.limiter) {
					continue; // Skip comments but still move the position pointer
				} else if(this.validate(this.timeline[this.position])){
					this.send(this.timeline[this.position]);
				}
			}else{
				break;
			}
		}
	};
	CommentManager.prototype.rescale = function(){
		
	};
	CommentManager.prototype.send = function(data){
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
		if(data.mode === 1 || data.mode === 2 || data.mode === 6){
			var cmt = new ScrollComment(this, data);
		}else{
			var cmt = new CoreComment(this, data);
		}
		switch(cmt.mode){
			case 1:cmt.align = 0;break;
			case 2:cmt.align = 2;break;
			case 4:cmt.align = 2;break;
			case 5:cmt.align = 0;break;
			case 6:cmt.align = 1;break;
		}
		cmt.init();
		this.stage.appendChild(cmt.dom);
		switch(cmt.mode){
			default:
			case 1:{this.csa.scroll.add(cmt);}break;
			case 2:{this.csa.scrollbtm.add(cmt);}break;
			case 4:{this.csa.bottom.add(cmt);}break;
			case 5:{this.csa.top.add(cmt);}break;
			case 6:{this.csa.reverse.add(cmt);}break;
			case 17:
			case 7:{
				if(data.rY !== 0 || data.rZ !== 0){
					/** TODO: revise when browser manufacturers make up their mind on Transform APIs **/
					cmt.dom.style.transform = getRotMatrix(data.rY, data.rZ);
					cmt.dom.style.webkitTransform = getRotMatrix(data.rY, data.rZ);
					cmt.dom.style.OTransform = getRotMatrix(data.rY, data.rZ);
					cmt.dom.style.MozTransform = getRotMatrix(data.rY, data.rZ);
					cmt.dom.style.MSTransform = getRotMatrix(data.rY, data.rZ);
				}
			}break;
		}
		cmt.y = cmt.y;
		this.dispatchEvent("enterComment", cmt);
		this.runline.push(cmt);
	};
	CommentManager.prototype.sendComment = function(data){
		console.log("CommentManager.sendComment is deprecated. Please use send instead");
		this.send(data); // Wrapper for Backwards Compatible APIs
	};
	CommentManager.prototype.finish = function(cmt){
		this.dispatchEvent("exitComment", cmt);
		this.stage.removeChild(cmt.dom);
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
	CommentManager.prototype.addEventListener = function(event, listener){
		if(typeof this._listeners[event] !== "undefined"){
			this._listeners[event].push(listener);
		}else{
			this._listeners[event] = [listener];
		}
	};
	CommentManager.prototype.dispatchEvent = function(event, data){
		if(typeof this._listeners[event] !== "undefined"){
			for(var i = 0; i < this._listeners[event].length; i++){
				try{
					this._listeners[event][i](data);
				}catch(e){
					console.err(e.stack);
				}
			}
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
	return CommentManager;
})();
