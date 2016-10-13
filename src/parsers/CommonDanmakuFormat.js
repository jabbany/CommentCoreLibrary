/**
 * CommonDanmakuFormat Parser
 * Example parser for parsing comments that the CCL can accept directly.
 * @license MIT
 * @author Jim Chen
 **/

var CommonDanmakuFormat = (function () {
    var CommonDanmakuFormat = {};
    var _check = function () {
        // Sanity check to see if we should be parsing these comments or not
        if (comment.mode !== "number"|| typeof comment.stime !== "number") {
            return false;
        }
        if (comment.mode === 8 && !(typeof comment.code === "string")) {
            return false;
        }
        if (typeof comment.text !== "string") {
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
        
    };

    CommonDanmakuFormat.XMLParser.prototype.parseMany = function (comments) {
    
    };

    return CommonDanmakuFormat;
})();
