/// <reference path="../OOAPI.d.ts"/>

/// <reference path="ISerializable.ts"/>
module Display {
  export class ColorTransform implements ISerializable {
    public alphaMultiplier:number;
    public alphaOffset:number;
    public blueMultiplier:number;
    public blueOffset:number;
    public greenMultiplier:number;
    public greenOffset:number;
    public redMultiplier:number;
    public redOffset:number;

    constructor(redMultiplier: number = 1,
      greenMultiplier: number = 1,
      blueMultiplier: number = 1,
      alphaMultiplier: number = 1,
      redOffset: number = 0,
      greenOffset: number = 0,
      blueOffset: number = 0,
      alphaOffset: number = 0) {

      this.redMultiplier = redMultiplier;
      this.greenMultiplier = greenMultiplier;
      this.blueMultiplier = blueMultiplier;
      this.alphaMultiplier = alphaMultiplier;
      this.redOffset = redOffset;
      this.greenOffset = greenOffset;
      this.blueOffset = blueOffset;
      this.alphaOffset = alphaOffset;
    }

    get color():number {
      return this.redOffset << 16 | this.greenOffset << 8 | this.blueOffset;
    }

    set color(color:number) {
      this.redOffset = (( color >> 16 ) & 0xFF);
      this.greenOffset = (( color >> 8 ) & 0xFF);
      this.blueOffset = color & 0xFF;
      this.redMultiplier = 0;
      this.greenMultiplier = 0;
      this.blueMultiplier = 0;
    }

    public concat(second:ColorTransform):void {
      this.redMultiplier *= second.redMultiplier;
      this.greenMultiplier *= second.greenMultiplier;
      this.blueMultiplier *= second.blueMultiplier;
      this.alphaMultiplier *= second.alphaMultiplier;
      this.redOffset += second.redOffset;
      this.greenOffset += second.greenOffset;
      this.blueOffset += second.blueOffset;
      this.alphaOffset += second.alphaOffset;
    }

    public serialize():Object {
      return {
        'class': 'ColorTransform',
        'red': {
          'offset': this.redOffset,
          'multiplier': this.redMultiplier
        },
        'green': {
          'offset': this.greenOffset,
          'multiplier': this.greenMultiplier
        },
        'blue': {
          'offset': this.blueOffset,
          'multiplier': this.blueMultiplier
        },
        'alpha': {
          'offset': this.alphaOffset,
          'multiplier': this.alphaMultiplier
        }
      };
    }
  }

  export function createColorTransform(redMultiplier: number = 1,
    greenMultiplier: number = 1,
    blueMultiplier: number = 1,
    alphaMultiplier: number = 1,
    redOffset: number = 0,
    greenOffset: number = 0,
    blueOffset: number = 0,
    alphaOffset: number = 0):ColorTransform {

    return new ColorTransform(redMultiplier,
      greenMultiplier,
      blueMultiplier,
      alphaMultiplier,
      redOffset,
      greenOffset,
      blueOffset,
      alphaOffset);
  }
}
