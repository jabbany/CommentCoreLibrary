import { Axis, Anchor, CoordinateMode } from '../../core/interfaces';
import { Measurement, Offset } from '../interfaces';

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
  private _convertCoords(value:number, reference:'width'|'height') {
    if (this._coord === 'absolute') {
      return value;
    }
    if (reference === 'width') {
      if (this._stage.offsetWidth === 0) {
        return 0;
      }
      return value / this._stage.offsetWidth;
    } else {
      if (this._stage.offsetHeight === 0) {
        return 0;
      }
      return value / this._stage.offsetHeight;
    }
  }

  get width():number {
    return this._convertCoords(this._item.offsetWidth, 'width');
  }
  get height():number {
    return this._convertCoords(this._item.offsetHeight, 'height');
  }
  get x():number {
    if (this._axis === 'top-left' || this._axis === 'bottom-left') {
      return this._convertCoords(this._item.offsetLeft, 'width');
    } else {
      return this._convertCoords(
        this._stage.offsetWidth - this._item.offsetLeft, 'width');
    }
  }
  get y():number {
    if (this._axis === 'top-left' || this._axis === 'top-right') {
      return this._convertCoords(this._item.offsetTop, 'height');
    } else {
      return this._convertCoords(
        this._stage.offsetHeight - this._item.offsetTop, 'height');
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
  private _futurePosition:Offset;
  private _axis:Axis|null = null;
  constructor(sourceMeasurement:Measurement,
    offset:Offset) {

    this._source = sourceMeasurement;
    this._futurePosition = offset;
  }
  private _inferAxis():Axis {
    if (this._axis === null) {
      let vAxis = (this.top < this.bottom) ? 'top' : 'bottom';
      let hAxis = (this.left < this.right) ? 'left' : 'right';
      return `${vAxis}-${hAxis}` as Axis;
    } else {
      return this._axis;
    }
  }
  get width():number {
    return this._source.width;
  }
  get height():number {
    return this._source.height;
  }
  get x():number {
    return this._source.x + this._futurePosition.x;
  }
  get y():number {
    return this._source.y + this._futurePosition.y;
  }
  get top():number {
    this._axis = this._inferAxis();
    return 0;
  }
  get bottom():number {
    this._axis = this._inferAxis();
    return 0;
  }
  get left():number {
    this._axis = this._inferAxis();
    return 0;
  }
  get right():number {
    this._axis = this._inferAxis();
    return 0;
  }
}
