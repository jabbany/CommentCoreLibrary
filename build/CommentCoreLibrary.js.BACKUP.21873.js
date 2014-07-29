<<<<<<< HEAD
/* CommentCoreLibrary (//github.com/jabbany/CommentCoreLibrary) - Licensed under the MIT License */
function AcfunParser(t){function e(t){for(;t.length<6;)t="0"+t;return t}var i=[];try{var o=JSON.parse(t)}catch(s){return console.log("Error: Could not parse json list!"),[]}for(var r=0;r<o.length;r++){var a={},n=o[r].c.split(",");if(n.length>0){if(a.stime=1e3*parseFloat(n[0]),a.color="#"+e(parseInt(n[1]).toString(16)),a.mode=parseInt(n[2]),a.size=parseInt(n[3]),a.hash=n[4],a.date=parseInt(n[5]),a.position="relative",7!=a.mode?(a.text=o[r].m.replace(/(\/n|\\n|\n|\r\n|\\r)/g,"\n"),a.text=a.text.replace(/\r/g,"\n"),a.text=a.text.replace(/\s/g," ")):a.text=o[r].m,7==a.mode){try{var h=JSON.parse(a.text)}catch(s){console.log("[Err] Error parsing internal data for comment"),console.log("[Dbg] "+a.text);continue}a.text=h.n,a.text=a.text.replace(/\ /g," "),console.log(a.text),null!=h.p?(a.x=h.p.x/1e3,a.y=h.p.y/1e3):(a.x=0,a.y=0),a.shadow=h.b,a.duration=4e3,null!=h.l&&(a.moveDelay=1e3*h.l),null!=h.z&&h.z.length>0&&(a.movable=!0,a.toX=h.z[0].x/1e3,a.toY=h.z[0].y/1e3,a.alphaTo=h.z[0].t,a.colorTo=h.z[0].c,a.moveDuration=null!=h.z[0].l?1e3*h.z[0].l:500,a.duration=a.moveDelay+a.moveDuration),null!=h.r&&null!=h.k&&(a.rX=h.r,a.rY=h.k),h.a&&(a.alphaFrom=h.a)}i.push(a)}}return i}function BilibiliParser(t,e,i){function o(t){for(;t.length<6;)t="0"+t;return t}function s(t){return t.replace(/\t/,"\\t")}if(null!==t)var r=t.getElementsByTagName("d");else{if(i){if(!confirm("XML Parse Error. \n Allow tag soup parsing?\n[WARNING: This is unsafe.]"))return[]}else e=e.replace(new RegExp("</([^d])","g"),"</disabled $1"),e=e.replace(new RegExp("</(S{2,})","g"),"</disabled $1"),e=e.replace(new RegExp("<([^d/]W*?)","g"),"<disabled $1"),e=e.replace(new RegExp("<([^/ ]{2,}W*?)","g"),"<disabled $1"),console.log(e);var a=document.createElement("div");a.innerHTML=e,console.log(a);var r=a.getElementsByTagName("d")}for(var n=[],h=0;h<r.length;h++)if(null!=r[h].getAttribute("p")){var l=r[h].getAttribute("p").split(",");if(!r[h].childNodes[0])continue;var e=r[h].childNodes[0].nodeValue,d={};if(d.stime=Math.round(parseFloat(1e3*l[0])),d.size=parseInt(l[2]),d.color="#"+o(parseInt(l[3]).toString(16)),d.mode=parseInt(l[1]),d.date=parseInt(l[4]),d.pool=parseInt(l[5]),d.position="absolute",null!=l[7]&&(d.dbid=parseInt(l[7])),d.hash=l[6],d.border=!1,d.mode<7)d.text=e.replace(/(\/n|\\n|\n|\r\n)/g,"\n");else if(7==d.mode)try{adv=JSON.parse(s(e)),d.shadow=!0,d.x=parseInt(adv[0]),d.y=parseInt(adv[1]),d.text=adv[4].replace(/(\/n|\\n|\n|\r\n)/g,"\n"),d.rZ=0,d.rY=0,adv.length>=7&&(d.rZ=parseInt(adv[5]),d.rY=parseInt(adv[6])),d.movable=!1,adv.length>=11&&(d.movable=!0,d.toX=adv[7],d.toY=adv[8],d.moveDuration=500,d.moveDelay=0,""!=adv[9]&&(d.moveDuration=adv[9]),""!=adv[10]&&(d.moveDelay=adv[10]),adv.length>11&&(d.shadow=adv[11],"true"===d.shadow&&(d.shadow=!0),"false"===d.shadow&&(d.shadow=!1),null!=adv[12]&&(d.font=adv[12]))),d.duration=2500,adv[3]<12&&(d.duration=1e3*adv[3]),d.alphaFrom=1,d.alphaTo=1;var a=adv[2].split("-");null!=a&&a.length>1&&(d.alphaFrom=parseFloat(a[0]),d.alphaTo=parseFloat(a[1]))}catch(m){console.log("[Err] Error occurred in JSON parsing"),console.log("[Dbg] "+e)}else 8==d.mode&&(d.code=e);null!=d.text&&(d.text=d.text.replace(/\u25a0/g,"█")),n.push(d)}return n}function CommentFilter(){this.rulebook={all:[]},this.modifiers=[],this.runtime=null,this.allowTypes={1:!0,4:!0,5:!0,6:!0,7:!0,8:!0,17:!0},this.doModify=function(t){for(var e=0;e<this.modifiers.length;e++)t=this.modifiers[e](t);return t},this.isMatchRule=function(t,e){switch(e.operator){case"==":if(t[e.subject]==e.value)return!1;break;case">":if(t[e.subject]>e.value)return!1;break;case"<":if(t[e.subject]<e.value)return!1;break;case"range":if(t[e.subject]>e.value.min&&t[e.subject]<e.value.max)return!1;break;case"!=":if(t[e.subject]!=e.value)return!1;break;case"~":if(new RegExp(e.value).test(t[e[subject]]))return!1;break;case"!~":if(!new RegExp(e.value).test(t[e[subject]]))return!1}return!0},this.beforeSend=function(t){var e=t.data.mode;if(null!=this.rulebook[e]){for(var i=0;i<this.rulebook[e].length;i++)if("width"==this.rulebook[e][i].subject||"height"==this.rulebook[e][i].subject)if("width"==this.rulebook[e][i].subject)switch(this.rulebook[e][i].operator){case">":if(this.rulebook[e][i].value<t.offsetWidth)return!1;break;case"<":if(this.rulebook[e][i].value>t.offsetWidth)return!1;break;case"range":if(this.rulebook[e][i].value.max>t.offsetWidth&&this.rulebook[e][i].min<t.offsetWidth)return!1;break;case"==":if(this.rulebook[e][i].value==t.offsetWidth)return!1}else switch(this.rulebook[e][i].operator){case">":if(this.rulebook[e][i].value<t.offsetHeight)return!1;break;case"<":if(this.rulebook[e][i].value>t.offsetHeight)return!1;break;case"range":if(this.rulebook[e][i].value.max>t.offsetHeight&&this.rulebook[e][i].min<t.offsetHeight)return!1;break;case"==":if(this.rulebook[e][i].value==t.offsetHeight)return!1}return!0}return!0},this.doValidate=function(t){if(!this.allowTypes[t.mode])return!1;var e={text:t.text,mode:t.mode,color:t.color,size:t.size,stime:t.stime,hash:t.hash};if(null!=this.rulebook[t.mode]&&this.rulebook[t.mode].length>0)for(var i=0;i<this.rulebook[t.mode];i++)if(!this.isMatchRule(e,this.rulebook[t.mode][i]))return!1;for(var i=0;i<this.rulebook[t.mode];i++)if(!this.isMatchRule(e,this.rulebook[t.mode][i]))return!1;return!0},this.addRule=function(t){switch(null==this.rulebook[t.mode+""]&&(this.rulebook[t.mode+""]=[]),t.operator){case"eq":case"equals":case"=":t.operator="==";break;case"ineq":t.operator="!=";break;case"regex":case"matches":t.operator="~";break;case"notmatch":case"iregex":t.operator="!~"}return this.rulebook[t.mode].push(t),this.rulebook[t.mode].length-1},this.addModifier=function(t){this.modifiers.push(t)},this.runtimeFilter=function(t){return null==this.runtime?t:this.runtime(t)},this.setRuntimeFilter=function(t){this.runtime=t}}function CommentSpaceAllocator(t,e){this.width=t,this.height=e,this.dur=4e3,this.pools=[[]],this.pool=this.pools[0],this.setBounds=function(t,e){this.width=t,this.height=e},this.add=function(t){t.height>=this.height?(t.cindex=this.pools.indexOf(this.pool),t.style.top="0px"):(t.cindex=this.pools.indexOf(this.pool),t.style.top=this.setY(t)+"px")},this.remove=function(t){var e=this.pools[t.cindex];e.remove(t)},this.validateCmt=function(t){return t.bottom=t.offsetTop+t.offsetHeight,t.y=t.offsetTop,t.x=t.offsetLeft,t.right=t.offsetLeft+t.offsetWidth,t.width&&t.height||(t.height=t.offsetHeight,t.width=t.offsetWidth),t.top=t.offsetTop,t.left=t.offsetLeft,t},this.setY=function(t,e){if(!e)var e=0;if(t=this.validateCmt(t),this.pools.length<=e&&this.pools.push([]),this.pool=this.pools[e],0==this.pool.length)return this.pool.push(t),0;if(this.vCheck(0,t))return this.pool.binsert(t,function(t,e){return t.bottom<e.bottom?-1:t.bottom==e.bottom?0:1}),t.y;for(var i=0,o=0;o<this.pool.length&&(i=this.pool[o].bottom+1,!(i+t.offsetHeight>this.height));o++)if(this.vCheck(i,t))return this.pool.binsert(t,function(t,e){return t.bottom<e.bottom?-1:t.bottom==e.bottom?0:1}),t.y;this.setY(t,e+1)},this.vCheck=function(t,e){var i=t+e.height,o=e.x+e.width;this.validateCmt(e);for(var s=0;s<this.pool.length;s++)if(this.pool[s]=this.validateCmt(this.pool[s]),!(this.pool[s].y>i||this.pool[s].bottom<t)){if(this.pool[s].right<e.x||this.pool[s].x>o){if(this.getEnd(this.pool[s])<this.getMiddle(e))continue;return!1}return!1}return e.y=t,e.bottom=e.height+t,!0},this.getEnd=function(t){return t.stime+t.ttl},this.getMiddle=function(t){return t.stime+t.ttl/2}}function TopCommentSpaceAllocator(t,e){var i=new CommentSpaceAllocator(t,e);i.add=function(t){i.validateCmt(t),t.style.left=(i.width-t.width)/2+"px",t.height>=i.height?(t.cindex=i.pools.indexOf(i.pool),t.style.top="0px"):(t.cindex=i.pools.indexOf(i.pool),t.style.top=i.setY(t)+"px")},i.vCheck=function(t,e){for(var o=t+e.height,s=0;s<i.pool.length;s++){var r=i.validateCmt(i.pool[s]);if(!(r.y>o||r.bottom<t))return!1}return e.y=t,e.bottom=e.bottom+t,!0},this.setBounds=function(t,e){i.setBounds(t,e)},this.add=function(t){i.add(t)},this.remove=function(t){i.remove(t)}}function BottomCommentSpaceAllocator(t,e){var i=new CommentSpaceAllocator(t,e);i.add=function(t){t.style.top="",t.style.bottom="0px",i.validateCmt(t),t.style.left=(i.width-t.width)/2+"px",t.height>=i.height?(t.cindex=i.pools.indexOf(i.pool),t.style.bottom="0px"):(t.cindex=i.pools.indexOf(i.pool),t.style.bottom=i.setY(t)+"px")},i.validateCmt=function(t){return t.y=i.height-(t.offsetTop+t.offsetHeight),t.bottom=t.y+t.offsetHeight,t.x=t.offsetLeft,t.right=t.offsetLeft+t.offsetWidth,t.height=t.offsetHeight,t.width=t.offsetWidth,t.top=t.y,t.left=t.offsetLeft,t},i.vCheck=function(t,e){for(var o=t+e.height,s=0;s<i.pool.length;s++){var r=i.validateCmt(i.pool[s]);if(!(r.y>o||r.bottom<t))return!1}return e.y=t,e.bottom=e.bottom+t,!0},this.setBounds=function(t,e){i.setBounds(t,e)},this.add=function(t){i.add(t)},this.remove=function(t){i.remove(t)}}function ReverseCommentSpaceAllocator(t,e){var i=new CommentSpaceAllocator(t,e);i.vCheck=function(t,e){var i=t+e.height,o=e.x+e.width;this.validateCmt(e);for(var s=0;s<this.pool.length;s++){var r=this.validateCmt(this.pool[s]);if(!(r.y>i||r.bottom<t)){if(r.x>o||r.right<e.x){if(this.getEnd(r)<this.getMiddle(e))continue;return!1}return!1}}return e.y=t,e.bottom=e.height+t,!0},this.setBounds=function(t,e){i.setBounds(t,e)},this.add=function(t){i.add(t)},this.remove=function(t){i.remove(t)}}function BottomScrollCommentSpaceAllocator(t,e){var i=new CommentSpaceAllocator(t,e);i.validateCmt=function(t){return t.y=i.height-(t.offsetTop+t.offsetHeight),t.bottom=t.y+t.offsetHeight,t.x=t.offsetLeft,t.right=t.offsetLeft+t.offsetWidth,t.height=t.offsetHeight,t.width=t.offsetWidth,t.top=t.y,t.left=t.offsetLeft,t},i.add=function(t){t.style.top="",t.style.bottom="0px",i.validateCmt(t),t.style.left=i.width+"px",t.height>=i.height?(t.cindex=i.pools.indexOf(i.pool),t.style.bottom="0px"):(t.cindex=i.pools.indexOf(i.pool),t.style.bottom=i.setY(t)+"px")},this.setBounds=function(t,e){i.setBounds(t,e)},this.add=function(t){i.add(t)},this.remove=function(t){i.remove(t)}}function CommentManager(t){var e=0;this.stage=t,this.def={opacity:1,globalScale:1,scrollScale:1},this.timeline=[],this.runline=[],this.pdiv=[],this.pdivbreak=1*this.def.globalScale,this.eachDivTime=4e3*this.pdivbreak,this.pdivshow=[],this.pdivpool=[0],this.pdivheight=29,this.position=0,this.limiter=0,this.filter=null,this.csa={scroll:new CommentSpaceAllocator(0,0),top:new TopCommentSpaceAllocator(0,0),bottom:new BottomCommentSpaceAllocator(0,0),reverse:new ReverseCommentSpaceAllocator(0,0),scrollbtm:new BottomScrollCommentSpaceAllocator(0,0)},this.stage.width=this.stage.offsetWidth,this.stage.height=this.stage.offsetHeight,this.initCmt=function(t,e){return t.className="cmt",t.stime=e.stime,t.mode=e.mode,t.data=e,17===t.mode||(t.appendChild(document.createTextNode(e.text)),t.innerText=e.text,t.style.fontSize=e.size+"px"),null!=e.font&&""!=e.font&&(t.style.fontFamily=e.font),e.shadow===!1&&(t.className="cmt noshadow"),"#000000"!=e.color||!e.shadow&&null!=e.shadow||(t.className+=" rshadow"),null!=e.margin&&(t.style.margin=e.margin),null!=e.color&&(t.style.color=e.color),1!=this.def.opacity&&1==e.mode&&(t.style.opacity=this.def.opacity),null!=e.alphaFrom&&(t.style.opacity=e.alphaFrom),e.border&&(t.style.border="1px solid #00ffff"),t.ttl=Math.round(4e3*this.def.globalScale),t.dur=t.ttl,(1===t.mode||6===t.mode||2===t.mode)&&(t.ttl*=this.def.scrollScale,t.dur=t.ttl),t},this.caculatecmt=function(t){var e=t.data.text.split("\n");t.height=Math.floor(e.length*t.data.size*1.15)+1,t.textlength=0;for(var i=0;i<e.length;i++)e[i].length>t.textlength&&(t.textlength=e[i].length);return t.width=Math.floor(t.data.size*t.textlength*1.15)+1,isNaN(t.width)&&(t.width=0),t},this.startTimer=function(){if(!(e>0)){var t=(new Date).getTime(),i=this;e=window.setInterval(function(){var e=(new Date).getTime()-t;t=(new Date).getTime(),i.onTimerEvent(e,i)},10)}},this.stopTimer=function(){window.clearInterval(e),e=0}}Array.prototype.remove=function(t){for(var e=0;e<this.length;e++)if(this[e]==t){this.splice(e,1);break}},Array.prototype.bsearch=function(t,e){if(0==this.length)return 0;if(e(t,this[0])<0)return 0;if(e(t,this[this.length-1])>=0)return this.length;for(var i=0,o=0,s=0,r=this.length-1;r>=i;){if(o=Math.floor((r+i+1)/2),s++,e(t,this[o-1])>=0&&e(t,this[o])<0)return o;e(t,this[o-1])<0?r=o-1:e(t,this[o])>=0?i=o:console.error("Program Error"),s>1500&&console.error("Too many run cycles.")}return-1},Array.prototype.binsert=function(t,e){this.splice(this.bsearch(t,e),0,t)},CommentManager.prototype.seek=function(t){this.position=this.timeline.bsearch(t,function(t,e){return t<e.stime?-1:t>e.stime?1:0})},CommentManager.prototype.validate=function(t){return null==t?!1:this.filter.doValidate(t)},CommentManager.prototype.load=function(t){this.timeline=t,this.timeline.sort(function(t,e){return t.stime>e.stime?2:t.stime<e.stime?-2:t.date>e.date?1:t.date<e.date?-1:null!=t.dbid&&null!=e.dbid?t.dbid>e.dbid?1:t.dbid<e.dbid?-1:0:0}),this.preload()},CommentManager.prototype.preload=function(){for(this.pdiv=[],this.pdivshow=[],this.pdivpool=[0];this.stage.children.length>0;)this.stage.removeChild(this.stage.children[0]);totalDivTime=this.timeline[this.timeline.length-1].stime,totalDivNum=Math.floor(totalDivTime/this.eachDivTime)+1;for(var t=0;totalDivNum>t;t++)this.pdiv[t]=document.createElement("div"),this.pdiv[t].show=!1,this.pdiv[t].id="pdiv_"+t,this.pdiv[t].pnum=t,this.pdiv[t].className="container";for(var t=0;t<this.timeline.length;t++)if(1==this.timeline[t].mode){if(null!=this.filter&&(data=this.timeline[t],null==this.filter.doModify(data)))continue;cmt=document.createElement("div"),cmt=this.initCmt(cmt,this.timeline[t]),cmt=this.caculatecmt(cmt);for(var e=0;e<=this.pdivpool.length;){if(e==this.pdivpool.length&&(this.pdivpool[e]=0),cmt.stime>=this.pdivpool[e]){for(cmt.totop=e*this.pdivheight;cmt.totop+cmt.height>this.stage.height;)cmt.totop-=this.stage.height;for(cmt.totop<0&&(cmt.totop=0),endtime=cmt.stime+cmt.width/this.stage.width*4e3*this.def.globalScale,k=0;k*this.pdivheight<cmt.height;)this.pdivpool[e+k]=endtime,k++;break}e++}cmt.style.left=-this.stage.width-cmt.width+"px",cmt.style.top=cmt.totop+"px",this.pdiv[Math.floor(this.timeline[t].stime/this.eachDivTime)].appendChild(cmt),this.timeline[t].cmt=cmt}},CommentManager.prototype.pdivsety=function(){this.pdivpool=[0];for(var t=0;t<this.timeline.length;t++)if(1===this.timeline[t].mode&&this.timeline[t].cmt){cmt=this.timeline[t].cmt;for(var e=0;e<=this.pdivpool.length;){if(e==this.pdivpool.length&&(this.pdivpool[e]=0),cmt.stime>=this.pdivpool[e]){for(cmt.totop=e*this.pdivheight;cmt.totop+cmt.height>this.stage.height;)cmt.totop-=this.stage.height;for(cmt.totop<0&&(cmt.totop=0),endtime=cmt.stime+cmt.width/this.stage.width*4e3*this.def.globalScale,k=0;k*this.pdivheight<cmt.height;)this.pdivpool[e+k]=endtime,k++;break}e++}cmt.style.top=cmt.totop+"px"}},CommentManager.prototype.pdivupdate=function(){if(time=this.lastPos,nowDivNum=Math.floor(time/this.eachDivTime),this.pdiv[nowDivNum]){if(0==this.pdiv[nowDivNum].show){for(this.pdiv[nowDivNum].show=!0,pdiv=this.pdiv[nowDivNum],i=0;i<pdiv.children.length;i++)pdiv.children[i].style.left=-this.stage.width-pdiv.children[i].width+"px";this.stage.appendChild(this.pdiv[nowDivNum]),this.pdivshow.push(this.pdiv[nowDivNum])}if(finish=Math.floor(1/this.pdivbreak)+1,this.pdivshow[0])for(;this.pdivshow[0].pnum<nowDivNum-finish;)this.stage.removeChild(this.pdivshow[0]),this.pdivshow[0].show=!1,this.pdivshow.shift()}},CommentManager.prototype.pdivclear=function(){for(var t=0;t<this.pdivshow.length;t++)this.stage.removeChild(this.pdivshow[t]);this.pdivshow=[];for(var t=0;t<this.pdiv.length;t++)this.pdiv[t].show=!1;for(var t=0;t<this.timeline.length;t++)1==this.timeline[t].mode&&this.timeline[t].cmt&&(this.timeline[t].cmt.ttl=this.timeline[t].cmt.dur)},CommentManager.prototype.clear=function(){for(var t=0;t<this.runline.length;t++)this.finish(this.runline[t]),1!==this.runline[t].mode&&this.stage.removeChild(this.runline[t]);this.runline=[],this.pdivclear()},CommentManager.prototype.setBounds=function(){for(var t in this.csa)this.csa[t].setBounds(this.stage.offsetWidth,this.stage.offsetHeight);for(this.stage.width=this.stage.offsetWidth,this.stage.height=this.stage.offsetHeight,this.stage.style.perspective=this.stage.width*Math.tan(40*Math.PI/180)/2+"px",this.stage.style.webkitPerspective=this.stage.width*Math.tan(40*Math.PI/180)/2+"px",i=0;i<this.pdiv.length;i++)this.pdiv[i].style.left=this.stage.width+"px";this.pdivsety()},CommentManager.prototype.init=function(){this.setBounds(),null==this.filter&&(this.filter=new CommentFilter)},CommentManager.prototype.time=function(t){if(t-=1,this.position>=this.timeline.length||Math.abs(this.lastPos-t)>=500){if(this.seek(t),this.lastPos=t,this.timeline.length<=this.position)return}else this.lastPos=t;for(;this.position<this.timeline.length&&!(this.limiter>0&&this.runline.length>this.limiter)&&(this.validate(this.timeline[this.position])&&this.timeline[this.position].stime<=t);this.position++)this.sendComment(this.timeline[this.position])},CommentManager.prototype.rescale=function(){for(var t=0;t<this.runline.length;t++)this.runline[t].dur=Math.round(this.runline[t].dur*this.def.globalScale),this.runline[t].ttl=Math.round(this.runline[t].ttl*this.def.globalScale)},CommentManager.prototype.sendComment=function(t){if(8===t.mode)return console.log(t),void(this.scripting&&console.log(this.scripting.eval(t.code)));if(1===t.mode)e=t.cmt;else{var e=document.createElement("div");if(null!=this.filter&&(t=this.filter.doModify(t),null==t))return;e=this.initCmt(e,t),this.stage.appendChild(e),e.width=e.offsetWidth,e.height=e.offsetHeight,e.style.width=e.w+1+"px",e.style.height=e.h-3+"px",e.style.left=this.stage.width+"px"}if(null!=this.filter&&!this.filter.beforeSend(e))return this.stage.removeChild(e),void(e=null);switch(e.mode){default:case 1:break;case 2:this.csa.scrollbtm.add(e);break;case 4:this.csa.bottom.add(e);break;case 5:this.csa.top.add(e);break;case 6:this.csa.reverse.add(e);break;case 17:case 7:if("relative"!==e.data.position?(e.style.top=e.data.y+"px",e.style.left=e.data.x+"px"):(e.style.top=e.data.y*this.stage.height+"px",e.style.left=e.data.x*this.stage.width+"px"),e.ttl=Math.round(t.duration*this.def.globalScale),e.dur=Math.round(t.duration*this.def.globalScale),0!==t.rY||0!==t.rZ){var i=function(t,e){for(var i=Math.PI/180,o=t*i,s=e*i,r=Math.cos,a=Math.sin,n=[r(o)*r(s),r(o)*a(s),a(o),0,-a(s),r(s),0,0,-a(o)*r(s),-a(o)*a(s),r(o),0,0,0,0,1],h=0;h<n.length;h++)Math.abs(n[h])<1e-6&&(n[h]=0);return"matrix3d("+n.join(",")+")"};e.style.transformOrigin="0% 0%",e.style.webkitTransformOrigin="0% 0%",e.style.OTransformOrigin="0% 0%",e.style.MozTransformOrigin="0% 0%",e.style.MSTransformOrigin="0% 0%",e.style.transform=i(t.rY,t.rZ),e.style.webkitTransform=i(t.rY,t.rZ),e.style.OTransform=i(t.rY,t.rZ),e.style.MozTransform=i(t.rY,t.rZ),e.style.MSTransform=i(t.rY,t.rZ)}}this.runline.push(e)},CommentManager.prototype.finish=function(t){switch(t.mode){default:case 1:break;case 2:this.csa.scrollbtm.remove(t);break;case 4:this.csa.bottom.remove(t);break;case 5:this.csa.top.remove(t);break;case 6:this.csa.reverse.remove(t);break;case 7:}},CommentManager.prototype.onTimerEvent=function(t,e){this.pdivupdate();for(var i=0;i<e.runline.length;i++){var o=e.runline[i];if(!o.hold){if(o.ttl-=t,1==o.mode||2==o.mode)o.style.left=o.ttl/o.dur*(e.stage.width+o.width)-o.width+"px";else if(6==o.mode)o.style.left=(1-o.ttl/o.dur)*(e.stage.width+o.width)-o.width+"px";else if((4==o.mode||5==o.mode||o.mode>=7)&&(null==o.dur&&(o.dur=4e3),null!=o.data.alphaFrom&&null!=o.data.alphaTo&&(o.style.opacity=(o.data.alphaFrom-o.data.alphaTo)*(o.ttl/o.dur)+o.data.alphaTo),7==o.mode&&o.data.movable)){var s=Math.min(Math.max(o.dur-o.data.moveDelay-o.ttl,0),o.data.moveDuration)/o.data.moveDuration;"relative"!==o.data.position?(o.style.top=(o.data.toY-o.data.y)*s+o.data.y+"px",o.style.left=(o.data.toX-o.data.x)*s+o.data.x+"px"):(o.style.top=((o.data.toY-o.data.y)*s+o.data.y)*e.stage.height+"px",o.style.left=((o.data.toX-o.data.x)*s+o.data.x)*e.stage.width+"px")}null!=e.filter&&(o=e.filter.runtimeFilter(o)),o.ttl<=0&&(1!==o.mode&&e.stage.removeChild(o),e.runline.splice(i,1),e.finish(o))}}};
=======
/** 
Comment Filters/Filter Lang
Licensed Under MIT License
**/

function CommentFilter(){
	this.rulebook = {"all":[]};
	this.modifiers = [];
	this.runtime = null;
	this.allowTypes = {
		"1":true,
		"4":true,
		"5":true,
		"6":true,
		"7":true,
		"8":true,
		"17":true
	};
	this.doModify = function(cmt){
		for(var k=0;k<this.modifiers.length;k++){
			cmt = this.modifiers[k](cmt);
		}
		return cmt;
	};
	this.isMatchRule = function(cmtData,rule){
		switch(rule['operator']){
			case '==':if(cmtData[rule['subject']] == rule['value']){return false;};break;
			case '>':if(cmtData[rule['subject']] > rule['value']){return false;};break;
			case '<':if(cmtData[rule['subject']] < rule['value']){return false;};break;
			case 'range':if(cmtData[rule['subject']] > rule.value.min && cmtData[rule['subject']] < rule.value.max){return false;};break;
			case '!=':if(cmtData[rule['subject']] != rule.value){return false;}break;
			case '~':if(new RegExp(rule.value).test(cmtData[rule[subject]])){return false;}break;
			case '!~':if(!(new RegExp(rule.value).test(cmtData[rule[subject]]))){return false;}break;
		}
		return true;
	};
	this.beforeSend = function(cmt){
		//Check with the rules upon size
		var cmtMode = cmt.data.mode;
		if(this.rulebook[cmtMode]!=null){
			for(var i=0;i<this.rulebook[cmtMode].length;i++){
				if(this.rulebook[cmtMode][i].subject == 'width' || this.rulebook[cmtMode][i].subject == 'height'){
					if(this.rulebook[cmtMode][i].subject == 'width'){
						switch(this.rulebook[cmtMode][i].operator){
							case '>':if(this.rulebook[cmtMode][i].value < cmt.offsetWidth)return false;break;
							case '<':if(this.rulebook[cmtMode][i].value > cmt.offsetWidth)return false;break;
							case 'range':if(this.rulebook[cmtMode][i].value.max > cmt.offsetWidth && this.rulebook[cmtMode][i].min < cmt.offsetWidth)return false;break;
							case '==':if(this.rulebook[cmtMode][i].value == cmt.offsetWidth)return false;break;
							default:break;
						}
					}else{
						switch(this.rulebook[cmtMode][i].operator){
							case '>':if(this.rulebook[cmtMode][i].value < cmt.offsetHeight)return false;break;
							case '<':if(this.rulebook[cmtMode][i].value > cmt.offsetHeight)return false;break;
							case 'range':if(this.rulebook[cmtMode][i].value.max > cmt.offsetHeight && this.rulebook[cmtMode][i].min < cmt.offsetHeight)return false;break;
							case '==':if(this.rulebook[cmtMode][i].value == cmt.offsetHeight)return false;break;
							default:break;
						}
					}
				}
			}
			return true;
		}else{return true;}
	}
	this.doValidate = function(cmtData){
		if(!this.allowTypes[cmtData.mode])
			return false;
		/** Create abstract cmt data **/
		var abstCmtData = {
			text:cmtData.text,
			mode:cmtData.mode,
			color:cmtData.color,
			size:cmtData.size,
			stime:cmtData.stime,
			hash:cmtData.hash,
		}
		if(this.rulebook[cmtData.mode] != null && this.rulebook[cmtData.mode].length > 0){
			for(var i=0;i<this.rulebook[cmtData.mode];i++){
				if(!this.isMatchRule(abstCmtData,this.rulebook[cmtData.mode][i]))
					return false;
			}
		}
		for(var i=0;i<this.rulebook[cmtData.mode];i++){
			if(!this.isMatchRule(abstCmtData,this.rulebook[cmtData.mode][i]))
				return false;
		}
		return true;
	};
	this.addRule = function(rule){
		if(this.rulebook[rule.mode + ""] == null)
			this.rulebook[rule.mode + ""] = [];
		/** Normalize Operators **/
		switch(rule.operator){
			case 'eq':
			case 'equals':
			case '=':rule.operator='==';break;
			case 'ineq':rule.operator='!=';break;
			case 'regex':
			case 'matches':rule.operator='~';break;
			case 'notmatch':
			case 'iregex':rule.operator='!~';break;
		}
		this.rulebook[rule.mode].push(rule);
		return (this.rulebook[rule.mode].length - 1);
	};
	this.addModifier = function(f){
		this.modifiers.push(f);
	};
	this.runtimeFilter = function(cmt){
		if(this.runtime == null)
			return cmt;
		return this.runtime(cmt);
	};
	this.setRuntimeFilter = function(f){
		this.runtime = f;
	}
}

/** 
  Comment Space Allocators Classes
  Licensed Under MIT License
  You may create your own.
 **/
function CommentSpaceAllocator(w,h){
	this.width = w;
	this.height = h;
	this.dur = 4000;
	this.pools = [[]];
	this.pool = this.pools[0];
	this.setBounds = function(w,h){this.width = w;this.height = h;};
	this.add = function(cmt){
		if(cmt.height >= this.height){
			cmt.cindex = this.pools.indexOf(this.pool);
			//cmt.style.top = "0px";
		}else{
			cmt.cindex = this.pools.indexOf(this.pool);
			//cmt.style.top = this.setY(cmt) + "px";
		}
	};
	this.remove = function(cmt){
		var tpool = this.pools[cmt.cindex];
		tpool.remove(cmt);
	};
	this.validateCmt = function(cmt){
		cmt.bottom = cmt.offsetTop + cmt.offsetHeight;
		cmt.y = cmt.offsetTop;
		cmt.x = cmt.offsetLeft;
		cmt.right = cmt.offsetLeft + cmt.offsetWidth;
		if(!cmt.width || !cmt.height){
			cmt.height = cmt.offsetHeight;
			cmt.width = cmt.offsetWidth;
		}
		cmt.top = cmt.offsetTop;
		cmt.left = cmt.offsetLeft;
		return cmt;
	};
	this.setY = function(cmt,index){
		if(!index)
		  var index = 0;
		cmt = this.validateCmt(cmt);
		if(this.pools.length <= index){
			this.pools.push([]);
		}
		this.pool = this.pools[index];
		if(this.pool.length == 0){
			this.pool.push(cmt);	
			return 0;
		}
		else if(this.vCheck(0,cmt)){
			this.pool.binsert(cmt,function(a,b){
				if(a.bottom < b.bottom){
					return -1;
				}else if (a.bottom == b.bottom){
					return 0;
				}else{return 1;}
			});
			return cmt.y;
		}
		var y=0;
		for(var k=0;k<this.pool.length;k++){
			y = this.pool[k].bottom + 1;
			if(y + cmt.offsetHeight > this.height){
				break;
			}
			if(this.vCheck(y,cmt)){
				this.pool.binsert(cmt,function(a,b){
					if(a.bottom < b.bottom){
						return -1;
					}else if (a.bottom == b.bottom){
						return 0;
					}else{return 1;}
				});
				return cmt.y;
			}
		}
		return this.setY(cmt,index+1);
	};
	this.vCheck = function(y,cmt){
		var bottom = y + cmt.height;
		var right = cmt.x + cmt.width;
		this.validateCmt(cmt);
		for(var i=0;i<this.pool.length;i++){
			this.pool[i] = this.validateCmt(this.pool[i]);
			if(this.pool[i].y > bottom || this.pool[i].bottom < y)
			  continue;
			else if(this.pool[i].right < cmt.x || this.pool[i].x > right){
				if(this.getEnd(this.pool[i]) < this.getMiddle(cmt))
				  continue;
				else
				  return false;
			}else{
				return false;}
		}
		cmt.y = y;
		cmt.bottom = cmt.height + y;
		return true;
	};
	this.getEnd  = function(cmt){
		return cmt.stime + cmt.ttl;
	};
	this.getMiddle = function(cmt){
		return cmt.stime + (cmt.ttl / 2);
	};
}
function TopCommentSpaceAllocator(w,h){
	var csa = new CommentSpaceAllocator(w,h);
	csa.add = function (cmt){
		csa.validateCmt(cmt);
		cmt.style.left = (csa.width - cmt.width)/2 + "px";
		if(cmt.height >= csa.height){
			cmt.cindex = csa.pools.indexOf(csa.pool);
			cmt.style.top = "0px";
		}else{
			cmt.cindex = csa.pools.indexOf(csa.pool);
			cmt.style.top = csa.setY(cmt) + "px";
		}
	};
	csa.vCheck = function(y,cmt){
		var bottom = y + cmt.height;
		for(var i=0;i<csa.pool.length;i++){
			var c = csa.validateCmt(csa.pool[i]);
			if(c.y > bottom || c.bottom < y){
				continue;
			}else{
				return false;
			}
		}
		cmt.y = y;
		cmt.bottom = cmt.bottom + y;
		return true;
	};
	this.setBounds = function(w,h){csa.setBounds(w,h);};
	this.add = function(what){csa.add(what);};
	this.remove = function(d){csa.remove(d);};
}
function BottomCommentSpaceAllocator(w,h){
	var csa = new CommentSpaceAllocator(w,h);
	csa.add = function (cmt){
		cmt.style.top = "";
		cmt.style.bottom = "0px";
		csa.validateCmt(cmt);
		cmt.style.left = (csa.width - cmt.width)/2 + "px";
		if(cmt.height >= csa.height){
			cmt.cindex = csa.pools.indexOf(csa.pool);
			cmt.style.bottom = "0px";
		}else{
			cmt.cindex = csa.pools.indexOf(csa.pool);
			cmt.style.bottom = csa.setY(cmt) + "px";
		}
	};
	csa.validateCmt = function(cmt){
		cmt.y = csa.height - (cmt.offsetTop + cmt.offsetHeight);
		cmt.bottom = cmt.y + cmt.offsetHeight;
		cmt.x = cmt.offsetLeft;
		cmt.right = cmt.offsetLeft + cmt.offsetWidth;
		cmt.height = cmt.offsetHeight;
		cmt.width = cmt.offsetWidth;
		cmt.top = cmt.y;
		cmt.left = cmt.offsetLeft;
		return cmt;
	};
	csa.vCheck = function(y,cmt){
		var bottom = y + cmt.height;
		for(var i=0;i<csa.pool.length;i++){
			var c = csa.validateCmt(csa.pool[i]);
			if(c.y > bottom || c.bottom < y){
				continue;
			}else{
				return false;
			}
		}
		cmt.y = y;
		cmt.bottom = cmt.bottom + y;
		return true;
	};
	this.setBounds = function(w,h){csa.setBounds(w,h);};
	this.add = function(what){csa.add(what);};
	this.remove = function(d){csa.remove(d);};
}
function ReverseCommentSpaceAllocator(w,h){
	var csa= new CommentSpaceAllocator(w,h);
	csa.vCheck = function(y,cmt){
		var bottom = y + cmt.height;
		var right = cmt.x + cmt.width;
		this.validateCmt(cmt);
		for(var i=0;i<this.pool.length;i++){
			var c = this.validateCmt(this.pool[i]);
			if(c.y > bottom || c.bottom < y)
			  continue;
			else if(c.x > right || c.right < cmt.x){
				if(this.getEnd(c) < this.getMiddle(cmt))
				  continue;
				else
				  return false;
			}else{
				return false;}
		}
		cmt.y = y;
		cmt.bottom = cmt.height + y;
		return true;
	}
	this.setBounds = function(w,h){csa.setBounds(w,h);};
	this.add = function(what){csa.add(what);};
	this.remove = function(d){csa.remove(d);};
}
function BottomScrollCommentSpaceAllocator(w,h){
	var csa = new CommentSpaceAllocator(w,h);
	csa.validateCmt = function(cmt){
		cmt.y = csa.height - (cmt.offsetTop + cmt.offsetHeight);
		cmt.bottom = cmt.y + cmt.offsetHeight;
		cmt.x = cmt.offsetLeft;
		cmt.right = cmt.offsetLeft + cmt.offsetWidth;
		cmt.height = cmt.offsetHeight;
		cmt.width = cmt.offsetWidth;
		cmt.top = cmt.y;
		cmt.left = cmt.offsetLeft;
		return cmt;
	};
	csa.add = function (cmt){
		cmt.style.top = "";
		cmt.style.bottom = "0px";
		csa.validateCmt(cmt);
		cmt.style.left = csa.width + "px";
		if(cmt.height >= csa.height){
			cmt.cindex = csa.pools.indexOf(csa.pool);
			cmt.style.bottom = "0px";
		}else{
			cmt.cindex = csa.pools.indexOf(csa.pool);
			cmt.style.bottom = csa.setY(cmt) + "px";
		}
	};
	this.setBounds = function(w,h){csa.setBounds(w,h);};
	this.add = function(what){csa.add(what);};
	this.remove = function(d){csa.remove(d);};
}

/******
 * Comment Core For HTML5 VideoPlayers
 * Author : Jim Chen
 * Licensing : MIT License
 ******/
Array.prototype.remove = function(obj){
	for(var a = 0; a < this.length;a++)
	  if(this[a] == obj){
		  this.splice(a,1);
		  break;
	  }
};
Array.prototype.bsearch = function(what,how){
	if(this.length == 0) return 0;
	if(how(what,this[0]) < 0) return 0;
	if(how(what,this[this.length - 1]) >=0) return this.length;
	var low =0;
	var i = 0;
	var count = 0;
	var high = this.length - 1;
	while(low<=high){
		i = Math.floor((high + low + 1)/2);
		count++;
		if(how(what,this[i-1])>=0 && how(what,this[i])<0){
			return i;
		}else if(how(what,this[i-1])<0){
			high = i-1;
		}else if(how(what,this[i])>=0){
			low = i;
		}else
		  console.error('Program Error');
		if(count > 1500) console.error('Too many run cycles.');
	}
	return -1;
};
Array.prototype.binsert = function(what,how){
	this.splice(this.bsearch(what,how),0,what);
};
/****** Load Core Engine Classes ******/
function CommentManager(stageObject){
	var __timer = 0;
	this.stage = stageObject;
	this.def = {
		opacity:1,
		globalScale:1,
		scrollScale:1
	};
	this.timeline = [];
	this.runline = [];
	this.position = 0;
	this.limiter = 0;
	this.filter = null;
	this.csa = {
		scroll: new CommentSpaceAllocator(0,0),
		top:new TopCommentSpaceAllocator(0,0),
		bottom:new BottomCommentSpaceAllocator(0,0),
		reverse:new ReverseCommentSpaceAllocator(0,0),
		scrollbtm:new BottomScrollCommentSpaceAllocator(0,0)
	};
	/** Precompute the offset width **/
	this.stage.width = this.stage.offsetWidth;
	this.stage.height= this.stage.offsetHeight;
	//Canvas
	this.canvas = document.createElement("canvas");
	this.canvas.width = this.stage.width;
	this.stage.height = this.stage.height;
	this.stage.appendChild(this.canvas);
	this.ctx = this.canvas.getContext('2d');
	this.ctx.textBaseline="top";
	//this.defaultFont = "25px SimHei";
	this.pdivpool = [0];
	this.pdivheight = 29;
	/** Private **/
	this.initCmt = function(cmt,data){
		cmt.className = 'cmt';
		cmt.stime = data.stime;
		cmt.mode = data.mode;
		cmt.data = data;
		if(cmt.mode === 17){

		}else{
			cmt.appendChild(document.createTextNode(data.text));
			cmt.innerText = data.text;
			cmt.style.fontSize = data.size + "px";
		}
		if(data.font != null && data.font != '')
		  cmt.style.fontFamily = data.font;
		if(data.shadow === false)
		  cmt.className = 'cmt noshadow';
		if(data.color == "#000000" && (data.shadow || data.shadow == null))
		  cmt.className += ' rshadow';
		if(data.margin != null)
		  cmt.style.margin = data.margin;
		if(data.color != null)
		  cmt.style.color = data.color;
		if(this.def.opacity != 1 && data.mode == 1)
		  cmt.style.opacity = this.def.opacity;
		if(data.alphaFrom != null)
		  cmt.style.opacity = data.alphaFrom;
		if(data.border)
		  cmt.style.border = "1px solid #00ffff";
		cmt.ttl = Math.round(4000 * this.def.globalScale);
		cmt.dur = cmt.ttl;
		if(cmt.mode === 1 || cmt.mode === 6 || cmt.mode === 2){
			cmt.ttl *= this.def.scrollScale;
			cmt.dur = cmt.ttl;
		}
		return cmt;
	};
	this.startTimer = function(){
		if(__timer > 0)
		  return;
		var lastTPos = new Date().getTime();
		var cmMgr = this;
		__timer = window.setInterval(function(){
			var elapsed = new Date().getTime() - lastTPos;
			lastTPos = new Date().getTime();
			cmMgr.onTimerEvent(elapsed,cmMgr);
		},10);
	};
	this.stopTimer = function(){
		window.clearInterval(__timer);
		__timer = 0;
	};
}

/** Public **/
CommentManager.prototype.seek = function(time){
	this.position = this.timeline.bsearch(time,function(a,b){
		if(a < b.stime) return -1
		else if(a > b.stime) return 1;
		else return 0;
	});
};
CommentManager.prototype.validate = function(cmt){
	if(cmt == null)
	  return false;
	return this.filter.doValidate(cmt);
};
CommentManager.prototype.load = function(a){
	this.timeline = a;
	this.timeline.sort(function(a,b){
		if(a.stime > b.stime) return 2;
		else if(a.stime < b.stime) return -2;
		else{
			if(a.date > b.date) return 1;
			else if(a.date < b.date) return -1;
			else if(a.dbid != null && b.dbid != null){
				if(a.dbid > b.dbid) return 1;
				else if(a.dbid < b.dbid) return -1;
				return 0;
			}else
		return 0;
		}
	});
	//////
	this.preload();
	//////
};

CommentManager.prototype.preload = function ()
{
	this.pdivpool = [-10000000];
	for(var i = 0; i < this.timeline.length; i++){
		if(this.timeline[i].mode !== 1)
		  continue;
		cmt=this.timeline[i];
		cmt.ctxfont = "bold "+cmt.size + "px " + "SimHei";
		if(cmt.font != null && cmt.font != '')
			cmt.ctxfont = "bold "+cmt.size + "px " + cmt.font;
		//caculate width and height
		this.ctx.font=cmt.ctxfont;
		text = cmt.text.split("\n");
		cmt.height = Math.floor(text.length * cmt.size * 1.15) + 1;
		cmt.textlength = 0;
		for(var p = 0; p < text.length; p++ ){
			if(this.ctx.measureText(text[p]).width > cmt.textlength){
				cmt.textlength = this.ctx.measureText(text[p]).width;
			}
		}
		cmt.width = cmt.textlength;
		cmt.ttl = Math.round(4000 * this.def.globalScale);
		cmt.dur = cmt.ttl;
		if(cmt.mode === 1 || cmt.mode === 6 || cmt.mode === 2){
			cmt.ttl *= this.def.scrollScale;
			cmt.dur = cmt.ttl;
		}
		cmt.hold = 0;
		/*
		var j = 0;
		while(j <= this.pdivpool.length){
			if(j == this.pdivpool.length)
			  this.pdivpool[j] = -10000000;
			if(cmt.stime-(cmt.width/this.stage.width*4000*this.def.globalScale)/3>= this.pdivpool[j]){
				cmt.totop = j* this.pdivheight;
				while(cmt.totop + cmt.height > this.stage.height)
				  cmt.totop-=this.stage.height;
				if(cmt.totop<0)
				  cmt.totop=0;
				cmt.totop=Math.round(cmt.totop/this.pdivheight)*this.pdivheight;
				endtime = cmt.stime+cmt.width/this.stage.width*4000*this.def.globalScale;
				k=0;
				while(k*this.pdivheight<cmt.height){
					this.pdivpool[j+k]=endtime;
					k++
				}
				break;
			}else
			  j++;
		}
		*/
	}
}

CommentManager.prototype.onDraw = function(){
	this.ctx.clearRect(0,0,this.canvas.offsetWidth,this.canvas.offsetHeight);
	for(i=0;i<this.runline.length;i++){
		cmt=this.runline[i];
		this.ctx.textBaseline = "top";
		//this.ctx.shadowBlur=4;
		//this.ctx.shadowColor="black";
		this.ctx.font=cmt.ctxfont;
		this.ctx.fillStyle=cmt.color;
		this.ctx.fillText(cmt.text,cmt.left,cmt.totop);
		if(cmt.border||true){
			this.ctx.strokeStyle="#000000";
			this.ctx.strokeText(cmt.text,cmt.left,cmt.totop);
		}
	}
}

CommentManager.prototype.clear = function(){
	for(k=0;k<this.pdivpool.lenght;k++)
	  this.pdivpool[k]=-10000000;
	for(var i=0;i<this.runline.length;i++){
		this.finish(this.runline[i]);
		if(this.runline[i].mode !==1 )
		  this.stage.removeChild(this.runline[i]);
	}
	this.runline = [];
};
CommentManager.prototype.setBounds = function(){
	for(var comAlloc in this.csa){
		this.csa[comAlloc].setBounds(this.stage.offsetWidth,this.stage.offsetHeight);
	}
	this.stage.width = this.stage.offsetWidth;
	this.stage.height= this.stage.offsetHeight;
	// Update 3d perspective
	this.stage.style.perspective = this.stage.width * Math.tan(40 * Math.PI/180) / 2 + "px";
	this.stage.style.webkitPerspective = this.stage.width * Math.tan(40 * Math.PI/180) / 2 + "px";
	this.canvas.width = this.stage.offsetWidth;
	this.canvas.height = this.stage.offsetHeight;
};
CommentManager.prototype.init = function(){
	this.setBounds();
	if(this.filter == null)
	  this.filter = new CommentFilter(); //Only create a filter if none exist
};
CommentManager.prototype.time = function(time){
	time = time - 1;
	if(this.position >= this.timeline.length || Math.abs(this.lastPos - time) >= 2000){
		this.seek(time);
		this.lastPos = time;
		if(this.timeline.length <= this.position)
		  return;
	}else{
		this.lastPos = time;
	}
	for(;this.position < this.timeline.length;this.position++){
		if(this.limiter > 0 && this.runline.length > this.limiter) break;
		if(this.validate(this.timeline[this.position]) && this.timeline[this.position]['stime']<=time){
			this.sendComment(this.timeline[this.position]);
		}else{
			break;
		}
	}
};
CommentManager.prototype.rescale = function(){
	for(var i = 0; i < this.runline.length; i++){
		this.runline[i].dur = Math.round(this.runline[i].dur * this.def.globalScale);
		this.runline[i].ttl = Math.round(this.runline[i].ttl * this.def.globalScale);
	}
};
CommentManager.prototype.sendComment = function(data){
	if(data.mode === 8){
		console.log(data);
		if(this.scripting){
			console.log(this.scripting.eval(data.code));
		}
		return;
	}
	if(data.mode === 1){
		cmt=data;
		var j = 0;
		while(j <= this.pdivpool.length){
			if(j == this.pdivpool.length)
			  this.pdivpool[j] = -10000000;
			if(cmt.stime-(cmt.width/this.stage.width*4000*this.def.globalScale)/3>= this.pdivpool[j]){
				cmt.totop = j* this.pdivheight;
				while(cmt.totop + cmt.height > this.stage.height)
				  cmt.totop-=this.stage.height;
				if(cmt.totop<0)
				  cmt.totop=0;
				cmt.totop=Math.round(cmt.totop/this.pdivheight)*this.pdivheight;
				endtime = cmt.stime+cmt.width/this.stage.width*4000*this.def.globalScale;
				k=0;
				while(k*this.pdivheight<cmt.height){
					this.pdivpool[j+k]=endtime;
					k++
				}
				break;
			}else
			  j++;
		}
		this.runline.push(data);
		return;
	}
	var cmt = document.createElement('div');
	if(this.filter != null){
		data = this.filter.doModify(data);
		if(data == null) return;
	}
	cmt = this.initCmt(cmt,data);

	this.stage.appendChild(cmt);
	cmt.width = cmt.offsetWidth;
	cmt.height = cmt.offsetHeight;
	//cmt.style.width = (cmt.width + 1) + "px";
	//cmt.style.height = (cmt.height - 3) + "px";
	cmt.style.left = this.stage.width + "px";

	if(this.filter != null && !this.filter.beforeSend(cmt)){
		this.stage.removeChild(cmt);
		cmt = null;
		return;
	}
	switch(cmt.mode){
		default:
		case 1: break;//{this.csa.scroll.add(cmt);}break;
		case 2:{this.csa.scrollbtm.add(cmt);}break;
		case 4:{this.csa.bottom.add(cmt);}break;
		case 5:{this.csa.top.add(cmt);}break;
		case 6:{this.csa.reverse.add(cmt);}break;
		case 17:
		case 7:{
			if(cmt.data.position !== "relative"){
				cmt.style.top = cmt.data.y + "px";
				cmt.style.left = cmt.data.x + "px";
			}else{
				cmt.style.top = cmt.data.y * this.stage.height + "px";
				cmt.style.left = cmt.data.x * this.stage.width + "px";
			}
			cmt.ttl = Math.round(data.duration * this.def.globalScale);
			cmt.dur = Math.round(data.duration * this.def.globalScale);
			if(data.rY !== 0 || data.rZ !== 0){
				/** TODO: revise when browser manufacturers make up their mind on Transform APIs **/
				var getRotMatrix = function(yrot, zrot) {
					// Courtesy of @StarBrilliant, re-adapted to look better
					var DEG2RAD = Math.PI/180;
					var yr = yrot * DEG2RAD;
					var zr = zrot * DEG2RAD;
					var COS = Math.cos;
					var SIN = Math.sin;
					var matrix = [
						COS(yr) * COS(zr)    , COS(yr) * SIN(zr)     , SIN(yr)  , 0, 
						(-SIN(zr))           , COS(zr)               , 0        , 0, 
						(-SIN(yr) * COS(zr)) , (-SIN(yr) * SIN(zr))  , COS(yr)  , 0,
						0                    , 0                     , 0        , 1
							];
					// CSS does not recognize scientific notation (e.g. 1e-6), truncating it.
					for(var i = 0; i < matrix.length;i++){
						if(Math.abs(matrix[i]) < 0.000001){
							matrix[i] = 0;
						}
					}
					return "matrix3d(" + matrix.join(",") + ")";
				}
				cmt.style.transformOrigin = "0% 0%";
				cmt.style.webkitTransformOrigin = "0% 0%";
				cmt.style.OTransformOrigin = "0% 0%";
				cmt.style.MozTransformOrigin = "0% 0%";
				cmt.style.MSTransformOrigin = "0% 0%";
				cmt.style.transform = getRotMatrix(data.rY, data.rZ);
				cmt.style.webkitTransform = getRotMatrix(data.rY, data.rZ);
				cmt.style.OTransform = getRotMatrix(data.rY, data.rZ);
				cmt.style.MozTransform = getRotMatrix(data.rY, data.rZ);
				cmt.style.MSTransform = getRotMatrix(data.rY, data.rZ);
			}
		}break;
	}
	this.runline.push(cmt);
};
CommentManager.prototype.finish = function(cmt){
	switch(cmt.mode){
		default:
		case 1: break;//{this.csa.scroll.remove(cmt);}break;
		case 2:{this.csa.scrollbtm.remove(cmt);}break;
		case 4:{this.csa.bottom.remove(cmt);}break;
		case 5:{this.csa.top.remove(cmt);}break;
		case 6:{this.csa.reverse.remove(cmt);}break;
		case 7:break;
	}
};
/** Static Functions **/
CommentManager.prototype.onTimerEvent = function(timePassed,cmObj){
	this.onDraw();
	for(var i= 0;i < cmObj.runline.length; i++){
		var cmt = cmObj.runline[i];
		if(cmt.hold){
			continue;
		}
		cmt.ttl -= timePassed;
		if(cmt.mode == 1 || cmt.mode == 2) {
			//cmt.style.left = (cmt.ttl / cmt.dur) * (cmObj.stage.width + cmt.width) - cmt.width + "px";
			cmt.left = (cmt.ttl / cmt.dur) * (cmObj.stage.width + cmt.width) - cmt.width ;
		}else if(cmt.mode == 6) {
			cmt.style.left = (1 - cmt.ttl / cmt.dur) * (cmObj.stage.width + cmt.width) - cmt.width + "px";
		}else if(cmt.mode == 4 || cmt.mode == 5 || cmt.mode >= 7){
			if(cmt.dur == null)
			  cmt.dur = 4000;
			if(cmt.data.alphaFrom != null && cmt.data.alphaTo != null){
				cmt.style.opacity = (cmt.data.alphaFrom - cmt.data.alphaTo) * 
					(cmt.ttl/cmt.dur) + cmt.data.alphaTo;
			}
			if(cmt.mode == 7 && cmt.data.movable){
				var posT = Math.min(Math.max(cmt.dur - cmt.data.moveDelay - cmt.ttl,0),
							cmt.data.moveDuration) / cmt.data.moveDuration;
				if(cmt.data.position !== "relative"){
					cmt.style.top = ((cmt.data.toY - cmt.data.y) * posT + cmt.data.y) + "px";
					cmt.style.left= ((cmt.data.toX - cmt.data.x) * posT + cmt.data.x) + "px";
				}else{
					cmt.style.top = (((cmt.data.toY - cmt.data.y) * posT + cmt.data.y) * cmObj.stage.height) + "px";
					cmt.style.left= (((cmt.data.toX - cmt.data.x) * posT + cmt.data.x) * cmObj.stage.width) + "px";
				}
			}
		}
		if(cmObj.filter != null){
			cmt = cmObj.filter.runtimeFilter(cmt);
		}
		if(cmt.ttl <= 0){
			if(cmt.mode !==1 )
			  cmObj.stage.removeChild(cmt);
			cmObj.runline.splice(i,1);//remove the comment
			cmObj.finish(cmt);
		}
	}
};

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

/** 
Bilibili Format
Licensed Under MIT License
 Takes in an XMLDoc/LooseXMLDoc and parses that into a Generic Comment List
**/
function BilibiliParser(xmlDoc, text, warn){
	function fillRGB(string){
		while(string.length < 6){
			string = "0" + string;
		}
		return string;
	}
	
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
			obj.stime = Math.round(parseFloat(opt[0]*1000));
			obj.size = parseInt(opt[2]);
			obj.color = "#" + fillRGB(parseInt(opt[3]).toString(16));
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
						obj.x = parseInt(adv[0]);
						obj.y = parseInt(adv[1]);
						obj.text = adv[4].replace(/(\/n|\\n|\n|\r\n)/g, "\n");
						obj.rZ = 0;
						obj.rY = 0;
						if(adv.length >= 7){
							obj.rZ = parseInt(adv[5]);
							obj.rY = parseInt(adv[6]);
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
								obj.shadow = adv[11];
								if(obj.shadow === "true"){
									obj.shadow = true;
								}
								if(obj.shadow === "false"){
									obj.shadow = false;
								}
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
>>>>>>> dev-scripting
