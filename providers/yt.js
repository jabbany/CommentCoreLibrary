/* ================================================================================
	YouTube Shim by Sunnyok
	Note:	comment overlay don't work when YouTube is using https
			disable HTTPS EVERYWHERE for YouTube
================================================================================ */

//	Initiate this when we actually use a YouTube stream
function yt_init(){
// 1. This code loads the IFrame Player API code asynchronously.
	var tag = document.createElement('script');
	tag.src = "//www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// 2. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
function onYouTubeIframeAPIReady() {
	var player = new YT.Player('ytPlayer', {    //replace #ytPlayer with iframe
		videoId: ytid,
		height: '100%',
		width: '100%',
		playerVars: {
			autohide: 1,
			//autoplay: 0,
			//controls: 0,
            fs: 0,                  // no fullscreen button
			html5: 1,
			//modestbranding: 1,
			rel: 0,
			//showinfo: 0,
			wmode: 'opaque'         // enable z-indexing for flash
		},
		events: {
		// 3. The API will call this function when the video player is ready.
			'onReady': function(event){
				load('tests/'+cid+'.xml');
			},
		// 4. The API calls this function when the player's state changes.
			'onStateChange': function(event){
				switch (event.data){
					case 1:	//playing
						playhead = player.getCurrentTime()*1000;		//working seek for now...
						resume();
						document.getElementById('ytTitleFix').style.zIndex=2;
						document.getElementById('ytFullHide').style.zIndex=3;
						//alert(player.getCurrentTime() + ' + ' +playhead);
						break;
					case 2:	//paused
					case 3:	//buffering
						stop();
						break;
					case 0:	//ended
						cm.clear();
						//playhead = 0;			//re-seeks itself when playing
						break;
				}
			},
		// 5. Error Handling
			'onError': function(event){
				alert(event.data);
			}
		}
	});


/* 6. Youtube Fix - Uses jQuery
		
	Purpose:
		Make comments more transparent so as to not obscure YouTube's
        top info bar when mouse hovers over.
		
	Description:
		Overlay transparent divs over top region of YouTube player.
		When mouse hovers over the divs, do some comment manipulation and
        then hide the div itself so it does not interfere w/ interactions.
*/

	// Recoverable Hide Div - title overlay fix
	var tag = document.createElement('div');
	tag.id = 'ytTitleFix';
	$(tag).insertBefore('#ytPlayer');

	// Full Hide Div - share page enabler
	var tag = document.createElement('div');
	tag.id = 'ytFullHide';
	$(tag).insertBefore('#ytPlayer');

	var canvas = $('.abp')
	var ytBar = $('#ytTitleFix')[0];
	var hideBox = $('#ytFullHide')[0];

	hideBox.onmouseover = function(){
		ytBar.style.zIndex = -1;
		hideBox.style.zIndex = -1;
		player.pauseVideo();
		cm.clear();
	};

	// title fix
	canvas.mousemove(function(e){
		if (e.pageY < canvas.offset().top+60){
			//yt infobar occupies 30px but used higher value to extend more rows
			ytBar.style.marginTop = '60px';
			ytBar.style.height = '100%';

			cm.filter.setRuntimeFilter(function(cmt){
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
				ytBar.style.height = '60px';
				cm.filter.setRuntimeFilter(null);
			}, 1000);
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
}