import { Timer } from '../../lib/timer';
import { CommentData } from '../../core/interfaces';

import { AnimationTracker, Measurement } from '../interfaces';
import { LazyFutureMeasurement } from './lazy-dom-measurement';

export class RafAnimationTracker implements AnimationTracker {
  private _item:HTMLDivElement;
  private _measurement:Measurement;
  private _initial:CommentData;
  private _timer:Timer;

  constructor(item:HTMLDivElement,
    measurement:Measurement,
    comment:CommentData) {

    this._item = item;
    this._measurement = measurement;
    this._initial = comment;

    this._timer = new Timer();
  }

  get duration():number {
    return this._initial.animation.duration;
  }

  get time():number {
    return this._timer.time;
  }

  public stop():void {
    this._timer.stop();
  }

  public start(time?:number):void {
    if (typeof time !== 'undefined') {
      this._timer.time = time;
    }
    this._timer.start();
    // Tick on the next frame
    window.requestAnimationFrame(this._tick.bind(this));
  }

  public measure():Measurement {
    return new LazyFutureMeasurement(this._measurement);
  }

  private _tick() {
    // Do rendering stuff here
    if (this._initial.animation.mode === 'scroll-left') {
      let x = this._item.offsetLeft;
      this._item.style.left = `${x + 1}`;
    }

    if (this._timer.time >= this.duration) {
      this.stop();
      this._timer.time = this.duration;
    }
    if (this._timer.running) {
      // Schedule the next tick
      window.requestAnimationFrame(this._tick.bind(this));
    }
  }
}
