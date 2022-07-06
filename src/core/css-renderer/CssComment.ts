/**
 * Basic CSS Accelerated Comment Abstraction
 *
 * @author Jim Chen
 * @license MIT License
 * @description Comment abstraction based on CSS3 implementation
 */
/// <reference path="../Comment.ts" />

class CssScrollComment extends ScrollComment {
  // Marker for whether we need to re-create the CSS or not
  private _dirtyCSS:boolean = true;

  public init(recycle:IComment = null):void {
    super.init(recycle);
    this._toggleClass('css-optimize', true);
  }

  protected _calculateX():number {
    var width = (typeof this._width === 'undefined') ? 0 : this.width;
    var x = (this.ttl / this.dur) * (this.parent.width + width) - width;
    return (!this.absolute) ? (x / this.parent.width) : x;
  }

  get x():number{
    return this._calculateX();
  }

  set x(x:number) {
    /*
      Re-pivot x to animate from the current _x location.
     */
    // Convert to pixel space
    if (!this.absolute) {
       x *= this.parent.width;
    }
    var dx:number = x - this._calculateX();
    this.dom.style.transform =
      "translateX(" + (this.axis % 2 === 0 ? dx : -dx) + "px)" +
      (this._transform === null || this._transform.isIdentity() ?
        '' : (' ' + this._transform.toCss()));

    if (this.axis % 2 === 0) {
      // x-axis towards right
      this.dom.style.left = this._calculateX() + 'px';
    } else {
      // x-axis towards left
      this.dom.style.right = this._calculateX() + 'px';
    }
  }

  public update():void{
    /*
      This is called by the update manager
      Since CSS updates are very different, super should not be called.
    */
    if (this._dirtyCSS) {
      // Recreate the CSS
      this.dom.style.transition = "transform " + this.ttl + "ms linear";
      this.x = - this.width;
      this._dirtyCSS = false;
    }
  }

  public invalidate():void{
    super.invalidate();
    this._dirtyCSS = true;

    if (!this.dom) {
      return; // DOM not created yet, do nothing
    } else {
      // Clear the transition to prepare for a rewrite
      this.dom.style.transition = '';
      this.x = this.x;
    }
  }

  /**
   * Override the toplevel stop to actually stop the CSS.
   */
  public stop():void{
    super.stop();
    this.invalidate();
  }
}
