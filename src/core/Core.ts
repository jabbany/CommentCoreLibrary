/**
 * Core Definitions file
 *
 * @author Jim Chen
 * @description Definitions file for interfaces used in CCL
 */

export interface IScriptingEngine {
  eval(code:string):any;
}

/**
 * Options for CommentCoreLibrary
 */
export interface CCLOptions {
  global: {
    scale: number;
    opacity: number;
    className: string;
  }
  scroll: {
    scale:number;
    opacity:number;
  }
  /**
   * Maximum number of comments on the runline. 0 means unlimited
   */
  limit:number;
  /**
   * Time difference (ms) between two time() calls that triggers a seek
   */
  seekTrigger:number;
}

export interface ICommentManager {
  stage:any;
  width:number;
  height:number;
  options:CCLOptions;
  /**
   * Start the comment manager comments
   */
  start():void;
  /**
   * Stop the running comments
   */
  stop():void;
  /**
   * Remove all current running comments
   */
  clear():void;
  /**
   * Set the bounds for the CommentManager stage
   * @param w width
   * @param h height
   */
  setBounds(w?:number, h?:number):void;
  /**
   * Cleanup the given comment since it has finished
   * @param c - IComment
   */
  finish(c:IComment):void;
}

export interface ICommentFactory {
  create(manager:ICommentManager, comment:Object):IComment;
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
   * @param t - difference in time
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
