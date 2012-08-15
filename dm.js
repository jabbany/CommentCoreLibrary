//Dailymotion Shim by Sunnyok

// This code loads the Dailymotion Javascript SDK asynchronously.
(function() {
	var e = document.createElement('script'); e.async = true;
	e.src = document.location.protocol + '//api.dmcdn.net/all.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(e, s);
}());

// This function init the player once the SDK is loaded
window.dmAsyncInit = function(){
	// PARAMS is a javascript object containing parameters to pass to the player if any (eg: {autoplay: 1})
	var player = DM.player("dmPlayer", {
		video: dmid, 
		width: "100%", 
		height: "100%", 
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
			'apiready': function(){load('tests/'+cid+'.xml');},
			'playing': function(event)
			{
				playhead = event.target.currentTime*1000;		//	<--------------------
				resume();															//	|
			},																		//	|
			'pause': function(){stop();},											//	|
			'ended': function(e)													//	|
			{																		//	|
				stop();																//	|
				cm.clear();															//	|
				//playhead=0;															|
				e.target.currentTime = 0;			//need to reset this.. -.-  ---------
			},
			//'timeupdate': function(event){console.log(event.target.currentTime);},
			//'seeked': function(event){playhead = event.target.currentTime*1000; resume();},
			'error': function(e){alert('dm Handler Error:' + e.data);}
		}
	});

	/* 4. We can attach some events on the player (using standard DOM events)
	player.addEventListener("apiready", function(e){
		//e.target.play();
	}); */
};
