/** 
 * Comment Filters Module Simplified
 * @license MIT
 * @author Jim Chen
 */
var CommentFilter = (function () {

    function _match (rule, cmtData) {
        var path = rule.subject.split('.');
        var extracted = cmtData;
        while (path.length > 0) {
            var item = path.shift();
            if (item === '') {
                continue;
            }
            if (extracted.hasOwnProperty(item)) {
                extracted = extracted[item];
            }
            if (extracted === null || typeof extracted === 'undefined') {
                extracted = null;
                break;
            }
        }
        if (extracted === null) {
            // Null precondition implies anything
            return true;
        }
        switch (rule.op) {
            case '~':
            case 'regexp':
                return (new RegExp(rule.value)).test(extracted.toString());
            case '=':
            case 'eq':
                return rule.value === extracted.toString();
            case 'NOT':
                return !_match(rule.value, cmtData);
            case 'AND':
                if (Array.isArray(rule.value)) {
                    return rule.value.every(function (r) {
                        return _match(r, cmtData);
                    });
                } else {
                    return false;
                }
            case 'OR':
                if (Array.isArray(rule.value)) {
                    return rule.value.some(function (r) {
                        return _match(r, cmtData);
                    });
                } else {
                    return false;
                }
            default:
                return false;
        }
    }

    function CommentFilter() {
        this.rules = [];
        this.modifiers = [];
        this.allowUnknownTypes = true;
        this.allowTypes = {
            '1': true,
            '2': true,
            '4': true,
            '5': true,
            '6': true,
            '7': true,
            '8': true,
            '17': true
        };
    }

    CommentFilter.prototype.doModify = function (cmt) {
        for (var k=0; k < this.modifiers.length; k++) {
            cmt = this.modifiers[k](cmt);
        }
        return cmt;
    };

    CommentFilter.prototype.beforeSend = function (cmt) {
        return cmt;
    }

    CommentFilter.prototype.doValidate = function (cmtData) {
        if (cmtData.mode.toString() in this.allowTypes &&
            !this.allowTypes[cmtData.mode.toString()]) {
            return false;
        }
        return this.rules.every(function (rule) {
            // Decide if matched
            var matched = _match(rule, cmtData);
            return rule.mode === 'accept' ? matched : !matched;
        });
    };

    CommentFilter.prototype.addRule = function (rule) {
        if (rule.mode !== 'accept' && rule.mode !== 'reject') {
            throw new Error('Rule must be of accept type or reject type.');
        }
        this.rules.push(rule);
    };

    CommentFilter.prototype.addModifier = function (f) {
        this.modifiers.push(f);
    };

    return CommentFilter;
})();
