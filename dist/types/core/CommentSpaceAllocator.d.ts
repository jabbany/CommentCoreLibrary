/**
 * The parts of a comment that space allocators use. Allocators only position
 * items and do not depend on how they are rendered.
 */
export interface ISpaceItem {
    stime: number;
    ttl: number;
    /**
     * Index of the pool the item is allocated in. Set by the allocator.
     */
    cindex: number;
    x: number;
    y: number;
    readonly bottom: number;
    readonly right: number;
    readonly width: number;
    readonly height: number;
}
export interface ISpaceAllocator {
    add(c: ISpaceItem): void;
    remove(c: ISpaceItem): void;
    setBounds(w: number, h: number): void;
}
export declare class CommentSpaceAllocator implements ISpaceAllocator {
    _width: number;
    _height: number;
    private _pools;
    /**
     * Number of pixels to avoid from last possible y-offset
     * @type {number}
     */
    avoid: number;
    /**
     * Constructs a space allocator
     * @param width - allocator width pixels (default 0)
     * @param height - allocator height pixels (default 0)
     */
    constructor(width?: number, height?: number);
    /**
     * Logic to determine if checked comment collides with existing comment
     * We say that comments collide if the existing comment finishes later
     * than the checked comment is halfway through
     *
     * @param existing - Existing comment;
     * @param check - Checked comment
     * @returns {boolean} checked collides with exisiting
     */
    willCollide(existing: ISpaceItem, check: ISpaceItem): boolean;
    /**
     * Validates sufficient space for a "bullet path" for the comment.
     *
     * @param y - Path starting at y offset (path height is the comment height)
     * @param comment - Comment instance to test
     * @param pool - The pool to test in.
     * @returns {boolean} whether or not a valid path exists in the tested pool.
     */
    pathCheck(y: number, comment: ISpaceItem, pool: Array<ISpaceItem>): boolean;
    /**
     * Finds a good y-coordinate for comment such that minimal collision happens.
     * This method will also add the comment to the allocated pool and assign a proper cindex
     *
     * @param comment - Comment
     * @param cindex - Pool index
     * @returns {number} Y offset assigned
     */
    assign(comment: ISpaceItem, cindex: number): number;
    /**
     * Adds a comment to the space allocator. Will also assign the
     * comment's y values. Note that added comments may not be actually
     * recorded, check the cindex value.
     * @param comment
     */
    add(comment: ISpaceItem): void;
    /**
     * Remove the comment from the space allocator. Will silently fail
     * if the comment is not found
     * @param comment
     */
    remove(comment: ISpaceItem): void;
    /**
     * Set the bounds (width, height) of the allocator. Normally this
     * should be as big as the stage DOM object. But you can manually set
     * this to another smaller value too.
     *
     * @param width
     * @param height
     */
    setBounds(width: number, height: number): void;
}
export declare class AnchorCommentSpaceAllocator extends CommentSpaceAllocator {
    add(comment: ISpaceItem): void;
    willCollide(a: ISpaceItem, b: ISpaceItem): boolean;
    pathCheck(y: number, comment: ISpaceItem, pool: Array<ISpaceItem>): boolean;
}
