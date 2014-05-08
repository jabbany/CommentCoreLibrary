/** Some loading code **/
function bind(video, cm){
	video.addEventListener("timeupdate", function(){
		if(cm.display === false) return;
		if(video.hasStalled){
			cm.startTimer();
			video.hasStalled = false;
		}
		cm.time(Math.floor(video.currentTime * 1000));
	});
	video.addEventListener("play", function(){
		cm.startTimer();
	});
	video.addEventListener("pause", function(){
		cm.stopTimer();
	});
	video.addEventListener("waiting", function(){
		cm.stopTimer();
	});
	video.addEventListener("playing",function(){
		cm.startTimer();
	});
};

function load(filename, callback){
	var XHR = new XMLHttpRequest();
	XHR.onreadystatechange = function(){
		if(XHR.readyState === 4 && XHR.status === 200){
			callback(XHR.responseText);
		}
	};
	XHR.open("GET", filename, true);
	XHR.send();
}
