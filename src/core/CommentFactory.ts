/**
 * Comment Factory Abstraction
 *
 * @author Jim Chen
 * @license MIT License
 * @description Factory to allow creation of different kinds of comments with
 *        different underlying abstractions.
 */
/// <reference path="Core.d.ts" />
/// <reference path="Comment.ts" />
/// <reference path="css-renderer/CssComment.ts" />

class CommentFactory implements ICommentFactory {
  private _bindings:{[key:number]:Function;} = {};

  private static _simpleCssScrollingInitializer (manager:ICommentManager, data:Object):IComment {
    var cmt = new CssScrollComment(manager, data);
    switch (cmt.mode) {
      case 1: {
        cmt.align = 0;
        cmt.axis = 0;
        break;
      }
      case 2: {
        cmt.align = 2;
        cmt.axis = 2;
        break;
      }
      case 6: {
        cmt.align = 1;
        cmt.axis = 1;
        break;
      }
    }
    cmt.init();
    manager.stage.appendChild(cmt.dom);
    return cmt;
  }

  private static _simpleScrollingInitializer (manager:ICommentManager, data:Object):IComment {
    var cmt = new ScrollComment(manager, data);
    switch (cmt.mode) {
      case 1: {
        cmt.align = 0;
        cmt.axis = 0;
        break;
      }
      case 2: {
        cmt.align = 2;
        cmt.axis = 2;
        break;
      }
      case 6: {
        cmt.align = 1;
        cmt.axis = 1;
        break;
      }
    }
    cmt.init();
    manager.stage.appendChild(cmt.dom);
    return cmt;
  }

  private static _simpleAnchoredInitializer (manager:ICommentManager, data:Object):IComment  {
    var cmt = new CoreComment(manager, data);
    switch (cmt.mode) {
      case 4: {
        cmt.align = 2;
        cmt.axis = 2;
        break;
      }
      case 5: {
        cmt.align = 0;
        cmt.axis = 0;
        break;
      }
    }
    cmt.init();
    manager.stage.appendChild(cmt.dom);
    return cmt;
  };

  private static _advancedCoreInitializer (manager:ICommentManager, data:Object):IComment  {
    var cmt = new CoreComment(manager, data);
    cmt.init();
    cmt.transform = CommentUtils.Matrix3D.createRotationMatrix(0, data['rY'], data['rZ']).flatArray;
    manager.stage.appendChild(cmt.dom);
    return cmt;
  }

  public static defaultFactory ():ICommentFactory {
    var factory = new CommentFactory();
    factory.bind(1, CommentFactory._simpleScrollingInitializer);
    factory.bind(2, CommentFactory._simpleScrollingInitializer);
    factory.bind(6, CommentFactory._simpleScrollingInitializer);
    factory.bind(4, CommentFactory._simpleAnchoredInitializer);
    factory.bind(5, CommentFactory._simpleAnchoredInitializer);
    factory.bind(7, CommentFactory._advancedCoreInitializer);
    factory.bind(17, CommentFactory._advancedCoreInitializer);
    return factory;
  }

  public static defaultCssRenderFactory ():ICommentFactory {
    var factory = new CommentFactory();
    factory.bind(1, CommentFactory._simpleCssScrollingInitializer);
    factory.bind(2, CommentFactory._simpleCssScrollingInitializer);
    factory.bind(6, CommentFactory._simpleCssScrollingInitializer);
    factory.bind(4, CommentFactory._simpleAnchoredInitializer);
    factory.bind(5, CommentFactory._simpleAnchoredInitializer);
    factory.bind(7, CommentFactory._advancedCoreInitializer);
    factory.bind(17, CommentFactory._advancedCoreInitializer);
    return factory;
  }

  public static defaultCanvasRenderFactory ():ICommentFactory {
    throw new Error('Not implemented');
  }

  public static defaultSvgRenderFactory ():ICommentFactory {
    throw new Error('Not implemented');
  }

  public bind (mode:number, factory:Function):void {
    this._bindings[mode] = factory;
  }

  public canCreate (comment:Object):boolean {
    // Tests if a certain binding is available
    return this._bindings.hasOwnProperty(comment['mode']);
  }

  public create (manager:ICommentManager, comment:Object):IComment {
    if (comment === null || !comment.hasOwnProperty('mode')) {
      throw new Error('Comment format incorrect');
    }
    if (!this._bindings.hasOwnProperty(comment['mode'])) {
      throw new Error('No binding for comment type ' + comment['mode']);
    }
    return this._bindings[comment['mode']](manager, comment);
  }
}
