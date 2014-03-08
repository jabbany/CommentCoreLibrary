CCLAnim.Translate = function(data, parent, onEnd){
	if(!data.to || !parent){
		throw "Malformed input.";
	};
	var an = new CCLAnim.Animation(parent);
	an.data = data;
	// Initialize ttl and dur
	if(data.dur){
		an.ttl = data.dur;
		an.dur = data.dur;
	}
	if(!data.from){
		data.from = {};
		data.from.x = parent.offsetTop;
		data.from.y = parent.offsetLeft;
	}
	if(!data.delay){
		data.delay = 0;
	}
	
	an.toCSS = function(){
		CCLAnim.setTransition(an.parent, "all " + an.ttl + "ms linear " + an.data.delay + "ms");
		CCLAnim.setXY(an.parent, an.data.to.x , an.data.to.y);
	};
	an.addEventListener("stop", function(){
		var cx = an.parent.offsetLeft;
		var cy = an.parent.offsetTop;
		an.parent.style.transition = "";
		CCLAnim.setXY(an.parent, cx, cy);
	});
	an.addEventListener("start", function(){
		an.toCSS();
	});
	an.addEventListener("end", function(){
		try{
			if(onEnd){
				onEnd(an.parent);
			}
		}catch(e){};
	});
	CCLAnim.setTransition(an.parent, "all " + an.ttl + "ms linear " + an.data.delay + "ms");
	return an;
};
