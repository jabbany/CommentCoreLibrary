/** 
Bilibili Format
Licensed Under MIT License
 Takes in an XMLDoc/LooseXMLDoc and parses that into a Generic Comment List
**/
function BilibiliParser(xmlDoc, text, warn){	
	//Format the bili output to be json-valid
	function format(string){
		return string.replace(/\t/,"\\t");	
	}
	if(xmlDoc !== null){
        var elems = xmlDoc.getElementsByTagName('d');
    }else{
    	if(warn){
    		if(!confirm("XML Parse Error. \n Allow tag soup parsing?\n[WARNING: This is unsafe.]")){
    			return [];
    		}
    	}else{
    		// clobber some potentially bad things
        	text = text.replace(new RegExp("</([^d])","g"), "</disabled $1");
        	text = text.replace(new RegExp("</(\S{2,})","g"), "</disabled $1");
        	text = text.replace(new RegExp("<([^d/]\W*?)","g"), "<disabled $1");
        	text = text.replace(new RegExp("<([^/ ]{2,}\W*?)","g"), "<disabled $1");
        	console.log(text);
    	}
        var tmp = document.createElement("div");
        tmp.innerHTML = text;
        console.log(tmp);
        var elems = tmp.getElementsByTagName('d');
    }
	var tlist = [];
	for(var i=0;i<elems.length;i++){
		if(elems[i].getAttribute('p') != null){
			var opt = elems[i].getAttribute('p').split(',');
			if(!elems[i].childNodes[0])
			  continue;
			var text = elems[i].childNodes[0].nodeValue;
			var obj = {};
			obj.stime = Math.round(parseFloat(opt[0])*1000);
			obj.size = parseInt(opt[2]);
			obj.color = parseInt(opt[3]);
			obj.mode = parseInt(opt[1]);
			obj.date = parseInt(opt[4]);
			obj.pool = parseInt(opt[5]);
			obj.position = "absolute";
			if(opt[7] != null)
				obj.dbid = parseInt(opt[7]);
			obj.hash = opt[6];
			obj.border = false;
			if(obj.mode < 7){
				obj.text = text.replace(/(\/n|\\n|\n|\r\n)/g, "\n");
			}else{
				if(obj.mode == 7){
					try{
						adv = JSON.parse(format(text));
						obj.shadow = true;
						obj.x = parseInt(adv[0], 10);
						obj.y = parseInt(adv[1], 10);
						obj.text = adv[4].replace(/(\/n|\\n|\n|\r\n)/g, "\n");
						obj.rZ = 0;
						obj.rY = 0;
						if(adv.length >= 7){
							obj.rZ = parseInt(adv[5], 10);
							obj.rY = parseInt(adv[6], 10);
						}
						obj.motion = [];
						obj.movable = false;
						if(adv.length >= 11){
							obj.movable = true;
							var motion = {
								x:{from: obj.x, to:parseInt(adv[7], 10), dur:500, delay:0},
								y:{from: obj.y, to:parseInt(adv[8], 10), dur:500, delay:0},
							}
							if(adv[9] !== ''){
								motion.x.dur = parseInt(adv[9], 10);
								motion.y.dur = parseInt(adv[9], 10);
							}
							if(adv[10] !== ''){
								motion.x.delay = parseInt(adv[10], 10);
								motion.y.delay = parseInt(adv[10], 10);
							}
							if(adv.length > 11){
								obj.shadow = adv[11];
								if(obj.shadow === "true"){
									obj.shadow = true;
								}
								if(obj.shadow === "false"){
									obj.shadow = false;
								}
								if(adv[12] != null){
									obj.font = adv[12];
								}
							}
							obj.motion.push(motion);
						}
						obj.dur = 2500;
						if(adv[3] < 12){
							obj.dur = adv[3] * 1000;
						}
						var tmp = adv[2].split('-');
						if(tmp != null && tmp.length>1){
							var alphaFrom = parseFloat(tmp[0]);
							var alphaTo = parseFloat(tmp[1]);
							obj.opacity = alphaFrom;
							var alphaObj = {from:alphaFrom, to:alphaTo, dur:obj.dur, delay:0};
							if(obj.motion.length > 0){
								obj.motion[0]["alpha"] = alphaObj;
							}else{
								obj.motion.push({alpha:alphaObj});
							}
						}
					}catch(e){
						console.log('[Err] Error occurred in JSON parsing');
						console.log('[Dbg] ' + text);
					}
				}else if(obj.mode == 8){
					obj.code = text; //Code comments are special
				}
			}
			//Before we push
			if(obj.text != null)
				obj.text = obj.text.replace(/\u25a0/g,"\u2588");
			tlist.push(obj);
		}
	}
	return tlist;
}
