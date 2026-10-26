/*!
 * Comment Core Library CommentManager
 * @license MIT
 * @author Jim Chen
 *
 * Copyright (c) 2014 Jim Chen
 */
import type { CCLOptions, ICommentManager, ICommentFactory, IComment, ICommentData, IScriptingEngine, ITimer } from './core/Core';
import { CommentSpaceAllocator } from './core/CommentSpaceAllocator';
import { CommentFilter } from './filter/CommentFilter';
export declare class CommentManager implements ICommentManager {
    private _running;
    private _listeners;
    private _lastPosition;
    stage: HTMLElement;
    options: CCLOptions;
    timeline: Array<ICommentData>;
    runline: Array<IComment>;
    position: number;
    /**
     * Clock that drives the running comments. Replace it (e.g. with an
     * AnimationFrameTimer) while the manager is stopped.
     */
    timer: ITimer;
    factory: ICommentFactory | null;
    filter: CommentFilter | null;
    scripting: IScriptingEngine | null;
    csa: {
        [name: string]: CommentSpaceAllocator;
    };
    width: number;
    height: number;
    constructor(stageObject: HTMLElement);
    private _startTimer;
    private _stopTimer;
    /**
     * Whether the comments on the runline are moving (see start / stop)
     */
    get isRunning(): boolean;
    /** Public **/
    stop(): void;
    start(): void;
    /**
     * Stops the manager and releases everything it holds: running comments,
     * the timeline and event listeners. Dispatches 'destroy' before the
     * listeners are removed.
     */
    destroy(): void;
    seek(time: number): void;
    validate(cmt: ICommentData): boolean;
    load(a: Array<ICommentData>): void;
    insert(c: ICommentData): void;
    /**
     * Removes comments from the timeline. Comments that are already running
     * are not affected.
     * @param target - the comment data instance to remove, or a function that
     *    returns true (strictly) for every comment that should be removed
     */
    remove(target: ICommentData | ((data: ICommentData) => boolean)): void;
    clear(): void;
    setBounds(): void;
    init(renderer?: string): void;
    time(time: number): void;
    rescale(): void;
    private _preprocess;
    private _allocateSpace;
    send(data: ICommentData | Array<ICommentData>): void;
    finish(cmt: IComment): void;
    addEventListener(event: string, listener: Function): void;
    removeEventListener(event: string, listener: Function): void;
    dispatchEvent(event: string, data?: any): void;
    /** Static Functions **/
    onTimerEvent(timePassed: number, cmObj: CommentManager): void;
}
