/**
 * IComment Common Comment Contract
 */
/// <reference path="DisplayObject.ts" />
/// <reference path="MotionManager.ts" />
module Display {
	export interface IComment {
		/**
		 * Motion Manager for Comments
		 */
		motionManager:MotionManager;

		/**
		 * Removal
		 */
		remove():void;

		/**
		 * Initialize a style for the class.
		 * CommentBitmap does not have this
		 * @param params
		 */
		initStyle(params:Object):void;
	}
}