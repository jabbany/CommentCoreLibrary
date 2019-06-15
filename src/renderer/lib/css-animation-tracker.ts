import { Timer } from '../../lib/timer';
import { CommentData } from '../../core/interfaces';

import { AnimationTracker, Measurement } from '../interfaces';

export class CSSAnimationTracker implements AnimationTracker {
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
    // Render the spec
  }

  public measure(time?:number):Measurement {
    return this._measurement;
  }
}
