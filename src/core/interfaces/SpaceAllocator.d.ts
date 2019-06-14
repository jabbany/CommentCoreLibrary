import { Position } from './CommentData';

export interface SpaceAllocator<T> {
  add(item:T):void;
  remove(item:T):void;
  setBounds(w:number, h:number):void;
}

export interface AllocationResult extends Position {
  poolIndex:number;
}
