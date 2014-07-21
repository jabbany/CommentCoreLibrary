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

	export function openWindow(url:string, params?:any, callback:Function = null):void{
		__channel("Runtime:PrivilegedAPI", {
			"method": "openWindow",
			"params":[url, params]
		}, function(windowId){
			// Create a small compact window object
			var WND:Object = {
				"moveTo":function(x,y){
					__pchannel("Runtime:PrivilegedAPI",{
						"method":"window",
						"params":[windowId, "moveTo",[x,y]]
					});
				},
				"resizeTo":function(w,h){
					__pchannel("Runtime:PrivilegedAPI",{
						"method":"window",
						"params":[windowId, "resizeTo",[w,h]]
					});
				},
				"focus":function(){
					__pchannel("Runtime:PrivilegedAPI",{
						"method":"window",
						"params":[windowId, "focus"]
					});
				},
				"close":function(){
					__pchannel("Runtime:PrivilegedAPI",{
						"method":"window",
						"params":[windowId, "close"]
					});
				}
			};
			if(callback !== null){
				callback(WND);
			}
		});
	}

	export function injectStyle(referenceObject:string, style:Object):void{
		__pchannel("Runtime:PrivilegedAPI",{
			"method":"injectStyle",
			"params":[referenceObject, style]
		});
	}

	export function privilegedCode():void{
		__trace("Runtime.privilegedCode not available.","warn");
	}
}