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
			data.text = data.mode != 7 ? jsondt[i].m.replace(/(\/n|\\n|\n|\r\n)/g,"\n") : jsondt[i].m;
			data.hash = xc[4];
			data.date = parseInt(xc[5]);
			if(data.mode ==7){
				//High level positioned dm
				try{
					var x = JSON.parse(data.text);
				}catch(e){
					console.log('Error parsing internal data for comment');
					continue;
				}
				console.log(x);
				data.text = x.n.replace(/\ /g,"&nbsp;");
				data.raw = true;
				if(/<(script|embed|object|canvas|meta|video|audio).*?>/g.test(data.text) ||
					/<.*on\w+=.*>/.test(data.txt)){
					//Unsafe scripting embed
					console.log('Unsafe attempt to embed script through text!');
					data.text = data.text.replace(/<.+?>/g,'');//Remove all HTML
				}
				data.text = data.text.replace(/(\/n|\\n|\n|\r\n|\r|\\r)/g,"<br>");
				if(x.p != null){
					data.x = x.p.x;
					data.y = x.p.y;
				}else{
					data.x = 0;
					data.y = 0;
				}
				data.shadow = x.b;
				data.duration = 4000;
				if(x.l != null)
					data.duration = x.l* 1000;
				if(x.z != null){
					data.movable = true;
					data.toX = x.z[0].x;
					data.toY = x.z[0].y;
					data.moveDuration = x.z[0].l != null ? (x.z[0].l * 1000) : 500;
					data.moveDelay = 0;
				}
			}
			list.push(data);
		}
	}
	return list;
}