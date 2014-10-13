/**
 * Binary Search Stubs for JS Arrays
 * @license MIT
 * @author Jim Chen
 */
var BinArray = (function(){
	var BinArray = {};
	BinArray.bsearch = function(arr, what, how){
		if(arr.length == 0) return 0;
		if(how(what,arr[0]) < 0) return 0;
		if(how(what,arr[arr.length - 1]) >=0) return arr.length;
		var low =0;
		var i = 0;
		var count = 0;
		var high = arr.length - 1;
		while(low<=high){
			i = Math.floor((high + low + 1)/2);
			count++;
			if(how(what,arr[i-1])>=0 && how(what,arr[i])<0){
				return i;
			}else if(how(what,arr[i-1])<0){
				high = i-1;
			}else if(how(what,arr[i])>=0){
				low = i;
			}else
				console.error('Program Error');
			if(count > 1500) console.error('Too many run cycles.');
		}
		return -1;
	};
	BinArray.binsert = function(arr, what, how){
		var index = BinArray.bsearch(arr,what,how);
		arr.splice(index,0,what);
		return index;
	};
	return BinArray;
})();

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};

var CommentSpaceAllocator = (function () {
    function CommentSpaceAllocator(width, height) {
        if (typeof width === "undefined") { width = 0; }
        if (typeof height === "undefined") { height = 0; }
        this._pools = [
            []
        ];
        this.avoid = 1;
        this._width = width;
        this._height = height;
    }
    CommentSpaceAllocator.prototype.willCollide = function (existing, check) {
        return existing.stime + existing.ttl >= check.stime + check.ttl / 2;
    };

    CommentSpaceAllocator.prototype.pathCheck = function (y, comment, pool) {
        var bottom = y + comment.height;
        var right = comment.right;
        for (var i = 0; i < pool.length; i++) {
            if (pool[i].y > bottom || pool[i].bottom < y) {
                continue;
            } else if (pool[i].right < comment.x || pool[i].x > right) {
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

    CommentSpaceAllocator.prototype.assign = function (comment, cindex) {
        while (this._pools.length <= cindex) {
            this._pools.push([]);
        }
        var pool = this._pools[cindex];
        if (pool.length === 0) {
            comment.cindex = cindex;
            return 0;
        } else if (this.pathCheck(0, comment, pool)) {
            comment.cindex = cindex;
            return 0;
        }
        var y = 0;
        for (var k = 0; k < pool.length; k++) {
            y = pool[k].bottom + this.avoid;
            if (y + comment.height > this._height) {
                break;
            }
            if (this.pathCheck(y, comment, pool)) {
                comment.cindex = cindex;
                return y;
            }
        }

        return this.assign(comment, cindex + 1);
    };

    CommentSpaceAllocator.prototype.add = function (comment) {
        if (comment.height > this._height) {
            comment.cindex = -2;
            comment.y = 0;
        } else {
            comment.y = this.assign(comment, 0);
            BinArray.binsert(this._pools[comment.cindex], comment, function (a, b) {
                if (a.bottom < b.bottom) {
                    return -1;
                } else if (a.bottom > b.bottom) {
                    return 1;
                } else {
                    return 0;
                }
            });
        }
    };

    CommentSpaceAllocator.prototype.remove = function (comment) {
        if (comment.cindex < 0) {
            return;
        }
        if (comment.cindex >= this._pools.length) {
            throw new Error("cindex out of bounds");
        }
        var index = this._pools[comment.cindex].indexOf(comment);
        if (index < 0)
            return;
        this._pools[comment.cindex].splice(index, 1);
    };

    CommentSpaceAllocator.prototype.setBounds = function (width, height) {
        this._width = width;
        this._height = height;
    };
    return CommentSpaceAllocator;
})();

var AnchorCommentSpaceAllocator = (function (_super) {
    __extends(AnchorCommentSpaceAllocator, _super);
    function AnchorCommentSpaceAllocator() {
        _super.apply(this, arguments);
    }
    AnchorCommentSpaceAllocator.prototype.add = function (comment) {
        _super.prototype.add.call(this, comment);
        comment.x = (this._width - comment.width) / 2;
    };

    AnchorCommentSpaceAllocator.prototype.willCollide = function (a, b) {
        return true;
    };

    AnchorCommentSpaceAllocator.prototype.pathCheck = function (y, comment, pool) {
        var bottom = y + comment.height;
        for (var i = 0; i < pool.length; i++) {
            if (pool[i].y > bottom || pool[i].bottom < y) {
                continue;
            } else {
                return false;
            }
        }
        return true;
    };
    return AnchorCommentSpaceAllocator;
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
        this._alphaMotion = null;
        this.absolute = true;
        this.align = 0;
        this._alpha = 1;
        this._size = 25;
        this._color = 0xffffff;
        this._border = false;
        this._shadow = true;
        this._font = "";
        if (!parent) {
            throw new Error("Comment not bound to comment manager.");
        } else {
            this.parent = parent;
        }
        if (init.hasOwnProperty("stime")) {
            this.stime = init["stime"];
        }
        if (init.hasOwnProperty("mode")) {
            this.mode = init["mode"];
        } else {
            this.mode = 1;
        }
        if (init.hasOwnProperty("dur")) {
            this.dur = init["dur"];
            this.ttl = this.dur;
        }
        this.dur *= this.parent.options.global.scale;
        this.ttl *= this.parent.options.global.scale;
        if (init.hasOwnProperty("text")) {
            this.text = init["text"];
        }
        if (init.hasOwnProperty("motion")) {
            this._motionStart = [];
            this._motionEnd = [];
            this.motion = init["motion"];
            var head = 0;
            for (var i = 0; i < init["motion"].length; i++) {
                this._motionStart.push(head);
                var maxDur = 0;
                for (var k in init["motion"][i]) {
                    var m = init["motion"][i][k];
                    maxDur = Math.max(m.dur, maxDur);
                    if (m.easing === null || m.easing === undefined) {
                        init["motion"][i][k]["easing"] = CoreComment.LINEAR;
                    }
                }
                head += maxDur;
                this._motionEnd.push(head);
            }
            this._curMotion = 0;
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
        if (init.hasOwnProperty("alpha")) {
            this._alphaMotion = init["alpha"];
        }
        if (init.hasOwnProperty("font")) {
            this._font = init["font"];
        }
        if (init.hasOwnProperty("x")) {
            this._x = init["x"];
        }
        if (init.hasOwnProperty("y")) {
            this._y = init["y"];
        }
        if (init.hasOwnProperty("shadow")) {
            this._shadow = init["shadow"];
        }
        if (init.hasOwnProperty("position")) {
            if (init["position"] === "relative") {
                this.absolute = false;
                if (this.mode < 7) {
                    console.warn("Using relative position for CSA comment.");
                }
            }
        }
    }
    CoreComment.prototype.init = function (recycle) {
        if (typeof recycle === "undefined") { recycle = null; }
        if (recycle !== null) {
            this.dom = recycle.dom;
        } else {
            this.dom = document.createElement("div");
        }
        this.dom.className = this.parent.options.global.className;
        this.dom.appendChild(document.createTextNode(this.text));
        this.dom.textContent = this.text;
        this.dom.innerText = this.text;
        this.size = this._size;
        if (this._color != 0xffffff) {
            this.color = this._color;
        }
        this.shadow = this._shadow;
        if (this._border) {
            this.border = this._border;
        }
        if (this._font !== "") {
            this.font = this._font;
        }
        if (this._x !== undefined) {
            this.x = this._x;
        }
        if (this._y !== undefined) {
            this.y = this._y;
        }
        if (this._alpha !== 1 || this.parent.options.global.opacity < 1) {
            this.alpha = this._alpha;
        }
        if (this.motion.length > 0) {
            this.animate();
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
            if (!this.absolute) {
                return this._x / this.parent.width;
            }
            return this._x;
        },
        set: function (x) {
            this._x = x;
            if (!this.absolute) {
                this._x *= this.parent.width;
            }
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
            if (!this.absolute) {
                return this._y / this.parent.height;
            }
            return this._y;
        },
        set: function (y) {
            this._y = y;
            if (!this.absolute) {
                this._y *= this.parent.height;
            }
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
                this.dom.className = this.parent.options.global.className + " rshadow";
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
            this.dom.style.opacity = Math.min(this._alpha, this.parent.options.global.opacity) + "";
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
                this.dom.className = this.parent.options.global.className + " noshadow";
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











    CoreComment.prototype.time = function (time) {
        this.ttl -= time;
        if (this.ttl < 0) {
            this.ttl = 0;
        }
        if (this.movable) {
            this.update();
        }
        if (this.ttl <= 0) {
            this.finish();
        }
    };

    CoreComment.prototype.update = function () {
        this.animate();
    };

    CoreComment.prototype.invalidate = function () {
        this._x = null;
        this._y = null;
        this._width = null;
        this._height = null;
    };

    CoreComment.prototype._execMotion = function (currentMotion, time) {
        for (var prop in currentMotion) {
            if (currentMotion.hasOwnProperty(prop)) {
                var m = currentMotion[prop];
                this[prop] = m.easing(Math.min(Math.max(time - m.delay, 0), m.dur), m.from, m.to - m.from, m.dur);
            }
        }
    };

    CoreComment.prototype.animate = function () {
        if (this._alphaMotion) {
            this.alpha = (this.dur - this.ttl) * (this._alphaMotion["to"] - this._alphaMotion["from"]) / this.dur + this._alphaMotion["from"];
        }
        if (this.motion.length === 0) {
            return;
        }
        var ttl = Math.max(this.ttl, 0);
        var time = (this.dur - ttl) - this._motionStart[this._curMotion];
        this._execMotion(this.motion[this._curMotion], time);
        if (this.dur - ttl > this._motionEnd[this._curMotion]) {
            this._curMotion++;
            if (this._curMotion >= this.motion.length) {
                this._curMotion = this.motion.length - 1;
            }
            return;
        }
    };

    CoreComment.prototype.finish = function () {
        this.parent.finish(this);
    };

    CoreComment.prototype.toString = function () {
        return ["[", this.stime, "|", this.ttl, "/", this.dur, "]", "(", this.mode, ")", this.text].join("");
    };
    CoreComment.LINEAR = function (t, b, c, d) {
        return t * c / d + b;
    };
    return CoreComment;
})();

var ScrollComment = (function (_super) {
    __extends(ScrollComment, _super);
    function ScrollComment(parent, data) {
        _super.call(this, parent, data);
        this.dur *= this.parent.options.scroll.scale;
        this.ttl *= this.parent.options.scroll.scale;
    }
    Object.defineProperty(ScrollComment.prototype, "alpha", {
        set: function (a) {
            this._alpha = a;
            this.dom.style.opacity = Math.min(Math.min(this._alpha, this.parent.options.global.opacity), this.parent.options.scroll.opacity) + "";
        },
        enumerable: true,
        configurable: true
    });

    ScrollComment.prototype.init = function (recycle) {
        if (typeof recycle === "undefined") { recycle = null; }
        _super.prototype.init.call(this, recycle);
        this.x = this.parent.width;
        if (this.parent.options.scroll.opacity < 1) {
            this.alpha = this._alpha;
        }
        this.absolute = true;
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
	this.stage = stageObject;
	this.def = {
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
	this.startTimer = function(){};
	this.stopTimer = function(){};
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
		this.stage.removeChild(this.runline[i]);
	}
	this.runline = [];
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
		if(this.limiter > 0 && this.runline.length > this.limiter) break;
		if(this.validate(this.timeline[this.position]) && this.timeline[this.position]['stime']<=time) this.sendComment(this.timeline[this.position]);
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
	var cmt = document.createElement('div');
	if(this.filter != null){
		data = this.filter.doModify(data);
		if(data == null) return;
	}
	cmt = this.initCmt(cmt,data);
	cmt.style.left = this.stage.width + "px";
	this.stage.appendChild(cmt);
	cmt.width = cmt.offsetWidth;
	cmt.height = cmt.offsetHeight;
	cmt.style.width = (cmt.w + 1) + "px";
	cmt.style.height = (cmt.h - 3) + "px";
	cmt.style.transition = "all " + cmt.dur + "ms linear 0ms";
	cmt.style.webkitTransition = "all " + cmt.dur + "ms linear 0ms";
	cmt.style.left = -cmt.width + "px";
	
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
	this.runline.push(cmt);
	var self = this;
	cmt.addEventListener("transitionend", function(){
		self.finish(cmt);
		this.runline
	});
	cmt.addEventListener("webkitTransitionEnd", function(){
		self.finish(cmt);
	});
};
CommentManager.prototype.finish = function(cmt){
	var index = this.runline.indexOf(cmt);
	if(index >= 0){
		this.runline.splice(index,1);
	}
	this.stage.removeChild(cmt);
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

/** 
AcFun Format
Licensed Under MIT License
 An alternative format comment parser
**/
function AcfunParser(jsond){
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
			data.color = parseInt(xc[1])
			data.mode = parseInt(xc[2]);
			data.size = parseInt(xc[3]);
			data.hash = xc[4];
			data.date = parseInt(xc[5]);
			data.position = "absolute";
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
				data.position = "relative";
				data.text = x.n; /*.replace(/\r/g,"\n");*/
				data.text = data.text.replace(/\ /g,"\u00a0");
				console.log(data.text);
				if(x.a != null){
					data.opacity = x.a;
				}else{
					data.opacity = 1;
				}
				if(x.p != null){
					data.x = x.p.x / 1000; // relative position
					data.y = x.p.y / 1000;
				}else{
					data.x = 0;
					data.y = 0;
				}
				data.shadow = x.b;
				data.dur = 4000;
				if(x.l != null)
					data.moveDelay = x.l * 1000;
				if(x.z != null && x.z.length > 0){
					data.movable = true;
					data.motion = [];
					var moveDuration = 0;
					var last = {x:data.x, y:data.y, alpha:data.opacity, color:data.color};
					for(var m = 0; m < x.z.length; m++){
						var dur = x.z[m].l != null ? (x.z[m].l * 1000) : 500;
						moveDuration += dur;
						var motion = {
							x:{from:last.x, to:x.z[m].x/1000, dur: dur, delay: 0},
							y:{from:last.y, to:x.z[m].y/1000, dur: dur, delay: 0}
						};
						last.x = motion.x.to;
						last.y = motion.y.to;
						if(x.z[m].t !== last.alpha){
							motion.alpha = {from:last.alpha, to:x.z[m].t, dur: dur, delay: 0};
							last.alpha = motion.alpha.to;
						}
						if(x.z[m].c != null && x.z[m].c !== last.color){
							motion.color = {from:last.color, to:x.z[m].c, dur: dur, delay: 0};
							last.color = motion.color.to;
						}
						data.motion.push(motion);
					}
					data.dur = moveDuration + (data.moveDelay ? data.moveDelay : 0);
				}
				if(x.r != null && x.k != null){
					data.rX = x.r;
					data.rY = x.k;
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
	function format(string){
		//Format the bili output to be json-valid
		return string.replace(/\t/,"\\t");	
	}
	
	if(xmlDoc !== null){
		var elems = xmlDoc.getElementsByTagName('d');
	}else{
		if(!document || !document.createElement){
			//Maybe we are in a restricted context
			return [];
		}
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
		}
		var tmp = document.createElement("div");
		tmp.innerHTML = text;
		var elems = tmp.getElementsByTagName('d');
	}
	
	var tlist = [];
	for(var i=0;i < elems.length;i++){
		if(elems[i].getAttribute('p') != null){
			var opt = elems[i].getAttribute('p').split(',');
			if(!elems[i].childNodes[0])
			  continue;
			var text = elems[i].childNodes[0].nodeValue;
			var obj = {};
			obj.stime = Math.round(parseFloat(opt[0])*1000);
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
						obj.x = parseFloat(adv[0]);
						obj.y = parseFloat(adv[1]);
						if(Math.floor(obj.x) < obj.x || Math.floor(obj.y) < obj.y){
							obj.position = "relative";
						}
						obj.text = adv[4].replace(/(\/n|\\n|\n|\r\n)/g, "\n");
						obj.rZ = 0;
						obj.rY = 0;
						if(adv.length >= 7){
							obj.rZ = parseInt(adv[5], 10);
							obj.rY = parseInt(adv[6], 10);
						}
						obj.motion = [];
						obj.movable = false;
						if(adv.length >= 11){
							obj.movable = true;
							var singleStepDur = 500;
							var motion = {
								x:{from: obj.x, to:parseFloat(adv[7]), dur:singleStepDur, delay:0},
								y:{from: obj.y, to:parseFloat(adv[8]), dur:singleStepDur, delay:0},
							};
							if(adv[9] !== ''){
								singleStepDur = parseInt(adv[9], 10);
								motion.x.dur = singleStepDur;
								motion.y.dur = singleStepDur;
							}
							if(adv[10] !== ''){
								motion.x.delay = parseInt(adv[10], 10);
								motion.y.delay = parseInt(adv[10], 10);
							}
							if(adv.length > 11){
								obj.shadow = adv[11];
								if(obj.shadow === "true"){
									obj.shadow = true;
								}
								if(obj.shadow === "false"){
									obj.shadow = false;
								}
								if(adv[12] != null){
									obj.font = adv[12];
								}
								if(adv.length > 14){
									// Support for Bilibili Advanced Paths
									if(obj.position === "relative"){
										console.log("Cannot mix relative and absolute positioning");
										obj.position = "absolute";
									}
									var path = adv[14];
									var lastPoint = {x:motion.x.from, y:motion.y.from};
									var pathMotion = [];
									var regex = new RegExp("([a-zA-Z])\\s*(\\d+)[, ](\\d+)","g");
									var counts = path.split(/[a-zA-Z]/).length - 1;
									var m = regex.exec(path);
									while(m !== null){
										switch(m[1]){
											case "M":{
												lastPoint.x = parseInt(m[2],10);
												lastPoint.y = parseInt(m[3],10);
											}break;
											case "L":{
												pathMotion.push({
													"x":{"from":lastPoint.x, "to":parseInt(m[2],10), "dur": singleStepDur / counts, "delay": 0},
													"y":{"from":lastPoint.y, "to":parseInt(m[3],10), "dur": singleStepDur / counts, "delay": 0}
												});
												lastPoint.x = parseInt(m[2],10);
												lastPoint.y = parseInt(m[3],10);
											}break;
										}
										m = regex.exec(path);
									}
									motion = null;
									obj.motion = pathMotion;
								}
							}
							if(motion !== null){
								obj.motion.push(motion);
							}
						}
						obj.dur = 2500;
						if(adv[3] < 12){
							obj.dur = adv[3] * 1000;
						}
						var tmp = adv[2].split('-');
						if(tmp != null && tmp.length>1){
							var alphaFrom = parseFloat(tmp[0]);
							var alphaTo = parseFloat(tmp[1]);
							obj.opacity = alphaFrom;
							if(alphaFrom !== alphaTo){
								obj.alpha = {from:alphaFrom, to:alphaTo}
							}
						}
					}catch(e){
						console.log('[Err] Error occurred in JSON parsing');
						console.log('[Dbg] ' + text);
					}
				}else if(obj.mode == 8){
					obj.code = text; //Code comments are special
				}
			}
			if(obj.text != null)
				obj.text = obj.text.replace(/\u25a0/g,"\u2588");
			tlist.push(obj);
		}
	}
	return tlist;
}
