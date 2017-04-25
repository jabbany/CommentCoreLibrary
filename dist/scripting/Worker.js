var __OOAPI;

importScripts("OOAPI.js");

if (!__OOAPI) {
    console.log("Error: OOAPI Not Loaded");
    self.close();
}

// Hook independent channels that cannot be removed
__OOAPI.createChannel("::eval", 1, Math.round(Math.random() * 100000));
__OOAPI.createChannel("::debug", 1, Math.round(Math.random() * 100000));

// Load the BSE Abstraction Runtime
importScripts('api/Runtime.js',
    'api/Player.js',
    'api/Display.js',
    'api/Tween.js',
    'api/Utils.js',
    'api/Global.js',
    'api/Function.js');

// Immediately Hook into the eval channel, blocking future hooks
__schannel("::eval", function (msg) {
    // Prevent some things from being accessed in eval easily
    (function (__code, importScripts, postMessage, addEventListener, self) {
        if (Tween && Tween.extendWithEasingFunctions) {
            Tween.extendWithEasingFunctions(this);
        }
        var clearTimeout = Utils.clearTimeout;
        var clearInterval = Utils.clearInterval;
        eval(__code);
    })(msg);
});

__schannel("::debug", function (msg) {
    if (typeof msg === 'undefined' || msg === null ||
        !msg.hasOwnProperty('action')) {
        __achannel('::worker:debug', 'worker', 'Malformed request');
        return;
    }
    if (msg.action === 'list-channels') {
        __achannel('::worker:debug', 'worker', __OOAPI.listChannels());
    } else if (msg.action === 'raw-eval') {
        try {
            __achannel('::worker:debug', 'worker', eval(msg.code));
        } catch (e) {
            __achannel('::worker:debug', 'worker', 'Error: ' + e);
        }
    } else {
        __achannel('::worker:debug', 'worker', 'Unrecognized action');
    }
});

__achannel("::worker:state", "worker", "running");
