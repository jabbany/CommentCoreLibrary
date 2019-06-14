/**
 * This is a renderer based on CSS + the DOM. The old timer-based system has
 * been deprecated.
 */
import { UpdateableCommentData, AnimationData } from '../core/interfaces';
import { Timer } from '../lib/timer';
import { toCssColor } from '../lib/color';

import { Renderer, Measurement, AnimationTracker } from './interfaces';

class CSSAnimationTracker implements AnimationTracker {
  private _item:DOMItem;
  private _animationSpec:AnimationData;
  private _timer:Timer;

  constructor(item:DOMItem, animationSpec:AnimationData) {
    this._item = item;
    this._animationSpec = animationSpec;
    this._timer = new Timer();
  }

  get duration():number {
    return this._animationSpec.duration;
  }

  get time():number {
    return this._timer.time;
  }

  public updateAnimation(spec:AnimationData):void {
    this._animationSpec = spec;
    this._timer.reset();
  }

  public stop():void {
    this._timer.stop();
  }

  public start(time?:number):void {
    if (typeof time !== 'undefined') {
      this._timer.time = time;
    }
    this._timer.start();
    // Do some much needed rendering
    if (this._animationSpec.mode === 'none') {
      // Nothing needs to be done
      this._item.dom.style.transform = '';
    } else if (this._animationSpec.mode === 'scroll') {
      // There should be only one waypoint and it must have the same y value!
      if (typeof this._animationSpec.path === 'undefined') {
        throw new Error('Scroll animation expects a path specification!');
      }
      if (this._animationSpec.path.length !== 1) {
        throw new Error('Scroll animation expects exactly one waypoint!');
      }
      let ttl = this.duration - this.time;
      let waypoint = this._animationSpec.path[0];
      let x = this._item.dom.offsetLeft, y = this._item.dom.offsetTop;

      // Setup a transfition
      this._item.dom.style.transition = `transform ${ttl}s`;
      // Setup a transform
      this._item.dom.style.transform =
        `translate(${waypoint.x - x}px, ${waypoint.y - y}px)`;
    } else if (this._animationSpec.mode === 'path') {
      // Need to use CSS keyframe animations which are hard
    }
  }
}

class LazyMeasurement implements Measurement {
  private _stage:HTMLDivElement;
  private _item:HTMLDivElement;
  constructor(stage:HTMLDivElement, item:HTMLDivElement) {
    this._stage = stage;
    this._item = item;
  }
  get width():number {
    return this._item.offsetWidth;
  }
  get height():number {
    return this._item.offsetHeight;
  }
  get x():number {
    return this._item.offsetLeft;
  }
  get y():number {
    return this._item.offsetTop;
  }
  get top():number {
    return this._item.offsetTop;
  }
  get bottom():number {
    return this._stage.offsetHeight - this.top - this.height;
  }
  get left():number {
    return this._item.offsetLeft;
  }
  get right():number {
    return this._stage.offsetWidth - this.width - this.left;
  }
}

class DOMItem {
  public readonly dom:HTMLDivElement;
  public readonly animation:CSSAnimationTracker;
  public measurements:LazyMeasurement|null;
  constructor(animation:AnimationData) {
    this.dom = document.createElement('div');
    this.animation = new CSSAnimationTracker(this, animation);
    this.measurements = null;
  }
}

export class DOMRenderer implements Renderer<DOMItem, UpdateableCommentData> {
  private stage:HTMLDivElement;
  private _defaultAnimation:AnimationData;

  constructor(stage:HTMLDivElement) {
    this.stage = stage;
    this._defaultAnimation = {
      duration: 4000,
      mode: 'scroll'
    };
    // Bind the resize event
    window.addEventListener('resize', () => {
      this.onResize();
    })
  }

  public create(props:UpdateableCommentData) {
    const item:DOMItem = new DOMItem(
      typeof props.animation === 'undefined' ? this._defaultAnimation :
        props.animation);
    this.update(item, props);
    return item;
  }

  public update(item:DOMItem, props:UpdateableCommentData):void {
    if (typeof props.text !== 'undefined') {
      item.dom.innerText = props.text;
    }
    if (typeof props.border !== 'undefined') {
      item.dom.classList.toggle('border', props.border);
    }
    if (typeof props.shadow !== 'undefined') {
      item.dom.classList.toggle('shadow', props.shadow);
    }
    if (typeof props.color !== 'undefined') {
      item.dom.style.color = toCssColor(props.color);
    }
    if (typeof props.size !== 'undefined') {
      item.dom.style.fontSize = `${props.size}px`;
    }
    if (typeof props.font !== 'undefined') {
      item.dom.style.fontFamily = props.font;
    }
    if (typeof props.alpha !== 'undefined') {
      let alpha = Math.min(Math.max(props.alpha, 0), 1)
      item.dom.style.opacity = `${alpha}`;
    }
    if (typeof props.position !== 'undefined') {
      item.dom.style.left = `${props.position.x}px`;
      item.dom.style.top = `${props.position.y}px`;
    }
    if (typeof props.animation !== 'undefined') {
      item.animation.updateAnimation(props.animation);
    }
  }

  public destroy(item:DOMItem):void {
    if (this.stage.contains(item.dom)) {
      this.stage.removeChild(item.dom);
    }
  }

  public measure(item:DOMItem):Measurement {
    if (item.measurements === null) {
      item.measurements = new LazyMeasurement(this.stage, item.dom);
    }
    return item.measurements;
  }

  public track(item:DOMItem):CSSAnimationTracker {
    return item.animation;
  }

  private onResize() {
    this.stage.style.perspective = this.stage.offsetWidth *
      Math.tan(40 * Math.PI/180) / 2 + "px";
    this.stage.style["webkitPerspective"] = this.stage.offsetWidth *
      Math.tan(40 * Math.PI/180) / 2 + "px";
  }
}
