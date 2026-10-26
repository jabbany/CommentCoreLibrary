/**
 * Display Module that is (mostly) API-compatible with BiliScriptEngine
 * @author Jim Chen
 * @description The read-only properties of the module (root, width, ...) are
 *    defined on the Display global (see ../Display.ts)
 */
export * from './Matrix';
export * from './DisplayObject';
export * from './Transform';
export * from './ColorTransform';
export * from './Filter';
export * from './Graphics';
export * from './Shape';
export * from './Sprite';
export * from './TextField';
export * from './ByteArray';
export * from './Bitmap';
export * from './MotionManager';
export * from './CommentBitmap';
export * from './CommentButton';
export * from './CommentCanvas';
export * from './CommentField';
export * from './CommentShape';
export type * from './IComment';
export type * from './ISerializable';

export function toString() {
  return "[display Display]";
}
