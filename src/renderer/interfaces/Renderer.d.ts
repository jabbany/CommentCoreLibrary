/**
 * Interfaces for defining a renderer
 */
import { Measurement } from './Measurement';
import { AnimationTracker } from './AnimationTracker';

export interface Renderer<T, U> {
  create(props:U):T;
  update(item:T, props:U):void;
  destroy(item:T):void;
  measure(item:T):Measurement;
  track(item:T):AnimationTracker;
}
