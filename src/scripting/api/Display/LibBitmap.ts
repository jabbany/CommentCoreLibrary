import * as Display from './CommentBitmap';
import { Rectangle } from './DisplayObject';

/**
 * LibBitmap "library" built to be loaded by BSE.
 * This is auto loaded ever since a certain version so we actually don't care if we
 * throw this into the global namespace (as Bitmap, see ../Display.ts)
 */
export function createBitmap(params:Object):any {
  return Display.createBitmap(params);
}

export function createParticle(params:Object):any {
  return Display.createParticle(params);
}

export function createBitmapData(width:number,
  height:number,
  transparent:boolean = true,
  fillColor:number = 0xffffffff):any {

  return Display.createBitmapData(width, height, transparent, fillColor);
}

export function createRectangle(x:number,
  y:number,
  width:number,
  height:number):Rectangle {

  return new Rectangle(x, y, width, height);
}
