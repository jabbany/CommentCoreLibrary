/// <reference path="../Runtime.d.ts"/>
module Player{
  /**
   * Class for sound support
   */
  class Sound implements Runtime.RegisterableObject {
    private _id:string;
    private _source:string;
    private _isPlaying:boolean = false;
    public onload:Function;

    constructor(type:string, onload:Function) {
      this._id = Runtime.generateId('obj-snd');
      this.onload = onload;
      this._source = type;
    }

    public createFromURL(url:string):void {
      this._source = url;
    }

    public play():void {
      if (this._isPlaying) {
        return;
      }
    }

    public remove():void {

    }

    public stop():void {
      if (!this._isPlaying) {
        return;
      }
    }

    public loadPercent():number {
      return 0;
    }

    public getId():string {
      return this._id;
    }

    public dispatchEvent(_eventName:string, _params:any):void {

    }

    public unload():void {
      this.stop();
    }

    public serialize():Object {
      return {
        'class':'Sound',
        'url':this._source
      };
    }
  }

  export function createSound(sample:string, onload:Function = null):Sound {
    return new Sound(sample, onload);
  }
}
