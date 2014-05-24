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
        function Transform() {
        }
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
            this._transform = new Transform();
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
                this.propertyUpdate("filters", filters);
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


        Object.defineProperty(DisplayObject.prototype, "transform", {
            get: function () {
                return this._transform;
            },
            set: function (t) {
                this._transform = t;
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
* Display Adapter
* Author: Jim Chen
*/
/// <reference path="../OOAPI.d.ts" />
/// <reference path="Sprite.ts" />
/// <reference path="DisplayObject.ts" />
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
            __pchannel("Display:SetFrameRate", value);
        }
    });
})(Display || (Display = {}));

/// <reference path="CommentButton.ts" />
/// <reference path="CommentCanvas.ts" />
/// <reference path="CommentShape.ts" />
/// <reference path="CommentField.ts" />
var $ = Display;
