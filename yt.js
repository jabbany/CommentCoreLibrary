//YouTube Shim by Sunnyok

// 1. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "//www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 2. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
	player = new YT.Player('ytPlayer', {		//replace #ytPlayer with iframe
		videoId: ytid,
		height: '100%',
		width: '100%',
		playerVars: {
			autohide: 1,
			autoplay: 0,
			controls: 1,
			html5: 1,				//unoffical api call
			//modestbranding: 1,
			rel: 0,
			showinfo: 1,
			wmode: 'opaque'			//enable z-indexing
		},
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange,
			'onError': onPlayerError
		}
	});
}

// 3. The API will call this function when the video player is ready.
function onPlayerReady(event) {
	load('tests/'+cid+'.xml');
	//event.target.playVideo();			//playerVars:{autoplay:1}
}

// 4. The API calls this function when the player's state changes.
function onPlayerStateChange(event) {
	if (event.data == YT.PlayerState.PLAYING) {
		playhead = player.getCurrentTime()*1000;				//working seek for now...
		resume();
		document.getElementById('ytTitleFix').style.zIndex=2;
		document.getElementById('ytFullHide').style.zIndex=3;
		//alert(player.getCurrentTime() + ' + ' +playhead);
	}else if (event.data == YT.PlayerState.PAUSED) {
		stop();
	}else if (event.data == YT.PlayerState.BUFFERING) {
		stop();
	}else if(event.data == YT.PlayerState.ENDED){
		cm.clear();
		playhead = 0;
	}
}

// 5. Error Handling
function onPlayerError(event) {
	alert('yt Handler Error:' + event.data);
}


/* 6. Youtube Fix - Requires jQuery
		Comment click through can be enabled with css pointer-events: none;
		
	Purpose:
		Using YouTube API requires compliance to its ToS.
		Therefore, a fix/hack is required for danmaku not to obscure the player.
		
	Description:
		When document ready, overlay div boxes on top of youtube info bar.
		When mouse over, hide danmaku and move div boxes itself so it does not obscure the content.
		There are two different fix, one is title fix and the other is full removal of danmaku.
		Also there is a canvas click fix, for when the comment is clickable to play/pause video.
*/
		
$(document).ready(function(){

	// Recoverable Hide Div - title overlay fix
	var tag = document.createElement('div');
	tag.id = 'ytTitleFix';
	$(tag).insertBefore('#ytPlayer');

	// Full Hide Div - share page enabler
	var tag = document.createElement('div');
	tag.id = 'ytFullHide';
	$(tag).insertBefore('#ytPlayer');
	
	// dom objects
	var canvas = $('#player')				//container for mouse detection
	var ytBar = $('#ytTitleFix')[0];
	var hideBox = $('#ytFullHide')[0];
	
	hideBox.onmouseover = function(){
		ytBar.style.zIndex = -1;
		hideBox.style.zIndex = -1;
		player.pauseVideo();
		cm.clear();
	};
	
	//below is basically the onmouseover for title fix
	canvas.mousemove(function(e){
		if (e.pageY < canvas.offset().top+30){
			ytBar.style.marginTop = '30px';
			ytBar.style.height = '100%';
			
			cm.filter.setRuntimeFilter(function(cmt){
				if (cmt.mode != 1 && cmt.mode != 5 && cmt.mode != 6) return cmt;
				var cmtPos = cmt.ttl / cmt.dur;
				if (cmt.top < 32 || cmt.mode == 5 || cmt.mode == 6)
					cmt.style.opacity = 0.8 * (cmtPos - 0.7) / 0.5;
				else if (cmt.top < 64)
					cmt.style.opacity = 0.8 * (cmtPos - 0.7) / 0.3;
				return cmt;
			});
			
		}else{
			ytBar.style.marginTop = '0';
			ytBar.style.height = '30px';
			cm.filter.setRuntimeFilter(null);
		}
		//console.log(e.pageX+', '+e.pageY);
	})
	
	
/*==================== Canvas Click Fix - use when comment is clickable ====================
	canvas.click(function(){
		if (player.getPlayerState() == 1){
			player.pauseVideo();
		}else{
			player.playVideo();
		}
	})*/
	
});