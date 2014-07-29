/**
 * Compatibility Check
 */

module Runtime{
	var supported:Object = {
		"js":["*"],
		"Runtime":["*","openWindow", "injectStyle"],
		"Display":["*"],
		"Player":["*"],
		"Tween":["*"],
		"Utils":["*"]
	};
	export function supports(featureName:string, subfeature:string = "*"):boolean{
		if(!supported.hasOwnProperty(featureName)){
			return false;
		}else{
			if(supported[featureName].indexOf(subfeature) >= 0){
				return true;
			}
		}
		return false;
	};
}