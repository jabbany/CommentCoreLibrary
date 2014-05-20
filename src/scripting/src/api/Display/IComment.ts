/**
 * IComment Common Comment Contract
 */
module Display {
	interface IComment {
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
		initStyle?(params:Object):void;
	}
}