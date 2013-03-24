// Initialize the Comment Core Library and its video component
// uses some jQuery..

//$.holdReady(true);	// delay jQuery ready event
var cm, cl;				// global scope

setTimeout(function recursive(){			// wait for the required node to be created
	if($('div#commentCanvas').length){		// check node existence
		// create comment overlay
		cm = new CommentManager($_('commentCanvas'));
		cm.init();
		
        // add tabs
        var tm = new TabManager($_('sidebar'));
        tm.bindAction(['commentlist',"commentListTab"]);
        tm.bindAction(['playersettings',"playerSettingsTab"]);
        
        // create comment list
        cl = new FlexDataGrid($_('CommentList'));
        cl.colWidthMap = [30,$_('tb-ref2').offsetWidth-12,110];
        
        //  opacity scroll bar
        var scrollbar = new SimpleSlider({targetId:'opacitySettings',barCss:"scrollbar-floater",sliderCss:"scrollbar-track",max:100,def:100});
        scrollbar.create();
        scrollbar.onchange = function(){
            cm.def.opacity = Math.min(scrollbar.getValue(),100)/100;
        };
        scrollbar.setValue(85);
        
		// video loader
		if(typeof ytid != 'undefined') yt_init();
		if(typeof dmid != 'undefined') dm_init();
		if(typeof vmid != 'undefined') vm_init();
		
		//$.holdReady(false);
		
	}/*else{
		setTimeout(resursive, 10);			// loop if needed
		console.log('loopy');
	}*/
}, 1);


// helper function
function zerofill(number, width) {
    var input = number + "";  // make sure it's a string
    return("00000000".slice(0, width - input.length) + input);
}

/* ======================================== Comment Utilities ======================================== */

var tmr=0;
var start=0;
var playhead = 0;

function load(dmf,dmfmd){
	cm.clear();
	start = 0;
	try{clearInterval(tmr);}catch(e){}  // unnecessary try-catch block?
    
    var cbfunc = function(){
        // rebuild comment list
        // reset comment list if already created
        $_('CommentList').innerHTML = '';
        
        cl.bind(cm.timeline,['stime','text','date'],function(dobj){
            var newObj = {};
            newObj.stime = Math.floor((dobj.stime / 1000)/60)+":" + (Math.floor((dobj.stime / 1000)%60)>=10 ? Math.floor((dobj.stime / 1000)%60):"0"+Math.floor((dobj.stime / 1000)%60));
            newObj.text = dobj.text;
            var dt = new Date();
            dt.setTime(dobj.date * 1000);
            newObj.date = dt.getFullYear() + "-" + zerofill(dt.getMonth()+1, 2) + "-" + zerofill(dt.getDate(), 2) + " " + zerofill(dt.getHours(), 2) + ":" + zerofill(dt.getMinutes(), 2);
            return newObj;
        });
        
        // draw table
        cl.init();
    }
    
	CommentLoader(dmf,cm,cbfunc,dmfmd);
	//resume();                         // use when switching between dm, comment autostart..
}

function stop(){
	cm.stopTimer();
	clearInterval(tmr);
}

function resume(){
	cm.startTimer();
	start = new Date().getTime() - playhead;
	try{
		clearInterval(tmr);				// make sure interval is cleared when switching dm
	}catch(e){}							// does nothing.
	tmr = setInterval(function(){
		playhead = new Date().getTime() - start;	// Date object to accurately track time
		cm.time(playhead);
		//console.log('Interval: '+playhead);
	}, 10);
}

function basicComment(){		// not so basic anymore..

	// special commands
	if($('input:text[name="comment"]').val() == 'fs'){
		toggleFullScreen($_('chrome'));
		$('input:text[name="comment"]').val('');
	}

	if($('input:text[name="comment"]').val() != ''){
		stime = parseFloat(Math.round(playhead / 1000))	// decimal: .toFixed(2);
		sec = zerofill(stime % 60, 2);
		min = Math.floor(stime / 60);
		// need to do some time conversion
		text = $('input:text[name="comment"]').val();
		time = new Date();
		date = time.getFullYear() + '-' + zerofill(time.getMonth() + 1, 2) + '-' + zerofill(time.getDate(), 2)
					+ ' ' + zerofill(time.getHours(), 2) + ':' + zerofill(time.getMinutes(), 2);
        
		// display it on screen
		cm.sendComment({	// only 'mode' and 'text' are required
			//stime:stime,
			mode:parseInt($('select#mode').val()),
			text:text,
			size:$('select#fontsize').val(),
			//date = new Date().getTime()		//get timestamp?
		});

		// add to cmtList
		$('div.cmtList table#CommentList tbody').append('<tr><td><div>'+min+':'+sec+'</div></td><td><div>'+text+'</div></td><td><div>'+date+'</div></td></tr>');
		// reset
		$('input:text[name="comment"]').val('');
	}
	return false;		// prevent refresh
}

/* ======================================== Full Screen Utilities ======================================== */

var isWindowedFullscreen = false;

function launchWindowFull(element){
	if(!isWindowedFullscreen){
		element.style.position = "fixed";
		element.style.top = "0";
		element.style.bottom = "0";
		element.style.left = "0";
		element.style.right = "0";
		element.style.width = "auto";
		element.style.height = "auto";
	}else{
		element.style.position = "";
		element.style.top = "";
		element.style.bottom = "";
		element.style.left = "";
		element.style.right = "";
	}
	cm.setBounds();
	isWindowedFullscreen = !isWindowedFullscreen;
}

function toggleFullScreen(element) {
	if ((document.fullScreenElement && document.fullScreenElement !== null) ||	// alternative standard method
		(!document.mozFullScreen && !document.webkitIsFullScreen)) {            // current working methods
		if (element.requestFullScreen) {
			element.requestFullScreen();
		} else if (element.mozRequestFullScreen) {
			element.mozRequestFullScreen();
		} else if (element.webkitRequestFullScreen) {
			element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
		}
	} else {
		if (document.cancelFullScreen) {
			document.cancelFullScreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitCancelFullScreen) {
			document.webkitCancelFullScreen();
		}
	}
}

// fullscreen listener
$(document).on('fullscreenchange mozfullscreenchange webkitfullscreenchange', function(){
    cm.setBounds();
})
