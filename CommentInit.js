//Comment Core Library + Video Initializer
//requires jQuery

//$.holdReady(true);	//delay jQuery ready event
var cm;					//global scope

setTimeout(function recursive(){			//wait for the required node to be created
	if($('div#commentCanvas').length){		//check node existence
		//	create comment overlay
		cm = new CommentManager($_('commentCanvas'));
		cm.init();
		
		//	video loader
		if(typeof ytid != 'undefined') yt_init();
		if(typeof dmid != 'undefined') dm_init();
		if(typeof vmid != 'undefined') vm_init();
		
		//$.holdReady(false);
	}/*else{
		setTimeout(resursive, 10);			//loop if needed
		console.log('loopy');
	}*/
}, 1);

/*
cm.filter.addModifier(function(cmt){
	if(cmt.mode == 1)
		cmt.mode = 2;
	return cmt;
});

cm.filter.setRuntimeFilter(fefx.offset_dim);*/

var tmr=0;
var start=0;
var playhead = 0;

function load(dmf){						//glitchy.. initial load is fine.
	cm.clear();
	start = 0;
	try{clearInterval(tmr);}catch(e){}	//unnecessary try-catch block?
	CommentLoader(dmf,cm);
	//resume();							//use when switching between dm, comment autostart..
}

function stop(){
	cm.stopTimer();
	clearTimeout(tmr);					//or is it clearInterval?
}

function resume(){
	cm.startTimer();
	start = new Date().getTime() - playhead;
	try{
		clearInterval(tmr);				//make sure interval is cleared when switching dm
	}catch(e){}							//a try catch block -.- does basically nothing...
	tmr = setInterval(function(){
		playhead = new Date().getTime() - start;
		cm.time(playhead);
		//console.log('Interval: '+playhead);
	},10);
}
