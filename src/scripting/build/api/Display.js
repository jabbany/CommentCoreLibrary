/**
* Matrix Polyfill for AS3.
* Author: Jim Chen
* Part of the CCLScripter
*/
var Display;
(function (Display) {
    var Matrix = (function () {
        function Matrix(a, b, c, d, tx, ty) {
            if (typeof a === "undefined") { a = 1; }
            if (typeof b === "undefined") { b = 0; }
            if (typeof c === "undefined") { c = 0; }
            if (typeof d === "undefined") { d = 1; }
            if (typeof tx === "undefined") { tx = 0; }
            if (typeof ty === "undefined") { ty = 0; }
            this._data = [a, c, tx, b, d, ty, 0, 0, 1];
        }
        Matrix.prototype.setTo = function (a, b, c, d, tx, ty) {
            if (typeof a === "undefined") { a = 1; }
            if (typeof b === "undefined") { b = 0; }
            if (typeof c === "undefined") { c = 0; }
            if (typeof d === "undefined") { d = 1; }
            if (typeof tx === "undefined") { tx = 0; }
            if (typeof ty === "undefined") { ty = 0; }
            this._data = [a, c, tx, b, d, ty, 0, 0, 1];
        };

        Matrix.prototype.identity = function () {
            this.setTo(1, 0, 0, 1, 0, 0);
        };

        Matrix.prototype.clone = function () {
            var a = this._data[0], b = this._data[3], c = this._data[1], d = this._data[4], tx = this._data[2], ty = this._data[5];
            return new Matrix(a, b, c, d, tx, ty);
        };
        return Matrix;
    })();
    Display.Matrix = Matrix;

    var Matrix3D = (function () {
        function Matrix3D(iv) {
            if (typeof iv === "undefined") { iv = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]; }
            if (iv.length == 16) {
                this._data = iv;
            } else {
                __trace("Matrix3D initialization vector invalid", "warn");
                this.identity();
            }
        }
        Matrix3D.prototype.identity = function () {
            this._data = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        };

        Matrix3D.prototype.clone = function () {
            return new Matrix3D(this._data);
        };
        return Matrix3D;
    })();
    Display.Matrix3D = Matrix3D;

    function createMatrix() {
        return new Matrix();
    }
    Display.createMatrix = createMatrix;

    function createMatrix3D() {
        return new Matrix3D();
    }
    Display.createMatrix3D = createMatrix3D;

    function createColorTransform() {
        return null;
    }
    Display.createColorTransform = createColorTransform;

    function createGradientBox() {
        return null;
    }
    Display.createGradientBox = createGradientBox;

    /**
    * Transforms a JS Array into an AS3 Vector<int>.
    *   Nothing is actually done since the methods are very
    *   similar across both.
    * @param array - Array
    * @returns {Array<number>} - AS3 Integer Vector
    */
    function toIntVector(array) {
        Object.defineProperty(array, 'as3Type', {
            get: function () {
                return "Vector<int>";
            },
            set: function (value) {
            }
        });
        return array;
    }
    Display.toIntVector = toIntVector;

    /**
    * Transforms a JS Array into an AS3 Vector<number>.
    *   Nothing is actually done since the methods are very
    *   similar across both.
    * @param array - Array
    * @returns {Array<number>} - AS3 Number Vector
    */
    function toNumberVector(array) {
        Object.defineProperty(array, 'as3Type', {
            get: function () {
                return "Vector<number>";
            },
            set: function (value) {
            }
        });
        return array;
    }
    Display.toNumberVector = toNumberVector;
})(Display || (Display = {}));
/**
* Filter Polyfill for AS3.
* Author: Jim Chen
* Part of the CCLScripter
*/
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="ISerializable.ts" />
var Display;
(function (Display) {
    var Filter = (function () {
        function Filter() {
        }
        Filter.prototype.serialize = function () {
            return {
                "class": "Filter",
                "type": "nullfilter"
            };
        };
        return Filter;
    })();
    Display.Filter = Filter;

    var BlurFilter = (function (_super) {
        __extends(BlurFilter, _super);
        function BlurFilter(blurX, blurY) {
            if (typeof blurX === "undefined") { blurX = 4.0; }
            if (typeof blurY === "undefined") { blurY = 4.0; }
            _super.call(this);
            this._blurX = blurX;
            this._blurY = blurY;
        }
        BlurFilter.prototype.serialize = function () {
            var s = _super.prototype.serialize.call(this);
            s["type"] = "blur";
            s["params"] = {
                "blurX": this._blurX,
                "blurY": this._blurY
            };
            return s;
        };
        return BlurFilter;
    })(Filter);

    var GlowFilter = (function (_super) {
        __extends(GlowFilter, _super);
        function GlowFilter(color, alpha, blurX, blurY, strength, quality, inner, knockout) {
            if (typeof color === "undefined") { color = 16711680; }
            if (typeof alpha === "undefined") { alpha = 1.0; }
            if (typeof blurX === "undefined") { blurX = 6.0; }
            if (typeof blurY === "undefined") { blurY = 6.0; }
            if (typeof strength === "undefined") { strength = 2; }
            if (typeof quality === "undefined") { quality = null; }
            if (typeof inner === "undefined") { inner = false; }
            if (typeof knockout === "undefined") { knockout = false; }
            _super.call(this);
            this._color = color;
            this._alpha = alpha;
            this._blurX = blurX;
            this._blurY = blurY;
            this._strength = strength;
            this._quality = quality;
            this._inner = inner;
            this._knockout = knockout;
        }
        GlowFilter.prototype.serialize = function () {
            var s = _super.prototype.serialize.call(this);
            s["type"] = "glow";
            s["params"] = {
                "color": this._color,
                "alpha": this._alpha,
                "blurX": this._blurX,
                "blurY": this._blurY,
                "strength": this._strength,
                "inner": this._inner,
                "knockout": this._knockout
            };
            return s;
        };
        return GlowFilter;
    })(Filter);

    var DropShadowFilter = (function (_super) {
        __extends(DropShadowFilter, _super);
        function DropShadowFilter(distance, angle, color, alpha, blurX, blurY, strength, quality) {
            if (typeof distance === "undefined") { distance = 4.0; }
            if (typeof angle === "undefined") { angle = 45; }
            if (typeof color === "undefined") { color = 0; }
            if (typeof alpha === "undefined") { alpha = 1; }
            if (typeof blurX === "undefined") { blurX = 4.0; }
            if (typeof blurY === "undefined") { blurY = 4.0; }
            if (typeof strength === "undefined") { strength = 1.0; }
            if (typeof quality === "undefined") { quality = 1; }
            _super.call(this);
            this._color = color;
            this._alpha = alpha;
            this._blurX = blurX;
            this._blurY = blurY;
            this._strength = strength;
            this._quality = quality;

            /* TODO: Update to support inner & knockout */
            this._inner = false;
            this._knockout = false;
            this._distance = distance;
            this._angle = angle;
        }
        DropShadowFilter.prototype.serialize = function () {
            var s = _super.prototype.serialize.call(this);
            s["type"] = "dropShadow";
            s["params"] = {
                "distance": this._distance,
                "angle": this._angle,
                "color": this._color,
                "alpha": this._alpha,
                "blurX": this._blurX,
                "blurY": this._blurY,
                "strength": this._strength,
                "inner": this._inner,
                "knockout": this._knockout
            };
            return s;
        };
        return DropShadowFilter;
    })(Filter);

    function createDropShadowFilter(distance, angle, color, alpha, blurX, blurY, strength, quality) {
        if (typeof distance === "undefined") { distance = 4.0; }
        if (typeof angle === "undefined") { angle = 45; }
        if (typeof color === "undefined") { color = 0; }
        if (typeof alpha === "undefined") { alpha = 1; }
        if (typeof blurX === "undefined") { blurX = 4.0; }
        if (typeof blurY === "undefined") { blurY = 4.0; }
        if (typeof strength === "undefined") { strength = 1.0; }
        if (typeof quality === "undefined") { quality = 1; }
        return new DropShadowFilter(distance, angle, color, alpha, blurX, blurY, strength, quality);
    }
    Display.createDropShadowFilter = createDropShadowFilter;

    function createGlowFilter(color, alpha, blurX, blurY, strength, quality, inner, knockout) {
        if (typeof color === "undefined") { color = 16711680; }
        if (typeof alpha === "undefined") { alpha = 1.0; }
        if (typeof blurX === "undefined") { blurX = 6.0; }
        if (typeof blurY === "undefined") { blurY = 6.0; }
        if (typeof strength === "undefined") { strength = 2; }
        if (typeof quality === "undefined") { quality = null; }
        if (typeof inner === "undefined") { inner = false; }
        if (typeof knockout === "undefined") { knockout = false; }
        return new GlowFilter(color, alpha, blurX, blurY, strength, quality, inner, knockout);
    }
    Display.createGlowFilter = createGlowFilter;

    function createBlurFilter(blurX, blurY, strength) {
        if (typeof blurX === "undefined") { blurX = 6.0; }
        if (typeof blurY === "undefined") { blurY = 6.0; }
        if (typeof strength === "undefined") { strength = 2; }
        return new BlurFilter(blurX, blurY);
    }
    Display.createBlurFilter = createBlurFilter;
})(Display || (Display = {}));
/**
* Shape Polyfill for AS3.
* Author: Jim Chen
* Part of the CCLScripter
*/
/// <reference path="../Runtime.d.ts" />
/// <reference path="ISerializable.ts" />
/// <reference path="Filter.ts" />
var Display;
(function (Display) {
    var Transform = (function () {
        function Transform(parent) {
            this._matrix = new Display.Matrix();
            this._matrix3d = null;
            this._parent = parent;
        }


        Object.defineProperty(Transform.prototype, "matrix3D", {
            get: function () {
                return this._matrix3d;
            },
            set: function (m) {
                this._matrix = null;
                this._matrix3d = m;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Transform.prototype, "matrix", {
            get: function () {
                return this._matrix;
            },
            set: function (m) {
                this._matrix3d = null;
                this._matrix = m;
            },
            enumerable: true,
            configurable: true
        });

        Transform.prototype.updateProperty = function (propertyName, value) {
            this._parent.transform = this;
        };

        Transform.prototype.serialize = function () {
            return {};
        };
        return Transform;
    })();
    var DisplayObject = (function () {
        function DisplayObject(id) {
            if (typeof id === "undefined") { id = Runtime.generateId(); }
            this._alpha = 1;
            this._x = 0;
            this._y = 0;
            this._scaleX = 1;
            this._scaleY = 1;
            this._filters = [];
            this._visible = false;
            this._listeners = {};
            this._parent = null;
            this._name = "";
            this._children = [];
            this._transform = new Transform(this);
            this._hasSetDefaults = false;
            this._id = id;
            this._visible = true;
        }
        DisplayObject.prototype.setDefaults = function (defaults) {
            if (typeof defaults === "undefined") { defaults = {}; }
            if (this._hasSetDefaults) {
                __trace("DisplayObject.setDefaults called more than once.", "warn");
                return;
            }
            this._hasSetDefaults = true;
            if (defaults.hasOwnProperty("alpha")) {
                this._alpha = defaults["alpha"];
            }
            if (defaults.hasOwnProperty("x")) {
                this._x = defaults["x"];
            }
            if (defaults.hasOwnProperty("y")) {
                this._y = defaults["y"];
            }
        };

        DisplayObject.prototype.propertyUpdate = function (propertyName, updatedValue) {
            __pchannel("Runtime:UpdateProperty", {
                "id": this._id,
                "name": propertyName,
                "value": updatedValue
            });
        };

        DisplayObject.prototype.methodCall = function (methodName, params) {
            __pchannel("Runtime:CallMethod", {
                "id": this._id,
                "method": methodName,
                "params": params
            });
        };


        Object.defineProperty(DisplayObject.prototype, "alpha", {
            get: function () {
                return this._alpha;
            },
            /** Properties **/
            set: function (value) {
                this._alpha = value;
                this.propertyUpdate("alpha", value);
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(DisplayObject.prototype, "cacheAsBitmap", {
            get: function () {
                return false;
            },
            set: function (value) {
                __trace("DisplayObject.cacheAsBitmap is not supported", "warn");
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(DisplayObject.prototype, "filters", {
            get: function () {
                return this._filters;
            },
            set: function (filters) {
                this._filters = filters;
                var serializedFilters = [];
                for (var i = 0; i < this._filters.length; i++) {
                    serializedFilters.push(this._filters[i].serialize());
                }
                this.propertyUpdate("filters", serializedFilters);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(DisplayObject.prototype, "root", {
            get: function () {
                return Display.root;
            },
            enumerable: true,
            configurable: true
        });







        Object.defineProperty(DisplayObject.prototype, "scaleX", {
            get: function () {
                return this._scaleX;
            },
            set: function (val) {
                this._scaleX = val;
                this.propertyUpdate("scaleX", val);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(DisplayObject.prototype, "scaleY", {
            get: function () {
                return this._scaleY;
            },
            set: function (val) {
                this._scaleY = val;
                this.propertyUpdate("scaleY", val);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(DisplayObject.prototype, "scaleZ", {
            get: function () {
                return 1;
            },
            set: function (val) {
                __trace("DisplayObject.scaleZ is not supported", "warn");
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(DisplayObject.prototype, "x", {
            get: function () {
                return this._x;
            },
            set: function (val) {
                this._x = val;
                this.propertyUpdate("x", val);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(DisplayObject.prototype, "y", {
            get: function () {
                return this._y;
            },
            set: function (val) {
                this._y = val;
                this.propertyUpdate("y", val);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(DisplayObject.prototype, "z", {
            get: function () {
                return 0;
            },
            set: function (val) {
                __trace("DisplayObject.z is not supported", "warn");
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(DisplayObject.prototype, "visible", {
            get: function () {
                return this._visible;
            },
            set: function (visible) {
                this._visible = visible;
                this.propertyUpdate("visible", visible);
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(DisplayObject.prototype, "blendMode", {
            get: function () {
                return "normal";
            },
            set: function (blendMode) {
                __trace("DisplayObject.blendMode not supported.", "warn");
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(DisplayObject.prototype, "transform", {
            get: function () {
                return this._transform;
            },
            set: function (t) {
                this._transform = t;
                this.propertyUpdate("transform", this._transform.serialize());
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(DisplayObject.prototype, "name", {
            get: function () {
                return this._name;
            },
            set: function (name) {
                this._name = name;
                this.propertyUpdate("name", name);
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(DisplayObject.prototype, "loaderInfo", {
            get: function () {
                __trace("DisplayObject.loaderInfo is not supported", "warn");
                return {};
            },
            set: function (name) {
                __trace("DisplayObject.loaderInfo is read-only", "warn");
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(DisplayObject.prototype, "parent", {
            get: function () {
                return this._parent;
            },
            set: function (p) {
                __trace("DisplayObject.parent is read-only", "warn");
            },
            enumerable: true,
            configurable: true
        });

        /** AS3 Stuff **/
        DisplayObject.prototype.dispatchEvent = function (event, data) {
            if (this._listeners.hasOwnProperty(event)) {
                if (this._listeners[event] !== null) {
                    for (var i = 0; i < this._listeners[event].length; i++) {
                        try  {
                            this._listeners[event][i](data);
                        } catch (e) {
                            if (e.hasOwnProperty("stack")) {
                                __trace(e.stack.toString(), 'err');
                            } else {
                                __trace(e.toString(), 'err');
                            }
                        }
                    }
                }
            }
        };

        DisplayObject.prototype.addEventListener = function (event, listener) {
            if (!this._listeners.hasOwnProperty(event)) {
                this._listeners[event] = [];
            }
            this._listeners[event].push(listener);
        };

        DisplayObject.prototype.removeEventListener = function (event, listener) {
            if (!this._listeners.hasOwnProperty(event)) {
                return;
            }
            var index = this._listeners[event].indexOf(listener);
            if (index >= 0) {
                this._listeners[event].splice(index, 1);
            }
        };

        DisplayObject.prototype.addChild = function (o) {
            this._children.push(o);
            o._parent = this;
            this.methodCall("addChild", o._id);
        };

        DisplayObject.prototype.removeChild = function (o) {
            var index = this._children.indexOf(o);
            if (index >= 0) {
                this._children.splice(index, 1);
                o._parent = null;
                this.methodCall("removeChild", o._id);
            }
        };

        /**
        * Removes the object from a parent if exists.
        */
        DisplayObject.prototype.remove = function () {
            // Remove itself
            if (this._parent !== null) {
                this._parent.removeChild(this);
            } else {
                this.root.removeChild(this);
            }
        };

        /** Common Functions **/
        DisplayObject.prototype.serialize = function () {
            this._hasSetDefaults = true;
            var filters = [];
            for (var i = 0; i < this._filters.length; i++) {
                filters.push(this._filters[i].serialize());
            }
            return {
                "class": "DisplayObject",
                "x": this._x,
                "y": this._y,
                "alpha": this._alpha,
                "filters": filters
            };
        };

        DisplayObject.prototype.unload = function () {
            this._visible = false;
            this.remove();
            __pchannel("Runtime:CallMethod", {
                "id": this._id,
                "method": "unload",
                "params": null
            });
        };

        DisplayObject.prototype.getId = function () {
            return this._id;
        };
        return DisplayObject;
    })();
    Display.DisplayObject = DisplayObject;
})(Display || (Display = {}));
/**
* Sprite Polyfill for AS3.
* Author: Jim Chen
* Part of the CCLScripter
*/
/// <reference path="DisplayObject.ts" />
var Display;
(function (Display) {
    var Sprite = (function (_super) {
        __extends(Sprite, _super);
        function Sprite(id) {
            _super.call(this, id);
        }
        Sprite.prototype.serialize = function () {
            var serialized = _super.prototype.serialize.call(this);
            serialized["class"] = "Sprite";
            return serialized;
        };
        return Sprite;
    })(Display.DisplayObject);
    Display.Sprite = Sprite;
})(Display || (Display = {}));
/**
* MotionManager Polyfill for AS3.
* Author: Jim Chen
* Part of the CCLScripter
*/
/// <reference path="../Runtime.d.ts" />
/// <reference path="DisplayObject.ts" />
var Display;
(function (Display) {
    var MotionManager = (function () {
        function MotionManager(o, dur) {
            if (typeof dur === "undefined") { dur = 1000; }
            this._isRunning = false;
            this.oncomplete = null;
            this._ttl = dur;
            this._dur = dur;
            this._parent = o;
            this._timer = new Runtime.Timer(41, 0);
        }

        Object.defineProperty(MotionManager.prototype, "dur", {
            get: function () {
                return this._dur;
            },
            set: function (dur) {
                this._dur = dur;
                this._ttl = dur;
                this._timer.stop();
                this._timer = new Runtime.Timer(41, 0);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(MotionManager.prototype, "running", {
            get: function () {
                return this._isRunning;
            },
            enumerable: true,
            configurable: true
        });

        MotionManager.prototype.reset = function () {
            this._ttl = this._dur;
        };

        MotionManager.prototype.play = function () {
            if (this._isRunning)
                return;
            this._isRunning = true;
            var self = this;
            var _lastTime = Date.now();
            this._timer.addEventListener("timer", function () {
                var dur = Date.now() - _lastTime;
                self._dur -= dur;
                if (self._dur <= 0) {
                    self.stop();
                    if (self.oncomplete) {
                        self.oncomplete();
                    }
                    self._parent.unload();
                }
                _lastTime = Date.now();
            });
            this._timer.start();
        };

        MotionManager.prototype.stop = function () {
            if (!this._isRunning)
                return;
            this._isRunning = false;
            this._timer.stop();
        };

        MotionManager.prototype.forecasting = function (time) {
            return false;
        };

        MotionManager.prototype.setPlayTime = function (playtime) {
        };

        MotionManager.prototype.initTween = function (motion, repeat) {
            if (motion.hasOwnProperty("lifeTime")) {
                this._ttl = motion["lifeTime"] * 1000;
                if (isNaN(this._ttl)) {
                    this._ttl = 3000;
                }
            }
        };

        MotionManager.prototype.initTweenGroup = function (motionGroup, lifeTime) {
        };

        MotionManager.prototype.setCompleteListener = function (listener) {
            this.oncomplete = listener;
        };
        return MotionManager;
    })();
    Display.MotionManager = MotionManager;
})(Display || (Display = {}));
/// <reference path="DisplayObject.ts" />
/// <reference path="MotionManager.ts" />
/**
* Compliant CommentButton Polyfill For BiliScriptEngine
*/
/// <reference path="Sprite.ts" />
/// <reference path="IComment.ts" />
/// <reference path="MotionManager.ts" />
var Display;
(function (Display) {
    var CommentButton = (function (_super) {
        __extends(CommentButton, _super);
        function CommentButton(params) {
            _super.call(this);
            this._mM = new Display.MotionManager(this);
            this.initStyle(params);
            Runtime.registerObject(this);
        }
        /**
        * Set the style for the UIComponent which this is
        * @param styleProp - style to set
        * @param value - value to set the style to
        */
        CommentButton.prototype.setStyle = function (styleProp, value) {
            __trace("UIComponent.setStyle not implemented", "warn");
        };

        Object.defineProperty(CommentButton.prototype, "motionManager", {
            get: function () {
                return this._mM;
            },
            set: function (m) {
                __trace("IComment.motionManager is read-only", "warn");
            },
            enumerable: true,
            configurable: true
        });


        CommentButton.prototype.initStyle = function (style) {
        };

        CommentButton.prototype.serialize = function () {
            var serialized = _super.prototype.serialize.call(this);
            serialized["class"] = "Button";
            return serialized;
        };
        return CommentButton;
    })(Display.Sprite);

    function createButton(params) {
        return new CommentButton(params);
    }
    Display.createButton = createButton;
})(Display || (Display = {}));
/**
* Compliant CommentCanvas Polyfill For BiliScriptEngine
*/
/// <reference path="Sprite.ts" />
/// <reference path="IComment.ts" />
/// <reference path="MotionManager.ts" />
var Display;
(function (Display) {
    var CommentCanvas = (function (_super) {
        __extends(CommentCanvas, _super);
        function CommentCanvas(params) {
            _super.call(this);
            this._mM = new Display.MotionManager(this);
            this.initStyle(params);
            Runtime.registerObject(this);
        }
        Object.defineProperty(CommentCanvas.prototype, "motionManager", {
            get: function () {
                return this._mM;
            },
            set: function (m) {
                __trace("IComment.motionManager is read-only", "warn");
            },
            enumerable: true,
            configurable: true
        });


        CommentCanvas.prototype.initStyle = function (style) {
        };
        return CommentCanvas;
    })(Display.Sprite);

    function createCanvas(params) {
        return new CommentCanvas(params);
    }
    Display.createCanvas = createCanvas;
})(Display || (Display = {}));
/**
* Graphics Polyfill for AS3
* Author: Jim Chen
* Part of the CCLScripter
*/
/// <reference path="DisplayObject.ts" />
var Display;
(function (Display) {
    var Graphics = (function () {
        function Graphics(parent) {
            this._id = parent.getId();
        }
        Graphics.prototype._callDrawMethod = function (method, params) {
            __pchannel("Runtime:CallMethod", {
                "id": this._id,
                "context": "graphics",
                "method": method,
                "params": params
            });
        };

        /**
        * Line to point
        * @param x - x coordinate
        * @param y - y coordinate
        */
        Graphics.prototype.lineTo = function (x, y) {
            this._callDrawMethod("lineTo", [x, y]);
        };

        /**
        * Move to point
        * @param x - x coordinate
        * @param y - y coordinate
        */
        Graphics.prototype.moveTo = function (x, y) {
            this._callDrawMethod("moveTo", [x, y]);
        };

        /**
        * Quadratic Beizer Curve
        * @param cx - Control point x
        * @param cy - Control point y
        * @param ax - Anchor x
        * @param ay - Anchor y
        */
        Graphics.prototype.curveTo = function (cx, cy, ax, ay) {
            this._callDrawMethod("curveTo", [cx, cy, ax, ay]);
        };

        /**
        * Cubic Beizer Curve
        * @param cax - Control point A x
        * @param cay - Control point A y
        * @param cbx - Control point B x
        * @param cby - Control point B y
        * @param ax - Anchor x
        * @param ay - Anchor y
        */
        Graphics.prototype.cubicCurveTo = function (cax, cay, cbx, cby, ax, ay) {
            this._callDrawMethod("cubicCurveTo", [cax, cay, cbx, cby, ax, ay]);
        };

        /**
        * Set line style
        * @param thickness - line thickness
        * @param color - line color (default 0)
        * @param alpha - alpha (default 1)
        * @param hinting - pixel hinting (default false)
        * @param scale - scale mode (default "normal")
        * @param caps - line cap mode (default "none")
        * @param joints - line joint mode (default "round")
        * @param miterlim - miter limit (default 3)
        */
        Graphics.prototype.lineStyle = function (thickness, color, alpha, hinting, scale, caps, joints, miter) {
            if (typeof color === "undefined") { color = 0; }
            if (typeof alpha === "undefined") { alpha = 1.0; }
            if (typeof hinting === "undefined") { hinting = false; }
            if (typeof scale === "undefined") { scale = "normal"; }
            if (typeof caps === "undefined") { caps = "none"; }
            if (typeof joints === "undefined") { joints = "round"; }
            if (typeof miter === "undefined") { miter = 3; }
            this._callDrawMethod("lineStyle", [thickness, color, alpha, caps, joints, miter]);
        };

        /**
        * Draw a rectangle
        * @param x - x coordinate
        * @param y - y coordinate
        * @param w - width
        * @param h - height
        */
        Graphics.prototype.drawRect = function (x, y, w, h) {
            this._callDrawMethod("drawRect", [x, y, w, h]);
        };

        /**
        * Draws a circle
        * @param x - center x
        * @param y - center y
        * @param r - radius
        */
        Graphics.prototype.drawCircle = function (x, y, r) {
            this._callDrawMethod("drawCircle", [x, y, r]);
        };

        /**
        * Draws an ellipse
        * @param cx - center x
        * @param cy - center y
        * @param w - width
        * @param h - height
        */
        Graphics.prototype.drawEllipse = function (cx, cy, w, h) {
            this._callDrawMethod("drawEllipse", [cx + w / 2, cy + h / 2, w / 2, h / 2]);
        };

        /**
        * Draws a rounded rectangle
        * @param x - x coordinate
        * @param y - y coordinate
        * @param w - width
        * @param h - height
        * @param elw - ellipse corner width
        * @param elh - ellipse corner height
        */
        Graphics.prototype.drawRoundRect = function (x, y, w, h, elw, elh) {
            this._callDrawMethod("drawRoundRect", [x, y, w, h, elw, elh]);
        };

        /**
        * Fill next shape with solid color
        * @param color
        * @param alpha
        */
        Graphics.prototype.beginFill = function (color, alpha) {
            if (typeof alpha === "undefined") { alpha = 1.0; }
            this._callDrawMethod("beginFill", [color, alpha]);
        };

        /**
        * Gradient Fill Not Supported yet
        */
        Graphics.prototype.beginGradientFill = function () {
            __trace("Graphics: Gradients not supported yet.", 'warn');
        };

        /**
        * Shader Fill Not Supported yet
        */
        Graphics.prototype.beginShaderFill = function () {
            __trace("Graphics: Shaders not supported yet.", 'warn');
        };

        /**
        * Stop and finalize fill
        */
        Graphics.prototype.endFill = function () {
            this._callDrawMethod("endFill", []);
        };

        /**
        * Clears everything the current graphics context has drawn
        */
        Graphics.prototype.clear = function () {
            this._callDrawMethod("clear", []);
        };
        return Graphics;
    })();
    Display.Graphics = Graphics;
})(Display || (Display = {}));
/**
* Shape Polyfill for AS3.
* Author: Jim Chen
* Part of the CCLScripter
*/
/// <reference path="DisplayObject.ts" />
/// <reference path="Graphics.ts" />
var Display;
(function (Display) {
    var Shape = (function (_super) {
        __extends(Shape, _super);
        function Shape() {
            _super.call(this);
            this._graphics = new Display.Graphics(this);
        }
        Object.defineProperty(Shape.prototype, "graphics", {
            get: function () {
                return this._graphics;
            },
            enumerable: true,
            configurable: true
        });

        Shape.prototype.serialize = function () {
            var serialized = _super.prototype.serialize.call(this);
            serialized["class"] = "Shape";
            return serialized;
        };
        return Shape;
    })(Display.DisplayObject);
    Display.Shape = Shape;
})(Display || (Display = {}));
/**
* Compliant CommentShape Polyfill For BiliScriptEngine
*/
/// <reference path="Shape.ts" />
/// <reference path="IComment.ts" />
/// <reference path="MotionManager.ts" />
var Display;
(function (Display) {
    var CommentShape = (function (_super) {
        __extends(CommentShape, _super);
        function CommentShape(params) {
            _super.call(this);
            this._mM = new Display.MotionManager(this);
            this.setDefaults(params);
            this.initStyle(params); // This is for the special styles
            Runtime.registerObject(this);
        }
        Object.defineProperty(CommentShape.prototype, "motionManager", {
            get: function () {
                return this._mM;
            },
            set: function (m) {
                __trace("IComment.motionManager is read-only", "warn");
            },
            enumerable: true,
            configurable: true
        });


        CommentShape.prototype.initStyle = function (style) {
            if (style["lifeTime"]) {
                this._mM.dur = style["lifeTime"] * 1000;
            }
            this._mM.play();
        };
        return CommentShape;
    })(Display.Shape);

    function createShape(params) {
        return new CommentShape(params);
    }
    Display.createShape = createShape;
})(Display || (Display = {}));
/**
* TextField Polyfill for AS3.
* Author: Jim Chen
* Part of the CCLScripter
*/
/// <reference path="DisplayObject.ts" />
var Display;
(function (Display) {
    var TextFormat = (function () {
        function TextFormat(font, size, color, bold, italic, underline, url, target, align, leftMargin, rightMargin, indent, leading) {
            if (typeof font === "undefined") { font = "SimHei"; }
            if (typeof size === "undefined") { size = 25; }
            if (typeof color === "undefined") { color = 0xFFFFFF; }
            if (typeof bold === "undefined") { bold = false; }
            if (typeof italic === "undefined") { italic = false; }
            if (typeof underline === "undefined") { underline = false; }
            if (typeof url === "undefined") { url = ""; }
            if (typeof target === "undefined") { target = ""; }
            if (typeof align === "undefined") { align = "left"; }
            if (typeof leftMargin === "undefined") { leftMargin = 0; }
            if (typeof rightMargin === "undefined") { rightMargin = 0; }
            if (typeof indent === "undefined") { indent = 0; }
            if (typeof leading === "undefined") { leading = 0; }
            this.font = font;
            this.size = size;
            this.color = color;
            this.bold = bold;
            this.italic = italic;
            this.underline = underline;
        }
        TextFormat.prototype.serialize = function () {
            return {
                "class": "TextFormat",
                "font": this.font,
                "size": this.size,
                "color": this.color,
                "bold": this.bold,
                "underline": this.underline,
                "italic": this.italic
            };
        };
        return TextFormat;
    })();

    var TextField = (function (_super) {
        __extends(TextField, _super);
        function TextField(text, color) {
            if (typeof text === "undefined") { text = ""; }
            if (typeof color === "undefined") { color = 0; }
            _super.call(this);
            this._text = text;
            this._textFormat = new TextFormat();
            this._textFormat.color = color;
        }
        Object.defineProperty(TextField.prototype, "text", {
            get: function () {
                return this._text;
            },
            set: function (t) {
                this._text = t;
                this.propertyUpdate("text", this._text);
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(TextField.prototype, "htmlText", {
            get: function () {
                return this.text;
            },
            set: function (text) {
                __trace("TextField.htmlText is restricted due to security policy.", "warn");
                this.text = text.replace(/<\/?[^>]+(>|$)/g, "");
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(TextField.prototype, "color", {
            get: function () {
                return this._textFormat.color;
            },
            set: function (c) {
                this._textFormat.color = c;
                this.setTextFormat(this._textFormat);
            },
            enumerable: true,
            configurable: true
        });


        TextField.prototype.getTextFormat = function () {
            return this._textFormat;
        };

        TextField.prototype.setTextFormat = function (tf) {
            this._textFormat = tf;
            this.methodCall("setTextFormat", tf);
        };

        TextField.prototype.appendText = function (t) {
            this.text = this.text + t;
        };

        TextField.prototype.serialize = function () {
            var serialized = _super.prototype.serialize.call(this);
            serialized["class"] = "TextField";
            serialized["text"] = this._text;
            serialized["textFormat"] = this._textFormat.serialize();
            return serialized;
        };
        return TextField;
    })(Display.DisplayObject);
    Display.TextField = TextField;

    function createTextFormat() {
        return new TextFormat();
    }
    Display.createTextFormat = createTextFormat;
})(Display || (Display = {}));
/**
* Compliant CommentField Polyfill For BiliScriptEngine
*/
/// <reference path="TextField.ts" />
/// <reference path="IComment.ts" />
/// <reference path="MotionManager.ts" />
var Display;
(function (Display) {
    var CommentField = (function (_super) {
        __extends(CommentField, _super);
        function CommentField(text, params) {
            _super.call(this, text, 0xffffff);
            this._mM = new Display.MotionManager(this);
            this.setDefaults(params);
            this.initStyle(params);
            Runtime.registerObject(this);
        }

        Object.defineProperty(CommentField.prototype, "fontsize", {
            get: function () {
                return this.getTextFormat().fontsize;
            },
            set: function (size) {
                var tf = this.getTextFormat();
                tf.size = size;
                this.setTextFormat(tf);
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(CommentField.prototype, "font", {
            get: function () {
                return this.getTextFormat().font;
            },
            set: function (fontname) {
                var tf = this.getTextFormat();
                tf.font = fontname;
                this.setTextFormat(tf);
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(CommentField.prototype, "align", {
            get: function () {
                return this.getTextFormat().align;
            },
            set: function (a) {
                var tf = this.getTextFormat();
                tf.align = a;
                this.setTextFormat(tf);
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(CommentField.prototype, "bold", {
            get: function () {
                return this.getTextFormat().bold;
            },
            set: function (b) {
                var tf = this.getTextFormat();
                tf.bold = b;
                this.setTextFormat(tf);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(CommentField.prototype, "motionManager", {
            get: function () {
                return this._mM;
            },
            set: function (m) {
                __trace("IComment.motionManager is read-only", "warn");
            },
            enumerable: true,
            configurable: true
        });


        CommentField.prototype.initStyle = function (style) {
            if (style["lifeTime"]) {
                this._mM.dur = style["lifeTime"] * 1000;
            }
            if (style["fontsize"]) {
                this.getTextFormat().size = style["fontsize"];
            }
            if (style["font"]) {
                this.getTextFormat().font = style["font"];
            }
            if (style["color"]) {
                this.getTextFormat().color = style["color"];
            }
            if (style["bold"]) {
                this.getTextFormat().bold = style["bold"];
            }
            this._mM.play();
        };
        return CommentField;
    })(Display.TextField);

    function createComment(text, params) {
        return new CommentField(text, params);
    }
    Display.createComment = createComment;
})(Display || (Display = {}));
/**
* Display Adapter
* Author: Jim Chen
*/
/// <reference path="../OOAPI.d.ts" />
/// <reference path="Matrix.ts" />
/// <reference path="Sprite.ts" />
/// <reference path="DisplayObject.ts" />
/// <reference path="CommentButton.ts" />
/// <reference path="CommentCanvas.ts" />
/// <reference path="CommentShape.ts" />
/// <reference path="CommentField.ts" />
var Display;
(function (Display) {
    Display.root;
    Display.loaderInfo;
    Display.stage;
    Display.version;
    Display.width;
    Display.height;
    Display.fullScreenWidth;
    Display.fullScreenHeight;
    Display.frameRate;

    var _root = new Display.Sprite("__root");
    var _width = 0;
    var _height = 0;
    var _fullScreenWidth = 0;
    var _fullScreenHeight = 0;
    var _frameRate = 24;

    Object.defineProperty(Display, 'root', {
        get: function () {
            return _root;
        },
        set: function (value) {
            __trace("Display.root is read-only", "warn");
        }
    });
    Object.defineProperty(Display, 'loaderInfo', {
        get: function () {
            return {};
        },
        set: function (value) {
            __trace("Display.loaderInfo is disabled", "warn");
        }
    });
    Object.defineProperty(Display, 'stage', {
        get: function () {
            return _root;
        },
        set: function (value) {
            __trace("Display.stage is read-only", "warn");
        }
    });
    Object.defineProperty(Display, 'version', {
        get: function () {
            return "CCLDisplay/1.0 HTML5/* (bilibili, like BSE, like flash, AS3 compatible) KagerouEngine/v1";
        },
        set: function (value) {
            __trace("Display.version is read-only", "warn");
        }
    });
    Object.defineProperty(Display, 'width', {
        get: function () {
            return _width;
        },
        set: function (value) {
            __trace("Display.width is read-only", "warn");
        }
    });
    Object.defineProperty(Display, 'height', {
        get: function () {
            return _height;
        },
        set: function (value) {
            __trace("Display.height is read-only", "warn");
        }
    });
    Object.defineProperty(Display, 'fullScreenWidth', {
        get: function () {
            return _fullScreenWidth;
        },
        set: function (value) {
            __trace("Display.fullScreenWidth is read-only", "warn");
        }
    });
    Object.defineProperty(Display, 'fullScreenHeight', {
        get: function () {
            return _fullScreenHeight;
        },
        set: function (value) {
            __trace("Display.fullScreenHeight is read-only", "warn");
        }
    });
    Object.defineProperty(Display, 'frameRate', {
        get: function () {
            return _frameRate;
        },
        set: function (value) {
            _frameRate = value;
            __pchannel("Display:SetFrameRate", value);
        }
    });

    function toString() {
        return "[display Display]";
    }
    Display.toString = toString;
})(Display || (Display = {}));

var $ = Display;
