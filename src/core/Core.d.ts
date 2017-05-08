/**
 * Core Definitions file
 *
 * @author Jim Chen
 * @description Definitions file for interfaces used in CCL
 */

/**
 * Definintions for binary array tools
 */
interface IBinArray {
  /**
   * Binary insert into array
   * @param arr - target array
   * @param inserted - element to be inserted
   * @param how - comparison function
   */
  binsert(arr:Array<any>, inserted:any, how:Function):number;
  /**
   * Binary loose search
   * @param arr - array to look in
   * @param what - object to try to find
   * @param how - comparison function
   */
  bsearch(arr:Array<any>, what:any, how:Function):number;
}
declare var BinArray:IBinArray;

interface IScriptingEngine {
  eval(code:String);
}

/**
 * Options for CommentCoreLibrary
 */
interface CCLOptions {
  global: {
    scale: number;
    opacity: number;
    className: string;
  }
  scroll: {
    scale:number;
    opacity:number;
  }
  scripting:{
    mode:Array<number>;
    engine:IScriptingEngine;
  }
}

interface ICommentManager {
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

interface ICommentFactory {
  create(manager:ICommentManager, comment:Object):IComment;
}

/**
 * Easable motion on a certain parameter
 */
interface IMotion {
  from:number;
  to:number;
  delay:number;
  dur:number;
  ttl:number;
  easing:Function;
}

interface IComment {
  dom:any;
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
