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
		if(cmtPos > 0.3 && cmtPos < 0.7)
			cmt.ttl -= 10;
		return cmt;
	}
}