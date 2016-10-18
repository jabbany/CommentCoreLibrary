/**
 * AcFun Format Parser
 * Takes in JSON and parses it based on current documentation for AcFun comments
 * @license MIT License
 **/
var AcfunFormat = (function () {
    var AcfunFormat = {};

    AcfunFormat.JSONParser = function (params) {
        this._logBadComments = true;
        if (typeof params === 'object') {
            this._logBadComments = params.logBadComments === false ? false : true;
        }
    };

    AcfunFormat.JSONParser.prototype.parseOne = function (comment) {
        // Read a comment and generate a correct comment object
        var data = {};
        if (typeof comment !== 'object' || comment == null || !comment.hasOwnProperty('c')) {
            // This cannot be parsed. The comment contains no config data
            return null;
        }
        var config = comment['c'].split(',');
        if (config.length >= 6) {
            data.stime = parseFloat(config[0]) * 1000;
            data.color = parseInt(config[1])
            data.mode = parseInt(config[2]);
            data.size = parseInt(config[3]);
            data.hash = config[4];
            data.date = parseInt(config[5]);
            data.position = "absolute";
            if (data.mode !== 7) {
                // Do some text normalization on low complexity comments
                data.text = comment.m.replace(/(\/n|\\n|\n|\r\n|\\r)/g,"\n");
                data.text = data.text.replace(/\r/g,"\n");
                data.text = data.text.replace(/\s/g,"\u00a0");
            } else {
                try { 
                    var x = JSON.parse(comment.m);
                } catch (e) {
                    if (this._logBadComments) {
                        console.warn('Error parsing internal data for comment');
                        console.log('[Dbg] ' + data.text);
                    }
                    return null; // Can't actually parse this!
                }
                data.position = "relative";
                data.text = x.n; /*.replace(/\r/g,"\n");*/
                data.text = data.text.replace(/\ /g,"\u00a0");
                if (x.a != null) {
                    data.opacity = x.a;
                } else {
                    data.opacity = 1;
                }
                if (x.p != null) {
                    // Relative position
                    data.x = x.p.x / 1000;
                    data.y = x.p.y / 1000;
                } else {
                    data.x = 0;
                    data.y = 0;
                }
                data.shadow = x.b;
                data.dur = 4000;
                if (x.l != null) {
                    data.moveDelay = x.l * 1000;
                }
                if (x.z != null && x.z.length > 0) {
                    data.movable = true;
                    data.motion = [];
                    var moveDuration = 0;
                    var last = {x:data.x, y:data.y, alpha:data.opacity, color:data.color};
                    for (var m = 0; m < x.z.length; m++) {
                        var dur = x.z[m].l != null ? (x.z[m].l * 1000) : 500;
                        moveDuration += dur;
                        var motion = {
                            x:{from:last.x, to:x.z[m].x/1000, dur: dur, delay: 0},
                            y:{from:last.y, to:x.z[m].y/1000, dur: dur, delay: 0}
                        };
                        last.x = motion.x.to;
                        last.y = motion.y.to;
                        if (x.z[m].t !== last.alpha) {
                            motion.alpha = {from:last.alpha, to:x.z[m].t, dur: dur, delay: 0};
                            last.alpha = motion.alpha.to;
                        }
                        if (x.z[m].c != null && x.z[m].c !== last.color) {
                            motion.color = {from:last.color, to:x.z[m].c, dur: dur, delay: 0};
                            last.color = motion.color.to;
                        }
                        data.motion.push(motion);
                    }
                    data.dur = moveDuration + (data.moveDelay ? data.moveDelay : 0);
                }
                if (x.r != null && x.k != null) {
                    data.rX = x.r;
                    data.rY = x.k;
                }
                
            }
            return data;
        } else {
            // Not enough arguments.
            if (this._logBadComments) {
                console.warn('Dropping this comment due to insufficient parameters. Got: ' + config.length);
                console.log('[Dbg] ' + comment['c']);
            }
            return null;
        }
    };

    AcfunFormat.JSONParser.prototype.parseMany = function (comments) {
        if (!Array.isArray(comments)) {
            return null;
        }
        var list = [];
        for (var i = 0; i < comments.length; i++) {
            var comment = this.parseOne(comments[i]);
            if (comment !== null) {
                list.push(comment);
            }
        }
        return list;
    };

    AcfunFormat.TextParser = function (param) {
        this._jsonParser = new AcfunFormat.JSONParser(param);
    }

    AcfunFormat.TextParser.prototype.parseOne = function (comment) {
        try {
            return this._jsonParser.parseOne(JSON.parse(comment));
        } catch (e) {
            console.warn(e);
            return null;
        }
    }

    AcfunFormat.TextParser.prototype.parseMany = function (comment) {
        try {
            return this._jsonParser.parseMany(JSON.parse(comment));
        } catch (e) {
            console.warn(e);
            return null;
        }
    }

    return AcfunFormat;
})();
