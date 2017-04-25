/**
 * CommonDanmakuFormat Parser
 * Example parser for parsing comments that the CCL can accept directly.
 * @license MIT
 * @author Jim Chen
 **/

var CommonDanmakuFormat = (function () {
    var CommonDanmakuFormat = {};
    var _check = function (comment) {
        // Sanity check to see if we should be parsing these comments or not
        if (typeof comment.mode !== 'number' || typeof comment.stime !== 'number') {
            return false;
        }
        if (comment.mode === 8 && !(typeof comment.code === 'string')) {
            return false;
        }
        if (typeof comment.text !== 'string') {
            return false;
        }
        return true;
    };

    CommonDanmakuFormat.JSONParser = function () { };
    CommonDanmakuFormat.JSONParser.prototype.parseOne = function (comment) {
        // Refuse to parse the comment does not pass sanity check
        return _check(comment) ? comment : null;
    };

    CommonDanmakuFormat.JSONParser.prototype.parseMany = function (comments) {
        // Refuse to parse if any comment does not pass sanity check
        return comments.every(_check) ? comments : null;
    };

    CommonDanmakuFormat.XMLParser = function () { };
    CommonDanmakuFormat.XMLParser.prototype.parseOne = function (comment) {
        var data = {}
        try {
            data.stime = parseInt(comment.getAttribute('stime'));
            data.mode = parseInt(comment.getAttribute('mode'));
            data.size = parseInt(comment.getAttribute('size'));
            data.color = parseInt(comment.getAttribute('color'));
            data.text = comment.textContent;
        } catch (e) {
            return null;
        }
        return data;
    };

    CommonDanmakuFormat.XMLParser.prototype.parseMany = function (commentsElem) {
        try {
            var comments = commentsElem.getElementsByTagName('comment');
        } catch (e) {
            return null;
        }
        var commentList = [];
        for (var i = 0; i < comments.length; i++) {
            var comment = this.parseOne(comments[i]);
            if (comment !== null) {
                commentList.push(comment);
            }
        }
        return commentList;
    };

    return CommonDanmakuFormat;
})();
