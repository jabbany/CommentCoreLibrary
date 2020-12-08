/// <reference path="../OOAPI.d.ts" />
/// <reference path="DisplayObject.ts" />

module Display {
  export class ByteArray extends Array<number> {
    private _readPosition:number = 0;

    constructor(...params) {
      super(...params);
      try {
        Object['setPrototypeOf'](this, ByteArray.prototype);
      } catch (e) {}
    }

    get bytesAvailable():number {
      return this.length - this._readPosition;
    }

    set bytesAvailable(_n:number) {
      __trace('ByteArray.bytesAvailable is read-only', 'warn');
    }

    get position():number {
      return this._readPosition;
    }

    set position(p:number) {
      this._readPosition = p;
    }

    public clear():void {
      this.length = 0;
      this._readPosition = 0;
    }

    public compress(algorithm:string = 'zlib'):void {
      __trace('ByteArray.compress[' + algorithm + '] not implemented', 'warn');
      this._readPosition = 0;
    }

    public uncompress(algorithm:string = 'zlib'):void {
      __trace('ByteArray.uncompress[' + algorithm +
        '] not implemented', 'warn');
      this._readPosition = 0;
    }

    public deflate():void {
      __trace('ByteArray.deflate not implemented', 'warn');
    }

    public inflate():void {
      __trace('ByteArray.inflate not implemented', 'warn');
    }

    public readUTFBytes(length:number):string {
      // Get length
      var subArray:Array<number> = this.slice(this._readPosition, length);
      this._readPosition += Math.min(length, this.length - this._readPosition);
      var str:string = '';
      subArray.forEach((cc) => {
        str += String.fromCharCode(cc);
      })
      return str;
    }

    public readUnsignedByte():number {
      return this[this._readPosition] & 0xff;
    }

    public readUnsignedShort():number {
      var top:number = this.readUnsignedByte(),
        bottom:number = this.readUnsignedByte();
      return ((top << 8) + bottom) & 0xffff;
    }

    public readUnsignedInt():number {
      var a:number = this.readUnsignedByte(),
        b:number = this.readUnsignedByte(),
        c:number = this.readUnsignedByte(),
        d:number = this.readUnsignedByte();
      return ((a << 24) + (b << 16) + (c << 8) + d) & 0xffffffff;
    }

    public readByte():number {
      return this.readUnsignedByte() - 128;
    }

    public readShort():number {
      return this.readUnsignedShort() - 0x7fff;
    }

    public readBoolean():boolean {
      return this.readUnsignedByte() !== 0;
    }

    public readFloat():number {
      var source:number = this.readUnsignedInt();
      var fval = 0.0;
      var x = (source & 0x80000000)?-1:1;
      var m = ((source >> 23) & 0xff);//mantissa
      var s = (source & 0x7fffff);//sign
      switch(x) {
        case 0:
          break;
        case 0xFF:
          if (m) {
            fval = NaN;
          } else if (s > 0) {
            fval = Number.POSITIVE_INFINITY;
          } else {
            fval = Number.NEGATIVE_INFINITY;
          }
          break;
        default:
          x -= 127;
          m += 0x800000;
          fval = s * (m / 8388608.0) * Math.pow(2, x);
          break;
      }
      return fval;
    }

    public writeByte(value:number):void {
      this.push(value & 0xff);
    }

    public writeBytes(bytes:number[], offset:number = 0, length:number = 0) {
      for (var i = offset; i < Math.min(bytes.length - offset, length); i++) {
        this.writeByte(bytes[i]);
      }
    }

    public writeUTFBytes(value:string):void {
      var bytesString:string = unescape(encodeURIComponent(value));
      for (var i = 0; i < value.length; i++) {
        this.push(bytesString.charCodeAt(i));
      }
    }

    public clone():ByteArray {
      var cloned:ByteArray = new ByteArray();
      this.forEach(function (item) { cloned.push(item) });
      return cloned;
    }
  }
}
