/**
 * Compatibility Check and library loading
 */

// Use local definition to prevent the deps on Display
declare module Display {
  export class Bitmap {}
  export class BitmapData {}
}

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
		if (!supported.hasOwnProperty(featureName)) {
			return false;
		} else {
			if (supported[featureName].indexOf(subfeature) >= 0) {
				return true;
			}
		}
		return false;
	};

  export function requestLibrary(libraryName:string, callback:Function):void {
    if (libraryName === 'libBitmap') {
      callback(null, {
        'type': 'object',
        'name': 'Bitmap',
        'obj': Display.Bitmap
      });
    } else {
      callback(new Error('Could not load unknown library [' + libraryName + ']'), null);
    }
  }
}
