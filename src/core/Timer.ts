/**
 * Comment Timers
 *
 * @author Jim Chen
 * @license MIT License
 * @description Clocks that drive the comments of a CommentManager
 */
import type { ITimer } from './Core';

/**
 * Timer based on setInterval. Ticks at a fixed interval, also when the page
 * is in the background.
 */
export class IntervalTimer implements ITimer {
  private _handle:number = 0;
  private _interval:number;

  /**
   * @param interval - time (ms) between ticks (default 10)
   */
  constructor(interval:number = 10) {
    this._interval = interval;
  }

  public start(callback:(elapsed:number) => void):void {
    if (this._handle > 0) {
      return;
    }
    var last = new Date().getTime();
    this._handle = window.setInterval(function () {
      var now = new Date().getTime();
      var elapsed = now - last;
      last = now;
      callback(elapsed);
    }, this._interval);
  }

  public stop():void {
    window.clearInterval(this._handle);
    this._handle = 0;
  }
}

/**
 * Timer based on requestAnimationFrame. Ticks once per rendered frame and
 * pauses while the page is in the background. Falls back to setTimeout in
 * browsers without requestAnimationFrame.
 */
export class AnimationFrameTimer implements ITimer {
  private _handle:number = 0;
  // Identifies the running tick loop so that a stopped loop never reschedules
  private _token:Object = null;

  private static _request(callback:() => void):number {
    if (typeof window.requestAnimationFrame === 'function') {
      return window.requestAnimationFrame(callback);
    }
    return window.setTimeout(callback, 16);
  }

  private static _cancel(handle:number):void {
    if (typeof window.cancelAnimationFrame === 'function') {
      window.cancelAnimationFrame(handle);
    } else {
      window.clearTimeout(handle);
    }
  }

  public start(callback:(elapsed:number) => void):void {
    if (this._token !== null) {
      return;
    }
    var token = {};
    var last = new Date().getTime();
    var timer = this;
    var tick = function () {
      if (timer._token !== token) {
        return;
      }
      var now = new Date().getTime();
      var elapsed = now - last;
      last = now;
      callback(elapsed);
      if (timer._token === token) {
        timer._handle = AnimationFrameTimer._request(tick);
      }
    };
    this._token = token;
    this._handle = AnimationFrameTimer._request(tick);
  }

  public stop():void {
    if (this._token === null) {
      return;
    }
    AnimationFrameTimer._cancel(this._handle);
    this._handle = 0;
    this._token = null;
  }
}
