/* ========================================
	HTML5 Media Wrapper
======================================== */

Video.prototype = new CommentDisplay();

function Video(video){
    var self = this;
	this.player = video;
    
    // alias for common operations
    this.play = function(){
        this.player.play();
    }
    
    this.pause = function(){
        this.player.pause();
    }
    
    this.stop = function(){
        this.player.pause();
        this.stopCmt();
    }
    
    // events
    this.player.addEventListener('loadedmetadata', function() {
        self.load(cfile);
    }, false)
    
    this.player.addEventListener('play', function() {
        self.resumeCmt();
    }, false)
    
    this.player.addEventListener('pause', function() {
        self.pauseCmt();
    }, false)
    
    this.player.addEventListener('seeked', function() {
        self.position = this.currentTime * 1000;
        self.resumeCmt();
    }, false)
    
    this.player.addEventListener('ended', function() {
        self.stopCmt();
    }, false)
    
    // dereference
    this.destory = function(){
        this.stop();
        delete this.player;
        while (this.cm.stage.hasChildNodes())
            this.cm.stage.removeChild(this.cm.stage.firstChild);
    }
}



function Audio(){
    // ...   
}