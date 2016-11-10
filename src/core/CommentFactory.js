var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
            return new Matrix3D(matrix);
        };
        return Matrix3D;
    }());
    CommentUtils.Matrix3D = Matrix3D;
})(CommentUtils || (CommentUtils = {}));
var CoreComment = (function () {
    function CoreComment(parent, init) {
        if (init === void 0) { init = {}; }
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
        this.axis = 0;
        this._alpha = 1;
        this._size = 25;
        this._color = 0xffffff;
        this._border = false;
        this._shadow = true;
        this._font = "";
        this._transform = null;
        if (!parent) {
            throw new Error("Comment not bound to comment manager.");
        }
        else {
            this.parent = parent;
        }
        if (init.hasOwnProperty("stime")) {
            this.stime = init["stime"];
        }
        if (init.hasOwnProperty("mode")) {
            this.mode = init["mode"];
        }
        else {
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
            for (var i = 0; i < init['motion'].length; i++) {
                this._motionStart.push(head);
                var maxDur = 0;
                for (var k in init['motion'][i]) {
                    var m = init['motion'][i][k];
                    maxDur = Math.max(m.dur, maxDur);
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
        if (init.hasOwnProperty("align")) {
            this.align = init["align"];
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
        _super.call(this, parent, data);
        this.dur *= this.parent.options.scroll.scale;
        this.ttl *= this.parent.options.scroll.scale;
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
    ;
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
    ;
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
    CommentFactory.prototype.bind = function (mode, factory) {
        this._bindings[mode] = factory;
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
//# sourceMappingURL=CommentFactory.js.map