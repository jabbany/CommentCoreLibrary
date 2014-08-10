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
