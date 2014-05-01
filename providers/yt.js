/* ================================================================================
	YouTube Wrapper by Sunnyok
	Note:	comment overlay don't work when YouTube is using https
			disable HTTPS EVERYWHERE for YouTube
================================================================================ */

YouTube.prototype = new CommentDisplay();
YouTube.apiReady = false;

function YouTube(vid){
    var self = this;
    
    // alias for common operations
    this.play = function(){
        this.player.playVideo();
    }
    
    this.pause = function(){
        this.player.pauseVideo();
    }
    
    this.stop = function(){
        this.player.stopVideo();
        this.stopCmt();
    }
    
    //  This function creates an <iframe> (and YouTube player)
    //  after the API code downloads. (placed at the end of file)
    var init = function(vid){
        if (!self.cm.stage.hasChildNodes()){
            var tag = document.createElement('video');
            tag.id = 'ytPlayer';
            $('commentCanvas').appendChild(tag);
        }
        
        self.player = new YT.Player('ytPlayer', {    //replace #ytPlayer with iframe
            videoId: vid || ytid,
            height: '100%',
            width: '100%',
            playerVars: {
                autohide: 1,
                //autoplay: 1,
                //controls: 0,
                fs: 0,
                html5: 1,
                //modestbranding: 1,
                rel: 0,
                //showinfo: 0,
                wmode: 'opaque'
            },
            events: {
                'onReady': function(event){
                    if (typeof cfile != 'undefined')
                        self.loadCmt(cfile);
                    
                    (function(){ // seek detection for webkit
                        if(ABGlobal.is_webkit()){
                            var loop = setInterval(function(){
                                try{
                                    self.position = self.player.getCurrentTime()*1000;
                                if (self.player.getPlayerState() == 1)
                                    self.resumeCmt();
                                }catch(e){
                                    clearInterval(loop);
                                }
                            }, 1000)}
                        }
                    )();
                },
                'onStateChange': function(event){
                    switch (event.data){
                        case 1:	//playing
                            self.position = self.player.getCurrentTime()*1000;
                            self.resumeCmt();
                            $('ytTitleFix').style.zIndex=2;
                            $('ytFullHide').style.zIndex=3;
                            break;
                        case 2:	//paused
                        case 3:	//buffering
                            self.pauseCmt();
                            break;
                        case 0:	//ended
                            self.stopCmt();
                            break;
                    }
                }
            }
        })
        
        try{
            // Make comments less obtrusive when mouseover YouTube top info bar
            // Recoverable top overlay
            var tag = document.createElement('div');
            tag.id = 'ytTitleFix';
            tag.style.position = 'absolute';
            tag.style.width = '100%';
            tag.style.height = '90px';
            tag.style.zIndex = '2';
            jQuery(tag).insertBefore('#ytPlayer');
        
            // share/info button overlay
            var tag = document.createElement('div');
            tag.id = 'ytFullHide';
            tag.style.position = 'absolute';
            tag.style.right = '0px';
            tag.style.width = '138px';
            tag.style.height = '30px';
            tag.style.zIndex = '3';
            jQuery(tag).insertBefore('#ytPlayer');
        
            var canvas = jQuery('.abp')
            var ytBar = jQuery('#ytTitleFix')[0];
            var hideBox = jQuery('#ytFullHide')[0];
        
            hideBox.onmouseover = function(){
                ytBar.style.zIndex = -1;
                hideBox.style.zIndex = -1;
                self.pause();
                self.cm.clear();
            };
        
            canvas.mousemove(function(e){
                if (e.pageY < canvas.offset().top+90){
                    ytBar.style.marginTop = '90px';
                    ytBar.style.height = '100%';
        
                    self.cm.filter.setRuntimeFilter(function(cmt){
                        if (cmt.mode != 1 && cmt.mode != 5 && cmt.mode != 6) return cmt;
                        var cmtPos = cmt.ttl / cmt.dur;
                        if (cmt.top < 32 || cmt.mode == 5 || cmt.mode == 6)
                            cmt.style.opacity = 1.5 * (cmtPos - 0.6);
                        else if (cmt.top < 64)
                            cmt.style.opacity = cmtPos/2;
                        return cmt;
                    });
        
                }else{
                    setTimeout(function(){
                        ytBar.style.marginTop = '0';
                        ytBar.style.height = '90px';
                        self.cm.filter.setRuntimeFilter(null);
                    }, 1000);
                }
                //console.log(e.pageX+', '+e.pageY);
            })
        }catch(e){
            console.log(e);
        }
        
    }
    
    //  Remove some references
    this.destory = function(){
        this.stop();
        $('ytTitleFix').style.zIndex=-1;
        $('ytFullHide').style.zIndex=-1;
        this.cm.filter.setRuntimeFilter(null);
        delete this.player;
        while (this.cm.stage.hasChildNodes())
            this.cm.stage.removeChild(this.cm.stage.firstChild);
    }
    
    //  This code loads the IFrame Player API code asynchronously.
    //  placed last for order of execution.
    if(!YouTube.apiReady){
        var tag = document.createElement('script');
        tag.src = "//www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        
        window.onYouTubeIframeAPIReady = function () {
            YouTube.apiReady = true;
            delete onYouTubeIframeAPIReady;
            init(vid);
        }
    }else{
        init(vid);
    }
    
}