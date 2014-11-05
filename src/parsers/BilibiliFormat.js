/** 
 * Bilibili Format Parser
 * @license MIT License
 * Takes in an XMLDoc/LooseXMLDoc and parses that into a Generic Comment List
 **/
function BilibiliParser(xmlDoc, text, warn){	
	function format(string){
		// Format the comment text to be JSON Valid.
		return string.replace(/\t/,"\\t");	
	}
	
	if(xmlDoc !== null){
		var elems = xmlDoc.getElementsByTagName('d');
	}else{
		if(!document || !document.createElement){
			// Maybe we are in a restricted context? Bail.
			return [];
		}
		if(warn){
			if(!confirm("XML Parse Error. \n Allow tag soup parsing?\n[WARNING: This is unsafe.]")){
				return [];
			}
		}else{
			// TODO: Make this safer in the future
			text = text.replace(new RegExp("</([^d])","g"), "</disabled $1");
			text = text.replace(new RegExp("</(\S{2,})","g"), "</disabled $1");
			text = text.replace(new RegExp("<([^d/]\W*?)","g"), "<disabled $1");
			text = text.replace(new RegExp("<([^/ ]{2,}\W*?)","g"), "<disabled $1");
		}
		var tmp = document.createElement("div");
		tmp.innerHTML = text;
		var elems = tmp.getElementsByTagName('d');
	}
	
	var tlist = [];
	for(var i=0;i < elems.length;i++){
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
						obj.x = parseFloat(adv[0]);
						obj.y = parseFloat(adv[1]);
						if(Math.floor(obj.x) < obj.x || Math.floor(obj.y) < obj.y){
							obj.position = "relative";
						}
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
							var singleStepDur = 500;
							var motion = {
								x:{from: obj.x, to:parseFloat(adv[7]), dur:singleStepDur, delay:0},
								y:{from: obj.y, to:parseFloat(adv[8]), dur:singleStepDur, delay:0},
							};
							if(adv[9] !== ''){
								singleStepDur = parseInt(adv[9], 10);
								motion.x.dur = singleStepDur;
								motion.y.dur = singleStepDur;
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
								if(adv.length > 14){
									// Support for Bilibili Advanced Paths
									if(obj.position === "relative"){
										console.log("Cannot mix relative and absolute positioning");
										obj.position = "absolute";
									}
									var path = adv[14];
									var lastPoint = {x:motion.x.from, y:motion.y.from};
									var pathMotion = [];
									var regex = new RegExp("([a-zA-Z])\\s*(\\d+)[, ](\\d+)","g");
									var counts = path.split(/[a-zA-Z]/).length - 1;
									var m = regex.exec(path);
									while(m !== null){
										switch(m[1]){
											case "M":{
												lastPoint.x = parseInt(m[2],10);
												lastPoint.y = parseInt(m[3],10);
											}break;
											case "L":{
												pathMotion.push({
													"x":{"from":lastPoint.x, "to":parseInt(m[2],10), "dur": singleStepDur / counts, "delay": 0},
													"y":{"from":lastPoint.y, "to":parseInt(m[3],10), "dur": singleStepDur / counts, "delay": 0}
												});
												lastPoint.x = parseInt(m[2],10);
												lastPoint.y = parseInt(m[3],10);
											}break;
										}
										m = regex.exec(path);
									}
									motion = null;
									obj.motion = pathMotion;
								}
							}
							if(motion !== null){
								obj.motion.push(motion);
							}
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
							if(alphaFrom !== alphaTo){
								obj.alpha = {from:alphaFrom, to:alphaTo}
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
			if(obj.text != null)
				obj.text = obj.text.replace(/\u25a0/g,"\u2588");
			tlist.push(obj);
		}
	}
	return tlist;
}
