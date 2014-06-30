/***********************
* XMLParser
* Licensed Under the MIT License
* Copyright (c) 2012 Jim Chen ( CQZ, Jabbany )
************************/
function CommentLoader(url,xcm,mode){
	if(mode == null)
		mode = 'bilibili';
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
			if(mode == 'bilibili'){
				if(navigator.appName == 'Microsoft Internet Explorer'){
					var f = new ActiveXObject("Microsoft.XMLDOM");
					f.async = false;
					f.loadXML(xmlhttp.responseText);
					cm.load(BilibiliParser(f, xmlhttp.responseText));
				}else{
					cm.load(BilibiliParser(xmlhttp.responseXML, xmlhttp.responseText));
				}
			}else if(mode == 'acfun'){
				cm.load(AcfunParser(xmlhttp.responseText));
			}
		}
	}
}
/*************************
* Tiny Shorthand
**************************/
$ = function(a){return document.getElementById(a);};
