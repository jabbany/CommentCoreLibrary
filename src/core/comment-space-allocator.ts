/**
 * Basic Space Allocation Unit
 *
 * @author Jim Chen (jabbany)
 * @license MIT License
 * @description Comment space allocation units for static and movable comments
 */
import { SpaceAllocator, AllocationResult, UpdateableCommentData, CommentData }
  from './interfaces';
import { Renderer, Measurement } from '../renderer/interfaces';
import { binaryInsert } from '../lib';

export class CommentSpaceAllocator<T> implements SpaceAllocator<T> {
  protected _renderer:Renderer<T, UpdateableCommentData, CommentData>;
  protected _width:number;
  protected _height:number;
  private _pools:T[][];
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
  constructor(renderer:Renderer<T, UpdateableCommentData, CommentData>,
    width:number = 0, height:number = 0) {

    this._renderer = renderer;
    this._width = width;
    this._height = height;
    this._pools = [];
  }

  /**
   * Logic to determine if checked comment collides with existing comment
   * We only use time and not positional measurements to reduce DOM throttling
   *
   * @param existing - Existing comment;
   * @param target - Comment we are checkng a collision for
   * @returns {boolean} checked collides with exisiting
   */
  public willCollide(existing:T, target:T):boolean {
    let trackerExisting = this._renderer.track(existing),
      trackerTarget = this._renderer.track(target);
    let existingTtl = trackerExisting.duration - trackerExisting.time;
    return trackerTarget.time + existingTtl <= trackerTarget.duration / 2;
  }

  /**
   * Validates sufficient space for a "bullet path" for the comment.
   *
   * @param y - Path starting at y offset (path height is the comment height)
   * @param comment - Comment instance to test
   * @param pool - The pool to test in.
   * @returns {boolean} whether or not a valid path exists in the tested pool.
   */
  protected pathCheck(y:number, measurement:Measurement, pool:T[]):boolean {
    // Measure the comment
    let bottom = y + measurement.height,
      right = measurement.right;
    for (let i = 0; i < pool.length; i++) {
      let refMeasurement = this._renderer.measure(pool[i]);
      if (refMeasurement.y > bottom || refMeasurement.bottom < y) {
        // This comment is not in the path bounds
        continue;
      } else if (refMeasurement.right < measurement.x ||
        refMeasurement.x > right) {

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
   * This method will also add the comment to the allocated pool and assign a
   * proper pool index
   *
   * @param comment - Comment
   * @param poolIndex - Pool index
   * @returns {number} Y offset assigned
   */
  public provision(measurement:Measurement,
    poolIndex:number = 0):AllocationResult {
    // Measure the comment first
    while (this._pools.length <= poolIndex) {
      this._pools.push([]);
    }
    let pool = this._pools[poolIndex];
    if (pool.length === 0 || this.pathCheck(0, measurement, pool)) {
      return {
        y: 0,
        poolIndex: poolIndex
      };
    }

    let y:number = 0;
    for (let  k = 0; k < pool.length; k++) {
      y = this._renderer.measure(pool[k]).bottom + this.avoid;
      if (y + measurement.height > this._height) {
        break;
      }
      if (this.pathCheck(y, measurement, pool)) {
        // Has a path in the current pool
        return {
          x: measurement.x,
          y: y,
          poolIndex: poolIndex
        };
      }
    }
    // Assign one pool deeper
    return this.assign(measurement, poolIndex + 1);
  }

  /**
   * Adds a comment to the space allocator. Will also assign the
   * comment's y values. Note that added comments may not be actually
   * recorded, check the cindex value.
   * @param comment
   */
  public add(comment:T):void {
    let measurements = this._renderer.measure(comment);
    if (measurements.height > this._height) {
      this._renderer.update(comment, {
        position: {
          x: measurements.x,
          y: 0
        }
      });
    } else {
      let assignedPosition = this.assign(comment, 0);
      binaryInsert(this._pools[assignedPosition.poolIndex], comment, (a, b) => {
        let bottomA = this._renderer.measure(a).bottom,
          bottomB = this._renderer.measure(b).bottom;
        if (bottomA < bottomB) {
          return -1;
        } else if (bottomA > bottomB) {
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
  public remove(comment:T):void {
    for (let poolId = 0; poolId < this._pools.length; poolId ++) {
      let index = this._pools[poolId].indexOf(comment);
      if (index >= 0) {
        this._pools[poolId].splice(index, 1);
        return;
      }
    }
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

export class AnchorCommentSpaceAllocator<T> extends CommentSpaceAllocator<T> {
  public assign(comment:T, poolIndex:number = 0):AllocationResult {
    let result = super.assign(comment, poolIndex);
    result.x = (this._width - this._renderer.measure(comment).width) / 2;
    return result;
  }

  public willCollide(_a:T, _b:T):boolean {
    return true;
  }

  public pathCheck(y:number, comment:T, pool:T[]):boolean {
    let bottom = y + this._renderer.measure(comment).height;
    for (var i = 0; i < pool.length; i++) {
      let m = this._renderer.measure(pool[i]);
      if (m.y > bottom || m.bottom < y) {
        continue;
      } else {
        return false;
      }
    }
    return true;
  }
}
