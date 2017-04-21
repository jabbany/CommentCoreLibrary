var CommentFactory = (function () {
    function CommentFactory() {
        this._bindings = {};
    }
    CommentFactory._simpleCssScrollingInitializer = function (manager, data) {
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
    };
    CommentFactory._simpleScrollingInitializer = function (manager, data) {
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
    };
    CommentFactory._simpleAnchoredInitializer = function (manager, data) {
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
    ;
    CommentFactory._advancedCoreInitializer = function (manager, data) {
        var cmt = new CoreComment(manager, data);
        cmt.init();
        cmt.transform = CommentUtils.Matrix3D.createRotationMatrix(0, data['rY'], data['rZ']).flatArray;
        manager.stage.appendChild(cmt.dom);
        return cmt;
    };
    CommentFactory.defaultFactory = function () {
        var factory = new CommentFactory();
        factory.bind(1, CommentFactory._simpleScrollingInitializer);
        factory.bind(2, CommentFactory._simpleScrollingInitializer);
        factory.bind(6, CommentFactory._simpleScrollingInitializer);
        factory.bind(4, CommentFactory._simpleAnchoredInitializer);
        factory.bind(5, CommentFactory._simpleAnchoredInitializer);
        factory.bind(7, CommentFactory._advancedCoreInitializer);
        factory.bind(17, CommentFactory._advancedCoreInitializer);
        return factory;
    };
    CommentFactory.defaultCssRenderFactory = function () {
        var factory = new CommentFactory();
        factory.bind(1, CommentFactory._simpleCssScrollingInitializer);
        factory.bind(2, CommentFactory._simpleCssScrollingInitializer);
        factory.bind(6, CommentFactory._simpleCssScrollingInitializer);
        factory.bind(4, CommentFactory._simpleAnchoredInitializer);
        factory.bind(5, CommentFactory._simpleAnchoredInitializer);
        factory.bind(7, CommentFactory._advancedCoreInitializer);
        factory.bind(17, CommentFactory._advancedCoreInitializer);
        return factory;
    };
    CommentFactory.defaultCanvasRenderFactory = function () {
        throw new Error('Not implemented');
    };
    CommentFactory.defaultSvgRenderFactory = function () {
        throw new Error('Not implemented');
    };
    CommentFactory.prototype.bind = function (mode, factory) {
        this._bindings[mode] = factory;
    };
    CommentFactory.prototype.canCreate = function (comment) {
        return this._bindings.hasOwnProperty(comment['mode']);
    };
    CommentFactory.prototype.create = function (manager, comment) {
        if (comment === null || !comment.hasOwnProperty('mode')) {
            throw new Error('Comment format incorrect');
        }
        if (!this._bindings.hasOwnProperty(comment['mode'])) {
            throw new Error('No binding for comment type ' + comment['mode']);
        }
        return this._bindings[comment['mode']](manager, comment);
    };
    return CommentFactory;
}());
