"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Comment_1 = require("../Comment");
var CssCompatLayer = (function () {
    function CssCompatLayer() {
    }
    CssCompatLayer.transform = function (dom, trans) {
        dom.style.transform = trans;
        dom.style.webkitTransform = trans;
    };
    return CssCompatLayer;
}());
var CssScrollComment = (function (_super) {
    __extends(CssScrollComment, _super);
    function CssScrollComment() {
        _super.apply(this, arguments);
        this._dirtyCSS = true;
    }
    Object.defineProperty(CssScrollComment.prototype, "x", {
        get: function () {
            return (this.ttl / this.dur) * (this.parent.width + this.width) - this.width;
        },
        set: function (x) {
            if (this._x !== null && typeof this._x === 'number') {
                var dx = x - this._x;
                this._x = x;
                CssCompatLayer.transform(this.dom, 'translateX(' +
                    (this.axis % 2 === 0 ? dx : -dx) + 'px)');
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
            this.dom.style.transition = 'transform ' + this.ttl + 'ms linear';
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
}(Comment_1.ScrollComment));
exports.CssScrollComment = CssScrollComment;
