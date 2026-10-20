/**
 * Out-of-API Methods
 * @license MIT
 * @description This is the definition bridge for OOAPI methods.
 *        Please always include it
 **/
var __OOAPI = new function () {
  var channels = {};

  function dispatchMessage (msg) {
    if (channels.hasOwnProperty(msg.channel)) {
      for(var i = 0; i < channels[msg.channel].listeners.length; i++) {
        try {
          channels[msg.channel].listeners[i](msg.payload);
        } catch(e) {
          if (e.stack) {
            __trace(e.stack.toString(), 'err');
          } else {
            __trace(e.toString(), 'err');
          }
        }
      }
    } else {
      __trace('Got message on channel "' + msg.channel +
        '" but channel does not exist.', 'warn');
    }
  };

  self.addEventListener('message', function (event) {
    if (!event) {
      return;
    }
    try {
      var msg = JSON.parse(event.data);
    } catch (e) {
      __trace(e, 'err');
      return;
    }
    if (msg !== null && msg.hasOwnProperty('channel') &&
      typeof msg.channel === 'string') {
      dispatchMessage(msg);
    } else {
      __trace(msg, 'warn');
    }
  });

  this.listChannels = function () {
    var chl = {};
    for (var chan in channels) {
      chl[chan] = {
        'max': channels[chan].max,
        'listeners': channels[chan].listeners.length
      };
    }
    return chl;
  };

  this.deleteChannel = function (channelId, authToken){
    if (!(channelId in channels)) {
      return true;
    }
    if (authToken || channels[channelId].auth) {
      if (authToken === channels[channelId].auth) {
        delete channels[channelId];
        return true;
      }
      return false;
    } else {
      delete channels[channelId];
      return true;
    }
  };

  this.createChannel = function (channelId, maximum, authToken) {
    if (!(channelId in channels)) {
      channels[channelId] = {
        'max': maximum ? maximum : 0,
        'auth': authToken,
        'listeners': []
      };
      return true;
    }
    return false;
  };

  this.addListenerChannel = function (channel, listener) {
    if (!(channel in channels)) {
      channels[channel] = {
        'max': 0,
        'listeners': []
      };
    }
    if (channels[channel].max > 0) {
      if (channels[channel].listeners.length >=
        channels[channel].max) {
        return false;
      }
    }
    channels[channel].listeners.push(listener);
    return true;
  };
};

function __trace (obj, traceMode) {
  self.postMessage(JSON.stringify({
    'channel': '',
    'obj': obj,
    'mode': (traceMode ? traceMode : 'log')
  }));
};

function __channel (id, payload, callback) {
  self.postMessage(JSON.stringify({
    'channel': id,
    'payload': payload,
    'callback': true
  }));
  __OOAPI.addListenerChannel(id, callback);
};

function __schannel (id, callback) {
  __OOAPI.addListenerChannel(id, callback);
};

function __pchannel (id, payload) {
  self.postMessage(JSON.stringify({
    'channel': id,
    'payload': payload,
    'callback': false
  }));
};

function __achannel (id, auth, payload) {
  self.postMessage(JSON.stringify({
    'channel': id,
    'auth': auth,
    'payload': payload,
    'callback': false
  }));
};
