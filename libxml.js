/***********************
* XMLParser
* Licensed Under the MIT License
* Copyright (c) 2012 Jim Chen ( CQZ, Jabbany )
************************/
function CommentLoader(url,xcm,crossdomain){
	if(crossdomain == null)
		crossdomain = false;
	if(!crossdomain){
		if (window.XMLHttpRequest){
			xmlhttp=new XMLHttpRequest();
		}
		else{
			xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		}
		xmlhttp.open("GET",url,true);
		xmlhttp.send();
		var cm = xcm;
		xmlhttp.onreadystatechange = function(){
			if (xmlhttp.readyState==4 && xmlhttp.status==200){
				if(navigator.appName == 'Microsoft Internet Explorer'){
					var f = new ActiveXObject("Microsoft.XMLDOM");
					f.async = false;
					f.loadXML(xmlhttp.responseText);
					cm.load(BilibiliParser(f));
				}else{
					cm.load(BilibiliParser(xmlhttp.responseXML));
				}
			}
		}
	}else{
		var xhr = createCORSRequest("POST","corsproxy.php");
		if(xhr == null)
			return;
		var cm = xcm;
		var params = "CORSProxy_URI=" + urlencode(url) + "&CORSProxy_TYPE=GET&CORSProxy_REFERER=&CORSProxy_ENCTYPE=plain";
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.setRequestHeader("Content-length", params.length);
		xhr.onload = function(){
			if (xmlhttp.readyState==4 && xmlhttp.status==200){
			}
		}
		xhr.send(params);
	}
	
}
function createCORSRequest(method, url){
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr){
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined"){
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        xhr = null;
    }
    return xhr;
}
function BilibiliParser(xmlDoc){
	//Parse into Array
	function fillRGB(string){
		while(string.length < 6){
			string = "0" + string;
		}
		return string;
	}
	var elems = xmlDoc.getElementsByTagName('d');
	var tlist = [];
	for(var i=0;i<elems.length;i++){
		if(elems[i].getAttribute('p') != null){
			var opt = elems[i].getAttribute('p').split(',');
			var text = elems[i].childNodes[0].nodeValue;
			var obj = {};
			obj.stime = Math.round(parseFloat(opt[0]*1000));
			obj.size = parseInt(opt[2]);
			obj.color = "#" + fillRGB(parseInt(opt[3]).toString(16));
			obj.mode = parseInt(opt[1]);
			obj.date = parseInt(opt[4]);
			obj.pool = parseInt(opt[5]);
			if(opt[7] != null)
				obj.dbid = parseInt(opt[7]);
			obj.hash = opt[6];
			obj.border = false;
			if(obj.mode < 7){
				obj.text = text.replace(/(\/n|\\n|\n|\r\n)/g, "\n");
			}else{
				if(obj.mode == 7){
					try{
						adv = JSON.parse(text);
						obj.shadow = true;
						obj.x = adv[0];
						obj.y = adv[1];
						obj.text = adv[4].replace(/(\/n|\\n|\n|\r\n)/g, "\n");
						obj.rZ = 0;
						obj.rY = 0;
						if(adv.length >= 7){
							obj.rZ = adv[5];
							obj.rY = adv[6];
						}
						obj.movable = false;
						if(adv.length >= 11){
							obj.movable = true;
							obj.toX = adv[7];
							obj.toY = adv[8];
							obj.moveDuration = 500;
							obj.moveDelay = 0;
							if(adv[9]!='')
								obj.moveDuration = adv[9];
							if(adv[10]!="")
								obj.moveDelay = adv[10];
							if(adv.length > 11){
								obj.shadow = adv[11] == 'false' ? false : true;
								if(adv[12]!=null)
									obj.font = adv[12];
							}
						}
						obj.duration = 2500;
						if(adv[3] < 12){
							obj.duration = adv[3] * 1000;
						}
						obj.alphaFrom = 1;
						obj.alphaTo = 1;
						var tmp = adv[2].split('-');
						if(tmp != null && tmp.length>1){
							obj.alphaFrom = parseFloat(tmp[0]);
							obj.alphaTo = parseFloat(tmp[1]);
						}
					}catch(e){console.log('Error occurred in JSON parsing');}
				}
			}
			tlist.push(obj);
		}
	}
	return tlist;
}