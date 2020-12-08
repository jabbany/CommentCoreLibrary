/// <reference path="../OOAPI.d.ts" />
/// <reference path="DisplayObject.ts" />
/// <reference path="ByteArray.ts" />

module Display {

  class DirtyArea {
    private _xBegin:number = null;
    private _yBegin:number = null;
    private _xEnd:number = null;
    private _yEnd:number = null;

    public expand(x:number, y:number) {
      this._xBegin = this._xBegin === null ? x : Math.min(this._xBegin, x);
      this._xEnd = this._xEnd === null ? x : Math.max(this._xEnd, x);
      this._yBegin = this._yBegin === null ? y :Math.min(this._yBegin, y);
      this._yEnd = this._xEnd === null ? y :Math.max(this._yEnd, y);
    }

    public asRect():Rectangle {
      if (this.isEmpty()) {
        return new Rectangle(0, 0, 0, 0);
      }
      return new Rectangle(this._xBegin,
        this._yBegin,
        this._xEnd - this._xBegin,
        this._yEnd - this._yBegin);
    }

    public isEmpty():boolean {
      return this._xBegin === null || this._yBegin === null ||
        this._xEnd === null || this._yEnd === null;
    }

    public reset():void {
      this._xBegin = null;
      this._xEnd = null;
      this._yBegin = null;
      this._yEnd = null;
    }
  }

  /**
   * Bitmap AS3 Polyfill class
   * Note: This is NOT equivalent to the Bitmap library class of the same name!
   * @author Jim Chen
   */
  export class Bitmap extends DisplayObject {
    private _bitmapData:BitmapData | null = null;

    constructor(bitmapData:BitmapData | null = null) {
      super(Runtime.generateId('obj-bmp'));
      this._bitmapData = bitmapData;
    }

    get width():number {
      console.log(this._bitmapData);
      return this._bitmapData !== null ?
        this._bitmapData.width * this.scaleX : 0;
    }

    get height():number {
      return this._bitmapData !== null ?
        this._bitmapData.height * this.scaleY : 0;
    }

    set width(w:number) {
      if (this._bitmapData !== null && this._bitmapData.width > 0) {
        this.scaleX = w / this._bitmapData.width;
      }
    }

    set height(h:number) {
      if (this._bitmapData !== null && this._bitmapData.height > 0) {
        this.scaleY = h / this._bitmapData.height;
      }
    }

    public getBitmapData():BitmapData {
      return this._bitmapData;
    }

    public setBitmapData(bitmapData:BitmapData):void {
      if (typeof bitmapData !== 'undefined') {
        this._bitmapData = bitmapData;
        // Propagate up
        this.methodCall('setBitmapData', bitmapData.getId());
      }
    }

    public serialize():Object {
      var serialized:Object = super.serialize();
      serialized["class"] = 'Bitmap';
      if (this._bitmapData !== null) {
        serialized["bitmapData"] = this._bitmapData.getId();
      }
      return serialized;
    }
	}

  /**
   * BitmapData Polyfill class
   * @author Jim Chen
   */
  export class BitmapData implements Runtime.RegisterableObject {
    private _id:string;
    private _rect:Rectangle;
    private _locked:boolean = false;
    private _dirtyArea:DirtyArea;
    private _transparent:boolean;
    private _fillColor:number;
    private _byteArray:Array<number>;

    constructor(width:number,
      height:number,
      transparent:boolean = true,
      fillColor:number = 0xffffffff,
      id:string = Runtime.generateId('obj-bmp-data')) {

      this._id = id;
      this._rect = new Rectangle(0, 0, width, height);
      this._transparent = transparent;
      this._fillColor = fillColor;

      this._dirtyArea = new DirtyArea();

      this._fill();

      // Register this
      Runtime.registerObject(this);
    }

    private _fill():void {
      this._byteArray = [];
      for (var i = 0; i < this._rect.width * this._rect.height; i++) {
        this._byteArray.push(this._fillColor);
      }
    }

    private _updateBox(changeRect:Rectangle = null):void {
      if (this._dirtyArea.isEmpty()) {
        // Don't update anything if nothing was changed
        return;
      }
      if (this._locked) {
        // Don't send updates if this is locked
        return;
      }
      var change:Rectangle = changeRect === null ? this._dirtyArea.asRect() :
        changeRect;

      // Make sure we're not out-of-bounds
      if (!this._rect.containsRect(change)) {
        __trace('BitmapData._updateBox box ' + change.toString() +
          ' out of bonunds ' + this._rect.toString(), 'err');
        throw new Error('Rectangle provided was not within image bounds.');
      }
      // Extract the values
      var region:Array<number> = [];
      for (var i = 0; i < change.height; i++) {
        for (var j = 0; j < change.width; j++) {
          region.push(this._byteArray[(change.y + i) * this._rect.width +
              change.x + j]);
        }
      }
      this._methodCall('updateBox', {
        'box': change.serialize(),
        'values': region
      });
      this._dirtyArea.reset();
    }

    private _methodCall(methodName:string, params:any):void {
      __pchannel("Runtime:CallMethod", {
        "id": this._id,
        "method": methodName,
        "params": params
      });
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

    set height(_height:number) {
      __trace('BitmapData.height is read-only', 'warn');
    }

    set width(_width:number) {
      __trace('BitmapData.height is read-only', 'warn');
    }

    set rect(_rect:Rectangle) {
      __trace('BitmapData.rect is read-only', 'warn');
    }

    public draw(source:DisplayObject|BitmapData,
      matrix:Matrix = null,
      colorTransform:ColorTransform = null,
      blendMode:string = null,
      clipRect:Rectangle = null,
      smoothing:boolean = false):void {
      if (!(source instanceof BitmapData)) {
        __trace('Drawing non BitmapData is not supported!', 'err');
        return;
      }
      if (matrix !== null) {
        __trace('Matrix transforms not supported yet.', 'warn');
      }
      if (colorTransform !== null) {
        __trace('Color transforms not supported yet.', 'warn');
      }
      if (blendMode !== null && blendMode !== 'normal') {
        __trace('Blend mode [' + blendMode + '] not supported yet.', 'warn');
      }
      if (smoothing !== false) {
        __trace('Smoothign not supported!', 'warn');
      }
      this.lock();
      if (clipRect === null) {
        clipRect = new Rectangle(0, 0, source.width, source.height);
      }
      this.setPixels(clipRect, source.getPixels(clipRect));
      this.unlock();
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
          (this._byteArray[y * this._rect.width + x] & 0x00ffffff) + 0xff000000;
      } catch (e) {
        return this._fillColor;
      }
    }

    public getPixels(rect:Rectangle):ByteArray {
      if (typeof rect === 'undefined' || rect === null) {
        throw new Error('Expected a region to acquire pixels.');
      }
      if (rect.width === 0 || rect.height === 0) {
        return new ByteArray();
      }
      var region:ByteArray = new ByteArray();
      for (var i = 0; i < rect.height; i++) {
        this._byteArray.slice((rect.y + i) * this._rect.width + rect.x,
          (rect.y + i) * this._rect.width + rect.x + rect.width).forEach(function (v) {
            region.push(v)
          });
      }
      return region;
    }

    public setPixel(x:number, y:number, color:number):void {
      // Force alpha channel to be full
      this.setPixel32(x, y, (color & 0x00ffffff) + 0xff000000);
    }

    public setPixel32(x:number, y:number, color:number):void {
      if (!this._transparent) {
        // Force alpha channel
        color = (color & 0x00ffffff) + 0xff000000;
      }
      this._byteArray[y * this._rect.width + x] = color;
      this._dirtyArea.expand(x, y);
      this._updateBox();
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
      if (!this._transparent) {
        input = input.map(function (color) {
          return (color & 0x00ffffff) + 0xff000000;
        });
      }
      for (var i = 0; i < rect.width; i++) {
        for (var j = 0; j < rect.height; j++) {
          this._byteArray[(rect.y + j) * this.width + (rect.x + i)] =
            input[j * rect.width + i];
            this._dirtyArea.expand(i, j);
        }
      }
      this._updateBox();
    }

    public getVector(rect:Rectangle):Array<number> {
      if (this._rect.equals(rect)) {
        return this._byteArray;
      }
      var vector:Array<number> = [];
      for (var j = rect.y; j < rect.y + rect.height; j++) {
        for (var i = rect.x; i < rect.x + rect.width; i++) {
          vector.push(rect[j * this._rect.width + i]);
        }
      }
      return vector;
    }

    public lock():void {
      this._locked = true;
    }

    public unlock(changeRect:Rectangle = null):void {
      this._locked = false;
      if (changeRect == null) {
        this._updateBox();
      } else {
        this._updateBox(changeRect);
      }
    }

    public dispatchEvent(_event:string, _data?:any):void {

    }

    public getId():string {
      return this._id;
    }

    public serialize():Object {
      return {
        'class':'BitmapData',
        'width': this._rect.width,
        'height': this._rect.height,
        'fill': this._fillColor
      };
    }

    public unload():void {
      this._methodCall('unload', null);
    }

    public clone():BitmapData {
      var data = new BitmapData(this.width, this.height,
        this._transparent, this._fillColor);
      data._byteArray = this._byteArray.slice(0);
      data._updateBox(data._rect);
      return data;
    }
  }
}
