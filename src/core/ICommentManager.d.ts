import { IComment } from "./IComment.d";
import { IScriptingEngine } from "./IScriptingEngine.d";

/**
 * Options for CommentCoreLibrary
 */
export interface CCLOptions {
  global: {
    scale:number;
    opacity:number;
    className:string;
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

export interface ICommentManager extends EventDispatcher {
  stage:any;
  width:number;
  height:number;
  options:CCLOptions;
  init(renderer:string):void;
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

export interface EventDispatcher {
  addEventListener(name:string, listener:Function):void;
  dispatchEvent(name:string, data:any):void;
}
