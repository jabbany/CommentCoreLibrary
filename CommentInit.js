// Initializing the Comment Core Library and video component
// requires jQuery

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
        scrollbar.setValue(100);
        
		// video loader
		if(typeof ytid != 'undefined') yt_init();
		if(typeof dmid != 'undefined') dm_init();
		if(typeof vmid != 'undefined') vm_init();
		
		// track fullscreen
		$(document).on('fullscreenchange mozfullscreenchange webkitfullscreenchange', function(){
			// use css calc on supported browsers
			/* if (document.mozFullScreen || document.webkitIsFullScreen){
				$('div.abp').css('height', function(){
					return screen.height - 25 + 'px';
				})
			}else{
				$('div.abp').css('height', function(){
					return 380 + 'px';
				})
			} */
			cm.setBounds();		// reset canvas
		})
		
		//$.holdReady(false);
		
		// fullscreen comment bar width adjustment for browser without flex
		document.styleSheets[0].insertRule(':fullscreen form#danmu input[type="text"][name="comment"]{width: '+ (screen.width - 150) +'px;}', 0)
		
	}/*else{
		setTimeout(resursive, 10);			// loop if needed
		console.log('loopy');
	}*/
}, 1);


/*
cm.filter.addModifier(function(cmt){
	if(cmt.mode == 1)
		cmt.mode = 2;
	return cmt;
});
*/

// helper func
function zerofill(number, width) {
    var input = number + "";  // make sure it's a string
    return("00000000".slice(0, width - input.length) + input);
}

var tmr=0;
var start=0;
var playhead = 0;

function load(dmf,dmfmd){               // glitchy.. initial load is fine.
    if(dmfmd == null)                   // not needed, checked again in CommentLoader
        dmfmd = 'bilibili';

	cm.clear();
	start = 0;
	try{clearInterval(tmr);}catch(e){}  // unnecessary try-catch block?
    
    var cbfunc = function(){
        // rebuild comment list
        // reset comment list if already created
        document.getElementById('CommentList').innerHTML = '';
        
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
		toggleFullScreen();
		$('input:text[name="comment"]').val('');
	}

	if($('input:text[name="comment"]').val() != ''){
		//stime = Math.floor(player.getCurrentTime())+1	// youtube specific call!
		stime = parseFloat(Math.round(playhead / 1000))	// decimal: .toFixed(2);
		sec = zerofill(stime % 60, 2);
		min = Math.floor(stime / 60);
		// need to do some time conversion
		text = $('input:text[name="comment"]').val();
		time = new Date();
		date = time.getFullYear() + '-' + zerofill(time.getMonth() + 1, 2) + '-' + zerofill(time.getDate(), 2)
					+ ' ' + zerofill(time.getHours(), 2) + ':' + zerofill(time.getMinutes(), 2);

		// show it on screen
		cm.sendComment({	// only 'mode' and 'text' are required
			//stime:Math.floor(player.getCurrentTime())+1,
			mode:1,
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
function toggleFullScreen() {
	var frame = document.getElementById('chrome');
	if ((document.fullScreenElement && document.fullScreenElement !== null) ||	// alternative standard method
		(!document.mozFullScreen && !document.webkitIsFullScreen)) {            // current working methods
		if (frame.requestFullScreen) {
			frame.requestFullScreen();
		} else if (frame.mozRequestFullScreen) {
			frame.mozRequestFullScreen();
		} else if (frame.webkitRequestFullScreen) {
			frame.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
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