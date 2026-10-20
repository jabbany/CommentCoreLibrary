/**
 * Comment Factory Abstraction
 *
 * @author Jim Chen
 * @license MIT License
 * @description Factory to allow creation of different kinds of comments with
 *        different underlying abstractions.
 */
import type { ICommentManager, ICommentFactory, IComment } from './Core';
export declare class CommentFactory implements ICommentFactory {
    private _bindings;
    private static _simpleCssScrollingInitializer;
    private static _simpleScrollingInitializer;
    private static _simpleAnchoredInitializer;
    private static _advancedCoreInitializer;
    static defaultFactory(): ICommentFactory;
    static defaultCssRenderFactory(): ICommentFactory;
    static defaultCanvasRenderFactory(): ICommentFactory;
    static defaultSvgRenderFactory(): ICommentFactory;
    bind(mode: number, factory: Function): void;
    canCreate(comment: Object): boolean;
    create(manager: ICommentManager, comment: Object): IComment;
}
