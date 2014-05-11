/** 
AcFun Format
Licensed Under MIT License
 An alternative format comment parser
**/
function AcfunParser(jsond){
	function fillRGB(string){
		while(string.length < 6){
			string = "0" + string;
		}
		return string;
	}
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
			data.color = '#' + fillRGB(parseInt(xc[1]).toString(16));
			data.mode = parseInt(xc[2]);
			data.size = parseInt(xc[3]);
			data.hash = xc[4];
			data.date = parseInt(xc[5]);
			data.position = "relative";
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
				data.text = x.n; /*.replace(/\r/g,"\n");*/
				data.text = data.text.replace(/\ /g,"\u00a0");
				console.log(data.text);
				if(x.p != null){
					data.x = x.p.x / 1000; // relative position
					data.y = x.p.y / 1000;
				}else{
					data.x = 0;
					data.y = 0;
				}
				data.shadow = x.b;
				data.duration = 4000;
				if(x.l != null)
					data.moveDelay = x.l * 1000;
				if(x.z != null && x.z.length > 0){
					data.movable = true;
					data.toX = x.z[0].x / 1000;
					data.toY = x.z[0].y / 1000;
					data.alphaTo = x.z[0].t;
					data.colorTo = x.z[0].c;
					data.moveDuration = x.z[0].l != null ? (x.z[0].l * 1000) : 500;
					data.duration = data.moveDelay + data.moveDuration;
				}
				if(x.r != null && x.k != null){
					data.rX = x.r;
					data.rY = x.k;
				}
				if(x.a){
					data.alphaFrom = x.a;
				}
			}
			list.push(data);
		}
	}
	return list;
}
