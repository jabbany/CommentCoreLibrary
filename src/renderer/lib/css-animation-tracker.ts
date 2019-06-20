import { Timer } from '../../lib/timer';
import { CommentData } from '../../core/interfaces';

import { AnimationTracker, Measurement, Offset } from '../interfaces';
import { LazyFutureMeasurement } from './lazy-dom-measurement';

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

  private getOffsetAt(time:number = 0):Offset {
    let timeDiff = time - this._timer.time;
    if (timeDiff === 0) {
      return {'x': 0, 'y': 0};
    }
    return {'x': 0, 'y': 0};
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
    this._item.style.transform = '';
  }

  public measure(time?:number):Measurement {
    return new LazyFutureMeasurement(this._measurement,
      this.getOffsetAt(time));
  }
}
