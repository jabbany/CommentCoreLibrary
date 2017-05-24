/**
 * Interface specification for comment data
 * @desc Specifies the interface for comment data with all fields optional
 */
export interface ICommentData {
  stime?:number;
  dur?:number;
  mode?:number;
  text?:string;
  color?:number;
  size?:number;
  border?:boolean;
  opacity?:number;
  alpha?:AlphaMotion;
  font?:string;
  x?:number;
  y?:number;
  rX?:number;
  rY?:number;
  rZ?:number;
  shadow?:boolean;
  align?:number;
  axis?:number;
  transform?:Array<number>;
  position?:string;
  code?:string;
  motion?:MotionGroup;
  date?:number;
  dbid?:number;
}

export interface IComment {
  dom:any;
  mode:number;
  stime:number;
  dur:number;
  ttl:number;
  cindex:number;
  align:number;
  axis:number;
  x:number;
  y:number;
  bottom:number;
  right:number;
  width:number;
  height:number;
  movable:boolean;
  border:boolean;
  shadow:boolean;
  font:string;
  color:number;
  alpha:number;
  size:number;
  /**
   * Updates the comment life by subtracting t from ttl
   * @param {number} t - difference in time
   */
  time(t:number):void;
  /**
   * Update the comment's position based on the time.
   * This is called by time()
   */
  update():void;
  /**
   * Invalidate the coordinates and dimensions of the
   * current comment object
   */
  invalidate():void;
  /**
   * Perform an animation alongside the update
   */
  animate():void;
  /**
   * Remove the comment from display
   */
  finish():void;

  /**
   * Called when the outside container stops
   */
  stop():void;
}

/**
 * Special type to define a transform that only involves alpha values
 */
export interface AlphaMotion {
  from:number;
  to:number;
}

/**
 * Easable motion on a certain parameter
 */
export interface IMotion {
  from:number;
  to:number;
  delay:number;
  dur:number;
  ttl:number;
  easing:Function;
}

export type MotionFrame = {[prop:string]: IMotion};
export type MotionGroup = Array<MotionFrame>;
