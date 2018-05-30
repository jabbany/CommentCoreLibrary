/// <reference path="DisplayObject.ts" />
/// <reference path="Graphics.ts" />

module Display {
  /**
   * Sprite Polyfill for AS3. Is also a UIComponent.
   * @author Jim Chen
   */
  export class Sprite extends DisplayObject {
    private _graphics:Graphics;
    private _mouseEnabled:boolean = true;
    private _mousePosition:Point = new Point(0, 0);
    private _useHandCursor:boolean = false;

    constructor(id?:string) {
      super(id);
      this._graphics = new Graphics(this);
    }

    get graphics():Graphics {
      return this._graphics;
    }

    set graphics(g:Graphics) {
      __trace('Sprite.graphics is read-only.', 'warn');
    }

    get mouseEnabled():boolean {
      return this._mouseEnabled;
    }

    set mouseEnabled(enabled:boolean) {
      this._mouseEnabled = enabled;
      this.propertyUpdate('mouseEnabled', enabled);
    }

    get useHandCursor():boolean {
      return this._useHandCursor;
    }

    set useHandCursor(use:boolean) {
      this._useHandCursor = use;
      this.propertyUpdate('useHandCursor', use);
    }

    public serialize():Object {
      var serialized:Object = super.serialize();
      serialized['class'] = 'Sprite';
      return serialized;
    }
  }

  /**
   * Special sprite used for the root sprite
   * @author Jim Chen
   */
  export class RootSprite extends Sprite {
    constructor() {
      super('__root');
    }

    get parent():DisplayObject {
      __trace('SecurityError: No access above root sprite.','err');
      return null;
    }
  }

  export class UIComponent extends Sprite {
    private _styles:{[name:string]:any} = {};

    constructor(id?:string) {
      super(id);
    }

    /**
     * Clears the style for the UIComponent which this is
     * @param style - style to clear
     */
    public clearStyle(style:string):void {
      delete this._styles[style];
    }

    /**
     * Get the style for the UIComponent which this is
     * @param style - style to set
     * @return value - value of that style
     */
    public getStyle(style:string):any {
      return this._styles[style];
    }

    /**
     * Set the style for the UIComponent which this is
     * @param styleProp - style to set
     * @param value - value to set the style to
     */
    public setStyle(styleProp:string, value:any):void {
      __trace("UIComponent.setStyle not implemented", "warn");
      this._styles[styleProp] = value;
    }

    public setFocus():void {
      this.methodCall("setFocus", null);
    }

    public setSize(width:number, height:number):void {
      this.width = width;
      this.height = height;
    }

    public move(x:number, y:number):void {
      this.x = x;
      this.y =y;
    }
  }
}
