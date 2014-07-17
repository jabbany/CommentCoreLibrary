/* CommentCoreLibrary (//github.com/jabbany/CommentCoreLibrary) - Licensed under the MIT License */
function AcfunParser(t){function e(t){for(;t.length<6;)t="0"+t;return t}var i=[];try{var o=JSON.parse(t)}catch(s){return console.log("Error: Could not parse json list!"),[]}for(var h=0;h<o.length;h++){var r={},n=o[h].c.split(",");if(n.length>0){if(r.stime=1e3*parseFloat(n[0]),r.color="#"+e(parseInt(n[1]).toString(16)),r.mode=parseInt(n[2]),r.size=parseInt(n[3]),r.hash=n[4],r.date=parseInt(n[5]),r.position="relative",7!=r.mode?(r.text=o[h].m.replace(/(\/n|\\n|\n|\r\n|\\r)/g,"\n"),r.text=r.text.replace(/\r/g,"\n"),r.text=r.text.replace(/\s/g," ")):r.text=o[h].m,7==r.mode){try{var a=JSON.parse(r.text)}catch(s){console.log("[Err] Error parsing internal data for comment"),console.log("[Dbg] "+r.text);continue}r.text=a.n,r.text=r.text.replace(/\ /g," "),console.log(r.text),null!=a.p?(r.x=a.p.x/1e3,r.y=a.p.y/1e3):(r.x=0,r.y=0),r.shadow=a.b,r.duration=4e3,null!=a.l&&(r.moveDelay=1e3*a.l),null!=a.z&&a.z.length>0&&(r.movable=!0,r.toX=a.z[0].x/1e3,r.toY=a.z[0].y/1e3,r.alphaTo=a.z[0].t,r.colorTo=a.z[0].c,r.moveDuration=null!=a.z[0].l?1e3*a.z[0].l:500,r.duration=r.moveDelay+r.moveDuration),null!=a.r&&null!=a.k&&(r.rX=a.r,r.rY=a.k),a.a&&(r.alphaFrom=a.a)}i.push(r)}}return i}function BilibiliParser(t){function e(t){for(;t.length<6;)t="0"+t;return t}function i(t){return t.replace(/\t/,"\\t")}for(var o=t.getElementsByTagName("d"),s=[],h=0;h<o.length;h++)if(null!=o[h].getAttribute("p")){var r=o[h].getAttribute("p").split(",");if(!o[h].childNodes[0])continue;var n=o[h].childNodes[0].nodeValue,a={};if(a.stime=Math.round(parseFloat(1e3*r[0])),a.size=parseInt(r[2]),a.color="#"+e(parseInt(r[3]).toString(16)),a.mode=parseInt(r[1]),a.date=parseInt(r[4]),a.pool=parseInt(r[5]),a.position="absolute",null!=r[7]&&(a.dbid=parseInt(r[7])),a.hash=r[6],a.border=!1,a.mode<7)a.text=n.replace(/(\/n|\\n|\n|\r\n)/g,"\n");else if(7==a.mode)try{adv=JSON.parse(i(n)),a.shadow=!0,a.x=parseInt(adv[0]),a.y=parseInt(adv[1]),a.text=adv[4].replace(/(\/n|\\n|\n|\r\n)/g,"\n"),a.rZ=0,a.rY=0,adv.length>=7&&(a.rZ=parseInt(adv[5]),a.rY=parseInt(adv[6])),a.movable=!1,adv.length>=11&&(a.movable=!0,a.toX=adv[7],a.toY=adv[8],a.moveDuration=500,a.moveDelay=0,""!=adv[9]&&(a.moveDuration=adv[9]),""!=adv[10]&&(a.moveDelay=adv[10]),adv.length>11&&(a.shadow=adv[11],"true"===a.shadow&&(a.shadow=!0),"false"===a.shadow&&(a.shadow=!1),null!=adv[12]&&(a.font=adv[12]))),a.duration=2500,adv[3]<12&&(a.duration=1e3*adv[3]),a.alphaFrom=1,a.alphaTo=1;var l=adv[2].split("-");null!=l&&l.length>1&&(a.alphaFrom=parseFloat(l[0]),a.alphaTo=parseFloat(l[1]))}catch(d){console.log("[Err] Error occurred in JSON parsing"),console.log("[Dbg] "+n)}else 8==a.mode&&(a.code=n);null!=a.text&&(a.text=a.text.replace(/\u25a0/g,"█")),s.push(a)}return s}function CommentFilter(){this.rulebook={all:[]},this.modifiers=[],this.runtime=null,this.allowTypes={1:!0,4:!0,5:!0,6:!0,7:!0,8:!0,17:!0},this.doModify=function(t){for(var e=0;e<this.modifiers.length;e++)t=this.modifiers[e](t);return t},this.isMatchRule=function(t,e){switch(e.operator){case"==":if(t[e.subject]==e.value)return!1;break;case">":if(t[e.subject]>e.value)return!1;break;case"<":if(t[e.subject]<e.value)return!1;break;case"range":if(t[e.subject]>e.value.min&&t[e.subject]<e.value.max)return!1;break;case"!=":if(t[e.subject]!=e.value)return!1;break;case"~":if(new RegExp(e.value).test(t[e[subject]]))return!1;break;case"!~":if(!new RegExp(e.value).test(t[e[subject]]))return!1}return!0},this.beforeSend=function(t){var e=t.data.mode;if(null!=this.rulebook[e]){for(var i=0;i<this.rulebook[e].length;i++)if("width"==this.rulebook[e][i].subject||"height"==this.rulebook[e][i].subject)if("width"==this.rulebook[e][i].subject)switch(this.rulebook[e][i].operator){case">":if(this.rulebook[e][i].value<t.offsetWidth)return!1;break;case"<":if(this.rulebook[e][i].value>t.offsetWidth)return!1;break;case"range":if(this.rulebook[e][i].value.max>t.offsetWidth&&this.rulebook[e][i].min<t.offsetWidth)return!1;break;case"==":if(this.rulebook[e][i].value==t.offsetWidth)return!1}else switch(this.rulebook[e][i].operator){case">":if(this.rulebook[e][i].value<t.offsetHeight)return!1;break;case"<":if(this.rulebook[e][i].value>t.offsetHeight)return!1;break;case"range":if(this.rulebook[e][i].value.max>t.offsetHeight&&this.rulebook[e][i].min<t.offsetHeight)return!1;break;case"==":if(this.rulebook[e][i].value==t.offsetHeight)return!1}return!0}return!0},this.doValidate=function(t){if(!this.allowTypes[t.mode])return!1;var e={text:t.text,mode:t.mode,color:t.color,size:t.size,stime:t.stime,hash:t.hash};if(null!=this.rulebook[t.mode]&&this.rulebook[t.mode].length>0)for(var i=0;i<this.rulebook[t.mode];i++)if(!this.isMatchRule(e,this.rulebook[t.mode][i]))return!1;for(var i=0;i<this.rulebook[t.mode];i++)if(!this.isMatchRule(e,this.rulebook[t.mode][i]))return!1;return!0},this.addRule=function(t){switch(null==this.rulebook[t.mode+""]&&(this.rulebook[t.mode+""]=[]),t.operator){case"eq":case"equals":case"=":t.operator="==";break;case"ineq":t.operator="!=";break;case"regex":case"matches":t.operator="~";break;case"notmatch":case"iregex":t.operator="!~"}return this.rulebook[t.mode].push(t),this.rulebook[t.mode].length-1},this.addModifier=function(t){this.modifiers.push(t)},this.runtimeFilter=function(t){return null==this.runtime?t:this.runtime(t)},this.setRuntimeFilter=function(t){this.runtime=t}}function CommentSpaceAllocator(t,e){this.width=t,this.height=e,this.dur=4e3,this.pools=[[]],this.pool=this.pools[0],this.setBounds=function(t,e){this.width=t,this.height=e},this.add=function(t){t.height>=this.height?(t.cindex=this.pools.indexOf(this.pool),t.style.top="0px"):(t.cindex=this.pools.indexOf(this.pool),t.style.top=this.setY(t)+"px")},this.remove=function(t){var e=this.pools[t.cindex];e.remove(t)},this.validateCmt=function(t){return t.bottom=t.offsetTop+t.offsetHeight,t.y=t.offsetTop,t.x=t.offsetLeft,t.right=t.offsetLeft+t.offsetWidth,t.w&&t.h?(t.width=t.w,t.height=t.h):(t.height=t.offsetHeight,t.width=t.offsetWidth),t.top=t.offsetTop,t.left=t.offsetLeft,t},this.setY=function(t,e){if(!e)var e=0;if(t=this.validateCmt(t),this.pools.length<=e&&this.pools.push([]),this.pool=this.pools[e],0==this.pool.length)return this.pool.push(t),0;if(this.vCheck(0,t))return this.pool.binsert(t,function(t,e){return t.bottom<e.bottom?-1:t.bottom==e.bottom?0:1}),t.y;for(var i=0,o=0;o<this.pool.length&&(i=this.pool[o].bottom+1,!(i+t.offsetHeight>this.height));o++)if(this.vCheck(i,t))return this.pool.binsert(t,function(t,e){return t.bottom<e.bottom?-1:t.bottom==e.bottom?0:1}),t.y;this.setY(t,e+1)},this.vCheck=function(t,e){var i=t+e.height,o=e.x+e.width;this.validateCmt(e);for(var s=0;s<this.pool.length;s++)if(this.pool[s]=this.validateCmt(this.pool[s]),!(this.pool[s].y>i||this.pool[s].bottom<t)){if(this.pool[s].right<e.x||this.pool[s].x>o){if(this.getEnd(this.pool[s])<this.getMiddle(e))continue;return!1}return!1}return e.y=t,e.bottom=e.height+t,!0},this.getEnd=function(t){return t.stime+t.ttl},this.getMiddle=function(t){return t.stime+t.ttl/2}}function TopCommentSpaceAllocator(t,e){var i=new CommentSpaceAllocator(t,e);i.add=function(t){i.validateCmt(t),t.style.left=(i.width-t.width)/2+"px",t.height>=i.height?(t.cindex=i.pools.indexOf(i.pool),t.style.top="0px"):(t.cindex=i.pools.indexOf(i.pool),t.style.top=i.setY(t)+"px")},i.vCheck=function(t,e){for(var o=t+e.height,s=0;s<i.pool.length;s++){var h=i.validateCmt(i.pool[s]);if(!(h.y>o||h.bottom<t))return!1}return e.y=t,e.bottom=e.bottom+t,!0},this.setBounds=function(t,e){i.setBounds(t,e)},this.add=function(t){i.add(t)},this.remove=function(t){i.remove(t)}}function BottomCommentSpaceAllocator(t,e){var i=new CommentSpaceAllocator(t,e);i.add=function(t){t.style.top="",t.style.bottom="0px",i.validateCmt(t),t.style.left=(i.width-t.width)/2+"px",t.height>=i.height?(t.cindex=i.pools.indexOf(i.pool),t.style.bottom="0px"):(t.cindex=i.pools.indexOf(i.pool),t.style.bottom=i.setY(t)+"px")},i.validateCmt=function(t){return t.y=i.height-(t.offsetTop+t.offsetHeight),t.bottom=t.y+t.offsetHeight,t.x=t.offsetLeft,t.right=t.offsetLeft+t.offsetWidth,t.height=t.offsetHeight,t.width=t.offsetWidth,t.top=t.y,t.left=t.offsetLeft,t},i.vCheck=function(t,e){for(var o=t+e.height,s=0;s<i.pool.length;s++){var h=i.validateCmt(i.pool[s]);if(!(h.y>o||h.bottom<t))return!1}return e.y=t,e.bottom=e.bottom+t,!0},this.setBounds=function(t,e){i.setBounds(t,e)},this.add=function(t){i.add(t)},this.remove=function(t){i.remove(t)}}function ReverseCommentSpaceAllocator(t,e){var i=new CommentSpaceAllocator(t,e);i.vCheck=function(t,e){var i=t+e.height,o=e.x+e.width;this.validateCmt(e);for(var s=0;s<this.pool.length;s++){var h=this.validateCmt(this.pool[s]);if(!(h.y>i||h.bottom<t)){if(h.x>o||h.right<e.x){if(this.getEnd(h)<this.getMiddle(e))continue;return!1}return!1}}return e.y=t,e.bottom=e.height+t,!0},this.setBounds=function(t,e){i.setBounds(t,e)},this.add=function(t){i.add(t)},this.remove=function(t){i.remove(t)}}function BottomScrollCommentSpaceAllocator(t,e){var i=new CommentSpaceAllocator(t,e);i.validateCmt=function(t){return t.y=i.height-(t.offsetTop+t.offsetHeight),t.bottom=t.y+t.offsetHeight,t.x=t.offsetLeft,t.right=t.offsetLeft+t.offsetWidth,t.height=t.offsetHeight,t.width=t.offsetWidth,t.top=t.y,t.left=t.offsetLeft,t},i.add=function(t){t.style.top="",t.style.bottom="0px",i.validateCmt(t),t.style.left=i.width+"px",t.height>=i.height?(t.cindex=i.pools.indexOf(i.pool),t.style.bottom="0px"):(t.cindex=i.pools.indexOf(i.pool),t.style.bottom=i.setY(t)+"px")},this.setBounds=function(t,e){i.setBounds(t,e)},this.add=function(t){i.add(t)},this.remove=function(t){i.remove(t)}}function CommentManager(t){var e=0;this.stage=t,this.def={opacity:1,globalScale:1,scrollScale:1},this.timeline=[],this.runline=[],this.pdiv=[],this.pdivbreak=1*this.def.globalScale,this.eachDivTime=4e3*this.pdivbreak,this.pdivshow=[],this.pdivpool=[0],this.pdivheight=29,this.position=0,this.limiter=0,this.filter=null,this.csa={scroll:new CommentSpaceAllocator(0,0),top:new TopCommentSpaceAllocator(0,0),bottom:new BottomCommentSpaceAllocator(0,0),reverse:new ReverseCommentSpaceAllocator(0,0),scrollbtm:new BottomScrollCommentSpaceAllocator(0,0)},this.stage.width=this.stage.offsetWidth,this.stage.height=this.stage.offsetHeight,this.initCmt=function(t,e){return t.className="cmt",t.stime=e.stime,t.mode=e.mode,t.data=e,17===t.mode||(t.appendChild(document.createTextNode(e.text)),t.innerText=e.text,t.style.fontSize=e.size+"px"),null!=e.font&&""!=e.font&&(t.style.fontFamily=e.font),e.shadow===!1&&(t.className="cmt noshadow"),"#000000"!=e.color||!e.shadow&&null!=e.shadow||(t.className+=" rshadow"),null!=e.margin&&(t.style.margin=e.margin),null!=e.color&&(t.style.color=e.color),1!=this.def.opacity&&1==e.mode&&(t.style.opacity=this.def.opacity),null!=e.alphaFrom&&(t.style.opacity=e.alphaFrom),e.border&&(t.style.border="1px solid #00ffff"),t.ttl=Math.round(4e3*this.def.globalScale),t.dur=t.ttl,(1===t.mode||6===t.mode||2===t.mode)&&(t.ttl*=this.def.scrollScale,t.dur=t.ttl),t},this.startTimer=function(){if(!(e>0)){var t=(new Date).getTime(),i=this;e=window.setInterval(function(){var e=(new Date).getTime()-t;t=(new Date).getTime(),i.onTimerEvent(e,i)},10)}},this.stopTimer=function(){window.clearInterval(e),e=0}}Array.prototype.remove=function(t){for(var e=0;e<this.length;e++)if(this[e]==t){this.splice(e,1);break}},Array.prototype.bsearch=function(t,e){if(0==this.length)return 0;if(e(t,this[0])<0)return 0;if(e(t,this[this.length-1])>=0)return this.length;for(var i=0,o=0,s=0,h=this.length-1;h>=i;){if(o=Math.floor((h+i+1)/2),s++,e(t,this[o-1])>=0&&e(t,this[o])<0)return o;e(t,this[o-1])<0?h=o-1:e(t,this[o])>=0?i=o:console.error("Program Error"),s>1500&&console.error("Too many run cycles.")}return-1},Array.prototype.binsert=function(t,e){this.splice(this.bsearch(t,e),0,t)},CommentManager.prototype.seek=function(t){this.position=this.timeline.bsearch(t,function(t,e){return t<e.stime?-1:t>e.stime?1:0})},CommentManager.prototype.validate=function(t){return null==t?!1:this.filter.doValidate(t)},CommentManager.prototype.load=function(t){this.timeline=t,this.timeline.sort(function(t,e){return t.stime>e.stime?2:t.stime<e.stime?-2:t.date>e.date?1:t.date<e.date?-1:null!=t.dbid&&null!=e.dbid?t.dbid>e.dbid?1:t.dbid<e.dbid?-1:0:0}),this.preload()},CommentManager.prototype.preload=function(){for(this.pdiv=[],this.pdivshow=[],this.pdivpool=[0];this.stage.children.length>0;)this.stage.removeChild(this.stage.children[0]);for(totalDivTime=this.timeline[this.timeline.length-1].stime,totalDivNum=Math.floor(totalDivTime/this.eachDivTime)+1,i=0;totalDivNum>i;i++)this.pdiv[i]=document.createElement("div"),this.pdiv[i].show=!1,this.pdiv[i].id="pdiv_"+i,this.pdiv[i].className="preload",this.pdiv[i].pnum=i;for(i=0;i<this.timeline.length;i++)if(1==this.timeline[i].mode){if(null!=this.filter&&(data=this.timeline[i],null==this.filter.doModify(data)))continue;for(cmt=document.createElement("div"),cmt=this.initCmt(cmt,this.timeline[i]),cmt.width=Math.floor(cmt.data.text.length*cmt.data.size*1.1)+1,isNaN(cmt.width)&&(cmt.width=0),cmt.height=Math.floor(1.15*cmt.data.size)+1,j=0;j<=this.pdivpool.length;){if(j==this.pdivpool.length&&(this.pdivpool[j]=0),cmt.stime>=this.pdivpool[j]){for(cmt.totop=j*this.pdivheight;cmt.totop+cmt.height>this.stage.height;)cmt.totop-=this.stage.height;for(endtime=cmt.stime+cmt.width/this.stage.width*4e3*this.def.globalScale,k=0;k*this.pdivheight<cmt.height;)this.pdivpool[j+k]=endtime,k++;break}j++}cmt.style.left=-this.stage.width-cmt.width+"px",cmt.style.top=cmt.totop+"px",this.pdiv[Math.floor(this.timeline[i].stime/this.eachDivTime)].appendChild(cmt),this.timeline[i].cmt=cmt}},CommentManager.prototype.pdivsety=function(){for(this.pdivpool=[0],i=0;i<this.timeline.length;i++)if(1===this.timeline[i].mode&&this.timeline[i].cmt){for(cmt=this.timeline[i].cmt,j=0;j<=this.pdivpool.length;){if(j==this.pdivpool.length&&(this.pdivpool[j]=0),cmt.stime>=this.pdivpool[j]){for(cmt.totop=j*this.pdivheight;cmt.totop+cmt.height>this.stage.height;)cmt.totop-=this.stage.height;for(endtime=cmt.stime+cmt.width/this.stage.width*4e3*this.def.globalScale,k=0;k*this.pdivheight<cmt.height;)this.pdivpool[j+k]=endtime,k++;break}j++}cmt.style.top=cmt.totop+"px"}},CommentManager.prototype.pdivupdate=function(){if(time=this.lastPos,nowDivNum=Math.floor(time/this.eachDivTime),this.pdiv[nowDivNum]){if(0==this.pdiv[nowDivNum].show){for(this.pdiv[nowDivNum].show=!0,pdiv=this.pdiv[nowDivNum],i=0;i<pdiv.children.length;i++)pdiv.children[i].style.left=-this.stage.width-pdiv.children[i].width+"px";this.stage.appendChild(this.pdiv[nowDivNum]),this.pdivshow.push(this.pdiv[nowDivNum])}if(finish=Math.floor(1/this.pdivbreak)+1,this.pdivshow[0])for(;this.pdivshow[0].pnum<nowDivNum-finish;)this.stage.removeChild(this.pdivshow[0]),this.pdivshow[0].show=!1,this.pdivshow.shift()}},CommentManager.prototype.pdivclear=function(){for(i=0;i<this.pdivshow.length;i++)this.stage.removeChild(this.pdivshow[i]);for(this.pdivshow=[],i=0;i<this.pdiv.length;i++)this.pdiv[i].show=!1;for(i=0;i<this.timeline.length;i++)1==this.timeline[i].mode&&this.timeline[i].cmt&&(this.timeline[i].cmt.ttl=this.timeline[i].cmt.dur)},CommentManager.prototype.clear=function(){for(var t=0;t<this.runline.length;t++)this.finish(this.runline[t]),1!==this.runline[t].mode&&this.stage.removeChild(this.runline[t]);this.runline=[],this.pdivclear()},CommentManager.prototype.setBounds=function(){for(var t in this.csa)this.csa[t].setBounds(this.stage.offsetWidth,this.stage.offsetHeight);for(this.stage.width=this.stage.offsetWidth,this.stage.height=this.stage.offsetHeight,this.stage.style.perspective=this.stage.width*Math.tan(40*Math.PI/180)/2+"px",this.stage.style.webkitPerspective=this.stage.width*Math.tan(40*Math.PI/180)/2+"px",i=0;i<this.pdiv.length;i++)this.pdiv[i].style.left=this.stage.width+"px";this.pdivsety()},CommentManager.prototype.init=function(){this.setBounds(),null==this.filter&&(this.filter=new CommentFilter)},CommentManager.prototype.time=function(t){if(t-=1,this.position>=this.timeline.length||Math.abs(this.lastPos-t)>=500){if(this.seek(t),this.lastPos=t,this.timeline.length<=this.position)return}else this.lastPos=t;for(;this.position<this.timeline.length&&!(this.limiter>0&&this.runline.length>this.limiter)&&(this.validate(this.timeline[this.position])&&this.timeline[this.position].stime<=t);this.position++)this.sendComment(this.timeline[this.position])},CommentManager.prototype.rescale=function(){for(var t=0;t<this.runline.length;t++)this.runline[t].dur=Math.round(this.runline[t].dur*this.def.globalScale),this.runline[t].ttl=Math.round(this.runline[t].ttl*this.def.globalScale)},CommentManager.prototype.sendComment=function(t){if(8===t.mode)return console.log(t),void(this.scripting&&console.log(this.scripting.eval(t.code)));if(1===t.mode)e=t.cmt;else{var e=document.createElement("div");if(null!=this.filter&&(t=this.filter.doModify(t),null==t))return;e=this.initCmt(e,t),this.stage.appendChild(e),e.width=e.offsetWidth,e.height=e.offsetHeight,e.style.width=e.w+1+"px",e.style.height=e.h-3+"px",e.style.left=this.stage.width+"px"}if(null!=this.filter&&!this.filter.beforeSend(e))return this.stage.removeChild(e),void(e=null);switch(e.mode){default:case 1:break;case 2:this.csa.scrollbtm.add(e);break;case 4:this.csa.bottom.add(e);break;case 5:this.csa.top.add(e);break;case 6:this.csa.reverse.add(e);break;case 17:case 7:if("relative"!==e.data.position?(e.style.top=e.data.y+"px",e.style.left=e.data.x+"px"):(e.style.top=e.data.y*this.stage.height+"px",e.style.left=e.data.x*this.stage.width+"px"),e.ttl=Math.round(t.duration*this.def.globalScale),e.dur=Math.round(t.duration*this.def.globalScale),0!==t.rY||0!==t.rZ){var i=function(t,e){for(var i=Math.PI/180,o=t*i,s=e*i,h=Math.cos,r=Math.sin,n=[h(o)*h(s),h(o)*r(s),r(o),0,-r(s),h(s),0,0,-r(o)*h(s),-r(o)*r(s),h(o),0,0,0,0,1],a=0;a<n.length;a++)Math.abs(n[a])<1e-6&&(n[a]=0);return"matrix3d("+n.join(",")+")"};e.style.transformOrigin="0% 0%",e.style.webkitTransformOrigin="0% 0%",e.style.OTransformOrigin="0% 0%",e.style.MozTransformOrigin="0% 0%",e.style.MSTransformOrigin="0% 0%",e.style.transform=i(t.rY,t.rZ),e.style.webkitTransform=i(t.rY,t.rZ),e.style.OTransform=i(t.rY,t.rZ),e.style.MozTransform=i(t.rY,t.rZ),e.style.MSTransform=i(t.rY,t.rZ)}}this.runline.push(e)},CommentManager.prototype.finish=function(t){switch(t.mode){default:case 1:break;case 2:this.csa.scrollbtm.remove(t);break;case 4:this.csa.bottom.remove(t);break;case 5:this.csa.top.remove(t);break;case 6:this.csa.reverse.remove(t);break;case 7:}},CommentManager.prototype.onTimerEvent=function(t,e){this.pdivupdate();for(var i=0;i<e.runline.length;i++){var o=e.runline[i];if(!o.hold){if(o.ttl-=t,1==o.mode||2==o.mode)o.style.left=o.ttl/o.dur*(e.stage.width+o.width)-o.width+"px";else if(6==o.mode)o.style.left=(1-o.ttl/o.dur)*(e.stage.width+o.width)-o.width+"px";else if((4==o.mode||5==o.mode||o.mode>=7)&&(null==o.dur&&(o.dur=4e3),null!=o.data.alphaFrom&&null!=o.data.alphaTo&&(o.style.opacity=(o.data.alphaFrom-o.data.alphaTo)*(o.ttl/o.dur)+o.data.alphaTo),7==o.mode&&o.data.movable)){var s=Math.min(Math.max(o.dur-o.data.moveDelay-o.ttl,0),o.data.moveDuration)/o.data.moveDuration;"relative"!==o.data.position?(o.style.top=(o.data.toY-o.data.y)*s+o.data.y+"px",o.style.left=(o.data.toX-o.data.x)*s+o.data.x+"px"):(o.style.top=((o.data.toY-o.data.y)*s+o.data.y)*e.stage.height+"px",o.style.left=((o.data.toX-o.data.x)*s+o.data.x)*e.stage.width+"px")}null!=e.filter&&(o=e.filter.runtimeFilter(o)),o.ttl<=0&&(1!==o.mode&&e.stage.removeChild(o),e.runline.splice(i,1),e.finish(o))}}};