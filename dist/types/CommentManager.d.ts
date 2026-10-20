/*!
 * Comment Core Library CommentManager
 * @license MIT
 * @author Jim Chen
 *
 * Copyright (c) 2014 Jim Chen
 */
import type { CCLOptions, ICommentManager, ICommentFactory, IComment, IScriptingEngine } from './core/Core';
import { CommentSpaceAllocator } from './core/CommentSpaceAllocator';
import { CommentFilter } from './filter/CommentFilter';
export declare class CommentManager implements ICommentManager {
    private _timer;
    private _listeners;
    private _lastPosition;
    stage: HTMLElement;
    options: CCLOptions;
    timeline: Array<any>;
    runline: Array<IComment>;
    position: number;
    factory: ICommentFactory;
    filter: CommentFilter;
    scripting: IScriptingEngine;
    csa: {
        [name: string]: CommentSpaceAllocator;
    };
    width: number;
    height: number;
    constructor(stageObject: HTMLElement);
    private _startTimer;
    private _stopTimer;
    /** Public **/
    stop(): void;
    start(): void;
    seek(time: number): void;
    validate(cmt: any): boolean;
    load(a: Array<any>): void;
    insert(c: any): void;
    clear(): void;
    setBounds(): void;
    init(renderer?: string): void;
    time(time: number): void;
    rescale(): void;
    private _preprocess;
    private _allocateSpace;
    send(data: any): void;
    finish(cmt: IComment): void;
    addEventListener(event: string, listener: Function): void;
    dispatchEvent(event: string, data?: any): void;
    /** Static Functions **/
    onTimerEvent(timePassed: number, cmObj: CommentManager): void;
}
