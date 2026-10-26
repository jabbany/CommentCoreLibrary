/**
 * Root of the display list
 * @author Jim Chen
 * @description The root sprite (Display.root) is created when the Display
 *    module loads (see ../Display.ts). It is held here so that display objects
 *    can reach it without depending on the module that creates it.
 */
import type { DisplayObject } from './DisplayObject';

var _root:DisplayObject = null;

export function getRoot():DisplayObject {
  return _root;
}

export function setRoot(root:DisplayObject):void {
  _root = root;
}
