/**
 * Comment Core Library
 *
 * @author Jim Chen
 * @license MIT License
 * @description Entry point for CCL. Everything exported here is part of the
 *    public API. When the UMD build is loaded through a <script> tag, each
 *    export is also exposed as a global of the same name.
 */
export * as BinArray from './Array';
export { CommentManager } from './CommentManager';
export { CoreComment, ScrollComment } from './core/Comment';
export { CssScrollComment } from './core/css-renderer/CssComment';
export { CommentFactory } from './core/CommentFactory';
export { CommentSpaceAllocator, AnchorCommentSpaceAllocator } from './core/CommentSpaceAllocator';
export { IntervalTimer, AnimationFrameTimer } from './core/Timer';
export * as CommentUtils from './core/CommentUtils';
export { CommentFilter } from './filter/CommentFilter';
export { CommentProvider } from './CommentProvider';
export * as Promises from './Promises';
export * as BilibiliFormat from './parsers/BilibiliFormat';
export * as AcfunFormat from './parsers/AcfunFormat';
export * as CommonDanmakuFormat from './parsers/CommonDanmakuFormat';
export type * from './core/Core';
export type { ISpaceAllocator, ISpaceItem } from './core/CommentSpaceAllocator';
export type { CommentParser, CommentTarget, DynamicSource } from './CommentProvider';
export type { FilterRule } from './filter/CommentFilter';
export type { AcfunComment, AcfunAdvancedParams, AcfunMovement } from './parsers/AcfunFormat';
