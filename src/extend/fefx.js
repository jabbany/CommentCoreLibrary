/** 
Fefx - Filter Effects library
Licensed Under MIT License
 Some fefx library to enhance dm readability or just generally enhance user experience
**/
var fefx = {
	center_dim:function(cmt){
		if(cmt.data.mode != 1 && cmt.data.mode !=2)
			return cmt;//Pass through all comments aside scrollers
		var cmtPos = cmt.ttl / cmt.dur;
		if(cmtPos > 0.3 && cmtPos < 0.7)
			return cmt;//Pass Centers
		if(cmtPos - 0.3 > 0)
			cmt.style.opacity = 0.8 * (cmtPos - 0.7) / 0.3 + 0.2;
		else
			cmt.style.opacity = 0.8 * (1 - cmtPos/0.3) + 0.2;
		return cmt;
	},
	center_speedup:function(cmt){
		if(cmt.data.mode != 1 && cmt.data.mode !=2)
			return cmt;//Pass through all comments aside scrollers
		var cmtPos = cmt.ttl / cmt.dur;
		if(cmtPos > 0.2 && cmtPos < 0.8)
			cmt.ttl -= 10;
		return cmt;
	},
	offset_dim:function(cmt){
		/** Does not work yet, we need to fetch some comment stage parameters **/
		if(cmt.data.mode != 1 && cmt.data.mode !=2) return cmt;
		if(cmt.offsetRight > 60 && cmt.offsetLeft > 60){
			cmt.style.opacity = 0.2;
			return cmt;
		}else{
			cmt.style.opacity = 1;
		}
		return cmt;
	},
}
