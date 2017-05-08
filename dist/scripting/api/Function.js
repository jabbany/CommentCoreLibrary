/**
 * Global Functions
 * @description Functions defined in the global namespace.
 **/

function trace (msg) {
    if (typeof msg === 'object') {
        __trace(JSON.stringify(msg), 'log');
    } else {
        __trace(msg, 'log');
    }
}

function load (library, onComplete) {
    if (typeof Runtime === 'undefined' || Runtime === null) {
        __trace('No runtime defined. Attempting to raw-load library!', 'warn');
        importScripts(library + '.js');
    } else {
        // Delegate this to runtime
        Runtime.requestLibrary(library, function (error, response) {
            if (error) {
                __trace('Load: ' + error, 'warn');
            } else {
                if (response.type === 'import') {
                    importScripts(response.location);
                } else if (response.type === 'raw') {
                    try {
                        eval(response.code);
                    } catch (e) {
                        __trace('Load: ' + e, 'warn');
                    }
                } else if (response.type === 'object') {
                    if (typeof self === 'object' && self !== null) {
                        self[response.name] = response.obj;
                    }
                } else if (response.type === 'noop') {
                  // Don't do anything
                  // This means library was already loaded
                }
                // Execute the remaining code
                if (typeof onComplete === 'function') {
                    onComplete();
                }
            }
        });
    }
}

function clone (target) {
    if (null === target || 'object' !== typeof target) {
        return target;
    }

    // Clone an array
    if (Array.isArray(target)) {
        return target.slice(0);
    }

    // Call the object's own clone method if possible
    if (target.hasOwnProperty('clone') || typeof target['clone'] === 'function') {
        return target.clone();
    }

    // Perform a shallow clone
    var copy = {};
    copy.constructor = copy.constructor;
    copy.prototype = copy.prototype;
    for (var x in target) {
        copy[x] = target[x];
    }
    return copy;
}

function foreach (enumerable, f) {
    if (null === enumerable || "object" !== typeof enumerable) {
        return;
    }
    // DisplayObjects do not have any enumerable properties
    if (enumerable instanceof Display.DisplayObject) {
        return;
    }

    for (var x in enumerable) {
        if (enumerable.hasOwnProperty(x)) {
            f(x, enumerable[x]);
        }
    }
    return;
}

var none = null;
