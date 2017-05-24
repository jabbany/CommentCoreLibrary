/**
 * Basic Canvas Comment Abstraction
 *
 * @author Jim Chen
 * @license MIT License
 * @description Comment abstraction based on CANVAS implementation
 */
import { ICommentData } from "../IComment.d"
import { ICommentManager } from "../ICommentManager"

import { ScrollComment } from "../Comment";

export class CanvasScrollComment extends ScrollComment {
  constructor(parent:ICommentManager, data:ICommentData) {
    super(parent, data);
  }
}
