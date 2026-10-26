/**
 * Comment Timers
 *
 * @author Jim Chen
 * @license MIT License
 * @description Clocks that drive the comments of a CommentManager
 */
import type { ITimer } from './Core';
/**
 * Timer based on setInterval. Ticks at a fixed interval, also when the page
 * is in the background.
 */
export declare class IntervalTimer implements ITimer {
    private _handle;
    private _interval;
    /**
     * @param interval - time (ms) between ticks (default 10)
     */
    constructor(interval?: number);
    start(callback: (elapsed: number) => void): void;
    stop(): void;
}
/**
 * Timer based on requestAnimationFrame. Ticks once per rendered frame and
 * pauses while the page is in the background. Falls back to setTimeout in
 * browsers without requestAnimationFrame.
 */
export declare class AnimationFrameTimer implements ITimer {
    private _handle;
    private _token;
    private static _request;
    private static _cancel;
    start(callback: (elapsed: number) => void): void;
    stop(): void;
}
