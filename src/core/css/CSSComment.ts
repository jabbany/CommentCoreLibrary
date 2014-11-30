/**
 * Basic CSS Accelerated Comment Abstraction
 *
 * @author Jim Chen
 * @license MIT License
 * @description Comment abstraction based on CSS3 implementation
 */
/// <reference path="../Comment.ts" />
class CSSScrollComment extends ScrollComment{
    private _dirtyCSS:boolean = true;
    public update():void{
        if(this._dirtyCSS){
            this.dom.style.transition = "left " + this.ttl + "ms linear, right " + this.ttl + "ms linear";
            this.x = - this.width;
            this._dirtyCSS = false;
        }
    }

    public invalidate():void{
        super.invalidate();
        this._dirtyCSS = true;
    }

    public stop():void{
        this.dom.style.transition = "";
        this.x = (this.ttl / this.dur) * (this.parent.width + this.width) - this.width;
        this._dirtyCSS = true;
    }
}