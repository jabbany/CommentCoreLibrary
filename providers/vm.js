/* ========================================
	Vimeo Wrapper by Sunnyok
======================================== */

Vimeo.prototype = new CommentDisplay();
Vimeo.apiReady = false;

function Vimeo(vid){
    var self = this;
    
    // common alias
    this.play = function(){
        this.player.api('play');
    }
    
    this.pause = function(){
        this.player.api('pause');
    }
    
    this.stop = function(){
        this.player.api('pause');
        this.stopCmt();
    }
    
    var init = function(vid){
        var tag = $('vmPlayer');
        var iframe = document.createElement('iframe');
        iframe.src = "http://player.vimeo.com/video/" + (vid || vmid) + "?api=1&player_id=vmPlayer";
        iframe.id = 'vmPlayer';         //  <--- These must match to enable the API!        ^^^^^
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.frameborder = 0;
        //iframe.wmode = 'opaque';
        tag.parentNode.replaceChild(iframe, tag);
    
        self.player = $f('vmPlayer') // = Froogaloop(this);
        
        self.player.addEvent('ready', function(id) {
                self.load(cfile);
                
                self.player.addEvent('play', function(id){
                    toSync();
                });
                self.player.addEvent('pause', function(id){
                    self.pauseCmt();
                });
                self.player.addEvent('finish', function(id){
                    self.stopCmt();
                });
                self.player.addEvent('seek', function(data, id){
                    toSync();
                });
                self.player.addEvent('playProgress', function(data, id){
                    self.vmData = data;
                });
                
                self.vmData = {seconds: 0};	//sometimes onPlayProgress is called after play
                
                function toSync(){
                    setTimeout(function(){
                        self.position = self.vmData.seconds * 1000;
                        self.resumeCmt();
                    },550);		// higher to be safe..
                }
        });
    }
    
    // dereference
    this.destory = function(){
        this.stop();
        delete this.player;
        while (this.cm.stage.hasChildNodes())
            this.cm.stage.removeChild(this.cm.stage.firstChild);
    }
    
    if(!Vimeo.apiReady){
    	var script = document.createElement('script');
        script.src = 'https://secure-a.vimeocdn.com/js/froogaloop2.min.js';
        var ref = document.getElementsByTagName('script')[0];
        ref.parentNode.insertBefore(script, ref);
    
        //	script loader, call init when script load completes
        //	alternatively there is the jQuery.getSctipt() function
        script.onload = script.onreadystatechange = function(){
            if(!Vimeo.apiReady && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')){
                Vimeo.apiReady = true;
                //execute when script is ready
                init(vid);
                //IE memory leak fix
                script.onload = script.onreadystatechange = null;
                //hide script
                ref.parentNode.removeChild(script);
            }
        };
    }else{
        init(vid);   
    }
    
}