/**
* Player sound
*/
var Player;
(function (Player) {
    var Sound = (function () {
        function Sound(type, onload) {
            this._isPlaying = false;
            this.onload = onload;
            this._source = type;
        }
        Sound.prototype.createFromURL = function (url) {
            this._source = url;
        };
        Sound.prototype.play = function () {
        };
        Sound.prototype.remove = function () {
        };
        Sound.prototype.stop = function () {
        };
        Sound.prototype.loadPercent = function () {
            return 0;
        };
        Sound.prototype.serialize = function () {
            return {
                "class": "Sound",
                "url": this._source
            };
        };
        return Sound;
    })();
})(Player || (Player = {}));
/**
* Player Library
* Author: Jim Chen
*/
/// <reference path="../OOAPI.d.ts" />
/// <reference path="Sound.ts" />
var Player;
(function (Player) {
    var _state = "";
    var _time;
    var _commentList;
    var _refreshRate;
    var _width;
    var _height;
    var _videoWidth;
    var _videoHeight;
    var _lastUpdate;

    Player.state;
    Player.time;
    Player.commentList;
    Player.refreshRate;
    Player.width;
    Player.height;
    Player.videoWidth;
    Player.videoHeight;
    Player.version;

    Object.defineProperty(Player, 'state', {
        get: function () {
            return _state;
        },
        set: function (value) {
            __trace("Player.state is read-only", "warn");
        }
    });
    Object.defineProperty(Player, 'time', {
        get: function () {
            if (_state !== "playing") {
                return _time;
            } else {
                return _time + (Date.now() - _lastUpdate);
            }
        },
        set: function (value) {
            __trace("Player.time is read-only", "warn");
        }
    });
    Object.defineProperty(Player, 'commentList', {
        get: function () {
            return _commentList;
        },
        set: function (value) {
        }
    });
    Object.defineProperty(Player, 'refreshRate', {
        get: function () {
            return _refreshRate;
        },
        set: function (value) {
        }
    });
    Object.defineProperty(Player, 'width', {
        get: function () {
            return _width;
        },
        set: function (value) {
            __trace("Player.width is read-only", "warn");
        }
    });
    Object.defineProperty(Player, 'height', {
        get: function () {
            return _height;
        },
        set: function (value) {
            __trace("Player.height is read-only", "warn");
        }
    });
    Object.defineProperty(Player, 'videoWidth', {
        get: function () {
            return _videoWidth;
        },
        set: function (value) {
            __trace("Player.videoWidth is read-only", "warn");
        }
    });
    Object.defineProperty(Player, 'videoHeight', {
        get: function () {
            return _videoHeight;
        },
        set: function (value) {
            __trace("Player.videoHeight is read-only", "warn");
        }
    });
    Object.defineProperty(Player, 'version', {
        get: function () {
            return "CCLPlayer/1.0 HTML5/* (bilibili, like BSE, like flash)";
        },
        set: function (value) {
            __trace("Player.version is read-only", "warn");
        }
    });

    /**
    * Requests the player to start playing.
    */
    function play() {
        __pchannel("Player::action", {
            "action": "play"
        });
    }
    Player.play = play;

    /**
    * Requests the player to pause
    */
    function pause() {
        __pchannel("Player::action", {
            "action": "pause"
        });
    }
    Player.pause = pause;

    /**
    * Seeks to a position (in milliseconds from start)
    * @param offset - milliseconds offset
    */
    function seek(offset) {
        __pchannel("Player::action", {
            "action": "seek",
            "params": offset
        });
    }
    Player.seek = seek;

    /**
    * Jump to another video
    * Note that this may not work if the Host policy does not allow it
    *
    * @param video - video id
    * @param page - video page (defaults to 1)
    * @param newWindow - open the video in a new window or not
    */
    function jump(video, page, newWindow) {
        if (typeof page === "undefined") { page = 1; }
        if (typeof newWindow === "undefined") { newWindow = false; }
        __pchannel("Player::action", {
            "action": "jump",
            "params": {
                "vid": video,
                "page": page,
                "window": newWindow
            }
        });
    }
    Player.jump = jump;

    function commentTrigger(callback, timeout) {
    }
    Player.commentTrigger = commentTrigger;

    function keyTrigger(callback, timeout) {
    }
    Player.keyTrigger = keyTrigger;

    function setMask(mask) {
        __trace("Masking not supported yet", 'warn');
    }
    Player.setMask = setMask;

    function toString() {
        return "[player Player]";
    }
    Player.toString = toString;

    /** Update Listeners **/
    __schannel("Update:DimensionUpdate", function (payload) {
        _width = payload["stageWidth"];
        _height = payload["stageHeight"];
        if (payload.hasOwnProperty("videoWidth") && payload.hasOwnProperty("videoHeight")) {
            _videoWidth = payload["videoWidth"];
            _videoHeight = payload["videoHeight"];
        }
    });

    __schannel("Update:TimeUpdate", function (payload) {
        _state = payload["state"];
        _time = payload["time"];
        _lastUpdate = Date.now();
    });
})(Player || (Player = {}));
