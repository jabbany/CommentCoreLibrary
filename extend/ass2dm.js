/** 
 *Subtitles File Parser Unit
 *
 * Licensed Under MIT License
 * Transforms an ASS file into a readable array for the CommentCoreLibrary
 * 
 * With reference from (https://github.com/spiegeleixxl/html5-ass-subtitles/)
***/

function parseASS(input, config) {
	var state = 0; 
	var linecounter = 0;
	var resizeFactor = 1;
	var captions = {};
	// initializing captions array
	var info = {};
	var styles = {};
	var timeline = [];
	// split the assfile by newlines.
	var assfile = input.split('\n');	
	var comments="";

	for (var linecount=0; linecount < assfile.length; linecount++){
		if (assfile[linecount].indexOf('[Script Info]') === 0){
			state = 1;
		} else if (assfile[linecount].indexOf('[V4+ Styles]')=== 0){
			state = 2;
			console.log(config);
			if ((info['PlayResX'] || info['PlayResY']) && (config.width || config.height)){
				resizeFactor = parseInt(info['PlayResY']) / config.height;
				console.log(resizeFactor);
			}
		} else if (assfile[linecount].indexOf('[Events]')=== 0){
			state = 3;
		} else if (state == 1){
			if (assfile[linecount].indexOf(';') !== 0){
				if (assfile[linecount].indexOf(':') > -1){
					var infoLine = assfile[linecount].split(':');
					info[infoLine[0].trim()] = infoLine[1].trim();
				}
			} else {
				comments = comments + assfile[linecount] + "\n";
			}
		} else if (state == 2){
			if (assfile[linecount].indexOf('Style:')=== 0){
				var styleparts = assfile[linecount].split(':')[1].split(',');
				var stylename = styleparts[0].trim();

				var style = {};
				style['stylename'] = styleparts[0].trim();
				style['fontname'] = styleparts[1];
				style['fontsize'] = parseFloat(styleparts[2]) * resizeFactor;
				style['color1'] = styleparts[3].replace(/^&H00/, "#");
				style['color2'] = styleparts[4].replace(/^&H00/, "#");
				style['border-color'] = styleparts[5];
				style['shadow-color'] = styleparts[6];
				style['bold'] = styleparts[7];
				style['italic'] = styleparts[8];
				style['underline'] = styleparts[9];
				style['strikeout'] = styleparts[10];
				style['fontscalex'] = styleparts[11];
				style['fontscaley'] = styleparts[12];
				style['spacing'] = styleparts[13];
				style['angle'] = styleparts[14];

				style['borderstyle'] = styleparts[15];
				style['outline'] = parseFloat(styleparts[16])*resizeFactor;
				style['shadow'] = parseFloat(styleparts[17])*resizeFactor;
				style['alignment'] = styleparts[18];
				style['marginleft'] = parseFloat(styleparts[19])*resizeFactor;
				style['marginright'] = parseFloat(styleparts[20])*resizeFactor;
				style['marginvertical'] = parseFloat(styleparts[21])*resizeFactor;
				style['encoding'] = styleparts[22];
				
				styles[style.stylename] = style;
			}
		} else if (state == 3){
			if (assfile[linecount].indexOf('Dialogue:')=== 0){
				var lineparts = assfile[linecount].split(',');
				var st = lineparts[1].trim().split(':');
				var et = lineparts[2].trim().split(':');
				var stime = st[0]*60*60 + st[1]*60 + parseFloat(st[2]);
				var etime = et[0]*60*60 + et[1]*60 + parseFloat(et[2]);
				var comment = {
					'stime' : Math.round(stime * 1000),
					'dur': Math.round((etime - stime) * 1000),
					'ttl': Math.round((etime - stime) * 1000),
					'mode': 4,
					'size': styles[lineparts[3]]['fontsize'] * resizeFactor,
					'color': styles[lineparts[3]]['color1'],
					'font': styles[lineparts[3]]['fontname'],
					'margin': styles[lineparts[3]]['marginleft'] + "px " + styles[lineparts[3]]['marginvertical'] + "px " + styles[lineparts[3]]['marginright'] + "px " + styles[lineparts[3]]['marginvertical'] + "px",
					'style' : lineparts[3],
					'pool': 15,
					'actor' : lineparts[4],
					'marginleft' : lineparts[5],
					'marginright' : lineparts[6],
					'marginvertical' : lineparts[7],
					'effect' : lineparts[8]
				}
				for (var z = 0; z < 9; z++) { lineparts.shift(); }
				comment.text = lineparts.join(',');
				comment.text = comment.text.replace(/{[^}]+}/gi,"");
				/*
				captions['lines'][linecounter]['asstags'] = "";
				var matches = captions['lines'][linecounter]['text'].match(/{[^}]+}/g);
				for (var z in matches){
					if (matches[z].startsWith("{\\")){
						captions['lines'][linecounter]['asstags'] = captions['lines'][linecounter]['asstags'] + matches[z] + " ";
					}
				}
				captions['lines'][linecounter]['text'] = captions['lines'][linecounter]['text'].replace(/{[^}]+}/gi,"");
				*/
				timeline.push(comment);
				linecounter = linecounter+1;
			}
		}
	}
	console.log(styles);
 	return timeline;  
}
