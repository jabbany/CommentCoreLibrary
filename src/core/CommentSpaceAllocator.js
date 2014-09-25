var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CommentSpaceAllocator = (function () {
    /**
    * Constructs a space allocator
    * @param width - allocator width pixels (default 0)
    * @param height - allocator height pixels (default 0)
    */
    function CommentSpaceAllocator(width, height) {
        if (typeof width === "undefined") { width = 0; }
        if (typeof height === "undefined") { height = 0; }
        this._pools = [
            []
        ];
        /**
        * Number of pixels to avoid from last possible y-offset
        * @type {number}
        */
        this.avoid = 1;
        this._width = width;
        this._height = height;
    }
    /**
    * Logic to determine if checked comment collides with existing comment
    * We say that comments collide if the existing comment finishes later
    * than the checked comment is halfway through
    *
    * @param existing - Existing comment;
    * @param check - Checked comment
    * @returns {boolean} checked collides with exisiting
    */
    CommentSpaceAllocator.prototype.willCollide = function (existing, check) {
        return existing.stime + existing.ttl >= check.stime + check.ttl / 2;
    };

    /**
    * Validates sufficient space for a "bullet path" for the comment.
    *
    * @param y - Path starting at y offset (path height is the comment height)
    * @param comment - Comment instance to test
    * @param pool - The pool to test in.
    * @returns {boolean} whether or not a valid path exists in the tested pool.
    */
    CommentSpaceAllocator.prototype.pathCheck = function (y, comment, pool) {
        var bottom = y + comment.height;
        var right = comment.right;
        for (var i = 0; i < pool.length; i++) {
            if (pool[i].y > bottom || pool[i].bottom < y) {
                continue;
            } else if (pool[i].right < comment.x || pool[i].x > right) {
                if (this.willCollide(pool[i], comment)) {
                    return false;
                } else {
                    continue;
                }
            } else {
                return false;
            }
        }
        return true;
    };

    /**
    * Finds a good y-coordinate for comment such that minimal collision happens.
    * This method will also add the comment to the allocated pool and assign a proper cindex
    *
    * @param comment - Comment
    * @param cindex - Pool index
    * @returns {number} Y offset assigned
    */
    CommentSpaceAllocator.prototype.assign = function (comment, cindex) {
        while (this._pools.length <= cindex) {
            this._pools.push([]);
        }
        var pool = this._pools[cindex];
        if (pool.length === 0) {
            comment.cindex = cindex;
            return 0;
        } else if (this.pathCheck(0, comment, pool)) {
            // Has a path in the current pool
            comment.cindex = cindex;
            return 0;
        }
        var y = 0;
        for (var k = 0; k < pool.length; k++) {
            y = pool[k].bottom + this.avoid;
            if (y + comment.height > this._height) {
                break;
            }
            if (this.pathCheck(y, comment, pool)) {
                // Has a path in the current pool
                comment.cindex = cindex;
                return y;
            }
        }

        // Assign one pool deeper
        return this.assign(comment, cindex + 1);
    };

    /**
    * Adds a comment to the space allocator. Will also assign the
    * comment's y values. Note that added comments may not be actually
    * recorded, check the cindex value.
    * @param comment
    */
    CommentSpaceAllocator.prototype.add = function (comment) {
        if (comment.height > this._height) {
            comment.cindex = -2;
            comment.y = 0;
        } else {
            comment.y = this.assign(comment, 0);
            this._pools[comment.cindex].binsert(comment, function (a, b) {
                if (a.bottom < b.bottom) {
                    return -1;
                } else if (a.bottom > b.bottom) {
                    return 1;
                } else {
                    return 0;
                }
            });
        }
    };

    /**
    * Remove the comment from the space allocator. Will silently fail
    * if the comment is not found
    * @param comment
    */
    CommentSpaceAllocator.prototype.remove = function (comment) {
        if (comment.cindex < 0) {
            return;
        }
        if (comment.cindex >= this._pools.length) {
            throw new Error("cindex out of bounds");
        }
        var index = this._pools[comment.cindex].indexOf(comment);
        if (index < 0)
            return;
        this._pools[comment.cindex].splice(index, 1);
    };

    /**
    * Set the bounds (width, height) of the allocator. Normally this
    * should be as big as the stage DOM object. But you can manually set
    * this to another smaller value too.
    *
    * @param width
    * @param height
    */
    CommentSpaceAllocator.prototype.setBounds = function (width, height) {
        this._width = width;
        this._height = height;
    };
    return CommentSpaceAllocator;
})();

var AnchorCommentSpaceAllocator = (function (_super) {
    __extends(AnchorCommentSpaceAllocator, _super);
    function AnchorCommentSpaceAllocator() {
        _super.apply(this, arguments);
    }
    AnchorCommentSpaceAllocator.prototype.add = function (comment) {
        _super.prototype.add.call(this, comment);
        comment.x = (this._width - comment.width) / 2;
    };

    AnchorCommentSpaceAllocator.prototype.willCollide = function (a, b) {
        return true;
    };

    AnchorCommentSpaceAllocator.prototype.pathCheck = function (y, comment, pool) {
        var bottom = y + comment.height;
        for (var i = 0; i < pool.length; i++) {
            if (pool[i].y > bottom || pool[i].bottom < y) {
                continue;
            } else {
                return false;
            }
        }
        return true;
    };
    return AnchorCommentSpaceAllocator;
})(CommentSpaceAllocator);
