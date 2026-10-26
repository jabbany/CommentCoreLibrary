/**
 * Basic Space Allocation Unit
 *
 * @author Jim Chen (jabbany)
 * @license MIT License
 * @description Comment space allocation units for static and movable comments
 */
import * as BinArray from '../Array';

/**
 * The parts of a comment that space allocators use. Allocators only position
 * items and do not depend on how they are rendered.
 */
export interface ISpaceItem {
  stime:number;
  ttl:number;
  /**
   * Index of the pool the item is allocated in. Set by the allocator.
   */
  cindex:number;
  x:number;
  y:number;
  readonly bottom:number;
  readonly right:number;
  readonly width:number;
  readonly height:number;
}

export interface ISpaceAllocator {
  add(c:ISpaceItem):void;
  remove(c:ISpaceItem):void;
  setBounds(w:number, h:number):void;
}

export class CommentSpaceAllocator implements ISpaceAllocator {
  public _width:number;
  public _height:number;
  private _pools:Array<Array<ISpaceItem>> = [
    []
  ];
  /**
   * Number of pixels to avoid from last possible y-offset
   * @type {number}
   */
  public avoid:number = 1;

  /**
   * Constructs a space allocator
   * @param width - allocator width pixels (default 0)
   * @param height - allocator height pixels (default 0)
   */
  constructor(width:number = 0, height:number = 0) {
    this._width = width;
    this._height = height;
  }

  /**
   * Logic to determine if checked comment collides with existing comment
   * We say that comments collide if the existing comment finishes later
   * than the checked comment is halfway through
   *
   * @param existing - Existing comment;
   * @param check - Checked comment
   * @returns {boolean} checked collides with exisiting
   */
  public willCollide(existing:ISpaceItem, check:ISpaceItem):boolean {
    return existing.stime + existing.ttl >= check.stime + check.ttl / 2;
  }

  /**
   * Validates sufficient space for a "bullet path" for the comment.
   *
   * @param y - Path starting at y offset (path height is the comment height)
   * @param comment - Comment instance to test
   * @param pool - The pool to test in.
   * @returns {boolean} whether or not a valid path exists in the tested pool.
   */
  public pathCheck(y:number, comment:ISpaceItem, pool:Array<ISpaceItem>):boolean {
    var bottom = y + comment.height;
    var right = comment.right;
    for (var i = 0; i < pool.length; i++) {
      if (pool[i].y > bottom || pool[i].bottom < y) {
        // This comment is not in the path bounds
        continue;
      } else if (pool[i].right < comment.x || pool[i].x > right) {

        if (this.willCollide(pool[i], comment)) {
          return false;
        } else {
          continue;
        }
      } else {
        return false;
      }
    }
    return true;
  }

  /**
   * Finds a good y-coordinate for comment such that minimal collision happens.
   * This method will also add the comment to the allocated pool and assign a proper cindex
   *
   * @param comment - Comment
   * @param cindex - Pool index
   * @returns {number} Y offset assigned
   */
  public assign(comment:ISpaceItem, cindex:number):number {
    while (this._pools.length <= cindex) {
      this._pools.push([]);
    }
    var pool = this._pools[cindex];
    if (pool.length === 0) {
      comment.cindex = cindex;
      return 0;
    } else if (this.pathCheck(0, comment, pool)) {
      // Has a path in the current pool
      comment.cindex = cindex;
      return 0;
    }
    var y:number = 0;
    for (var k = 0; k < pool.length; k++) {
      y = pool[k].bottom + this.avoid;
      if (y + comment.height > this._height) {
        break;
      }
      if (this.pathCheck(y, comment, pool)) {
        // Has a path in the current pool
        comment.cindex = cindex;
        return y;
      }
    }
    // Assign one pool deeper
    return this.assign(comment, cindex + 1);
  }

  /**
   * Adds a comment to the space allocator. Will also assign the
   * comment's y values. Note that added comments may not be actually
   * recorded, check the cindex value.
   * @param comment
   */
  public add(comment:ISpaceItem):void {
    if (comment.height > this._height) {
      comment.cindex = -2;
      comment.y = 0;
    } else {
      comment.y = this.assign(comment, 0);
      BinArray.binsert(this._pools[comment.cindex], comment, function (a, b) {
        if (a.bottom < b.bottom) {
          return -1;
        } else if (a.bottom > b.bottom) {
          return 1;
        } else {
          return 0;
        }
      });
    }
  }

  /**
   * Remove the comment from the space allocator. Will silently fail
   * if the comment is not found
   * @param comment
   */
  public remove(comment:ISpaceItem):void {
    if (comment.cindex < 0) {
      return;
    }
    if (comment.cindex >= this._pools.length) {
      throw new Error('cindex out of bounds');
    }
    var index = this._pools[comment.cindex].indexOf(comment);
    if (index < 0)
      return;
    this._pools[comment.cindex].splice(index, 1);
  }

  /**
   * Set the bounds (width, height) of the allocator. Normally this
   * should be as big as the stage DOM object. But you can manually set
   * this to another smaller value too.
   *
   * @param width
   * @param height
   */
  public setBounds(width:number, height:number):void {
    this._width = width;
    this._height = height;
  }
}

export class AnchorCommentSpaceAllocator extends CommentSpaceAllocator {
  public add(comment:ISpaceItem):void {
    super.add(comment);
    comment.x = (this._width - comment.width) / 2;
  }

  public willCollide(a:ISpaceItem, b:ISpaceItem):boolean {
    return true;
  }

  public pathCheck(y:number, comment:ISpaceItem, pool:Array<ISpaceItem>):boolean {
    var bottom = y + comment.height;
    for (var i = 0; i < pool.length; i++) {
      if (pool[i].y > bottom || pool[i].bottom < y) {
        continue;
      } else {
        return false;
      }
    }
    return true;
  }
}
