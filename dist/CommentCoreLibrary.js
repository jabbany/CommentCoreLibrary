/**
 * Binary Search Stubs for JS Arrays
 * @license MIT
 * @author Jim Chen
 */
var BinArray = (function () {

    var BinArray = {};

    /**
     * Performs binary search on the array
     * Note: The array MUST ALREADY BE SORTED. Some cases will fail but we don't
     * guarantee that we can catch all cases.
     * 
     * @param arr - array to search on
     * @param what - element to search for (may not be present)
     * @param how - function comparator (a, b). Returns positive value if a > b
     * @return index of the element (or index of the element if it were in the array)
     **/
    BinArray.bsearch = function (arr, what, how) {
        if (!Array.isArray(arr)) {
            throw new Error('Bsearch can only be run on arrays');
        }
        if (arr.length === 0) {
            return 0;
        }
        if (how(what,arr[0]) < 0) {
            return 0;
        }
        if (how(what,arr[arr.length - 1]) >= 0) {
            return arr.length;
        }
        var low = 0;
        var i = 0;
        var count = 0;
        var high = arr.length - 1;
        while (low <= high) {
            i = Math.floor((high + low + 1)/2);
            count++;
            if (how(what,arr[i-1]) >= 0 && how(what,arr[i]) < 0) {
                return i;
            } else if (how(what,arr[i-1]) < 0) {
                high = i-1;
            } else if (how(what,arr[i]) >= 0) {
                low = i;
            } else {
                throw new Error('Program Error. Inconsistent comparator or unsorted array!');
            }
            if (count > 1500) {
                throw new Error('Iteration depth exceeded. Inconsistent comparator or astronomical dataset!');
            }
        }
        return -1; 
    };

    /**
     * Insert an element into its position in the array signified by bsearch
     *
     * @param arr - array to insert into
     * @param what - element to insert
     * @param how - comparator (see bsearch)
     * @return index that the element was inserted to.
     **/
    BinArray.binsert = function (arr, what, how) {
        var index = BinArray.bsearch(arr,what,how);
        arr.splice(index,0,what);
        return index;
    };

    return BinArray;
})();

/*!
 * Comment Core Library CommentManager
 * @license MIT
 * @author Jim Chen
 *
 * Copyright (c) 2014 Jim Chen
 */
var CommentManager = (function() {
    var _defaultComparator = function (a,b) {
        if (a.stime > b.stime) {
            return 2;
        } else if (a.stime < b.stime) {
            return -2;
        } else {
            if (a.date > b.date) {
                return 1;
            } else if (a.date < b.date) {
                return -1;
            } else if (a.dbid != null && b.dbid != null) {
                if (a.dbid > b.dbid) {
                    return 1;
                } else if (a.dbid < b.dbid) {
                    return -1;
                }
                return 0;
            } else {
                return 0;
            }
        }
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
            limit: 0,
            seekTrigger: 2000
        };
        this.timeline = [];
        this.runline = [];
        this.position = 0;

        this.factory = null;
        this.filter = null;
        this.csa = {
            scroll: new CommentSpaceAllocator(0,0),
            top: new AnchorCommentSpaceAllocator(0,0),
            bottom: new AnchorCommentSpaceAllocator(0,0),
            reverse: new CommentSpaceAllocator(0,0),
            scrollbtm: new CommentSpaceAllocator(0,0)
        };

        /** Precompute the offset width **/
        this.width = this.stage.offsetWidth;
        this.height = this.stage.offsetHeight;
        this._startTimer = function () {
            if (__timer > 0) {
                return;
            }
            var lastTPos = new Date().getTime();
            var cmMgr = this;
            __timer = window.setInterval(function () {
                var elapsed = new Date().getTime() - lastTPos;
                lastTPos = new Date().getTime();
                cmMgr.onTimerEvent(elapsed,cmMgr);
            },10);
        };
        this._stopTimer = function () {
            window.clearInterval(__timer);
            __timer = 0;
        };
    }

    /** Public **/
    CommentManager.prototype.stop = function(){
        this._stopTimer();
        // Send stop signal to all comments
        this.runline.forEach(function (c) { c.stop(); });
    };

    CommentManager.prototype.start = function(){
        this._startTimer();
    };

    CommentManager.prototype.seek = function(time){
        this.position = BinArray.bsearch(this.timeline, time, function(a,b){
            if (a < b.stime) {
                return -1
            } else if(a > b.stime) {
                return 1;
            } else {
                return 0;
            }
        });
    };

    CommentManager.prototype.validate = function(cmt){
        if (cmt == null) {
            return false;
        }
        return this.filter.doValidate(cmt);
    };

    CommentManager.prototype.load = function(a){
        this.timeline = a;
        this.timeline.sort(_defaultComparator);
        this.dispatchEvent("load");
    };

    CommentManager.prototype.insert = function(c){
        var index = BinArray.binsert(this.timeline, c, _defaultComparator);
        if (index <= this.position) {
            this.position++;
        }
        this.dispatchEvent("insert");
    };

    CommentManager.prototype.clear = function () {
        while (this.runline.length > 0) {
            this.runline[0].finish();
        }
        this.dispatchEvent("clear");
    };

    CommentManager.prototype.setBounds = function () {
        this.width = this.stage.offsetWidth;
        this.height= this.stage.offsetHeight;
        this.dispatchEvent("resize");
        for (var comAlloc in this.csa) {
            this.csa[comAlloc].setBounds(this.width,this.height);
        }
        // Update 3d perspective
        this.stage.style.perspective = this.width / Math.tan(55 * Math.PI/180) / 2 + "px";
        this.stage.style.webkitPerspective = this.width / Math.tan(55 * Math.PI/180) / 2 + "px";
    };

    CommentManager.prototype.init = function (renderer) {
        this.setBounds();
        if (this.filter == null) {
            this.filter = new CommentFilter(); //Only create a filter if none exist
        }
        if (this.factory == null) {
            switch (renderer) {
                case 'legacy':
                    this.factory = CommentFactory.defaultFactory();
                    break;
                default:
                case 'css':
                    this.factory = CommentFactory.defaultCssRenderFactory();
                    break;
            }
        }
    };

    CommentManager.prototype.time = function (time) {
        time = time - 1;
        if (this.position >= this.timeline.length ||
          Math.abs(this._lastPosition - time) >= this.options.seekTrigger) {

            this.seek(time);
            this._lastPosition = time;
            if (this.timeline.length <= this.position) {
                return;
            }
        } else {
            this._lastPosition = time;
        }
        for (;this.position < this.timeline.length;this.position++) {
            if (this.timeline[this.position]['stime']<=time) {
                if (this.options.limit > 0 && this.runline.length >= this.options.limit) {
                    continue; // Skip comments but still move the position pointer
                } else if (this.validate(this.timeline[this.position])) {
                    this.send(this.timeline[this.position]);
                }
            } else {
                break;
            }
        }
    };

    CommentManager.prototype.rescale = function () {
        // TODO: Implement rescaling
    };

    CommentManager.prototype.send = function (data) {
        if (data.mode === 8) {
            console.log(data);
            if (this.scripting) {
                console.log(this.scripting.eval(data.code));
            }
            return;
        }
        if (this.filter != null) {
            data = this.filter.doModify(data);
            if (data == null) {
                return;
            }
        }
        var cmt = this.factory.create(this, data);
        switch (cmt.mode) {
            default:
            case 1:
                this.csa.scroll.add(cmt);
                break;
            case 2:
                this.csa.scrollbtm.add(cmt);
                break;
            case 4:
                this.csa.bottom.add(cmt);
                break;
            case 5:
                this.csa.top.add(cmt);
                break;
            case 6:
                this.csa.reverse.add(cmt);
                break;
            case 7:
            case 17:
                /* Do NOT manage these comments! */
                break;
        }
        cmt.y = cmt.y;
        this.dispatchEvent("enterComment", cmt);
        this.runline.push(cmt);
    };

    CommentManager.prototype.finish = function (cmt) {
        this.dispatchEvent("exitComment", cmt);
        this.stage.removeChild(cmt.dom);
        var index = this.runline.indexOf(cmt);
        if (index >= 0) {
            this.runline.splice(index, 1);
        }
        switch (cmt.mode) {
            default:
            case 1: {this.csa.scroll.remove(cmt);} break;
            case 2: {this.csa.scrollbtm.remove(cmt);} break;
            case 4: {this.csa.bottom.remove(cmt);} break;
            case 5: {this.csa.top.remove(cmt);} break;
            case 6: {this.csa.reverse.remove(cmt);} break;
            case 7: break;
        }
    };

    CommentManager.prototype.addEventListener = function (event, listener) {
        if (typeof this._listeners[event] !== "undefined") {
            this._listeners[event].push(listener);
        } else {
            this._listeners[event] = [listener];
        }
    };

    CommentManager.prototype.dispatchEvent = function (event, data) {
        if (typeof this._listeners[event] !== "undefined") {
            for (var i = 0; i < this._listeners[event].length; i++) {
                try {
                    this._listeners[event][i](data);
                } catch (e) {
                    console.error(e.stack);
                }
            }
        }
    };

    /** Static Functions **/
    CommentManager.prototype.onTimerEvent = function (timePassed,cmObj) {
        for (var i= 0;i < cmObj.runline.length; i++) {
            var cmt = cmObj.runline[i];
            cmt.time(timePassed);
        }
    };

    return CommentManager;

})();

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var CoreComment = (function () {
    function CoreComment(parent, init) {
        if (init === void 0) { init = {}; }
        this.mode = 1;
        this.stime = 0;
        this.text = '';
        this.ttl = 4000;
        this.dur = 4000;
        this.cindex = -1;
        this.motion = [];
        this.movable = true;
        this._alphaMotion = null;
        this.absolute = true;
        this.align = 0;
        this.axis = 0;
        this._alpha = 1;
        this._size = 25;
        this._color = 0xffffff;
        this._border = false;
        this._shadow = true;
        this._font = '';
        this._transform = null;
        if (!parent) {
            throw new Error('Comment not bound to comment manager.');
        }
        else {
            this.parent = parent;
        }
        if (init.hasOwnProperty('stime')) {
            this.stime = init['stime'];
        }
        if (init.hasOwnProperty('mode')) {
            this.mode = init['mode'];
        }
        else {
            this.mode = 1;
        }
        if (init.hasOwnProperty('dur')) {
            this.dur = init['dur'];
            this.ttl = this.dur;
        }
        this.dur *= this.parent.options.global.scale;
        this.ttl *= this.parent.options.global.scale;
        if (init.hasOwnProperty('text')) {
            this.text = init['text'];
        }
        if (init.hasOwnProperty('motion')) {
            this._motionStart = [];
            this._motionEnd = [];
            this.motion = init['motion'];
            var head = 0;
            for (var i = 0; i < init['motion'].length; i++) {
                this._motionStart.push(head);
                var maxDur = 0;
                for (var k in init['motion'][i]) {
                    var m = init['motion'][i][k];
                    maxDur = Math.max(m.dur + m.delay, maxDur);
                    if (m.easing === null || m.easing === undefined) {
                        init['motion'][i][k]['easing'] = CoreComment.LINEAR;
                    }
                }
                head += maxDur;
                this._motionEnd.push(head);
            }
            this._curMotion = 0;
        }
        if (init.hasOwnProperty('color')) {
            this._color = init['color'];
        }
        if (init.hasOwnProperty('size')) {
            this._size = init['size'];
        }
        if (init.hasOwnProperty('border')) {
            this._border = init['border'];
        }
        if (init.hasOwnProperty('opacity')) {
            this._alpha = init['opacity'];
        }
        if (init.hasOwnProperty('alpha')) {
            this._alphaMotion = init['alpha'];
        }
        if (init.hasOwnProperty('font')) {
            this._font = init['font'];
        }
        if (init.hasOwnProperty('x')) {
            this._x = init['x'];
        }
        if (init.hasOwnProperty('y')) {
            this._y = init['y'];
        }
        if (init.hasOwnProperty('shadow')) {
            this._shadow = init['shadow'];
        }
        if (init.hasOwnProperty('align')) {
            this.align = init['align'];
        }
        if (init.hasOwnProperty('axis')) {
            this.axis = init['axis'];
        }
        if (init.hasOwnProperty('transform')) {
            this._transform = new CommentUtils.Matrix3D(init['transform']);
        }
        if (init.hasOwnProperty('position')) {
            if (init['position'] === 'relative') {
                this.absolute = false;
                if (this.mode < 7) {
                    console.warn('Using relative position for CSA comment.');
                }
            }
        }
    }
    CoreComment.prototype.init = function (recycle) {
        if (recycle === void 0) { recycle = null; }
        if (recycle !== null) {
            this.dom = recycle.dom;
        }
        else {
            this.dom = document.createElement('div');
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
        if (this._font !== '') {
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
        if (this._transform !== null && !this._transform.isIdentity()) {
            this.transform = this._transform.flatArray;
        }
        if (this.motion.length > 0) {
            this.animate();
        }
    };
    Object.defineProperty(CoreComment.prototype, "x", {
        get: function () {
            if (this._x === null || this._x === undefined) {
                if (this.axis % 2 === 0) {
                    if (this.align % 2 === 0) {
                        this._x = this.dom.offsetLeft;
                    }
                    else {
                        this._x = this.dom.offsetLeft + this.width;
                    }
                }
                else {
                    if (this.align % 2 === 0) {
                        this._x = this.parent.width - this.dom.offsetLeft;
                    }
                    else {
                        this._x = this.parent.width - this.dom.offsetLeft - this.width;
                    }
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
            if (this.axis % 2 === 0) {
                this.dom.style.left = (this._x + (this.align % 2 === 0 ? 0 : -this.width)) + 'px';
            }
            else {
                this.dom.style.right = (this._x + (this.align % 2 === 0 ? -this.width : 0)) + 'px';
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CoreComment.prototype, "y", {
        get: function () {
            if (this._y === null || this._y === undefined) {
                if (this.axis < 2) {
                    if (this.align < 2) {
                        this._y = this.dom.offsetTop;
                    }
                    else {
                        this._y = this.dom.offsetTop + this.height;
                    }
                }
                else {
                    if (this.align < 2) {
                        this._y = this.parent.height - this.dom.offsetTop;
                    }
                    else {
                        this._y = this.parent.height - this.dom.offsetTop - this.height;
                    }
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
            if (this.axis < 2) {
                this.dom.style.top = (this._y + (this.align < 2 ? 0 : -this.height)) + 'px';
            }
            else {
                this.dom.style.bottom = (this._y + (this.align < 2 ? -this.height : 0)) + 'px';
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CoreComment.prototype, "bottom", {
        get: function () {
            var sameDirection = Math.floor(this.axis / 2) === Math.floor(this.align / 2);
            return this.y + (sameDirection ? this.height : 0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CoreComment.prototype, "right", {
        get: function () {
            var sameDirection = this.axis % 2 === this.align % 2;
            return this.x + (sameDirection ? this.width : 0);
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
            this.dom.style.width = this._width + 'px';
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
            this.dom.style.height = this._height + 'px';
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
            this.dom.style.fontSize = this._size + 'px';
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
            color = color.length >= 6 ? color : new Array(6 - color.length + 1).join('0') + color;
            this.dom.style.color = '#' + color;
            if (this._color === 0) {
                this.dom.className = this.parent.options.global.className + ' rshadow';
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
            this.dom.style.opacity = Math.min(this._alpha, this.parent.options.global.opacity) + '';
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
                this.dom.style.border = '1px solid #00ffff';
            }
            else {
                this.dom.style.border = 'none';
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
                this.dom.className = this.parent.options.global.className + ' noshadow';
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
            }
            else {
                this.dom.style.fontFamily = '';
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CoreComment.prototype, "transform", {
        get: function () {
            return this._transform.flatArray;
        },
        set: function (array) {
            this._transform = new CommentUtils.Matrix3D(array);
            if (this.dom !== null) {
                this.dom.style.transform = this._transform.toCss();
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
            this.alpha = (this.dur - this.ttl) * (this._alphaMotion['to'] - this._alphaMotion['from']) / this.dur + this._alphaMotion['from'];
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
    CoreComment.prototype.stop = function () {
    };
    CoreComment.prototype.finish = function () {
        this.parent.finish(this);
    };
    CoreComment.prototype.toString = function () {
        return ['[', this.stime, '|', this.ttl, '/', this.dur, ']', '(', this.mode, ')', this.text].join('');
    };
    CoreComment.LINEAR = function (t, b, c, d) {
        return t * c / d + b;
    };
    return CoreComment;
}());
var ScrollComment = (function (_super) {
    __extends(ScrollComment, _super);
    function ScrollComment(parent, data) {
        var _this = _super.call(this, parent, data) || this;
        _this.dur *= _this.parent.options.scroll.scale;
        _this.ttl *= _this.parent.options.scroll.scale;
        return _this;
    }
    Object.defineProperty(ScrollComment.prototype, "alpha", {
        set: function (a) {
            this._alpha = a;
            this.dom.style.opacity = Math.min(Math.min(this._alpha, this.parent.options.global.opacity), this.parent.options.scroll.opacity) + '';
        },
        enumerable: true,
        configurable: true
    });
    ScrollComment.prototype.init = function (recycle) {
        if (recycle === void 0) { recycle = null; }
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
}(CoreComment));

var CommentFactory = (function () {
    function CommentFactory() {
        this._bindings = {};
    }
    CommentFactory._simpleCssScrollingInitializer = function (manager, data) {
        var cmt = new CssScrollComment(manager, data);
        switch (cmt.mode) {
            case 1: {
                cmt.align = 0;
                cmt.axis = 0;
                break;
            }
            case 2: {
                cmt.align = 2;
                cmt.axis = 2;
                break;
            }
            case 6: {
                cmt.align = 1;
                cmt.axis = 1;
                break;
            }
        }
        cmt.init();
        manager.stage.appendChild(cmt.dom);
        return cmt;
    };
    CommentFactory._simpleScrollingInitializer = function (manager, data) {
        var cmt = new ScrollComment(manager, data);
        switch (cmt.mode) {
            case 1: {
                cmt.align = 0;
                cmt.axis = 0;
                break;
            }
            case 2: {
                cmt.align = 2;
                cmt.axis = 2;
                break;
            }
            case 6: {
                cmt.align = 1;
                cmt.axis = 1;
                break;
            }
        }
        cmt.init();
        manager.stage.appendChild(cmt.dom);
        return cmt;
    };
    CommentFactory._simpleAnchoredInitializer = function (manager, data) {
        var cmt = new CoreComment(manager, data);
        switch (cmt.mode) {
            case 4: {
                cmt.align = 2;
                cmt.axis = 2;
                break;
            }
            case 5: {
                cmt.align = 0;
                cmt.axis = 0;
                break;
            }
        }
        cmt.init();
        manager.stage.appendChild(cmt.dom);
        return cmt;
    };
    ;
    CommentFactory._advancedCoreInitializer = function (manager, data) {
        var cmt = new CoreComment(manager, data);
        cmt.init();
        cmt.transform = CommentUtils.Matrix3D.createRotationMatrix(0, data['rY'], data['rZ']).flatArray;
        manager.stage.appendChild(cmt.dom);
        return cmt;
    };
    CommentFactory.defaultFactory = function () {
        var factory = new CommentFactory();
        factory.bind(1, CommentFactory._simpleScrollingInitializer);
        factory.bind(2, CommentFactory._simpleScrollingInitializer);
        factory.bind(6, CommentFactory._simpleScrollingInitializer);
        factory.bind(4, CommentFactory._simpleAnchoredInitializer);
        factory.bind(5, CommentFactory._simpleAnchoredInitializer);
        factory.bind(7, CommentFactory._advancedCoreInitializer);
        factory.bind(17, CommentFactory._advancedCoreInitializer);
        return factory;
    };
    CommentFactory.defaultCssRenderFactory = function () {
        var factory = new CommentFactory();
        factory.bind(1, CommentFactory._simpleCssScrollingInitializer);
        factory.bind(2, CommentFactory._simpleCssScrollingInitializer);
        factory.bind(6, CommentFactory._simpleCssScrollingInitializer);
        factory.bind(4, CommentFactory._simpleAnchoredInitializer);
        factory.bind(5, CommentFactory._simpleAnchoredInitializer);
        factory.bind(7, CommentFactory._advancedCoreInitializer);
        factory.bind(17, CommentFactory._advancedCoreInitializer);
        return factory;
    };
    CommentFactory.defaultCanvasRenderFactory = function () {
        throw new Error('Not implemented');
    };
    CommentFactory.defaultSvgRenderFactory = function () {
        throw new Error('Not implemented');
    };
    CommentFactory.prototype.bind = function (mode, factory) {
        this._bindings[mode] = factory;
    };
    CommentFactory.prototype.canCreate = function (comment) {
        return this._bindings.hasOwnProperty(comment['mode']);
    };
    CommentFactory.prototype.create = function (manager, comment) {
        if (comment === null || !comment.hasOwnProperty('mode')) {
            throw new Error('Comment format incorrect');
        }
        if (!this._bindings.hasOwnProperty(comment['mode'])) {
            throw new Error('No binding for comment type ' + comment['mode']);
        }
        return this._bindings[comment['mode']](manager, comment);
    };
    return CommentFactory;
}());

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var CommentSpaceAllocator = (function () {
    function CommentSpaceAllocator(width, height) {
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 0; }
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
            }
            else if (pool[i].right < comment.x || pool[i].x > right) {
                if (this.willCollide(pool[i], comment)) {
                    return false;
                }
                else {
                    continue;
                }
            }
            else {
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
        }
        else if (this.pathCheck(0, comment, pool)) {
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
        }
        else {
            comment.y = this.assign(comment, 0);
            BinArray.binsert(this._pools[comment.cindex], comment, function (a, b) {
                if (a.bottom < b.bottom) {
                    return -1;
                }
                else if (a.bottom > b.bottom) {
                    return 1;
                }
                else {
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
            throw new Error('cindex out of bounds');
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
}());
var AnchorCommentSpaceAllocator = (function (_super) {
    __extends(AnchorCommentSpaceAllocator, _super);
    function AnchorCommentSpaceAllocator() {
        return _super !== null && _super.apply(this, arguments) || this;
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
            }
            else {
                return false;
            }
        }
        return true;
    };
    return AnchorCommentSpaceAllocator;
}(CommentSpaceAllocator));

var CommentUtils;
(function (CommentUtils) {
    var Matrix3D = (function () {
        function Matrix3D(array) {
            this._internalArray = null;
            if (!Array.isArray(array)) {
                throw new Error('Not an array. Cannot construct matrix.');
            }
            if (array.length != 16) {
                throw new Error('Illegal Dimensions. Matrix3D should be 4x4 matrix.');
            }
            this._internalArray = array;
        }
        Object.defineProperty(Matrix3D.prototype, "flatArray", {
            get: function () {
                return this._internalArray.slice(0);
            },
            set: function (array) {
                throw new Error('Not permitted. Matrices are immutable.');
            },
            enumerable: true,
            configurable: true
        });
        Matrix3D.prototype.isIdentity = function () {
            return this.equals(Matrix3D.identity());
        };
        Matrix3D.prototype.dot = function (matrix) {
            var a = this._internalArray.slice(0);
            var b = matrix._internalArray.slice(0);
            var res = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 4; j++) {
                    for (var k = 0; k < 4; k++) {
                        res[i * 4 + j] += a[i * 4 + k] * b[k * 4 + j];
                    }
                }
            }
            return new Matrix3D(res);
        };
        Matrix3D.prototype.equals = function (matrix) {
            for (var i = 0; i < 16; i++) {
                if (this._internalArray[i] !== matrix._internalArray[i]) {
                    return false;
                }
            }
            return true;
        };
        Matrix3D.prototype.toCss = function () {
            var matrix = this._internalArray.slice(0);
            for (var i = 0; i < matrix.length; i++) {
                if (Math.abs(matrix[i]) < 0.000001) {
                    matrix[i] = 0;
                }
            }
            return 'matrix3d(' + matrix.join(',') + ')';
        };
        Matrix3D.identity = function () {
            return new Matrix3D([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
        };
        Matrix3D.createScaleMatrix = function (xscale, yscale, zscale) {
            return new Matrix3D([xscale, 0, 0, 0, 0, yscale, 0, 0, 0, 0, zscale, 0, 0, 0, 0, 1]);
        };
        Matrix3D.createRotationMatrix = function (xrot, yrot, zrot) {
            var DEG2RAD = Math.PI / 180;
            var yr = yrot * DEG2RAD;
            var zr = zrot * DEG2RAD;
            var COS = Math.cos;
            var SIN = Math.sin;
            var matrix = [
                COS(yr) * COS(zr), COS(yr) * SIN(zr), SIN(yr), 0,
                (-SIN(zr)), COS(zr), 0, 0,
                (-SIN(yr) * COS(zr)), (-SIN(yr) * SIN(zr)), COS(yr), 0,
                0, 0, 0, 1
            ];
            return new Matrix3D(matrix.map(function (v) { return Math.round(v * 1e10) * 1e-10; }));
        };
        return Matrix3D;
    }());
    CommentUtils.Matrix3D = Matrix3D;
})(CommentUtils || (CommentUtils = {}));

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var CssCompatLayer = (function () {
    function CssCompatLayer() {
    }
    CssCompatLayer.transform = function (dom, trans) {
        dom.style.transform = trans;
        dom.style["webkitTransform"] = trans;
        dom.style["msTransform"] = trans;
        dom.style["oTransform"] = trans;
    };
    return CssCompatLayer;
}());
var CssScrollComment = (function (_super) {
    __extends(CssScrollComment, _super);
    function CssScrollComment() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._dirtyCSS = true;
        return _this;
    }
    Object.defineProperty(CssScrollComment.prototype, "x", {
        get: function () {
            return (this.ttl / this.dur) * (this.parent.width + this.width) - this.width;
        },
        set: function (x) {
            if (this._x !== null && typeof this._x === "number") {
                var dx = x - this._x;
                this._x = x;
                CssCompatLayer.transform(this.dom, "translateX(" +
                    (this.axis % 2 === 0 ? dx : -dx) + "px)");
            }
            else {
                this._x = x;
                if (!this.absolute) {
                    this._x *= this.parent.width;
                }
                if (this.axis % 2 === 0) {
                    this.dom.style.left =
                        (this._x + (this.align % 2 === 0 ? 0 : -this.width)) + 'px';
                }
                else {
                    this.dom.style.right =
                        (this._x + (this.align % 2 === 0 ? -this.width : 0)) + 'px';
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    CssScrollComment.prototype.update = function () {
        if (this._dirtyCSS) {
            this.dom.style.transition = "transform " + this.ttl + "ms linear";
            this.x = -this.width;
            this._dirtyCSS = false;
        }
    };
    CssScrollComment.prototype.invalidate = function () {
        _super.prototype.invalidate.call(this);
        this._dirtyCSS = true;
    };
    CssScrollComment.prototype.stop = function () {
        _super.prototype.stop.call(this);
        this.dom.style.transition = '';
        this.x = this._x;
        this._x = null;
        this.x = this.x;
        this._dirtyCSS = true;
    };
    return CssScrollComment;
}(ScrollComment));

/**
 * Comment Filters Module Simplified
 * @license MIT
 * @author Jim Chen
 */
var CommentFilter = (function () {

    /**
     * Matches a rule against an input that could be the full or a subset of
     * the comment data.
     *
     * @param rule - rule object to match
     * @param cmtData - full or portion of comment data
     * @return boolean indicator of match
     */
    function _match (rule, cmtData) {
        var path = rule.subject.split('.');
        var extracted = cmtData;
        while (path.length > 0) {
            var item = path.shift();
            if (item === '') {
                continue;
            }
            if (extracted.hasOwnProperty(item)) {
                extracted = extracted[item];
            }
            if (extracted === null || typeof extracted === 'undefined') {
                extracted = null;
                break;
            }
        }
        if (extracted === null) {
            // Null precondition implies anything
            return true;
        }
        switch (rule.op) {
            case '<':
                return extracted < rule.value;
            case '>':
                return extracted > rule.value;
            case '~':
            case 'regexp':
                return (new RegExp(rule.value)).test(extracted.toString());
            case '=':
            case 'eq':
                return rule.value ===
                    ((typeof extracted === 'number') ?
                        extracted : extracted.toString());
            case '!':
            case 'not':
                return !_match(rule.value, extracted);
            case '&&':
            case 'and':
                if (Array.isArray(rule.value)) {
                    return rule.value.every(function (r) {
                        return _match(r, extracted);
                    });
                } else {
                    return false;
                }
            case '||':
            case 'or':
                if (Array.isArray(rule.value)) {
                    return rule.value.some(function (r) {
                        return _match(r, extracted);
                    });
                } else {
                    return false;
                }
            default:
                return false;
        }
    }

    /**
     * Constructor for CommentFilter
     * @constructor
     */
    function CommentFilter() {
        this.rules = [];
        this.modifiers = [];
        this.allowUnknownTypes = true;
        this.allowTypes = {
            '1': true,
            '2': true,
            '4': true,
            '5': true,
            '6': true,
            '7': true,
            '8': true,
            '17': true
        };
    }

    /**
     * Runs all modifiers against current comment
     *
     * @param cmt - comment to run modifiers on
     * @return modified comment
     */
    CommentFilter.prototype.doModify = function (cmt) {
        return this.modifiers.reduce(function (c, f) {
            return f(c);
        }, cmt);
    };

    /**
     * Executes a method defined to be executed right before the comment object
     * (built from commentData) is placed onto the runline.
     *
     * @deprecated
     * @param cmt - comment data
     * @return cmt
     */
    CommentFilter.prototype.beforeSend = function (cmt) {
        return cmt;
    };

    /**
     * Performs validation of the comment data before it is allowed to get sent
     * by applying type constraints and rules
     *
     * @param cmtData - comment data
     * @return boolean indicator of whether this commentData should be shown
     */
    CommentFilter.prototype.doValidate = function (cmtData) {
        if (!cmtData.hasOwnProperty('mode')) {
            return false;
        }
        if ((!this.allowUnknownTypes ||
                cmtData.mode.toString() in this.allowTypes) &&
            !this.allowTypes[cmtData.mode.toString()]) {
            return false;
        }
        return this.rules.every(function (rule) {
            // Decide if matched
            try {
              var matched = _match(rule, cmtData);
            } catch (e) {
              var matched = false;
            }
            return rule.mode === 'accept' ? matched : !matched;
        });
    };

    /**
     * Adds a rule for use with validation
     *
     * @param rule - object containing rule definitions
     * @throws Exception when rule mode is incorrect
     */
    CommentFilter.prototype.addRule = function (rule) {
        if (rule.mode !== 'accept' && rule.mode !== 'reject') {
            throw new Error('Rule must be of accept type or reject type.');
        }
        this.rules.push(rule);
    };

    /**
     * Removes a rule
     *
     * @param rule - the rule that was added
     * @return true if the rule was removed, false if not found
     */
    CommentFilter.prototype.removeRule = function (rule) {
        var index = this.rules.indexOf(rule);
        if (index >= 0) {
          this.rules.splice(index, 1);
          return true;
        } else {
          return false;
        }
    };

    /**
     * Adds a modifier to be used
     *
     * @param modifier - modifier function that takes in comment data and
     *                   returns modified comment data
     * @throws Exception when modifier is not a function
     */
    CommentFilter.prototype.addModifier = function (f) {
        if (typeof f !== 'function') {
            throw new Error('Modifiers need to be functions.');
        }
        this.modifiers.push(f);
    };

    return CommentFilter;
})();

/**
 * Comment Provider
 * Provides functionality to send or receive danmaku
 * @license MIT
 * @author Jim Chen
**/

var CommentProvider = (function () {

    function CommentProvider () {
        this._started = false;
        this._destroyed = false;
        this._staticSources = {};
        this._dynamicSources = {};
        this._parsers = {}
        this._targets = [];
    }

    CommentProvider.SOURCE_JSON = 'JSON';
    CommentProvider.SOURCE_XML = 'XML';
    CommentProvider.SOURCE_TEXT = 'TEXT';

    /**
     * Provider for HTTP content. This returns a promise that resolves to TEXT.
     *
     * @param {string} method - HTTP method to use
     * @param {string} url - Base URL
     * @param {string} responseType - type of response expected.
     * @param {Object} args - Arguments for query string. Note: This is only used when
     *               method is POST or PUT
     * @param {any} body - Text body content. If not provided will omit a body
     * @return {Promise} that resolves or rejects based on the success or failure
     *         of the request
     **/
    CommentProvider.BaseHttpProvider = function (method, url, responseType, args, body) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            var uri = url;
            if (args && (method === 'POST' || method === 'PUT')) {
                uri += '?';
                var argsArray = [];
                for (var key in args) {
                    if (args.hasOwnProperty(key)) {
                        argsArray.push(encodeURIComponent(key) +
                            '=' + encodeURIComponent(args[key]));
                    }
                }
                uri += argsArray.join('&');
            }

            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    resolve(this.response);
                } else {
                    reject(new Error(this.status + " " + this.statusText));
                }
            };

            xhr.onerror = function () {
                reject(new Error(this.status + " " + this.statusText));
            };

            xhr.open(method, uri);

            // Limit the response type based on input
            xhr.responseType = typeof responseType === "string" ?
                responseType : "";

            if (typeof body !== 'undefined') {
                xhr.send(body);
            } else {
                xhr.send();
            }
        });
    };

    /**
     * Provider for JSON content. This returns a promise that resolves to JSON.
     *
     * @param {string} method - HTTP method to use
     * @param {string} url - Base URL
     * @param {Object} args - Arguments for query string. Note: This is only used when
     *               method is POST or PUT
     * @param {any} body - Text body content. If not provided will omit a body
     * @return {Promise} that resolves or rejects based on the success or failure
     *         of the request
     **/
    CommentProvider.JSONProvider = function (method, url, args, body) {
        return CommentProvider.BaseHttpProvider(
            method, url, "json", args, body).then(function (response) {
            return response;
        });
    };

    /**
     * Provider for XML content. This returns a promise that resolves to Document.
     *
     * @param {string} method - HTTP method to use
     * @param {string} url - Base URL
     * @param {Object} args - Arguments for query string. Note: This is only used when
     *               method is POST or PUT
     * @param {any} body - Text body content. If not provided will omit a body
     * @return {Promise} that resolves or rejects based on the success or failure
     *         of the request
     **/
    CommentProvider.XMLProvider = function (method, url, args, body) {
        return CommentProvider.BaseHttpProvider(
            method, url, "document", args, body).then(function (response) {
            return response;
        });
    };

    /**
     * Provider for text content. This returns a promise that resolves to Text.
     *
     * @param {string} method - HTTP method to use
     * @param {string} url - Base URL
     * @param {Object} args - Arguments for query string. Note: This is only used when
     *               method is POST or PUT
     * @param {any} body - Text body content. If not provided will omit a body
     * @return {Promise} that resolves or rejects based on the success or failure
     *         of the request
     **/
    CommentProvider.TextProvider = function (method, url, args, body) {
        return CommentProvider.BaseHttpProvider(
            method, url, "text", args, body).then(function (response) {
            return response;
        });
    };

    /**
     * Attaches a static source to the corresponding type.
     * NOTE: Multiple static sources will race to determine the initial comment
     *       list so it is imperative that they all parse to the SAME content.
     *
     * @param {Provider} source - Promise that resolves to one of the supported types
     * @param {Type} type - Type that the provider resolves to
     * @return {CommentProvider} this
     **/
    CommentProvider.prototype.addStaticSource = function (source, type) {
        if (this._destroyed) {
            throw new Error(
                'Comment provider has been destroyed, ' +
                'cannot attach more sources.');
        }
        if (!(type in this._staticSources)) {
            this._staticSources[type] = [];
        }
        this._staticSources[type].push(source);
        return this;
    };

    /**
     * Attaches a dynamic source to the corresponding type
     * NOTE: Multiple dynamic sources will collectively provide comment data.
     *
     * @param {DynamicProvider} source - Listenable that resolves to one of the supported types
     * @param {Type} type - Type that the provider resolves to
     * @return {CommentProvider} this
     **/
    CommentProvider.prototype.addDynamicSource = function (source, type) {
        if (this._destroyed) {
            throw new Error(
                'Comment provider has been destroyed, ' +
                'cannot attach more sources.');
        }
        if (!(type in this._dynamicSources)) {
            this._dynamicSources[type] = [];
        }
        this._dynamicSources[type].push(source);
        return this;
    };

    /**
     * Attaches a target comment manager so that we can stream comments to it
     *
     * @param {CommentManager} commentManager - Comment Manager instance to attach to
     * @return {CommentProvider} this
     **/
    CommentProvider.prototype.addTarget = function (commentManager) {
        if (this._destroyed) {
            throw new Error(
                'Comment provider has been destroyed, '
                +'cannot attach more targets.');
        }
        if (!(commentManager instanceof CommentManager)) {
            throw new Error(
                'Expected the target to be an instance of CommentManager.');
        }
        this._targets.push(commentManager);
        return this;
    };

    /**
     * Adds a parser for an incoming data type. If multiple parsers are added,
     * parsers added later take precedence.
     *
     * @param {CommentParser} parser - Parser spec compliant parser
     * @param {Type} type - Type that the provider resolves to
     * @return {CommentProvider} this
     **/
    CommentProvider.prototype.addParser = function (parser, type) {
        if (this._destroyed) {
            throw new Error(
                'Comment provider has been destroyed, ' +
                'cannot attach more parsers.');
        }
        if (!(type in this._parsers)) {
            this._parsers[type] = [];
        }
        this._parsers[type].unshift(parser);
        return this;
    };

    CommentProvider.prototype.applyParsersOne = function (data, type) {
        return new Promise(function (resolve, reject) {
            if (!(type in this._parsers)) {
                reject(new Error('No parsers defined for "' + type + '"'));
                return;
            }
            for (var i = 0; i < this._parsers[type].length; i++) {
                var output = null;
                try {
                    output = this._parsers[type][i].parseOne(data);
                } catch (e) {
                    // TODO: log this failure
                    console.error(e);
                }
                if (output !== null) {
                    resolve(output);
                    return;
                }
            }
            reject(new Error("Ran out of parsers for they target type"));
        }.bind(this));
    };

    CommentProvider.prototype.applyParsersList = function (data, type) {
        return new Promise(function (resolve, reject) {
            if (!(type in this._parsers)) {
                reject(new Error('No parsers defined for "' + type + '"'));
                return;
            }
            for (var i = 0; i < this._parsers[type].length; i++) {
                var output = null;
                try {
                    output = this._parsers[type][i].parseMany(data);
                } catch (e) {
                    // TODO: log this failure
                    console.error(e);
                }
                if (output !== null) {
                    resolve(output);
                    return;
                }
            }
            reject(new Error("Ran out of parsers for the target type"));
        }.bind(this));
    };

    /**
     * (Re)loads static comments
     *
     * @return {Promise} that is resolved when the static sources have been
     *         loaded
     */
    CommentProvider.prototype.load = function () {
        if (this._destroyed) {
            throw new Error('Cannot load sources on a destroyed provider.');
        }
        var promises = [];
        // TODO: This race logic needs to be rethought to provide redundancy
        for (var type in this._staticSources) {
            promises.push(Promises.any(this._staticSources[type])
                .then(function (data) {
                    return this.applyParsersList(data, type);
                }.bind(this)));
        }
        if (promises.length === 0) {
            // No static loaders
            return Promise.resolve([]);
        }
        return Promises.any(promises).then(function (commentList) {
            for (var i = 0; i < this._targets.length; i++) {
                this._targets[i].load(commentList);
            }
            return Promise.resolve(commentList);
        }.bind(this));
    };

    /**
     * Commit the changes and boot up the provider
     *
     * @return {Promise} that is resolved when all the static sources are loaded
     *         and all the dynamic sources are hooked up
     **/
    CommentProvider.prototype.start = function () {
        if (this._destroyed) {
            throw new Error('Cannot start a provider that has been destroyed.');
        }
        this._started = true;
        return this.load().then(function (commentList) {
            // Bind the dynamic sources
            for (var type in this._dynamicSources) {
                this._dynamicSources[type].forEach(function (source) {
                    source.addEventListener('receive', function (data) {
                        for (var i = 0; i < this._targets.length; i++) {
                            this._targets[i].send(
                                this.applyParserOne(data, type));
                        }
                    }.bind(this));
                }.bind(this));
            }
            return Promise.resolve(commentList);
        }.bind(this));
    };

    /**
     * Send out comments to both dynamic sources and POST targets.
     *
     * @param commentData - commentData to be sent to the server. Object.
     * @param requireAll - Do we require that all servers to accept the comment
     *                     for the promise to resolve. Defaults to true. If
     *                     false, the returned promise will resolve as long as a
     *                     single target accepts.
     * @return Promise that is resolved when the server accepts or rejects the
     *         comment. Dynamic sources will decide based on their promise while
     *         POST targets are considered accepted if they return a successful
     *         HTTP response code.
     **/
    CommentProvider.prototype.send = function (commentData, requireAll) {
        throw new Error('Not implemented');
    };

    /**
     * Stop providing dynamic comments to the targets
     *
     * @return Promise that is resolved when all bindings between dynamic
     *         sources have been successfully unloaded.
     **/
    CommentProvider.prototype.destroy = function () {
        if (this._destroyed) {
            return Promise.resolve();
        }
        // TODO: implement debinding for sources
        this._destroyed = true;
        return Promise.resolve();
    };

    return CommentProvider;
})();

/**
 * Promises extra functionality
 * @license MIT
 * @author Jim Chen
 */
var Promises = (function( ) {

    var Promises = {};

    /**
     * Resolves as soon as any promise resolves in the order of the input array
     * 
     * @param arr - array of promises
     * @return promise that resolves if any one promise resolves and rejects
     *         if otherwise
     **/
    Promises.any = function (promises) {
        if (!Array.isArray(promises)) {
            // Is raw object or promise, resolve it directly
            return Promise.resolve(promises);
        }
        if (promises.length === 0) {
            // No promises to resolve so we think it failed
            return Promise.reject();
        }
        return new Promise(function (resolve, reject) {
            var hasResolved = false;
            var hasCompleted = 0;
            var errors = [];
            for (var i = 0; i < promises.length; i++) {
                promises[i].then(function (value) {
                    hasCompleted++;
                    if (!hasResolved) {
                        hasResolved = true;
                        resolve(value);
                    }
                }).catch((function (i) {
                    return function (e) {
                        hasCompleted++;
                        errors[i] = e;
                        if (hasCompleted === promises.length) {
                            // All promises have completed and we are in rejecting case
                            if (!hasResolved) {
                                reject(errors);
                            }
                        }
                    }
                })(i));
            }
        });
    };

    return Promises;
})();

/** 
 * Bilibili Format Parser
 * Takes in an XMLDoc/LooseXMLDoc and parses that into a Generic Comment List
 * @license MIT License
 **/
var BilibiliFormat = (function () {
    var BilibiliFormat = {};

    // Fix comments to be valid
    var _format = function (text) {
        return text.replace(/\t/,"\\t");
    };

    // Fix Mode7 comments when they are bad
    var _formatmode7 = function (text) {
        if (text.charAt(0) === '[') {
            switch (text.charAt(text.length - 1)) {
                case ']':
                    return text;
                case '"':
                    return text + ']';
                case ',':
                    return text.substring(0, text.length - 1) + '"]';
                default:
                    return _formatmode7(text.substring(0, text.length - 1));
            }
        } else {
            return text;
        }
    };

    // Try to escape unsafe HTML code. DO NOT trust that this handles all cases
    // Please do not allow insecure DOM parsing unless you can trust your input source.
    var _escapeUnsafe = function (text) {
        text = text.replace(new RegExp('</([^d])','g'), '</disabled $1');
        text = text.replace(new RegExp('</(\S{2,})','g'), '</disabled $1');
        text = text.replace(new RegExp('<([^d/]\W*?)','g'), '<disabled $1');
        text = text.replace(new RegExp('<([^/ ]{2,}\W*?)','g'), '<disabled $1');
        return text;
    };

    BilibiliFormat.XMLParser = function (params) {
        this._attemptFix = true;
        this._logBadComments = true;
        if (typeof params === 'object') {
            this._attemptFix = params.attemptFix === false ? false : true;
            this._logBadComments = params.logBadComments === false ? false : true;
        }
    }

    BilibiliFormat.XMLParser.prototype.parseOne = function (elem) {
        try {
            var params = elem.getAttribute('p').split(',');
        } catch (e) {
            // Probably not XML
            return null;
        }
        var text = elem.textContent;
        var comment = {};
        comment.stime = Math.round(parseFloat(params[0])*1000);
        comment.size = parseInt(params[2]);
        comment.color = parseInt(params[3]);
        comment.mode = parseInt(params[1]);
        comment.date = parseInt(params[4]);
        comment.pool = parseInt(params[5]);
        comment.position = 'absolute';
        if (params[7] != null) {
            comment.dbid = parseInt(params[7]);
        }
        comment.hash = params[6];
        comment.border = false;
        if (comment.mode < 7) {
            comment.text = text.replace(/(\/n|\\n|\n|\r\n)/g, "\n");
        } else {
            if (comment.mode === 7) {
                try {
                    if (this._attemptFix) {
                        text = _format(_formatmode7(text));
                    }
                    var extendedParams = JSON.parse(text);
                    comment.shadow = true;
                    comment.x = parseFloat(extendedParams[0]);
                    comment.y = parseFloat(extendedParams[1]);
                    if (Math.floor(comment.x) < comment.x || Math.floor(comment.y) < comment.y) {
                        comment.position = 'relative';
                    }
                    comment.text = extendedParams[4].replace(/(\/n|\\n|\n|\r\n)/g, "\n");
                    comment.rZ = 0;
                    comment.rY = 0;
                    if (extendedParams.length >= 7) {
                        comment.rZ = parseInt(extendedParams[5], 10);
                        comment.rY = parseInt(extendedParams[6], 10);
                    }
                    comment.motion = [];
                    comment.movable = false;
                    if (extendedParams.length >= 11) {
                        comment.movable = true;
                        var singleStepDur = 500;
                        var motion = {
                            'x': {
                                'from': comment.x,
                                'to': parseFloat(extendedParams[7]),
                                'dur': singleStepDur,
                                'delay': 0
                            },
                            'y': {
                                'from': comment.y,
                                'to': parseFloat(extendedParams[8]),
                                'dur': singleStepDur,
                                'delay': 0
                            }
                        };
                        if (extendedParams[9] !== '') {
                            singleStepDur = parseInt(extendedParams[9], 10);
                            motion.x.dur = singleStepDur;
                            motion.y.dur = singleStepDur;
                        }
                        if (extendedParams[10] !== '') {
                            motion.x.delay = parseInt(extendedParams[10], 10);
                            motion.y.delay = parseInt(extendedParams[10], 10);
                        }
                        if (extendedParams.length > 11) {
                            comment.shadow = (extendedParams[11] !== 'false' && extendedParams[11] !== false);
                            if (extendedParams[12] != null) {
                                comment.font = extendedParams[12];
                            }
                            if (extendedParams.length > 14) {
                                // Support for Bilibili advanced Paths
                                if (comment.position === 'relative') {
                                    if (this._logBadComments) {
                                        console.warn('Cannot mix relative and absolute positioning!');
                                    }
                                    comment.position = 'absolute';
                                }
                                var path = extendedParams[14];
                                var lastPoint = {
                                    x: motion.x.from,
                                    y: motion.y.from
                                };
                                var pathMotion = [];
                                var regex = new RegExp('([a-zA-Z])\\s*(\\d+)[, ](\\d+)','g');
                                var counts = path.split(/[a-zA-Z]/).length - 1;
                                var m = regex.exec(path);
                                while (m !== null) {
                                    switch (m[1]) {
                                        case 'M': {
                                            lastPoint.x = parseInt(m[2],10);
                                            lastPoint.y = parseInt(m[3],10);
                                        }
                                        break;
                                        case 'L': {
                                            pathMotion.push({
                                                'x': {
                                                    'from': lastPoint.x,
                                                    'to': parseInt(m[2],10),
                                                    'dur': singleStepDur / counts,
                                                    'delay': 0
                                                },
                                                'y': {
                                                    'from': lastPoint.y,
                                                    'to': parseInt(m[3],10),
                                                    'dur': singleStepDur / counts,
                                                    'delay': 0
                                                }
                                            });
                                            lastPoint.x = parseInt(m[2],10);
                                            lastPoint.y = parseInt(m[3],10);
                                        }
                                        break;
                                    }
                                    m = regex.exec(path);
                                }
                                motion = null;
                                comment.motion = pathMotion;
                           }
                       }
                       if (motion !== null) {
                           comment.motion.push(motion);
                       }
                   }
                   comment.dur = 2500;
                   if (extendedParams[3] < 12) {
                       comment.dur = extendedParams[3] * 1000;
                   }
                   var tmp = extendedParams[2].split('-');
                   if (tmp != null && tmp.length > 1) {
                       var alphaFrom = parseFloat(tmp[0]);
                       var alphaTo = parseFloat(tmp[1]);
                       comment.opacity = alphaFrom;
                       if (alphaFrom !== alphaTo) {
                            comment.alpha = {
                                'from':alphaFrom,
                                'to':alphaTo
                            };
                        }
                    }
                } catch (e) {
                    if (this._logBadComments) {
                        console.warn('Error occurred in JSON parsing. Could not parse comment.');
                        console.log('[DEBUG] ' + text);
                    }
                }
            } else if(comment.mode === 8) {
                comment.code = text; // Code comments are special. Treat them that way.
            } else {
                if (this._logBadComments) {
                    console.warn('Unknown comment type : ' + comment.mode + '. Not doing further parsing.');
                    console.log('[DEBUG] ' + text);
                }
            }
        }
        if (comment.text !== null && typeof comment.text === 'string') {
            comment.text = comment.text.replace(/\u25a0/g,"\u2588");
        }
        return comment;
    };

    BilibiliFormat.XMLParser.prototype.parseMany = function (xmldoc) {
        var elements = [];
        try {
            elements = xmldoc.getElementsByTagName('d');
        } catch (e) {
            // TODO: handle XMLDOC errors.
            return null; // Bail, I can't handle
        }
        var commentList = [];
        for (var i = 0; i < elements.length; i++) {
            var comment = this.parseOne(elements[i]);
            if (comment !== null) {
                commentList.push(comment);
            }
        }
        return commentList;
    };

    BilibiliFormat.TextParser = function (params) {
        this._allowInsecureDomParsing = true;
        this._attemptEscaping = true;
        this._canSecureNativeParse = false;
        if (typeof params === 'object') {
            this._allowInsecureDomParsing = params.allowInsecureDomParsing === false ? false : true;
            this._attemptEscaping = params.attemptEscaping === false ? false : true;
        }
        if (typeof document === 'undefined' || !document || !document.createElement) {
            // We can't rely on innerHTML anyways. Maybe we're in a restricted context (i.e. node).
            this._allowInsecureDomParsing = false;
        }
        if (typeof DOMParser !== 'undefined' && DOMParser !== null) {
            this._canSecureNativeParse = true;
        }
        if (this._allowInsecureDomParsing || this._canSecureNativeParse) {
            this._xmlParser = new BilibiliFormat.XMLParser(params);
        }
    };

    BilibiliFormat.TextParser.prototype.parseOne = function (comment) {
        // Attempt to parse a single tokenized tag
        if (this._allowInsecureDomParsing) {
            var source = comment;
            if (this._attemptEscaping) {
                source = _escapeUnsafe(source);
            }
            var temp = document.createElement('div');
            temp.innerHTML = source;
            var tags = temp.getElementsByTagName('d');
            if (tags.length !== 1) {
                return null; // Can't parse, delegate
            } else {
                return this._xmlParser.parseOne(tags[0]);
            }
        } else if (this._canSecureNativeParse) {
            var domParser = new DOMParser();
            return this._xmlParser.parseOne(
                domParser.parseFromString(comment, 'application/xml'));
        } else {
            throw new Error('Secure native js parsing not implemented yet.');
        }
    };

    BilibiliFormat.TextParser.prototype.parseMany = function (comment) {
        // Attempt to parse a comment list
        if (this._allowInsecureDomParsing) {
            var source = comment;
            if (this._attemptEscaping) {
                source = _escapeUnsafe(source);
            }
            var temp = document.createElement('div');
            temp.innerHTML = source;
            return this._xmlParser.parseMany(temp);
        } else if (this._canSecureNativeParse) {
            var domParser = new DOMParser();
            return this._xmlParser.parseMany(
                domParser.parseFromString(comment, 'application/xml'));
        } else {
            throw new Error('Secure native js parsing not implemented yet.');
        }
    };

    return BilibiliFormat;
})();

/**
 * AcFun Format Parser
 * Takes in JSON and parses it based on current documentation for AcFun comments
 * @license MIT License
 **/
var AcfunFormat = (function () {
    var AcfunFormat = {};

    AcfunFormat.JSONParser = function (params) {
        this._logBadComments = true;
        this._logNotImplemented = false;
        if (typeof params === 'object') {
            this._logBadComments = params.logBadComments === false ? false : true;
            this._logNotImplemented = params.logNotImplemented === true ? true : false;
        }
    };

    AcfunFormat.JSONParser.prototype.parseOne = function (comment) {
        // Read a comment and generate a correct comment object
        var data = {};
        if (typeof comment !== 'object' || comment == null || !comment.hasOwnProperty('c')) {
            // This cannot be parsed. The comment contains no config data
            return null;
        }
        var config = comment['c'].split(',');
        if (config.length >= 6) {
            data.stime = parseFloat(config[0]) * 1000;
            data.color = parseInt(config[1])
            data.mode = parseInt(config[2]);
            data.size = parseInt(config[3]);
            data.hash = config[4];
            data.date = parseInt(config[5]);
            data.position = "absolute";
            if (data.mode !== 7) {
                // Do some text normalization on low complexity comments
                data.text = comment.m.replace(/(\/n|\\n|\n|\r\n|\\r)/g,"\n");
                data.text = data.text.replace(/\r/g,"\n");
                data.text = data.text.replace(/\s/g,"\u00a0");
            } else {
                try { 
                    var x = JSON.parse(comment.m);
                } catch (e) {
                    if (this._logBadComments) {
                        console.warn('Error parsing internal data for comment');
                        console.log('[Dbg] ' + data.text);
                    }
                    return null; // Can't actually parse this!
                }
                data.position = "relative";
                data.text = x.n; /*.replace(/\r/g,"\n");*/
                data.text = data.text.replace(/\ /g,"\u00a0");
                if (typeof x.a === 'number') {
                    data.opacity = x.a;
                } else {
                    data.opacity = 1;
                }
                if (typeof x.p === 'object') {
                    // Relative position
                    data.x = x.p.x / 1000;
                    data.y = x.p.y / 1000;
                } else {
                    data.x = 0;
                    data.y = 0;
                }
                if (typeof x.c === 'number') {
                    switch (x.c) {
                        case 0: data.align = 0; break;
                        case 2: data.align = 1; break;
                        case 6: data.align = 2; break;
                        case 8: data.align = 3; break;
                        default:
                            if (this._logNotImplemented) {
                                console.log('Cannot handle aligning to center! AlignMode=' + x.c);
                            }
                    }
                }
                // Use default axis
                data.axis = 0;
                data.shadow = x.b;
                data.dur = 4000;
                if (typeof x.l === 'number') {
                    data.dur = x.l * 1000;
                }
                if (x.z != null && x.z.length > 0) {
                    data.movable = true;
                    data.motion = [];
                    var moveDuration = 0;
                    var last = {
                        x: data.x, 
                        y: data.y, 
                        alpha: data.opacity,
                        color: data.color
                    };
                    for (var m = 0; m < x.z.length; m++) {
                        var dur = x.z[m].l != null ? (x.z[m].l * 1000) : 500;
                        moveDuration += dur;
                        var motion = {};
                        if (x.z[m].hasOwnProperty('rx') && typeof x.z[m].rx === 'number') {
                            // TODO: Support this
                            if (this._logNotImplemented) {
                                console.log('Encountered animated x-axis rotation. Ignoring.');
                            }
                        }
                        if (x.z[m].hasOwnProperty('e') && typeof x.z[m].e === 'number') {
                            // TODO: Support this
                            if (this._logNotImplemented) {
                                console.log('Encountered animated y-axis rotation. Ignoring.');
                            }
                        }
                        if (x.z[m].hasOwnProperty('d') && typeof x.z[m].d === 'number') {
                            // TODO: Support this
                            if (this._logNotImplemented) {
                                console.log('Encountered animated z-axis rotation. Ignoring.');
                            }
                        }
                        if (x.z[m].hasOwnProperty('x') && typeof x.z[m].x === 'number') {
                            motion.x = {
                                from: last.x, 
                                to: x.z[m].x / 1000, 
                                dur: dur, 
                                delay: 0
                            };
                        }
                        if (x.z[m].hasOwnProperty('y') && typeof x.z[m].y === 'number') {
                            motion.y = {
                                from: last.y, 
                                to: x.z[m].y / 1000, 
                                dur: dur, 
                                delay: 0
                            };
                        }
                        last.x = motion.hasOwnProperty('x') ? motion.x.to : last.x;
                        last.y = motion.hasOwnProperty('y') ? motion.y.to : last.y;
                        if (x.z[m].hasOwnProperty('t') &&
                            typeof x.z[m].t === 'number' &&
                            x.z[m].t !== last.alpha) {
                            motion.alpha = {
                                from: last.alpha, 
                                to: x.z[m].t, 
                                dur: dur, 
                                delay: 0
                            };
                            last.alpha = motion.alpha.to;
                        }
                        if (x.z[m].hasOwnProperty('c') &&
                            typeof x.z[m].c === 'number' &&
                            x.z[m].c !== last.color) {
                            motion.color = {
                                from: last.color, 
                                to:x.z[m].c, 
                                dur: dur, 
                                delay: 0
                            };
                            last.color = motion.color.to;
                        }
                        data.motion.push(motion);
                    }
                    data.dur = moveDuration + (data.moveDelay ? data.moveDelay : 0);
                }
                if (x.hasOwnProperty('w')) {
                    if (x.w.hasOwnProperty('f')) {
                        data.font = x.w.f;
                    }
                    if (x.w.hasOwnProperty('l') && Array.isArray(x.w.l)) {
                        if (x.w.l.length > 0) {
                            // Filters
                            if (this._logNotImplemented) {
                                console.log('[Dbg] Filters not supported! ' + 
                                    JSON.stringify(x.w.l));
                            }
                        }
                    }
                }
                if (x.r != null && x.k != null) {
                    data.rX = x.r;
                    data.rY = x.k;
                }
                
            }
            return data;
        } else {
            // Not enough arguments.
            if (this._logBadComments) {
                console.warn('Dropping this comment due to insufficient parameters. Got: ' + config.length);
                console.log('[Dbg] ' + comment['c']);
            }
            return null;
        }
    };

    AcfunFormat.JSONParser.prototype.parseMany = function (comments) {
        if (!Array.isArray(comments)) {
            return null;
        }
        var list = [];
        for (var i = 0; i < comments.length; i++) {
            var comment = this.parseOne(comments[i]);
            if (comment !== null) {
                list.push(comment);
            }
        }
        return list;
    };

    AcfunFormat.TextParser = function (param) {
        this._jsonParser = new AcfunFormat.JSONParser(param);
    }

    AcfunFormat.TextParser.prototype.parseOne = function (comment) {
        try {
            return this._jsonParser.parseOne(JSON.parse(comment));
        } catch (e) {
            console.warn(e);
            return null;
        }
    }

    AcfunFormat.TextParser.prototype.parseMany = function (comment) {
        try {
            return this._jsonParser.parseMany(JSON.parse(comment));
        } catch (e) {
            console.warn(e);
            return null;
        }
    }

    return AcfunFormat;
})();

/**
 * CommonDanmakuFormat Parser
 * Example parser for parsing comments that the CCL can accept directly.
 * @license MIT
 * @author Jim Chen
 **/

var CommonDanmakuFormat = (function () {
    var CommonDanmakuFormat = {};
    var _check = function (comment) {
        // Sanity check to see if we should be parsing these comments or not
        if (typeof comment.mode !== 'number' || typeof comment.stime !== 'number') {
            return false;
        }
        if (comment.mode === 8 && !(typeof comment.code === 'string')) {
            return false;
        }
        if (typeof comment.text !== 'string') {
            return false;
        }
        return true;
    };

    CommonDanmakuFormat.JSONParser = function () { };
    CommonDanmakuFormat.JSONParser.prototype.parseOne = function (comment) {
        // Refuse to parse the comment does not pass sanity check
        return _check(comment) ? comment : null;
    };

    CommonDanmakuFormat.JSONParser.prototype.parseMany = function (comments) {
        // Refuse to parse if any comment does not pass sanity check
        return comments.every(_check) ? comments : null;
    };

    CommonDanmakuFormat.XMLParser = function () { };
    CommonDanmakuFormat.XMLParser.prototype.parseOne = function (comment) {
        var data = {}
        try {
            data.stime = parseInt(comment.getAttribute('stime'));
            data.mode = parseInt(comment.getAttribute('mode'));
            data.size = parseInt(comment.getAttribute('size'));
            data.color = parseInt(comment.getAttribute('color'));
            data.text = comment.textContent;
        } catch (e) {
            return null;
        }
        return data;
    };

    CommonDanmakuFormat.XMLParser.prototype.parseMany = function (commentsElem) {
        try {
            var comments = commentsElem.getElementsByTagName('comment');
        } catch (e) {
            return null;
        }
        var commentList = [];
        for (var i = 0; i < comments.length; i++) {
            var comment = this.parseOne(comments[i]);
            if (comment !== null) {
                commentList.push(comment);
            }
        }
        return commentList;
    };

    return CommonDanmakuFormat;
})();
