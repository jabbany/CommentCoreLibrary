/// <reference path="Bitmap.ts" />
/// <reference path="IComment.ts" />
/// <reference path="MotionManager.ts" />

module Display {

  /**
   * Compliant CommentBitmap Polyfill For BiliScriptEngine
   */
  export class CommentBitmap extends Bitmap implements IComment {
    private _mM:MotionManager = new MotionManager(this);

    constructor(params:Object) {
      super('bitmapData' in params ? params['bitmapData'] : undefined);
      this.initStyle(params);
      Runtime.registerObject(this);
      this.bindParent(params);
      this._mM.play();
    }

    get motionManager():MotionManager {
      return this._mM;
    }

    set motionManager(_m) {
      __trace("IComment.motionManager is read-only", "warn");
    }

    private bindParent(params:Object):void {
      if (params.hasOwnProperty("parent")) {
        (<DisplayObject> params["parent"]).addChild(this);
      }
    }

    public initStyle(style:Object):void {
      if (typeof style === 'undefined' || style === null) {
        style = {};
      }
      if ("lifeTime" in style) {
        this._mM.dur = style["lifeTime"] * 1000;
      }
    }
  }

  export function createBitmap(params:Object):any {
    return new CommentBitmap(params);
  }

  export function createParticle(params:Object):any {
    __trace('Bitmap.createParticle not implemented', 'warn');
    return new CommentBitmap(params);
  }

  export function createBitmapData(width:number,
    height:number,
    transparent:boolean = true,
    fillColor:number = 0xffffffff):any {

    return new Display.BitmapData(width, height, transparent, fillColor);
  }
}

/**
 * LibBitmap "library" built to be loaded by BSE.
 * This is auto loaded ever since a certain version so we actually don't care if we
 * throw this into the global namespace
 */
module Bitmap {
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
    height:number):Display.Rectangle {

    return new Display.Rectangle(x, y, width, height);
  }
}
