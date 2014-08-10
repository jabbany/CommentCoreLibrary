/**
 * Binary Search Stubs for JS Arrays
 * @license MIT
 * @author Jim Chen
 */
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

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CommentSpaceAllocator = (function () {
    /**
    * Constructs a space allocator
    * @param width - allocator width pixels (default 0)
    * @param height - allocator height pixels (default 0)
    */
    function CommentSpaceAllocator(width, height) {
        if (typeof width === "undefined") { width = 0; }
        if (typeof height === "undefined") { height = 0; }
        this._pools = [
            []
        ];
        /**
        * Number of pixels to avoid from last possible y-offset
        * @type {number}
        */
        this.avoid = 1;
        this._width = width;
        this._height = height;
    }
    /**
    * Logic to determine if checked comment collides with existing comment
    * We say that comments collide if the existing comment finishes later
    * than the checked comment is halfway through
    *
    * @param existing - Existing comment;
    * @param check - Checked comment
    * @returns {boolean} checked collides with exisiting
    */
    CommentSpaceAllocator.prototype.willCollide = function (existing, check) {
        return existing.stime + existing.ttl > check.stime + check.ttl / 2;
    };

    /**
    * Validates sufficient space for a "bullet path" for the comment.
    *
    * @param y - Path starting at y offset (path height is the comment height)
    * @param comment - Comment instance to test
    * @param pool - The pool to test in.
    * @returns {boolean} whether or not a valid path exists in the tested pool.
    */
    CommentSpaceAllocator.prototype.pathCheck = function (y, comment, pool) {
        var bottom = y + comment.height;
        var right = comment.right;
        for (var i = 0; i < pool.length; i++) {
            if (pool[i].y > bottom || pool[i].bottom < y) {
                continue;
            } else if (pool[i].x < comment.x || pool[i].x > right) {
                if (this.willCollide(pool[i], comment)) {
                    return false;
                } else {
                    continue;
                }
            } else {
                return false;
            }
        }
        return true;
    };

    /**
    * Finds a good y-coordinate for comment such that minimal collision happens.
    * This method will also add the comment to the allocated pool and assign a proper cindex
    *
    * @param comment - Comment
    * @param cindex - Pool index
    * @returns {number} Y offset assigned
    */
    CommentSpaceAllocator.prototype.assign = function (comment, cindex) {
        while (this._pools.length <= cindex) {
            this._pools.push([]);
        }
        var pool = this._pools[cindex];
        if (pool.length === 0) {
            pool.push(comment);
            comment.cindex = cindex;
            return 0;
        } else if (this.pathCheck(0, comment, pool)) {
            // Has a path in the current pool
            comment.cindex = cindex;
            pool.binsert(comment, function (a, b) {
                if (a.bottom < b.bottom) {
                    return -1;
                } else if (a.bottom === b.bottom) {
                    return 0;
                } else {
                    return 1;
                }
            });
            return 0;
        }
        var y = 0;
        for (var k = 0; k < pool.length; k++) {
            y = pool[k].bottom + this.avoid;
            if (y + comment.height > this._height) {
                break;
            }
            if (this.pathCheck(y, comment, pool)) {
                // Has a path in the current pool
                comment.cindex = cindex;
                pool.binsert(comment, function (a, b) {
                    if (a.bottom < b.bottom) {
                        return -1;
                    } else if (a.bottom === b.bottom) {
                        return 0;
                    } else {
                        return 1;
                    }
                });
                return y;
            }
        }

        // Assign one pool deeper
        return this.assign(comment, cindex + 1);
    };

    /**
    * Adds a comment to the space allocator. Will also assign the
    * comment's y values. Note that added comments may not be actually
    * recorded, check the cindex value.
    * @param comment
    */
    CommentSpaceAllocator.prototype.add = function (comment) {
        if (comment.height > this._height) {
            comment.cindex = -2;
            comment.y = 0;
        } else {
            comment.y = this.assign(comment, 0);
        }
    };

    /**
    * Remove the comment from the space allocator. Will silently fail
    * if the comment is not found
    * @param comment
    */
    CommentSpaceAllocator.prototype.remove = function (comment) {
        if (comment.cindex < 0) {
            return;
        }
        var index = this._pools[comment.cindex].indexOf(comment);
        if (index < 0)
            return;
        this._pools[comment.cindex].splice(index, 1);
    };

    /**
    * Set the bounds (width, height) of the allocator. Normally this
    * should be as big as the stage DOM object. But you can manually set
    * this to another smaller value too.
    *
    * @param width
    * @param height
    */
    CommentSpaceAllocator.prototype.setBounds = function (width, height) {
        this._width = width;
        this._height = height;
    };
    return CommentSpaceAllocator;
})();

var TopCommentSpaceAllocator = (function (_super) {
    __extends(TopCommentSpaceAllocator, _super);
    function TopCommentSpaceAllocator() {
        _super.apply(this, arguments);
    }
    TopCommentSpaceAllocator.prototype.add = function (comment) {
        _super.prototype.add.call(this, comment);
        comment.x = (this._width - comment.width) / 2;
    };

    TopCommentSpaceAllocator.prototype.willCollide = function (a, b) {
        return true;
    };

    TopCommentSpaceAllocator.prototype.pathCheck = function (y, comment, pool) {
        var bottom = comment.bottom;
        for (var i = 0; i < pool.length; i++) {
            if (pool[i].y > bottom || pool[i].bottom < y) {
                continue;
            } else {
                return false;
            }
        }
        return true;
    };
    return TopCommentSpaceAllocator;
})(CommentSpaceAllocator);

var BottomCommentSpaceAllocator = (function (_super) {
    __extends(BottomCommentSpaceAllocator, _super);
    function BottomCommentSpaceAllocator() {
        _super.apply(this, arguments);
    }
    BottomCommentSpaceAllocator.prototype.add = function (comment) {
        comment.align = 2;
        comment.invalidate();
        _super.prototype.add.call(this, comment);
        comment.x = (this._width - comment.width) / 2;
    };
    return BottomCommentSpaceAllocator;
})(TopCommentSpaceAllocator);

var ReverseCommentSpaceAllocator = (function (_super) {
    __extends(ReverseCommentSpaceAllocator, _super);
    function ReverseCommentSpaceAllocator() {
        _super.apply(this, arguments);
    }
    ReverseCommentSpaceAllocator.prototype.add = function (comment) {
        comment.align = 1;
        comment.invalidate();
        _super.prototype.add.call(this, comment);
    };
    return ReverseCommentSpaceAllocator;
})(CommentSpaceAllocator);

var BottomScrollCommentSpaceAllocator = (function (_super) {
    __extends(BottomScrollCommentSpaceAllocator, _super);
    function BottomScrollCommentSpaceAllocator() {
        _super.apply(this, arguments);
    }
    BottomScrollCommentSpaceAllocator.prototype.add = function (comment) {
        comment.align = 1;
        comment.invalidate();
        _super.prototype.add.call(this, comment);
    };
    return BottomScrollCommentSpaceAllocator;
})(CommentSpaceAllocator);

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CoreComment = (function () {
    function CoreComment(parent, init) {
        if (typeof init === "undefined") { init = {}; }
        this.mode = 1;
        this.stime = 0;
        this.text = "";
        this.ttl = 4000;
        this.dur = 4000;
        this.cindex = -1;
        this.motion = [];
        this.movable = true;
        /**
        * Alignment
        * @type {number} 0=tl, 2=bl, 1=tr, 3=br
        */
        this.align = 0;
        this._size = 25;
        this._color = 0xffffff;
        this._border = false;
        this._alpha = 1;
        this._shadow = true;
        this._font = "";
        if (!parent) {
            throw new Error("Comment not bound to comment manager.");
        } else {
            this.parent = parent;
        }
        if (init.hasOwnProperty("mode")) {
            this.mode = parseInt(init["mode"], 10);
        } else {
            this.mode = 1;
        }
        if (init.hasOwnProperty("dur")) {
            this.dur = parseInt(init["dur"], 10);
            this.ttl = this.dur;
        }
        this.dur *= this.parent.options.globalScale;
        this.ttl *= this.parent.options.globalScale;
        if (init.hasOwnProperty("text")) {
            this.text = init["text"];
        }
        if (init.hasOwnProperty("motion")) {
            this._motionStart = [];
            this._motionEnd = [];
            for (var i = 0; i < init["motion"].length; i++) {
                var maxDur = 0;
                for (var k in init["motion"][i]) {
                    maxDur = Math.max(init["motion"][i][k].dur, maxDur);
                }
            }
        }
        if (init.hasOwnProperty("color")) {
            this._color = init["color"];
        }
        if (init.hasOwnProperty("size")) {
            this._size = init["size"];
        }
        if (init.hasOwnProperty("border")) {
            this._border = init["border"];
        }
        if (init.hasOwnProperty("opacity")) {
            this._alpha = init["opacity"];
        }
        if (init.hasOwnProperty("font")) {
            this._font = init["font"];
        }
    }
    /**
    * Initializes the DOM element (or canvas) backing the comment
    * This method takes the place of 'initCmt' in the old CCL
    */
    CoreComment.prototype.init = function (recycle) {
        if (typeof recycle === "undefined") { recycle = null; }
        if (recycle !== null) {
            this.dom = recycle.dom;
        } else {
            this.dom = document.createElement("div");
        }
        this.dom.className = "cmt";
        this.dom.appendChild(document.createTextNode(this.text));
        this.dom.textContent = this.text;
        this.dom.innerText = this.text;
        this.size = this._size;
        if (this._color != 0xffffff) {
            this.color = this._color;
        }
        this.shadow = this._shadow;
        if (this._font !== "") {
            this.font = this._font;
        }
    };

    Object.defineProperty(CoreComment.prototype, "x", {
        get: function () {
            if (this._x === null || this._x === undefined) {
                if (this.align % 2 === 0) {
                    this._x = this.dom.offsetLeft;
                } else {
                    this._x = this.parent.width - this.dom.offsetLeft - this.width;
                }
            }
            return this._x;
        },
        set: function (x) {
            this._x = x;
            if (this.align % 2 === 0) {
                this.dom.style.left = this._x + "px";
            } else {
                this.dom.style.right = this._x + "px";
            }
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(CoreComment.prototype, "y", {
        get: function () {
            if (this._y === null || this._y === undefined) {
                if (this.align < 2) {
                    this._y = this.dom.offsetTop;
                } else {
                    this._y = this.parent.height - this.dom.offsetTop - this.height;
                }
            }
            return this._y;
        },
        set: function (y) {
            this._y = y;
            if (this.align < 2) {
                this.dom.style.top = this._y + "px";
            } else {
                this.dom.style.bottom = this._y + "px";
            }
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(CoreComment.prototype, "bottom", {
        get: function () {
            return this.y + this.height;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(CoreComment.prototype, "right", {
        get: function () {
            return this.x + this.width;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(CoreComment.prototype, "width", {
        get: function () {
            if (this._width === null || this._width === undefined) {
                this._width = this.dom.offsetWidth;
            }
            return this._width;
        },
        set: function (w) {
            this._width = w;
            this.dom.style.width = this._width + "px";
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(CoreComment.prototype, "height", {
        get: function () {
            if (this._height === null || this._height === undefined) {
                this._height = this.dom.offsetHeight;
            }
            return this._height;
        },
        set: function (h) {
            this._height = h;
            this.dom.style.height = this._height + "px";
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(CoreComment.prototype, "size", {
        get: function () {
            return this._size;
        },
        set: function (s) {
            this._size = s;
            this.dom.style.fontSize = this._size + "px";
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(CoreComment.prototype, "color", {
        get: function () {
            return this._color;
        },
        set: function (c) {
            this._color = c;
            var color = c.toString(16);
            color = color.length >= 6 ? color : new Array(6 - color.length + 1).join("0") + color;
            this.dom.style.color = "#" + color;
            if (this._color === 0) {
                this.dom.className = "cmt rshadow";
            }
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(CoreComment.prototype, "alpha", {
        get: function () {
            return this._alpha;
        },
        set: function (a) {
            this._alpha = a;
            this.dom.style.opacity = Math.min(this._alpha, this.parent.options.opacity) + "";
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(CoreComment.prototype, "border", {
        get: function () {
            return this._border;
        },
        set: function (b) {
            this._border = b;
            if (this._border) {
                this.dom.style.border = "1px solid #00ffff";
            } else {
                this.dom.style.border = "none";
            }
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(CoreComment.prototype, "shadow", {
        get: function () {
            return this._shadow;
        },
        set: function (s) {
            this._shadow = s;
            if (!this._shadow) {
                this.dom.className = "cmt noshadow";
            }
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(CoreComment.prototype, "font", {
        get: function () {
            return this._font;
        },
        set: function (f) {
            this._font = f;
            if (this._font.length > 0) {
                this.dom.style.fontFamily = this._font;
            } else {
                this.dom.style.fontFamily = "";
            }
        },
        enumerable: true,
        configurable: true
    });











    /**
    * Moves the comment by a number of milliseconds. When
    * the given parameter is greater than 0 the comment moves
    * forward. Otherwise it moves backwards.
    * @param time - elapsed time in ms
    */
    CoreComment.prototype.time = function (time) {
        this.ttl -= time;
        if (this.movable) {
            this.update();
        }
        if (this.ttl <= 0) {
            this.finish();
        }
    };

    /**
    * Update the comment's position depending on its mode and
    * the current ttl/dur values.
    */
    CoreComment.prototype.update = function () {
        this.animate();
    };

    /**
    * Invalidate the comment position.
    */
    CoreComment.prototype.invalidate = function () {
        this._x = null;
        this._y = null;
    };

    /**
    * Update the comment's position depending on the applied motion
    * groups.
    */
    CoreComment.prototype.animate = function () {
        for (var i = 0; i < this.motion.length; i++) {
        }
    };

    /**
    * Remove the comment and do some cleanup.
    */
    CoreComment.prototype.finish = function () {
        this.dom.parentElement.removeChild(this.dom);
        this.parent.finish(this);
    };
    return CoreComment;
})();

var ScrollComment = (function (_super) {
    __extends(ScrollComment, _super);
    function ScrollComment(parent, data) {
        _super.call(this, parent, data);
        this.dur *= this.parent.options.scrollScale;
        this.ttl *= this.parent.options.scrollScale;
    }
    ScrollComment.prototype.init = function (recycle) {
        if (typeof recycle === "undefined") { recycle = null; }
        _super.prototype.init.call(this, recycle);
        this.x = this.parent.width;
    };

    ScrollComment.prototype.update = function () {
        this.x = (this.ttl / this.dur) * (this.parent.width + this.width) - this.width;
    };
    return ScrollComment;
})(CoreComment);

/** 
 * Comment Filters Module Simplified (only supports modifiers & types)
 * @license MIT
 * @author Jim Chen
 */
function CommentFilter(){
	this.modifiers = [];
	this.runtime = null;
	this.allowTypes = {
		"1":true,
		"4":true,
		"5":true,
		"6":true,
		"7":true,
		"8":true,
		"17":true
	};
	this.doModify = function(cmt){
		for(var k=0;k<this.modifiers.length;k++){
			cmt = this.modifiers[k](cmt);
		}
		return cmt;
	};
	this.beforeSend = function(cmt){
		return cmt;
	}
	this.doValidate = function(cmtData){
		if(!this.allowTypes[cmtData.mode])
			return false;
		return true;
	};
	this.addRule = function(rule){
		
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
}

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

/** 
AcFun Format
Licensed Under MIT License
 An alternative format comment parser
**/
function AcfunParser(jsond){
	function fillRGB(string){
		while(string.length < 6){
			string = "0" + string;
		}
		return string;
	}
	var list = [];
	try{
		var jsondt = JSON.parse(jsond);
	}catch(e){
		console.log('Error: Could not parse json list!');
		return [];
	}
	for(var i=0;i<jsondt.length;i++){
		//Read each comment and generate a correct comment object
		var data = {};
		var xc = jsondt[i]['c'].split(',');
		if(xc.length > 0){
			data.stime = parseFloat(xc[0]) * 1000;
			data.color = '#' + fillRGB(parseInt(xc[1]).toString(16));
			data.mode = parseInt(xc[2]);
			data.size = parseInt(xc[3]);
			data.hash = xc[4];
			data.date = parseInt(xc[5]);
			data.position = "relative";
			if(data.mode != 7){
				data.text = jsondt[i].m.replace(/(\/n|\\n|\n|\r\n|\\r)/g,"\n");
				data.text = data.text.replace(/\r/g,"\n");
				data.text = data.text.replace(/\s/g,"\u00a0");
			}else{
				data.text = jsondt[i].m;
			}
			if(data.mode == 7){
				//High level positioned dm
				try{
					var x = JSON.parse(data.text);
				}catch(e){
					console.log('[Err] Error parsing internal data for comment');
					console.log('[Dbg] ' + data.text);
					continue;
				}
				data.text = x.n; /*.replace(/\r/g,"\n");*/
				data.text = data.text.replace(/\ /g,"\u00a0");
				console.log(data.text);
				if(x.p != null){
					data.x = x.p.x / 1000; // relative position
					data.y = x.p.y / 1000;
				}else{
					data.x = 0;
					data.y = 0;
				}
				data.shadow = x.b;
				data.duration = 4000;
				if(x.l != null)
					data.moveDelay = x.l * 1000;
				if(x.z != null && x.z.length > 0){
					data.movable = true;
					data.toX = x.z[0].x / 1000;
					data.toY = x.z[0].y / 1000;
					data.alphaTo = x.z[0].t;
					data.colorTo = x.z[0].c;
					data.moveDuration = x.z[0].l != null ? (x.z[0].l * 1000) : 500;
					data.duration = data.moveDelay + data.moveDuration;
				}
				if(x.r != null && x.k != null){
					data.rX = x.r;
					data.rY = x.k;
				}
				if(x.a){
					data.alphaFrom = x.a;
				}
			}
			list.push(data);
		}
	}
	return list;
}

/** 
Bilibili Format
Licensed Under MIT License
 Takes in an XMLDoc/LooseXMLDoc and parses that into a Generic Comment List
**/
function BilibiliParser(xmlDoc, text, warn){	
	//Format the bili output to be json-valid
	function format(string){
		return string.replace(/\t/,"\\t");	
	}
	if(xmlDoc !== null){
        var elems = xmlDoc.getElementsByTagName('d');
    }else{
    	if(warn){
    		if(!confirm("XML Parse Error. \n Allow tag soup parsing?\n[WARNING: This is unsafe.]")){
    			return [];
    		}
    	}else{
    		// clobber some potentially bad things
        	text = text.replace(new RegExp("</([^d])","g"), "</disabled $1");
        	text = text.replace(new RegExp("</(\S{2,})","g"), "</disabled $1");
        	text = text.replace(new RegExp("<([^d/]\W*?)","g"), "<disabled $1");
        	text = text.replace(new RegExp("<([^/ ]{2,}\W*?)","g"), "<disabled $1");
        	console.log(text);
    	}
        var tmp = document.createElement("div");
        tmp.innerHTML = text;
        console.log(tmp);
        var elems = tmp.getElementsByTagName('d');
    }
	var tlist = [];
	for(var i=0;i<elems.length;i++){
		if(elems[i].getAttribute('p') != null){
			var opt = elems[i].getAttribute('p').split(',');
			if(!elems[i].childNodes[0])
			  continue;
			var text = elems[i].childNodes[0].nodeValue;
			var obj = {};
			obj.stime = Math.round(parseFloat(opt[0]*1000));
			obj.size = parseInt(opt[2]);
			obj.color = parseInt(opt[3]);
			obj.mode = parseInt(opt[1]);
			obj.date = parseInt(opt[4]);
			obj.pool = parseInt(opt[5]);
			obj.position = "absolute";
			if(opt[7] != null)
				obj.dbid = parseInt(opt[7]);
			obj.hash = opt[6];
			obj.border = false;
			if(obj.mode < 7){
				obj.text = text.replace(/(\/n|\\n|\n|\r\n)/g, "\n");
			}else{
				if(obj.mode == 7){
					try{
						adv = JSON.parse(format(text));
						obj.shadow = true;
						obj.x = parseInt(adv[0]);
						obj.y = parseInt(adv[1]);
						obj.text = adv[4].replace(/(\/n|\\n|\n|\r\n)/g, "\n");
						obj.rZ = 0;
						obj.rY = 0;
						if(adv.length >= 7){
							obj.rZ = parseInt(adv[5]);
							obj.rY = parseInt(adv[6]);
						}
						obj.movable = false;
						if(adv.length >= 11){
							obj.movable = true;
							obj.toX = adv[7];
							obj.toY = adv[8];
							obj.moveDuration = 500;
							obj.moveDelay = 0;
							if(adv[9]!='')
								obj.moveDuration = adv[9];
							if(adv[10]!="")
								obj.moveDelay = adv[10];
							if(adv.length > 11){
								obj.shadow = adv[11];
								if(obj.shadow === "true"){
									obj.shadow = true;
								}
								if(obj.shadow === "false"){
									obj.shadow = false;
								}
								if(adv[12]!=null)
									obj.font = adv[12];
							}
						}
						obj.duration = 2500;
						if(adv[3] < 12){
							obj.duration = adv[3] * 1000;
						}
						obj.alphaFrom = 1;
						obj.alphaTo = 1;
						var tmp = adv[2].split('-');
						if(tmp != null && tmp.length>1){
							obj.alphaFrom = parseFloat(tmp[0]);
							obj.alphaTo = parseFloat(tmp[1]);
						}
					}catch(e){
						console.log('[Err] Error occurred in JSON parsing');
						console.log('[Dbg] ' + text);
					}
				}else if(obj.mode == 8){
					obj.code = text; //Code comments are special
				}
			}
			//Before we push
			if(obj.text != null)
				obj.text = obj.text.replace(/\u25a0/g,"\u2588");
			tlist.push(obj);
		}
	}
	return tlist;
}
