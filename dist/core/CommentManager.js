"use strict";
var CommentFactory_1 = require("./CommentFactory");
var CommentManager = (function () {
    function CommentManager(stage) {
        this._width = 0;
        this._height = 0;
        this._status = "stopped";
        this._listeners = {};
        this._csa = {};
        this.options = {
            "global": {
                "scale": 1,
                "opacity": 1,
                "className": "cmt"
            },
            "scroll": {
                "scale": 1,
                "opacity": 1
            },
            "scripting": {
                "mode": [8],
                "engine": null
            }
        };
        this.timeline = [];
        this.runline = [];
        this.position = 0;
        this._stage = stage;
    }
    Object.defineProperty(CommentManager.prototype, "width", {
        get: function () {
            return this._width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommentManager.prototype, "height", {
        get: function () {
            return this._height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommentManager.prototype, "stage", {
        get: function () {
            return this._stage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommentManager.prototype, "status", {
        get: function () {
            return this._status;
        },
        enumerable: true,
        configurable: true
    });
    CommentManager.prototype.init = function () {
        this.factory = CommentFactory_1.CommentFactory.defaultCssRenderFactory();
    };
    CommentManager.prototype.start = function () {
        this._status = "running";
    };
    CommentManager.prototype.stop = function () {
        this._status = "stopped";
        for (var i = 0; i < this.runline.length; i++) {
            this.runline[i].stop();
        }
    };
    CommentManager.prototype.load = function (data) {
        this.timeline = data;
    };
    CommentManager.prototype.insert = function (data) {
    };
    CommentManager.prototype.clear = function () {
        while (this.runline.length > 0) {
            this.runline[0].finish();
        }
    };
    CommentManager.prototype.send = function (data) {
        if (!data.hasOwnProperty("mode")) {
            data.mode = 1;
        }
        if (this.options.scripting.mode.indexOf(data.mode) >= 0) {
            if (this.options.scripting.engine !== null) {
                this.options.scripting.engine.eval(data.code);
            }
            return;
        }
        this.runline.push(this.factory.create(this, data));
    };
    CommentManager.prototype.setBounds = function (width, height) {
        if (width === void 0) { width = this.stage.offsetWidth; }
        if (height === void 0) { height = this.stage.offsetHeight; }
        this._width = width;
        this._height = height;
        this.dispatchEvent("resize");
        for (var allocator in this._csa) {
            if (this._csa.hasOwnProperty(allocator)) {
                var csa = this._csa[allocator];
                csa.setBounds(this._width, this._height);
            }
        }
        this.stage.style.perspective = this.width * Math.tan(55 * Math.PI / 180) / 2 + "px";
        this.stage.style["webkitPerspective"] = this.width * Math.tan(55 * Math.PI / 180) / 2 + "px";
    };
    CommentManager.prototype.dispatchEvent = function (name, data) {
        if (data === void 0) { data = null; }
        if (this._listeners.hasOwnProperty(name)) {
            var listenerList = this._listeners[name];
            for (var i = 0; i < listenerList.length; i++) {
                try {
                    listenerList[i](data);
                }
                catch (e) {
                    console.warn(e);
                }
            }
        }
    };
    CommentManager.prototype.addEventListener = function (name, listener) {
        if (this._listeners.hasOwnProperty(name)) {
            this._listeners[name].push(listener);
        }
        else {
            this._listeners[name] = [listener];
        }
    };
    CommentManager.prototype.finish = function (cmt) {
        var index = this.runline.indexOf(cmt);
        if (index >= 0) {
            this.runline.splice(index, 1);
        }
    };
    return CommentManager;
}());
exports.CommentManager = CommentManager;
