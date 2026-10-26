/**
 * Basic Comment Abstraction
 *
 * @author Jim Chen
 * @license MIT License
 * @description Comment abstraction based on DOM implementation
 */
import type { ICommentManager, IComment, ICommentData, MotionGroup } from './Core';
import * as CommentUtils from './CommentUtils';
export declare class CoreComment implements IComment {
    static LINEAR: Function;
    mode: number;
    stime: number;
    text: string;
    ttl: number;
    dur: number;
    cindex: number;
    motion: Array<MotionGroup>;
    movable: boolean;
    private _curMotion;
    private _motionStart;
    private _motionEnd;
    private _alphaMotion;
    /**
     * Absolute coordinates. Use absolute coordinates if true otherwise use percentages.
     * @type {boolean} use absolute coordinates or not (default true)
     */
    absolute: boolean;
    /**
     * Alignment
     * @type {number} 0=tl, 2=bl, 1=tr, 3=br
     */
    align: number;
    /**
     * Axis
     * @type {number} 0=dr, 1=dl, 2=ur, 3=ul
     */
    axis: number;
    protected _x?: number | null;
    protected _y?: number | null;
    protected _alpha: number;
    protected _size: number;
    protected _width?: number | null;
    protected _height?: number | null;
    protected _color: number;
    protected _border: boolean;
    protected _shadow: boolean;
    protected _font: string;
    protected _transform: CommentUtils.Matrix3D | null;
    protected _className: string;
    parent: ICommentManager;
    dom: HTMLDivElement;
    constructor(parent: ICommentManager, init?: Partial<ICommentData>);
    protected _toggleClass(className: string, toggle?: boolean): void;
    /**
     * Initializes the DOM element (or canvas) backing the comment
     * This method takes the place of 'initCmt' in the old CCL
     */
    init(recycle?: IComment | null): void;
    get x(): number;
    get y(): number;
    get bottom(): number;
    get right(): number;
    get width(): number;
    get height(): number;
    get size(): number;
    get color(): number;
    get alpha(): number;
    get border(): boolean;
    get shadow(): boolean;
    get font(): string;
    get transform(): Array<number>;
    get className(): string;
    set x(x: number);
    set y(y: number);
    set width(w: number);
    set height(h: number);
    set size(s: number);
    set color(c: number);
    set alpha(a: number);
    set border(b: boolean);
    set shadow(s: boolean);
    set font(f: string);
    set transform(array: Array<number>);
    set className(className: string);
    /**
     * Moves the comment by a number of milliseconds. When
     * the given parameter is greater than 0 the comment moves
     * forward. Otherwise it moves backwards.
     * @param time - elapsed time in ms
     */
    time(time: number): void;
    /**
     * Update the comment's position depending on its mode and
     * the current ttl/dur values.
     */
    update(): void;
    /**
     * Invalidate the comment position.
     */
    invalidate(): void;
    /**
     * Executes a motion object
     * @param currentMotion - motion object
     * @private
     */
    private _execMotion;
    /**
     * Update the comment's position depending on the applied motion
     * groups.
     */
    animate(): void;
    /**
     * Notify the comment to stop. This has no effect if the comment
     * is driven by a timer.
     */
    stop(): void;
    /**
     * Remove the comment and do some cleanup.
     */
    finish(): void;
    /**
     * Returns string representation of comment
     * @returns {string}
     */
    toString(): string;
}
export declare class ScrollComment extends CoreComment {
    constructor(parent: ICommentManager, data: Partial<ICommentData>);
    set alpha(a: number);
    init(recycle?: IComment | null): void;
    update(): void;
}
