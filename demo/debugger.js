// Debugger for demo
var tests = {
	"test-1":"tests/test.xml",
	"test-2":"tests/test2.xml",
	"test-3":"tests/rokubunnoichi.xml",
	"test-4":"tests/mikunoshoushitsu.xml",
	"test-5":"tests/unowen.xml",
	"test-6":"tests/comment.xml",
	"test-7":"tests/extended.xml",
	"test-8":"tests/bilibili.xml",
	"test-9":"tests/utsukushiki_mono.xml",
	"test-s":"tests/scripting/kanpai.xml",
	"test-ac-1":{"f":'tests/ACFun.json',"p":"acfun"},
	"test-ac-2":{"f":'tests/ac940133.json',"p":"acfun"},
    "test-ts-1":"tests/invalid/no_closing.xml",
    "test-ts-2":"tests/invalid/syntax_error.xml",
    "test-ts-3":"tests/invalid/xss.xml"
};

var debugs = {
	"preset-1-run":"cm.filter.addModifier(function(cmt){if(cmt.pool === 0) return null; return cmt;})",
	"preset-2-run":"cm.filter.setRuntimeFilter(function(cmt){if(cmt.hasSet) return cmt; cmt.hasSet = true; cmt.onclick = function(){if(!this.hold){this.hold = true;this.style.border=\"1px solid #ff0\";this.style.zIndex =\"9999\"; this.style.backgroundColor=\"#000\";}else{this.hold = false;this.style.border=\"0px\";this.style.backgroundColor=\"\";}}; return cmt;});",
	"preset-3-run":"cm.filter.addModifier(function(cmt){cmt.border = true; return cmt;})",
};

var state = {
	"format":"hrf",
	"cw": "p-main",
	"mode": "timer",
};

var windowbinds = {
	"p-main":{"id":"w-main", "opacityOnly":true},
	"p-code":{"id":"w-code"},
	"p-help":{"id":"w-help"}
};

var CCLDBG = new function(){
	var x = 0;
	var profiles = [];
	var pmax = 0;
	var smax = 0;
	var sample = 0;
	var avg = 0;
	this.reset = function(){
		profiles = [];
		x = 0;
		pmax = 0;
		avg = 0;
		sample = 0;
	};
	this.profiler = function(){
		var t = (new Date()).getTime();
		var tdiff = t - x;
		if(tdiff < 10){
			return;
		}
		sample ++;
		if(sample % 100 == 0){
			sample = 0;
			profiles.push(-1);
		}
		if(tdiff < 5000){
			avg += tdiff/300;
			profiles.push(tdiff);
			if(tdiff > pmax){
				pmax = tdiff;
			}
			if(tdiff > smax){
				smax = tdiff;
			}
			if(profiles.length > 300){
				var del = profiles.shift();
				avg -= del / 300;
			}
		}
		x = t;
	};
	this.render = function(){
		if(smax > avg * 4){
			smax = Math.round(avg * 4)
		}
		var ctx = $("profiler").getContext("2d");
		if(ctx != null){
			ctx.fillStyle = "#00FFFF";
			ctx.clearRect(0,0, 300, 40);
			for(var i = 0; i < profiles.length; i++){
				if(profiles[i] < 0){
					ctx.fillStyle = "#FF00FF";
					ctx.fillRect(i, 0, 1, 40);
					ctx.fillStyle = "#00FFFF";
					continue; 
				}
				var barh = Math.round((profiles[i]/(smax + 5)) * 40);
				if(barh <= 40){
					ctx.fillRect(i,40-barh,1,barh);
				}else{
					ctx.fillStyle = "#FFFF00";
					ctx.fillRect(i,40-barh,1,barh);
					ctx.fillStyle = "#00FFFF";
				}
			}
			ctx.fillStyle = "#FF0000";
			ctx.fillRect(0,40 - Math.round(avg/(smax + 5) * 40),300,1);
			ctx.fillStyle = "#00FFFF";
		};
		$("pf-stats").innerHTML = "AVG:" + Math.round(avg) + "<br>" + "MAX:" + pmax + "<br>FPS:" + (avg > 0 ? Math.round(1000/avg) : 0);
	};
	this.getProfiles = function(){
		return profiles;
	};
	var self = this;
	var t = -1;;
	this.on = function(){
		if(t > 0)
			return;
		t = setInterval(function(){
			self.render();
		},150);
		$("profiler-start").style.color = "#0ff";
	};
	this.off = function(){
		if(t < 0)
			return;
		clearInterval(t);
		t = -1;
		$("profiler-start").style.color = "";
		$("pf-stats").innerHTML = "PF:OFF";
	};
	this.isOn = function(){
		return t >= 0;
	};
};

function bind(){
	window.cm = new CommentManager($('commentCanvas'));
	cm.init();
	
	var tmr = -1;
	var start = 0;
	var playhead = 0;
	
	$("control-stop").addEventListener("click", function(e){
		if(e && e.preventDefault)
			e.preventDefault();
		stop();
	});
	
	$("control-resume").addEventListener("click", function(e){
		if(e && e.preventDefault)
			e.preventDefault();
		resume();
	});
	
	$("control-reset").addEventListener("click", function(e){
		if(e && e.preventDefault)
			e.preventDefault();
		playhead = 0;
		start = (new Date()).getTime();
		cm.clear();
	});
	
	$("w-main").addEventListener("keydown", function(k){
		if(k){
			if(k.keyCode === 70){
				state.format = (state.format === "hrf" ? "std" : "hrf");
			}else if(k.keyCode === 32){
				if(tmr < 0){
					resume();
				}else{
					stop();
				}
			}else if(k.keyCode === 66){
				$("player").style.backgroundColor = "#000"; //b
				$("c-region").style.color = "#fff";
			}else if(k.keyCode === 87){
				$("player").style.backgroundColor = "#fff"; //w
				$("c-region").style.color = "#000";
			}else if(k.keyCode === 82){
				var x = prompt("Resize player window (WxH or 'old','new')");
				if(x){
					if(x === "new")
						x = "672x438";
					if(x === "old")
						x = "512x384";	
					var wh = x.split("x");
					var w = parseInt(wh[0]);
					var h = parseInt(wh[1]);
					if(w > 0 && h > 0){
						$("player").style.height = h + "px";
						$("player-unit").style.width = w + "px";
						if(cm)
							cm.setBounds();
					}
				}
			}else if(k.keyCode === 80){ //p
				if(CCLDBG.isOn()){
					CCLDBG.off();
					cm.filter.setRuntimeFilter(null);
				}else{
					CCLDBG.on();
					cm.filter.setRuntimeFilter(function(cmt){
						CCLDBG.profiler();
						return cmt;
					});
				}
			}
		}
	});
	
	window.isDebugRunning = function(){
		return tmr >= 0 || !$("abpVideo").paused;
	};
	
	window.displayTime = function(playhead){
		if(state.format === "hrf"){
			var sec = Math.floor(playhead / 1000);
			var millis = playhead % 1000;
			var millisText = (millis > 99 ? millis : ("0" + (millis > 9 ? millis : "0" + millis)));
			$("control-status").innerHTML = Math.floor(sec/60) + ":" +
				((sec % 60) > 9 ? (sec % 60) : "0" + (sec % 60)) + ":" + millisText;
		}else{
				$("control-status").innerHTML = playhead;
		}
	};
	
	$("control-status").addEventListener("dblclick", function(e){
		var x = prompt("Please input time (" + (state.format === "hrf" ? "xx:xx:xxx" : "xxx") + "):");
		if(!x || x === "")
			return;
		if(state.format === "hrf"){
			var y = x.split(":");
			var m = parseInt(y[0]);
			var s = parseInt(y[1]);
			var ml = parseInt(y[2]);
			playhead = m * 60000 + s * 1000 + ml;
		}else{
			try{
				playhead = parseInt(x);
			}catch(e){}
		}
	});
	
	function stop(){
		if(state.mode === "timer"){
			cm.stopTimer();
			$("control-status").className = "status";
			clearInterval(tmr);
			tmr = -1;
		}else{
			$("abpVideo").pause();
		}
	}
	function resume(){
		if(state.mode !== "timer"){
			$("abpVideo").play();
			return;
		}
		if(tmr !== -1)
			return;
		$("control-status").className = "status active";
		cm.startTimer();
		start = new Date().getTime() - playhead;
		tmr = setInterval(function(){
			playhead = new Date().getTime() - start;
			displayTime(playhead);
			cm.time(playhead);
		},10);
	}
	
	/** Load **/
	window.loadDM = function(dmf,provider){
		if(provider == null)
			provider = 'bilibili';
		cm.clear();
		start = 0;
		try{
			clearTimeout(tmr);
		}catch(e){}
		if(trace){
			trace("Loading " + dmf + " : " + provider);
		}
		CommentLoader('../' + dmf, cm, provider);
		cm.startTimer();
		$("control-status").className = "status active";
		if(state.mode !== "timer"){
			$("abpVideo").play();
			return;
		}
		start = new Date().getTime();
		tmr = setInterval(function(){
			playhead = new Date().getTime() - start;
			displayTime(playhead);
			cm.time(playhead);
		},10);
	};
	
	var isWindowedFullscreen = false;
	function launchFullScreen(element) {
		cm.setBounds();
		if(element.requestFullscreen) {
			element.requestFullscreen();
		} else if(element.mozRequestFullscreen) {
			element.mozRequestFullscreen();
		} else if(element.webkitRequestFullscreen) {
			element.webkitRequestFullscreen();
		}
	}
	function launchWindowFull(element, e2){
		if(!isWindowedFullscreen){
			element.style.position = "fixed";
			element.style.top = "0";
			element.style.bottom = "0";
			element.style.left = "0";
			element.style.right = "0";
			element.style.width = "auto";
			element.style.height = "auto";
			e2.style.height = "100%";
		}else{
			element.style.position = "";
			element.style.top = "";
			element.style.bottom = "";
			element.style.left = "";
			element.style.right = "";
		}
		isWindowedFullscreen = !isWindowedFullscreen;
	}
	// Add Fullscreen Handlers
	var fs = function(){
		cm.setBounds();
	};
	document.addEventListener("fullscreenchange", fs);
	document.addEventListener("webkitfullscreenchange", fs);
	document.addEventListener("mozfullscreenchange", fs);
	
	$("fs-all").addEventListener("click", function(e){
		if(e && e.preventDefault)
			e.preventDefault();
		launchFullScreen($("player-unit"));
	});
	$("fs-win").addEventListener("click", function(e){
		if(e && e.preventDefault)
			e.preventDefault();
		launchWindowFull($("player-unit"), $("player"));
	});
}

function bindWindow(){
	for(var w in windowbinds){
		$(w).addEventListener("click", function(e){
			if(state.cw === this.id)
				return;
			if(window.isDebugRunning()){
				
			}
			state.cw = this.id;
			for(var win in windowbinds){
				$(win).className = "button";
				if($(windowbinds[win].id) && !windowbinds[win].opacityOnly){
					$(windowbinds[win].id).style.display ="none";
				}else if($(windowbinds[win].id) && windowbinds[win].opacityOnly){
					$(windowbinds[win].id).style.opacity = "0";
				}
			}
			this.className = "button active";
			try{
				$(windowbinds[this.id].id).style.display = "";
				$(windowbinds[this.id].id).style.opacity = "1";
			}catch(e){
				console.log(e);
			}
		});
	}
};

function bindTests(){
	for(var test in tests){
		try{
			$(test).addEventListener("click", (function(){
				var url = tests[test];
				return function(){
					if(typeof url === "string"){
						loadDM(url);
					}else{
						loadDM(url.f, url.p);
					}
				}
			})());
		}catch(e){}
	}
	$("profiler-start").addEventListener("click", function(e){
		CCLDBG.reset();
		CCLDBG.on();
		cm.filter.setRuntimeFilter(function(cmt){
			CCLDBG.profiler();
			return cmt;
		});
		e.preventDefault();
	});
	$("video-demo").addEventListener("click", function(e){
		var x = prompt("Please give video URL");
		if(!x){
			return;
		}
		if(x == ""){
			$("abpVideo").innerHTML = '<source src="http://content.bitsontherun.com/videos/bkaovAYt-52qL9xLP.mp4" type="video/mp4">'
			+ '<source src="http://content.bitsontherun.com/videos/bkaovAYt-27m5HpIu.webm" type="video/webm">';
		}else{
			$("abpVideo").innerHTML = '<source src="' + x + '">';
		}
		bindVideo($("abpVideo"), cm);
		state.mode = 'video';
		loadDM(tests['test-6']);
	});
	$("load-cmt-file").addEventListener("click", function(e){
		var x = prompt("Please give comment file URL");
		if(!x){
			return;
		}
		loadDM(x);
	});
}

function bindResize(){
	var sX = 0, sY = 0;
	var iX = 0, iY = 0;
	var isDownTB = false;
	var isDownLR = false;
	document.addEventListener("dblclick", function(){
		isDownTB = false;
		isDownLR = false;
	});
	$("control-resize-lr").addEventListener("mousedown", function(e){
		sX = e.clientX;
		iX = $("player-unit").offsetWidth;
		iY = $("player").offsetHeight;
		$("commentCanvas").style.border="1px solid #0ff";
		isDownLR = true;
		$("c-region").style.display = "";
	});
	$("control-resize-tb").addEventListener("mousedown", function(e){
		sY = e.clientY;
		iX = $("player-unit").offsetWidth;
		iY = $("player").offsetHeight;
		$("commentCanvas").style.border="1px solid #0ff";
		isDownTB = true;
		$("c-region").style.display = "";
	});
	document.addEventListener("mousemove", function(e){
		if(isDownTB){
			var yDelta = e.clientY - sY;
			$("player").style.height =  (iY + yDelta) + "px";
			$("c-region").innerHTML = iX + "x" + (iY + yDelta);
		}else if(isDownLR){
			var xDelta = e.clientX - sX;
			$("player-unit").style.width =  (iX + xDelta) + "px";
			$("c-region").innerHTML = (iX + xDelta) + "x" + iY;
		}
	});
	document.addEventListener("mouseup", function(e){
		if((isDownTB || isDownLR)){
			if(trace){
				trace("Resize to " + $("commentCanvas").offsetWidth + "x" + $("commentCanvas").offsetHeight);
			}
			cm.setBounds();
			$("commentCanvas").style.border="0px";
			$("c-region").style.display="none";
			cm.setBounds();
		}
		isDownTB = false;
		isDownLR = false;
	});
};

function bindDebugger(){
	var output = $("debugger-output");
	function trace(msg){
		if(typeof msg === "object"){
			var obj = {};
			for(var field in msg){
				if(typeof msg[field] !== "function"){
					obj[field] = msg[field].toString();
				}else{
					obj[field] = "[function Function]";
				}
			}
			msg = JSON.stringify(obj, undefined, 2);
		}else if(msg === undefined){
			msg = "[undefined]";
		}else if(typeof msg !== "string"){
			msg = msg.toString();
		}
		var lines = msg.replace(/&/g,"&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/ /g,"&nbsp;").split("\n");
		output.innerHTML = lines.join("<br>") + "<br>" + output.innerHTML;
	};
	window.trace = trace;
	$("debugger-input-area").addEventListener("keydown",function(e){if(e.keyCode == 9) e.preventDefault()});
	$("debugger-input-area").addEventListener("keyup",function(e){if(e.keyCode == 9) { 
		e.preventDefault();
		this.innerHTML += "\t";
	}});
	$("debugger-run").addEventListener("click", function(){
		try{
			var cm = window.cm;
			eval($("debugger-input-area").innerText);
		}catch(e){
			trace(e);
			console.log(e);
		}
	});
	for(var x in debugs){
		$(x).addEventListener('click', function(){
			$("debugger-input-area").innerHTML = debugs[this.id];
		});
	}
};

function bindVideo(video, cm){
	video.addEventListener("timeupdate", function(){
		if(cm.display === false) return;
		if(video.hasStalled){
			cm.startTimer();
			video.hasStalled = false;
		}
		cm.time(Math.floor(video.currentTime * 1000));
		displayTime(Math.floor(video.currentTime * 1000));
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

window.addEventListener("load", function(){
	bind();
	bindWindow();
	bindTests();
	bindResize();
	bindDebugger();
});
