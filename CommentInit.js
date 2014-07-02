/* ================================================================================
    Player Comment Displaying Component
================================================================================ */

// helper function
function zerofill(number, width) {
    var input = number.toString();
    return ("00000000".slice(0, width - input.length) + input);
}

function CommentDisplay() {

    // since it shares the same display area..
    if (CommentDisplay.prototype._singletonInstance)
      return CommentDisplay.prototype._singletonInstance;
    CommentDisplay.prototype._singletonInstance = this;

    var self = this;

    this.cm = null;
    this.cl = null;

    this.timer = 0;
    this.position = 0;

    this.isWindowedFullscreen = false;
    this.initialized = false;

    (function construct() {
        if (jQuery('#commentCanvas').length) {
            // create comment overlay
            self.cm = new CommentManager($('commentCanvas'));
            self.cm.init();

            // add tabs
            var tm = new TabManager($('sidebar'));
            tm.bindAction(['commentlist', "commentListTab"]);
            tm.bindAction(['playersettings', "playerSettingsTab"]);

            // create comment list
            self.cl = new FlexDataGrid($('CommentList'));
            self.cl.colWidthMap = [30, $('tb-ref2').offsetWidth - 12, 110];

            // opacity scroll bar
            var scrollbar = new SimpleSlider({
                targetId: 'opacitySettings',
                barCss: "scrollbar-floater",
                sliderCss: "scrollbar-track",
                max: 100,
                def: 100
            });
            scrollbar.create();
            scrollbar.onchange = function () {
                self.cm.def.opacity = Math.min(scrollbar.getValue(), 100) / 100;
            };
            scrollbar.setValue(85);

            document.getElementById('danmu').addEventListener('submit', self.onComment);
            jQuery(document).on('fullscreenchange mozfullscreenchange webkitfullscreenchange',
                function () { self.cm.setBounds(); }
            );

            self.initialized = true;
        } else {
            setTimeout(construct, 10);
            console.log('waiting for commentCanvas node');
        }
    })();

    this.load = this.loadCmt = function (url, mode) {
        this.stopCmt();

        var cbfunc = function () {
            // rebuild comment list
            // reset comment list if already created
            var rowModel = '<tbody><tr><td id="tb-ref1" style="width:40px;"></td>' +
                '<td id="tb-ref2" style="width:' + $('tb-ref2').offsetWidth + 'px"></td>' +
                '<td id="tb-ref3" style="width:120px;"></td></tr></tbody>';
            $('CommentList').innerHTML = rowModel;

            self.cl.bind(self.cm.timeline, ['stime', 'text', 'date'], function (dobj) {
                var newObj = {};
                newObj.stime = Math.floor((dobj.stime / 1000) / 60) + ":"
                    + (Math.floor((dobj.stime / 1000) % 60) >= 10 ?
                       Math.floor((dobj.stime / 1000) % 60) :
                       "0" + Math.floor((dobj.stime / 1000) % 60));
                newObj.text = dobj.text;
                var dt = new Date();
                dt.setTime(dobj.date * 1000);
                newObj.date = dt.getFullYear() + "-" + zerofill(dt.getMonth() + 1, 2) +
                    "-" + zerofill(dt.getDate(), 2) + " " + zerofill(dt.getHours(), 2) +
                    ":" + zerofill(dt.getMinutes(), 2);
                return newObj;
            });

            // draw table
            self.cl.init();
        };

        CommentLoader(url, this.cm, cbfunc, mode);
    };

    this.play = this.resume = this.resumeCmt = function () {
        this.cm.startTimer();
        var start = new Date().getTime() - this.position;
        clearInterval(this.timer);
        this.timer = setInterval(function () {
            self.position = new Date().getTime() - start;
            self.cm.time(self.position);
        }, 10);
    };

    this.pause = this.pauseCmt = function () {
        this.cm.stopTimer();
        clearInterval(this.timer);
    };

    this.stop = this.stopCmt = function () {
        this.pauseCmt();
        this.cm.clear();
        this.position = 0;
    };

    this.show = function () {
        this.cm.filter.setRuntimeFilter(null);
    };

    this.hide = function () {
        // not very effective..
        this.cm.filter.setRuntimeFilter(function (cmt) {
            cmt.style.opacity = 0;
            return cmt;
        });
    };

    // all operations should halt when switching cmt
    this.destory = function () {
        this.stop();
        while (this.cm.stage.hasChildNodes())
            this.cm.stage.removeChild(this.cm.stage.firstChild);
    };

    this.toggleWindowedFullscreen = function () {
        var element = this.cm.stage;
        if (!this.isWindowedFullscreen) {
            element.style.position = "fixed";
            element.style.top = "0";
            element.style.bottom = "0";
            element.style.left = "0";
            element.style.right = "0";
            element.style.width = "auto";
            element.style.height = "auto";
        } else {
            element.style.position = "";
            element.style.top = "";
            element.style.bottom = "";
            element.style.left = "";
            element.style.right = "";
        }
        this.cm.setBounds();
        this.isWindowedFullscreen = !this.isWindowedFullscreen;
    };

    this.toggleFullscreen = function () {
        var element = this.cm.stage;
        if ((document.fullScreenElement && document.fullScreenElement !== null) ||
            (!document.mozFullScreen && !document.webkitIsFullScreen)) {
            if (element.requestFullScreen) {
                element.requestFullScreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullScreen) {
                element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
        }
    };

    this.onComment = function (event) {
        event.preventDefault();

        // special commands
        if (jQuery('input:text[name="comment"]').val() === 'fs') {
            jQuery('input:text[name="comment"]').val('');
            self.toggleFullscreen();
        }

        // post danmaku
        if (jQuery('input:text[name="comment"]').val() !== '') {
            var stime = parseFloat(Math.round(self.position / 1000)),
                sec = zerofill(stime % 60, 2),
                min = Math.floor(stime / 60),
                text = jQuery('input:text[name="comment"]').val(),
                time = new Date(),
                date = time.getFullYear() + '-' + zerofill(time.getMonth() + 1, 2) +
                    '-' + zerofill(time.getDate(), 2) + ' ' + zerofill(time.getHours(), 2) +
                    ':' + zerofill(time.getMinutes(), 2);

            // display it on screen
            self.cm.sendComment({   // only 'mode' and 'text' are required
                //stime:stime,
                mode: parseInt(jQuery('select#mode').val(), 10),
                text: text,
                size: jQuery('select#fontsize').val()
            });

            // add to cmtList
            jQuery('div.cmtList table#CommentList tbody').append(
                '<tr><td><div>' + min + ':' + sec + '</div></td><td><div>' +
                text + '</div></td><td><div>' + date + '</div></td></tr>'
            );

            // clear input
            jQuery('input:text[name="comment"]').val('');
        }
        return false;
    };
}