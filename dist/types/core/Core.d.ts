/**
 * Core Definitions file
 *
 * @author Jim Chen
 * @description Definitions file for interfaces used in CCL
 */
export interface IScriptingEngine {
    eval(code: string): any;
}
/**
 * Options for CommentCoreLibrary
 */
export interface CCLOptions {
    global: {
        scale: number;
        opacity: number;
        className: string;
    };
    scroll: {
        scale: number;
        opacity: number;
    };
    /**
     * Maximum number of comments on the runline. 0 means unlimited
     */
    limit: number;
    /**
     * Time difference (ms) between two time() calls that triggers a seek
     */
    seekTrigger: number;
}
/**
 * Clock that drives the comments of a CommentManager
 */
export interface ITimer {
    /**
     * Starts calling the callback with the time (ms) elapsed since the last call.
     * Has no effect if the timer is already running.
     * @param callback - called on every tick
     */
    start(callback: (elapsed: number) => void): void;
    /**
     * Stops the timer
     */
    stop(): void;
}
export interface ICommentManager {
    stage: any;
    width: number;
    height: number;
    options: CCLOptions;
    /**
     * Start the comment manager comments
     */
    start(): void;
    /**
     * Stop the running comments
     */
    stop(): void;
    /**
     * Remove all current running comments
     */
    clear(): void;
    /**
     * Set the bounds for the CommentManager stage
     * @param w width
     * @param h height
     */
    setBounds(w?: number, h?: number): void;
    /**
     * Cleanup the given comment since it has finished
     * @param c - IComment
     */
    finish(c: IComment): void;
}
export interface ICommentFactory {
    create(manager: ICommentManager, comment: ICommentData): IComment;
}
/**
 * Easable motion on a certain parameter
 */
export interface IMotion {
    from: number;
    to: number;
    delay: number;
    dur: number;
    ttl?: number;
    /**
     * Easing function (t, b, c, d). Defaults to linear
     */
    easing?: Function;
}
/**
 * Group of motions that run at the same time, keyed by the comment property
 * they animate (e.g. x, y, alpha)
 */
export type MotionGroup = {
    [prop: string]: IMotion;
};
/**
 * Change of alpha over the whole lifetime of the comment
 */
export interface IAlphaMotion {
    from: number;
    to: number;
}
/**
 * Abstract comment data. This is what parsers produce and what the
 * CommentManager timeline holds.
 */
export interface ICommentData {
    /**
     * Time (ms) on the timeline when the comment is shown
     */
    stime: number;
    /**
     * Comment type (1, 2, 6 scrolling; 4 bottom; 5 top; 7 positioned;
     * 8 scripting; 17 extended)
     */
    mode: number;
    text?: string;
    /**
     * Duration (ms) the comment stays on screen
     */
    dur?: number;
    size?: number;
    color?: number;
    border?: boolean;
    shadow?: boolean;
    font?: string;
    opacity?: number;
    alpha?: IAlphaMotion;
    x?: number;
    y?: number;
    /**
     * Alignment. 0=tl, 2=bl, 1=tr, 3=br
     */
    align?: number;
    /**
     * Axis. 0=dr, 1=dl, 2=ur, 3=ul
     */
    axis?: number;
    /**
     * Coordinates are in pixels (absolute) or fractions of the stage (relative)
     */
    position?: 'absolute' | 'relative';
    movable?: boolean;
    motion?: Array<MotionGroup>;
    /**
     * 4x4 transform matrix as a flat array
     */
    transform?: Array<number>;
    rX?: number;
    rY?: number;
    rZ?: number;
    className?: string;
    /**
     * Source code of scripting comments (mode 8)
     */
    code?: string;
    date?: number | string;
    dbid?: number | string;
    hash?: string;
    pool?: number;
}
export interface IComment {
    dom: any;
    mode: number;
    stime: number;
    dur: number;
    ttl: number;
    cindex: number;
    align: number;
    axis: number;
    x: number;
    y: number;
    bottom: number;
    right: number;
    width: number;
    height: number;
    movable: boolean;
    border: boolean;
    shadow: boolean;
    font: string;
    color: number;
    alpha: number;
    size: number;
    /**
     * Updates the comment life by subtracting t from ttl
     * @param t - difference in time
     */
    time(t: number): void;
    /**
     * Update the comment's position based on the time.
     * This is called by time()
     */
    update(): void;
    /**
     * Invalidate the coordinates and dimensions of the
     * current comment object
     */
    invalidate(): void;
    /**
     * Perform an animation alongside the update
     */
    animate(): void;
    /**
     * Remove the comment from display
     */
    finish(): void;
    /**
     * Called when the outside container stops
     */
    stop(): void;
}
