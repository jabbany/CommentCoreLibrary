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
            if (typeof this._x === "number") {
                var dx = x - this._x;
                this._x = x;
                CssCompatLayer.transform(this.dom, "translateX(" + dx + "px)");
            }
            else {
                this._x = x;
                if (!this.absolute) {
                    this._x *= this.parent.width;
                }
                if (this.align % 2 === 0) {
                    this.dom.style.left = this._x + "px";
                }
                else {
                    this.dom.style.right = this._x + "px";
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
        this.dom.style.transition = "";
        this.x = this._x;
        this._x = null;
        this.x = (this.ttl / this.dur) * (this.parent.width + this.width) - this.width;
        this._dirtyCSS = true;
    };
    return CssScrollComment;
}(ScrollComment));
//# sourceMappingURL=CssComment.js.map