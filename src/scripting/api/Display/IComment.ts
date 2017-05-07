/// <reference path="MotionManager.ts" />

module Display {

  /**
   * IComment Common Comment Contract
   */
  export interface IComment {
    /**
     * The {MotionManager} being used for the comment
     */
    motionManager:MotionManager;

    /**
     * Method to remove the comment object from its parent (or the root if it
     * is parented at the root).
     */
    remove():void;

    /**
     * Initialize a style for the class
     * @param params
     */
    initStyle(params:Object):void;
  }
}
