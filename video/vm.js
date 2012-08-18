//Vimeo Shim by Sunnyok

function vm_init(){
	var script = document.createElement('script');
	script.src = 'http://a.vimeocdn.com/js/froogaloop2.min.js';
	var ref = document.getElementsByTagName('script')[0];
	ref.parentNode.insertBefore(script, ref);

	//	script loader, call vmReady when script load completes
	//	alternatively there is the jQuery $.getSctipt() function
	var done = false;
	script.onload = script.onreadystatechange = function(){
		if(!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')){
			done = true;
			//execute when script is ready
			vmReady();
			//IE memory leak fix
			script.onload = script.onreadystatechange = null;
			//hide script
			ref.parentNode.removeChild(script);
		}
	};
};

function vmReady(){
var tag = document.getElementById('vmPlayer');
var iframe = document.createElement('iframe');
iframe.src = "http://player.vimeo.com/video/" + vmid + "?api=1&player_id=vmPlayer";
iframe.id = 'vmPlayer';		// <--- These must match for it to enable API! ^^^^^
iframe.width = '100%';
iframe.height = '100%';
iframe.frameborder = 0;
//iframe.wmode = 'opaque';
tag.parentNode.replaceChild(iframe, tag);

	$('iframe#vmPlayer').each(function(){

		player = $f('vmPlayer') // = Froogaloop(this);
		
		player.addEvent('ready', function(id) {
			//$(function(){
				load('tests/'+cid+'.xml');
				//player.api('play');
				
				player.addEvent('play', onPlay);
				player.addEvent('pause', onPause);
				player.addEvent('finish', onFinish);
				player.addEvent('seek', onSeek);
				player.addEvent('playProgress', onPlayProgress);
			//});
		});
	})
};

function onPlay(id){
	toSync();
}

function onPause(id) {
    stop();
}

function onSeek(data, id){
	toSync();
}

function onFinish(id) {
	cm.clear();
}

var data = {seconds: 0};	//just in case, because sometime onPlayProgress is called after play

function onPlayProgress(data, id) {
	window.data = data;		//set to global
	//console.log("player time: " + data.seconds + '		playhead: ' + playhead);
}

function toSync(){
	cm.clear();
	setTimeout(function(){
		playhead = data.seconds * 1000;
		resume();
	},550);		//At least 500, higher to be safe..
}
