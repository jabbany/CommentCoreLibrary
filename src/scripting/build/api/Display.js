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
    var DisplayObject = (function () {
        function DisplayObject(id) {
            if (typeof id === "undefined") { id = Runtime.getId(); }
            this._alpha = 1;
            this._x = 0;
            this._y = 0;
            this._scaleX = 1;
            this._scaleY = 1;
            this._filters = [];
            this._id = id;
        }
        DisplayObject.prototype.propertyUpdate = function (propertyName, updatedValue) {
            __pchannel("Runtime:UpdateProperty", {
                "id": this._id,
                "name": propertyName,
                "value": updatedValue
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

        /** AS3 Stuff **/
        DisplayObject.prototype.addEventListener = function (event, listener) {
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
    var _root = new Display.Sprite();
    Object.defineProperty(Display, 'root', {
        get: function () {
            return _root;
        },
        set: function (value) {
            __trace("Display.root is read-only", "warn");
        }
    });
})(Display || (Display = {}));

/// <reference path="CommentButton.ts" />
/// <reference path="CommentCanvas.ts" />
/// <reference path="CommentShape.ts" />
/// <reference path="CommentField.ts" />
var $ = Display;
