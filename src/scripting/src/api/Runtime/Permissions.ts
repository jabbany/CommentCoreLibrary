/**
 * Runtime permissions
 */
module Runtime{
	var permissions:Object = {};
	export function requestPermission(name:string, callback?:Function):void{
		__channel("Runtime:RequestPermission", {
			"name":name
		}, function(result:boolean){
			if(result === true){
				permissions[name] = true;
			}else{
				permissions[name] = false;
			}
			if(typeof callback === "function"){
				callback(result);
			}
		})
	}

	export function hasPermission(name:string):boolean{
		if(permissions.hasOwnProperty(name) &&
			permissions[name]){
			return true;
		}
		return false;
	}

	export function openWindow(url:string, params?:any, callback?:Function):void{

	}
}