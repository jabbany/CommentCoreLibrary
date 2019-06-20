import { Measurement } from './measurement';

export interface AnimationTracker {
  readonly duration:number;
  readonly time:number;
  stop():void;
  start(time?:number):void;
  measure(time?:number):Measurement;
}
