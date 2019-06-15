import { Position, Axis, Anchor, CoordinateMode } from '../../core/interfaces';
import { Measurement } from '../interfaces';

export class LazyMeasurement implements Measurement {
  private _stage:HTMLDivElement;
  private _item:HTMLDivElement;
  private _axis:Axis;
  private _coord:CoordinateMode;
  private _anchor:Anchor;

  constructor(stage:HTMLDivElement,
    item:HTMLDivElement, axis:Axis, coord:CoordinateMode, anchor:Anchor) {

    this._stage = stage;
    this._item = item;
    this._axis = axis;
    this._coord = coord;
    this._anchor = anchor;
  }
  get width():number {
    return this._item.offsetWidth;
  }
  get height():number {
    return this._item.offsetHeight;
  }
  get x():number {
    if (this._axis === 'top-left' || this._axis === 'bottom-left') {
      return this._item.offsetLeft;
    } else {
      return this._stage.offsetWidth - this._item.offsetLeft;
    }
  }
  get y():number {
    if (this._axis === 'top-left' || this._axis === 'top-right') {
      return this._item.offsetTop;
    } else {
      return this._stage.offsetHeight - this._item.offsetTop;
    }
  }
  get top():number {
    let offset = this.height * this._anchor.vertical;
    if (this._axis === 'top-left' || this._axis === 'top-right') {
      return this.y - offset;
    } else {
      return this.y + offset;
    }
  }
  get bottom():number {
    if (this._axis === 'top-left' || this._axis === 'top-right') {
      return this.top + this.height;
    } else {
      return this.top - this.height;
    }
  }
  get left():number {
    let offset = this.width * this._anchor.horizontal;
    if (this._axis === 'top-left' || this._axis === 'bottom-left') {
      return this.x - offset;
    } else {
      return this.x + offset;
    }
  }
  get right():number {
    if (this._axis === 'top-left' || this._axis === 'bottom-left') {
      return this.left + this.width;
    } else {
      return this.left - this.width;
    }
  }
}

export class LazyFutureMeasurement implements Measurement {
  private _source:Measurement;
  private _futurePosition:Position;
  constructor(sourceMeasurement:Measurement,
    position:Position) {

    this._source = sourceMeasurement;
    this._futurePosition = position;
  }
  get width():number {
    return this._source.width;
  }
  get height():number {
    return this._source.height;
  }
  get x():number {
    return this._futurePosition.x;
  }
  get y():number {
    return this._futurePosition.y;
  }
  get top():number {
    return 0;
  }
  get bottom():number {
    return 0;
  }
  get left():number {
    return 0;
  }
  get right():number {
    return 0;
  }
}
