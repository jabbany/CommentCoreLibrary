/**
 * Promises extra functionality
 * @license MIT
 * @author Jim Chen
 */

/**
 * Resolves as soon as any promise resolves in the order of the input array
 *
 * @param arr - array of promises
 * @return promise that resolves if any one promise resolves and rejects
 *     if otherwise
 **/
export function any<T>(promises:Array<Promise<T>> | T):Promise<T> {
  if (!Array.isArray(promises)) {
    // Is raw object or promise, resolve it directly
    return Promise.resolve(<T> promises);
  }
  if (promises.length === 0) {
    // No promises to resolve so we think it failed
    return Promise.reject();
  }
  return new Promise<T>(function (resolve, reject) {
    var hasResolved = false;
    var hasCompleted = 0;
    var errors:Array<any> = [];
    for (var i = 0; i < promises.length; i++) {
      promises[i].then(function (value) {
        hasCompleted++;
        if (!hasResolved) {
          hasResolved = true;
          resolve(value);
        }
      }).catch((function (i) {
        return function (e) {
          hasCompleted++;
          errors[i] = e;
          if (hasCompleted === promises.length) {
            // All promises have completed and we are in rejecting case
            if (!hasResolved) {
              reject(errors);
            }
          }
        }
      })(i));
    }
  });
}
