/// <reference path="../OOAPI.d.ts" />
/// <reference path="DisplayObject.ts" />

module Display {

  /**
   * Bitmap AS3 Polyfill class
   * Note: This is NOT equivalent to the Bitmap library class of the same name!
   * @author Jim Chen
   */
  export class Bitmap extends DisplayObject {

	}

  /**
   * BitmapData Polyfill class
   * @author Jim Chen
   */
  export class BitmapData {
    private _rect:Rectangle;
    private _transparent:boolean;
    private _fillColor:number;
    private _byteArray:Array<number>;

    constructor(width:number,
      height:number,
      transparent:boolean = true,
      fillColor:number = 0xffffffff) {

      this._rect = new Rectangle(0, 0, width, height);
      this._transparent = transparent;
      this._fillColor = fillColor;
      this._fill();
    }

    private _fill():void {
      this._byteArray = [];
      for (var i = 0; i < this._rect.width * this._rect.height; i++) {
        this._byteArray.push(this._fillColor);
      }
    }

    get height():number {
      return this._rect.height;
    }

    get width():number {
      return this._rect.width;
    }

    get rect():Rectangle {
      return this._rect;
    }

    set height(height:number) {
      __trace('BitmapData.height is read-only', 'warn');
    }

    set width(width:number) {
      __trace('BitmapData.height is read-only', 'warn');
    }

    set rect(rect:Rectangle) {
      __trace('BitmapData.rect is read-only', 'warn');
    }

    public getPixel(x:number, y:number):number {
      return this.getPixel32(x, y) & 0x00ffffff;
    }

    public getPixel32(x:number, y:number):number {
      if (x >= this._rect.width || y >= this._rect.height ||
          x < 0 || y < 0) {
        throw new Error('Coordinates out of bounds');
      }
      try {
        return this._transparent ? this._byteArray[y * this._rect.width + x] :
          this._byteArray[y * this._rect.width + x] + 0xff000000;
      } catch (e) {
        return this._fillColor;
      }
    }

    public getPixels(rect:Rectangle):Array<number> {
      if (typeof rect === 'undefined' || rect === null) {
        throw new Error('Expected a region to acquire pixels.');
      }
      if (rect.width === 0 || rect.height === 0) {
        return [];
      }
      var region:Array<number> = [];
      for (var i = 0; i < rect.height; i++) {
        Array.prototype.push.apply(region,
          this._byteArray.slice((rect.y + i) * this._rect.width + rect.x,
            (rect.y + i) * this._rect.width + rect.x + rect.width));
      }
      return region;
    }

    public setPixel(x:number, y:number, color:number):void {
      this.setPixel32(x, y, color);
    }

    public setPixel32(x:number, y:number, color:number):void {
      if (!this._transparent) {
        color = color & 0x00ffffff;
      } else {
        color = color & 0xffffffff;
      }
      this._byteArray[y * this._rect.width + x] = color;
    }

    public setPixels(rect:Rectangle, input:Array<number>):void {
      if (rect.width === 0 || rect.height === 0) {
        return;
      }
      // Test if the input is correct length
      if (input.length !== rect.width * rect.height) {
        throw new Error('setPixels expected ' + (rect.width * rect.height) +
          ' pixels, but actually got ' + input.length);
      }
      for (var i = 0; i < rect.width; i++) {
        for (var j = 0; j < rect.height; j++) {
          this._byteArray[(rect.y + j) * this.width + (rect.x + i)] =
            input[j * rect.width + i];
        }
      }
    }

    public serialize():Object {
      return {
        'class':'BitmapData'
      };
    }
  }
}
