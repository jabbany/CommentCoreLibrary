/** 
 * AcFun Format Parser
 * @license MIT License
 * An alternative format comment parser
 */
function AcfunParser(jsond){
	var list = [];
	try{
		var jsondt = JSON.parse(jsond);
	}catch(e){
		console.log('Error: Could not parse json list!');
		return [];
	}
	for(var i=0;i<jsondt.length;i++){
		//Read each comment and generate a correct comment object
		var data = {};
		var xc = jsondt[i]['c'].split(',');
		if(xc.length > 0){
			data.stime = parseFloat(xc[0]) * 1000;
			data.color = parseInt(xc[1])
			data.mode = parseInt(xc[2]);
			data.size = parseInt(xc[3]);
			data.hash = xc[4];
			data.date = parseInt(xc[5]);
			data.position = "absolute";
			if(data.mode != 7){
				data.text = jsondt[i].m.replace(/(\/n|\\n|\n|\r\n|\\r)/g,"\n");
				data.text = data.text.replace(/\r/g,"\n");
				data.text = data.text.replace(/\s/g,"\u00a0");
			}else{
				data.text = jsondt[i].m;
			}
			if(data.mode == 7){
				//High level positioned dm
				try{
					var x = JSON.parse(data.text);
				}catch(e){
					console.log('[Err] Error parsing internal data for comment');
					console.log('[Dbg] ' + data.text);
					continue;
				}
				data.position = "relative";
				data.text = x.n; /*.replace(/\r/g,"\n");*/
				data.text = data.text.replace(/\ /g,"\u00a0");
				if(x.a != null){
					data.opacity = x.a;
				}else{
					data.opacity = 1;
				}
				if(x.p != null){
					data.x = x.p.x / 1000; // relative position
					data.y = x.p.y / 1000;
				}else{
					data.x = 0;
					data.y = 0;
				}
				data.shadow = x.b;
				data.dur = 4000;
				if(x.l != null)
					data.moveDelay = x.l * 1000;
				if(x.z != null && x.z.length > 0){
					data.movable = true;
					data.motion = [];
					var moveDuration = 0;
					var last = {x:data.x, y:data.y, alpha:data.opacity, color:data.color};
					for(var m = 0; m < x.z.length; m++){
						var dur = x.z[m].l != null ? (x.z[m].l * 1000) : 500;
						moveDuration += dur;
						var motion = {
							x:{from:last.x, to:x.z[m].x/1000, dur: dur, delay: 0},
							y:{from:last.y, to:x.z[m].y/1000, dur: dur, delay: 0}
						};
						last.x = motion.x.to;
						last.y = motion.y.to;
						if(x.z[m].t !== last.alpha){
							motion.alpha = {from:last.alpha, to:x.z[m].t, dur: dur, delay: 0};
							last.alpha = motion.alpha.to;
						}
						if(x.z[m].c != null && x.z[m].c !== last.color){
							motion.color = {from:last.color, to:x.z[m].c, dur: dur, delay: 0};
							last.color = motion.color.to;
						}
						data.motion.push(motion);
					}
					data.dur = moveDuration + (data.moveDelay ? data.moveDelay : 0);
				}
				if(x.r != null && x.k != null){
					data.rX = x.r;
					data.rY = x.k;
				}
				
			}
			list.push(data);
		}
	}
	return list;
}
