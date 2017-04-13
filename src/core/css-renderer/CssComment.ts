/**
 * Basic CSS Accelerated Comment Abstraction
 *
 * @author Jim Chen
 * @license MIT License
 * @description Comment abstraction based on CSS3 implementation
 */
/// <reference path="../Comment.ts" />
class CssCompatLayer {
    public static transform(dom:HTMLDivElement, trans:string):void{
        dom.style.transform = trans;
        dom.style["webkitTransform"] = trans;
        dom.style["msTransform"] = trans;
        dom.style["oTransform"] = trans;
    }
}

class CssScrollComment extends ScrollComment {
    private _dirtyCSS:boolean = true;
    set x(x:number){
        if(typeof this._x === "number") {
            var dx:number = x - this._x;
            this._x = x;
            CssCompatLayer.transform(this.dom, "translateX(" + dx + "px)");
        }else{
            this._x = x;
            if (!this.absolute) {
                this._x *= this.parent.width;
            }
            if (this.align % 2 === 0) {
                this.dom.style.left = this._x + "px";
            } else {
                this.dom.style.right = this._x + "px";
            }
        }
    }
    get x():number{
        return (this.ttl / this.dur) * (this.parent.width + this.width) - this.width;
    }
    public update():void{
        if(this._dirtyCSS){
            this.dom.style.transition = "transform " + this.ttl + "ms linear";
            this.x = - this.width;
            this._dirtyCSS = false;
        }
    }

    public invalidate():void{
        super.invalidate();
        this._dirtyCSS = true;
    }

    /**
     * Override the toplevel stop to actually stop the CSS.
     */
    public stop():void{
        this.dom.style.transition = "";
        this.x = this._x;
        this._x = null;
        this.x = (this.ttl / this.dur) * (this.parent.width + this.width) - this.width;
        this._dirtyCSS = true;
    }
}
