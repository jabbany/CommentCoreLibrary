/** 
 * Bilibili Format Parser
 * Takes in an XMLDoc/LooseXMLDoc and parses that into a Generic Comment List
 * @license MIT License
 **/
var BilibiliFormat = (function () {
    var BilibiliFormat = {};

    // Fix comments to be valid
    var _format = function (text) {
        return text.replace(/\t/,"\\t");
    };

    // Fix Mode7 comments when they are bad
    var _formatmode7 = function (text) {
        if (text.charAt(0) === '[') {
            switch (text.charAt(text.length - 1)) {
                case ']':
                    return text;
                case '"':
                    return text + ']';
                case ',':
                    return text.substring(0, text.length - 1) + '"]';
                default:
                    return _formatmode7(text.substring(0, text.length - 1));
            }
        } else {
            return text;
        }
    };

    // Try to escape unsafe HTML code. DO NOT trust that this handles all cases
    // Please do not allow insecure DOM parsing unless you can trust your input source.
    var _escapeUnsafe = function (text) {
        text = text.replace(new RegExp('</([^d])','g'), '</disabled $1');
        text = text.replace(new RegExp('</(\S{2,})','g'), '</disabled $1');
        text = text.replace(new RegExp('<([^d/]\W*?)','g'), '<disabled $1');
        text = text.replace(new RegExp('<([^/ ]{2,}\W*?)','g'), '<disabled $1');
        return text;
    };

    BilibiliFormat.XMLParser = function (params) {
        this._attemptFix = true;
        this._logBadComments = true;
        if (typeof params === 'object') {
            this._attemptFix = params.attemptFix === false ? false : true;
            this._logBadComments = params.logBadComments === false ? false : true;
        }
    }

    BilibiliFormat.XMLParser.prototype.parseOne = function (elem) {
        try {
            var params = elem.getAttribute('p').split(',');
        } catch (e) {
            // Probably not XML
            return null;
        }
        var text = elem.textContent;
        var comment = {};
        comment.stime = Math.round(parseFloat(params[0])*1000);
        comment.size = parseInt(params[2]);
        comment.color = parseInt(params[3]);
        comment.mode = parseInt(params[1]);
        comment.date = parseInt(params[4]);
        comment.pool = parseInt(params[5]);
        comment.position = 'absolute';
        if (params[7] != null) {
            comment.dbid = parseInt(params[7]);
        }
        comment.hash = params[6];
        comment.border = false;
        if (comment.mode < 7) {
            comment.text = text.replace(/(\/n|\\n|\n|\r\n)/g, "\n");
        } else {
            if (comment.mode === 7) {
                try {
                    if (this._attemptFix) {
                        text = _format(_formatmode7(text));
                    }
                    var extendedParams = JSON.parse(text);
                    comment.shadow = true;
                    comment.x = parseFloat(extendedParams[0]);
                    comment.y = parseFloat(extendedParams[1]);
                    if (Math.floor(comment.x) < comment.x || Math.floor(comment.y) < comment.y) {
                        comment.position = 'relative';
                    }
                    comment.text = extendedParams[4].replace(/(\/n|\\n|\n|\r\n)/g, "\n");
                    comment.rZ = 0;
                    comment.rY = 0;
                    if (extendedParams.length >= 7) {
                        comment.rZ = parseInt(extendedParams[5], 10);
                        comment.rY = parseInt(extendedParams[6], 10);
                    }
                    comment.motion = [];
                    comment.movable = false;
                    if (extendedParams.length >= 11) {
                        comment.movable = true;
                        var singleStepDur = 500;
                        var motion = {
                            'x': {
                                'from': comment.x,
                                'to': parseFloat(extendedParams[7]),
                                'dur': singleStepDur,
                                'delay': 0
                            },
                            'y': {
                                'from': comment.y,
                                'to': parseFloat(extendedParams[8]),
                                'dur': singleStepDur,
                                'delay': 0
                            }
                        };
                        if (extendedParams[9] !== '') {
                            singleStepDur = parseInt(extendedParams[9], 10);
                            motion.x.dur = singleStepDur;
                            motion.y.dur = singleStepDur;
                        }
                        if (extendedParams[10] !== '') {
                            motion.x.delay = parseInt(extendedParams[10], 10);
                            motion.y.delay = parseInt(extendedParams[10], 10);
                        }
                        if (extendedParams.length > 11) {
                            comment.shadow = (extendedParams[11] !== 'false' && extendedParams[11] !== false);
                            if (extendedParams[12] != null) {
                                comment.font = extendedParams[12];
                            }
                            if (extendedParams.length > 14) {
                                // Support for Bilibili advanced Paths
                                if (comment.position === 'relative') {
                                    if (this._logBadComments) {
                                        console.warn('Cannot mix relative and absolute positioning!');
                                    }
                                    comment.position = 'absolute';
                                }
                                var path = extendedParams[14];
                                var lastPoint = {
                                    x: motion.x.from,
                                    y: motion.y.from
                                };
                                var pathMotion = [];
                                var regex = new RegExp('([a-zA-Z])\\s*(\\d+)[, ](\\d+)','g');
                                var counts = path.split(/[a-zA-Z]/).length - 1;
                                var m = regex.exec(path);
                                while (m !== null) {
                                    switch (m[1]) {
                                        case 'M': {
                                            lastPoint.x = parseInt(m[2],10);
                                            lastPoint.y = parseInt(m[3],10);
                                        }
                                        break;
                                        case 'L': {
                                            pathMotion.push({
                                                'x': {
                                                    'from': lastPoint.x,
                                                    'to': parseInt(m[2],10),
                                                    'dur': singleStepDur / counts,
                                                    'delay': 0
                                                },
                                                'y': {
                                                    'from': lastPoint.y,
                                                    'to': parseInt(m[3],10),
                                                    'dur': singleStepDur / counts,
                                                    'delay': 0
                                                }
                                            });
                                            lastPoint.x = parseInt(m[2],10);
                                            lastPoint.y = parseInt(m[3],10);
                                        }
                                        break;
                                    }
                                    m = regex.exec(path);
                                }
                                motion = null;
                                comment.motion = pathMotion;
                           }
                       }
                       if (motion !== null) {
                           comment.motion.push(motion);
                       }
                   }
                   comment.dur = 2500;
                   if (extendedParams[3] < 12) {
                       comment.dur = extendedParams[3] * 1000;
                   }
                   var tmp = extendedParams[2].split('-');
                   if (tmp != null && tmp.length > 1) {
                       var alphaFrom = parseFloat(tmp[0]);
                       var alphaTo = parseFloat(tmp[1]);
                       comment.opacity = alphaFrom;
                       if (alphaFrom !== alphaTo) {
                            comment.alpha = {
                                'from':alphaFrom,
                                'to':alphaTo
                            };
                        }
                    }
                } catch (e) {
                    if (this._logBadComments) {
                        console.warn('Error occurred in JSON parsing. Could not parse comment.');
                        console.log('[DEBUG] ' + text);
                    }
                }
            } else if(comment.mode === 8) {
                comment.code = text; // Code comments are special. Treat them that way.
            } else {
                if (this._logBadComments) {
                    console.warn('Unknown comment type : ' + comment.mode + '. Not doing further parsing.');
                    console.log('[DEBUG] ' + text);
                }
            }
        }
        if (comment.text !== null && typeof comment.text === 'string') {
            comment.text = comment.text.replace(/\u25a0/g,"\u2588");
        }
        return comment;
    };

    BilibiliFormat.XMLParser.prototype.parseMany = function (xmldoc) {
        var elements = [];
        try {
            elements = xmldoc.getElementsByTagName('d');
        } catch (e) {
            // TODO: handle XMLDOC errors.
            return null; // Bail, I can't handle
        }
        var commentList = [];
        for (var i = 0; i < elements.length; i++) {
            var comment = this.parseOne(elements[i]);
            if (comment !== null) {
                commentList.push(comment);
            }
        }
        return commentList;
    };

    BilibiliFormat.TextParser = function (params) {
        this._allowInsecureDomParsing = true;
        this._attemptEscaping = true;
        this._canSecureNativeParse = false;
        if (typeof params === 'object') {
            this._allowInsecureDomParsing = params.allowInsecureDomParsing === false ? false : true;
            this._attemptEscaping = params.attemptEscaping === false ? false : true;
        }
        if (typeof document === 'undefined' || !document || !document.createElement) {
            // We can't rely on innerHTML anyways. Maybe we're in a restricted context (i.e. node).
            this._allowInsecureDomParsing = false;
        }
        if (typeof DOMParser !== 'undefined' && DOMParser !== null) {
            this._canSecureNativeParse = true;
        }
        if (this._allowInsecureDomParsing || this._canSecureNativeParse) {
            this._xmlParser = new BilibiliFormat.XMLParser(params);
        }
    };

    BilibiliFormat.TextParser.prototype.parseOne = function (comment) {
        // Attempt to parse a single tokenized tag
        if (this._allowInsecureDomParsing) {
            var source = comment;
            if (this._attemptEscaping) {
                source = _escapeUnsafe(source);
            }
            var temp = document.createElement('div');
            temp.innerHTML = source;
            var tags = temp.getElementsByTagName('d');
            if (tags.length !== 1) {
                return null; // Can't parse, delegate
            } else {
                return this._xmlParser.parseOne(tags[0]);
            }
        } else if (this._canSecureNativeParse) {
            var domParser = new DOMParser();
            return this._xmlParser.parseOne(
                domParser.parseFromString(comment, 'application/xml'));
        } else {
            throw new Error('Secure native js parsing not implemented yet.');
        }
    };

    BilibiliFormat.TextParser.prototype.parseMany = function (comment) {
        // Attempt to parse a comment list
        if (this._allowInsecureDomParsing) {
            var source = comment;
            if (this._attemptEscaping) {
                source = _escapeUnsafe(source);
            }
            var temp = document.createElement('div');
            temp.innerHTML = source;
            return this._xmlParser.parseMany(temp);
        } else if (this._canSecureNativeParse) {
            var domParser = new DOMParser();
            return this._xmlParser.parseMany(
                domParser.parseFromString(comment, 'application/xml'));
        } else {
            throw new Error('Secure native js parsing not implemented yet.');
        }
    };

    return BilibiliFormat;
})();
