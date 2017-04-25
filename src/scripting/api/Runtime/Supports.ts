module Runtime{

  var supported:Object = {
    "js":["*"],
    "Runtime":["*","openWindow", "injectStyle"],
    "Display":["*"],
    "Player":["*"],
    "Tween":["*"],
    "Utils":["*"]
  };

  /**
   * Check if a certain feature is supported by the Runtime
   * @param {string} featureName - feature to be checked
   * @param {string} subfeature - sub feature (defaults to all)
   * @return {boolean} indicator of whether feature is supported
   */
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

  /**
   * Requests for a library and loads it. This is used by the load method
   * @param {string} libraryName - library to be loaded
   * @param {function} callback - function called after loading completes/fails
   */
  export function requestLibrary(libraryName:string, callback:Function):void {
    if (libraryName === 'libBitmap') {
      callback(null, {
        'type': 'noop'
      });
    } else {
      callback(new Error('Could not load unknown library [' + libraryName + ']'), null);
    }
  }
}
