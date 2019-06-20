/**
 * This is a renderer based on CSS + the DOM. The old timer-based system has
 * been deprecated.
 */
import { UpdateableCommentData, CommentData } from '../core/interfaces';

import { Renderer, Measurement, AnimationTracker } from './interfaces';
import { CSSAnimationTracker, RafAnimationTracker, LazyMeasurement, setProps }
  from './lib';

type TrackerType = 'css' | 'raf';

class DOMItem {
  private _props:CommentData;
  public readonly dom:HTMLDivElement;
  public readonly animation:AnimationTracker;
  public measurement:LazyMeasurement;

  constructor(comment:CommentData, tracker:TrackerType = 'css', stage:HTMLDivElement) {
    this._props = comment;
    this.dom = document.createElement('div');
    this.measurement = new LazyMeasurement(stage, this.dom,
      this._props.position.axis,
      this._props.position.mode,
      this._props.anchor);
    this.animation = tracker === 'css' ?
      new CSSAnimationTracker(this.dom, this.measurement, comment) :
      new RafAnimationTracker(this.dom, this.measurement, comment);
  }
}

export class DOMRenderer implements Renderer<DOMItem, UpdateableCommentData, CommentData> {
  private stage:HTMLDivElement;
  private _trackerType:TrackerType;

  constructor(stage:HTMLDivElement, trackerType:TrackerType = 'css') {
    this.stage = stage;
    this._trackerType = trackerType;

    // Bind the resize event
    window.addEventListener('resize', () => {
      this.onResize();
    })
  }

  public create(props:CommentData) {
    const item:DOMItem = new DOMItem(props, this._trackerType, this.stage);
    return item;
  }

  public update(item:DOMItem, props:UpdateableCommentData):void {
    setProps(item.dom, props);
  }

  public destroy(item:DOMItem):void {
    if (this.stage.contains(item.dom)) {
      this.stage.removeChild(item.dom);
    }
  }

  public measure(item:DOMItem):Measurement {
    if (this.stage.contains(item.dom)) {
      return item.measurement;
    } else {
      throw Error('Item not managed by this renderer!');
    }
  }

  public track(item:DOMItem):AnimationTracker {
    return item.animation;
  }

  private onResize() {
    this.stage.style.perspective = this.stage.offsetWidth *
      Math.tan(40 * Math.PI/180) / 2 + "px";
    this.stage.style["webkitPerspective"] = this.stage.offsetWidth *
      Math.tan(40 * Math.PI/180) / 2 + "px";
  }
}
