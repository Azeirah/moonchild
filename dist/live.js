(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var WebSocketLib = require('ws');
var util         = require('./util');

function createChannel(port) {
  // add listener from server
  // channel.on("eventName", callback)
  // send stuff to server
  // channel.send("eventName", data)

  var channel   = Object.create(null);

  var url       = util.formatString("ws://localhost:{port}/editor/", {port: port});
  var ws        = new WebSocketLib(url);
  var listeners = {};

  console.log("Websocket connecting to %s", url);

  ws.onmessage = function (message) {
    // Doesn't handle cyclic values
    var data = JSON.parse(message.data);

    // expects "data" to have .type
    var type = data.type;

    if (type in listeners) {
      listeners[type].forEach(function (listener) {
        listener(data);
      });
    } else {
      // console.log(util.formatString("The server is shouting '{type}'! But no-one is there to hear him...", {type: type}));
    }
  };

  ws.onopen = function () {
    console.log("open!");
  };

  // handle ws.on('error') here later..
  // ws.onerror = function (error) {
  //
  // };

  channel.on = function (messageType, callback) {
    if (messageType in listeners) {
      listeners[messageType].push(callback);
    } else {
      listeners[messageType] = [callback];
    }
  };

  channel.send = function (messageType, data) {
    var message;
    data.type = messageType;

    if (typeof data !== "object") {
      console.log("Expecting object, not ", typeof data, " at channel.send where messageType = ", messageType);
    }

    // Doesn't handle cyclic values
    message = JSON.stringify(data);

    ws.send(message);
  };

  return channel;
}

module.exports = {
  createChannel: createChannel
};

},{"./util":2,"ws":4}],2:[function(require,module,exports){
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function formatString(string, arguments) {
  // formats string using an object
  // formatString("hi {name}!", {name: "kiwi"}) -> "hi kiwi!"
  var type = typeof arguments[0];

  for (var r in arguments) {
    string = string.replace(new RegExp("\\{" + r + "\\}", "gi"), arguments[r]);
  }

  return string;
}

module.exports = {
  getParameterByName: getParameterByName,
  formatString: formatString
};

},{}],3:[function(require,module,exports){
var createChannel = require("./lib/channel.js").createChannel;
var channel = createChannel(8080);

channel.on("file", function execute(data) {
	document.body.innerHTML = "";
	eval(data.file);
});
},{"./lib/channel.js":1}],4:[function(require,module,exports){

/**
 * Module dependencies.
 */

var global = (function() { return this; })();

/**
 * WebSocket constructor.
 */

var WebSocket = global.WebSocket || global.MozWebSocket;

/**
 * Module exports.
 */

module.exports = WebSocket ? ws : null;

/**
 * WebSocket constructor.
 *
 * The third `opts` options object gets ignored in web browsers, since it's
 * non-standard, and throws a TypeError if passed to the constructor.
 * See: https://github.com/einaros/ws/issues/227
 *
 * @param {String} uri
 * @param {Array} protocols (optional)
 * @param {Object) opts (optional)
 * @api public
 */

function ws(uri, protocols, opts) {
  var instance;
  if (protocols) {
    instance = new WebSocket(uri, protocols);
  } else {
    instance = new WebSocket(uri);
  }
  return instance;
}

if (WebSocket) ws.prototype = WebSocket.prototype;

},{}]},{},[3]);
