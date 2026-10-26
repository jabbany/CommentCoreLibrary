/**
 * Public API from the built bundle (dist/CommentCoreLibrary.js)
 * The bundle is loaded with require() which exercises its UMD CommonJS branch.
 */
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ccl = require('../../dist/CommentCoreLibrary.js');

export const BinArray = ccl.BinArray;
export const CommentManager = ccl.CommentManager;
export const CoreComment = ccl.CoreComment;
export const ScrollComment = ccl.ScrollComment;
export const CssScrollComment = ccl.CssScrollComment;
export const CommentFactory = ccl.CommentFactory;
export const CommentSpaceAllocator = ccl.CommentSpaceAllocator;
export const AnchorCommentSpaceAllocator = ccl.AnchorCommentSpaceAllocator;
export const IntervalTimer = ccl.IntervalTimer;
export const AnimationFrameTimer = ccl.AnimationFrameTimer;
export const CommentUtils = ccl.CommentUtils;
export const CommentFilter = ccl.CommentFilter;
export const CommentProvider = ccl.CommentProvider;
export const Promises = ccl.Promises;
export const BilibiliFormat = ccl.BilibiliFormat;
export const AcfunFormat = ccl.AcfunFormat;
export const CommonDanmakuFormat = ccl.CommonDanmakuFormat;
