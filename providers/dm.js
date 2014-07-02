/* ========================================
	Dailymotion Wrapper by Sunnyok
======================================== */

DailyMotion.prototype = new CommentDisplay();
DailyMotion.apiReady = false;

function DailyMotion(vid){
    var self = this;
    
    // common alias
    this.play = function(){
        this.player.play();
    }
    
    this.pause = function(){
        this.player.pause();
    }
    
    this.stop = function(){
        // no stop option
        this.player.pause();
        this.stopCmt();
    }
    
    // This function init the player once the SDK is loaded
    var init = function(vid){
        // PARAMS is a javascript object containing parameters to pass to the player if any (eg: {autoplay: 1})
        self.player = DM.player('dmPlayer', {
            video: vid || dmid, 
            width: '100%', 
            height: '100%', 
            params: {
                autoplay: 0,
                //controls: 'html',		//enforce html5 on mp4 enabled browsers?
                info: 1,
                //logo: 0,
                related: 0,
                startscreen: 'html',
                //wmode: 'opaque'
            },
            events: {
                'apiready': function(){
                    self.load(cfile);
                },
                'playing': function(event){
                    self.position = event.target.currentTime*1000;
                    self.resumeCmt();
                },
                'pause': function(){
                    self.pauseCmt();
                },
                'ended': function(e){
                    self.stopCmt();
                }
            }
        });
    };
    
    // unset reference
    this.destory = function(){
        this.stop();
        delete this.player;
        while (this.cm.stage.hasChildNodes())
            this.cm.stage.removeChild(this.cm.stage.firstChild);
    }
    
    // This code loads the Dailymotion Javascript SDK asynchronously.
    // placed last for order of execution.
    if(!DailyMotion.apiReady){
        var e = document.createElement('script'); e.async = true;
		e.src = document.location.protocol + '//api.dmcdn.net/all.js';
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(e, s);
        
        window.dmAsyncInit = function () {
            DailyMotion.apiReady = true;
            delete dmAsyncInit;
            init(vid);
        }
    }else{
        init(vid);
    }
    
}
