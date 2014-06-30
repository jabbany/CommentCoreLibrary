CCLAnim.Opacity = function(data, parent, onEnd){
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
		data.from = 1;
	}
	if(!data.to){
		data.to = 1;
	}
	if(!data.delay){
		data.delay = 0;
	}
	parent.style.opacity = data.from;
	
	an.toCSS = function(){
		CCLAnim.setTransition(an.parent, "all " + an.ttl + "ms linear " + an.data.delay + "ms");
		an.parent.style.opacity = an.data.to;
	};
	an.addEventListener("stop", function(){
		an.parent.style.transition = "";
		an.parent.style.opacity = an.data.to;
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
