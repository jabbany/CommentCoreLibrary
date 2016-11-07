/**
 * Comment Factory Abstraction
 *
 * @author Jim Chen
 * @license MIT License
 * @description Factory to allow creation of different kinds of comments with 
 *              different underlying abstractions.
 */
/// <reference path="Core.d.ts" />
class CommentFactory implements ICommentFactory {
    private _bindings:{[key:number]:ICommentFactory;} = {};

    public bind (mode:number, factory:ICommentFactory):void {
        this._bindings[mode] = factory;
    }
    
    public create (comment:Object):IComment {
        if (comment === null || !comment.hasOwnProperty('mode')) {
            throw new Error('Comment format incorrect');
        }
        if (!this._bindings.hasOwnProperty(comment.mode)) {
            throw new Error('No binding for comment type ' + comment.mode);
        }
        return this._bindings[comment.mode](comment);
    }
}
