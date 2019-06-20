/**
 * Interfaces for defining a renderer
 */
import { Measurement } from './measurement';
import { AnimationTracker } from './animation-tracker';

export interface Renderer<T, U, V extends U> {
  create(props:V):T;
  update(item:T, props:U):void;
  destroy(item:T):void;
  measure(item:T):Measurement;
  track(item:T):AnimationTracker;
}
