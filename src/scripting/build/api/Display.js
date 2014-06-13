/**
* Matrix Polyfill for AS3.
* Author: Jim Chen
* Part of the CCLScripter
*/
var Display;
(function (Display) {
    var Matrix = (function () {
        function Matrix() {
            this._data = [];
        }
        Matrix.prototype.setTo = function () {
        };

        Matrix.prototype.clone = function () {
            return null;
        };
        return Matrix;
    })();
    Display.Matrix = Matrix;

    var Matrix3D = (function () {
        function Matrix3D() {
        }
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
            _super.call(this);
        }
        BlurFilter.prototype.serialize = function () {
            var s = _super.prototype.serialize.call(this);
            s["type"] = "blur";
            return s;
        };
        return BlurFilter;
    })(Filter);

    var GlowFilter = (function (_super) {
        __extends(GlowFilter, _super);
        function GlowFilter(blurX, blurY) {
            _super.call(this);
        }
        GlowFilter.prototype.serialize = function () {
            var s = _super.prototype.serialize.call(this);
            s["type"] = "glow";
            return s;
        };
        return GlowFilter;
    })(Filter);

    function createGlowFilter(color, alpha, blurX, blurY, strength, quality, inner, knockout) {
        if (typeof alpha === "undefined") { alpha = 1.0; }
        if (typeof blurX === "undefined") { blurX = 6.0; }
        if (typeof blurY === "undefined") { blurY = 6.0; }
        if (typeof strength === "undefined") { strength = 2; }
        if (typeof quality === "undefined") { quality = null; }
        if (typeof inner === "undefined") { inner = false; }
        if (typeof knockout === "undefined") { knockout = false; }
        return new GlowFilter(blurX, blurY);
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
/// <reference path="../Scripting.d.ts" />
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
            this._id = id;
            this._visible = true;
        }
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
                "name": methodName,
                "value": params
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

        /** AS3 Stuff **/
        DisplayObject.prototype.dispatchListener = function (event, data) {
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

        DisplayObject.prototype.remove = function () {
            // Remove itself
            if (this._parent !== null) {
                this._parent.removeChild(this);
            }
            this.unload();
        };

        /** Common Functions **/
        DisplayObject.prototype.serialize = function () {
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
        return Sprite;
    })(Display.DisplayObject);
    Display.Sprite = Sprite;
})(Display || (Display = {}));
/**
* MotionManager Polyfill for AS3.
* Author: Jim Chen
* Part of the CCLScripter
*/
/// <reference path="DisplayObject.ts" />
var Display;
(function (Display) {
    var MotionManager = (function () {
        function MotionManager(o) {
            this._isRunning = false;
            this.oncomplete = null;
        }
        Object.defineProperty(MotionManager.prototype, "running", {
            get: function () {
                return this._isRunning;
            },
            enumerable: true,
            configurable: true
        });

        MotionManager.prototype.reset = function () {
        };

        MotionManager.prototype.play = function () {
            this._isRunning = false;
        };

        MotionManager.prototype.stop = function () {
            this._isRunning = true;
        };

        MotionManager.prototype.forecasting = function (time) {
            return false;
        };

        MotionManager.prototype.setPlayTime = function (playtime) {
        };

        MotionManager.prototype.initTween = function (motion, repeat) {
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


        CommentButton.prototype.remove = function () {
            this.unload();
        };

        CommentButton.prototype.initStyle = function (style) {
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


        CommentCanvas.prototype.remove = function () {
            this.unload();
        };

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
            this.initStyle(params);
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


        CommentShape.prototype.remove = function () {
            this.unload();
        };

        CommentShape.prototype.initStyle = function (style) {
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
    var TextField = (function (_super) {
        __extends(TextField, _super);
        function TextField() {
            _super.apply(this, arguments);
        }
        return TextField;
    })(Display.DisplayObject);
    Display.TextField = TextField;
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
            _super.call(this);
            this._mM = new Display.MotionManager(this);
            this.initStyle(params);
            Runtime.registerObject(this);
        }
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


        CommentField.prototype.remove = function () {
            this.unload();
        };

        CommentField.prototype.initStyle = function (style) {
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
            return "CCLDisplay/1.0 HTML5/* (bilibili, like BSE, like flash, AS3 compatible)";
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
})(Display || (Display = {}));

var $ = Display;
