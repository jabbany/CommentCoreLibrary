import { Measurement } from '../../renderer/interfaces';
import { UpdateablePosition } from './comment-data';

export interface SpaceAllocator<T> {
  provision(item:T):AllocationResult;
  add(item:T):void;
  remove(item:T):void;
  setBounds(w:number, h:number):void;
}

export interface AllocationResult extends UpdateablePosition {
  x?:number;
  y?:number;
  poolIndex:number;
}
