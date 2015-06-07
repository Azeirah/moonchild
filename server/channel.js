var WebSocketServer = require("ws").Server;
var fs              = require("fs");

// A channel is a really simple abstraction over websockets,
// it's nothing more than appending a type to a JSON message sent over websocket.
// This allows you to listen
// channel.on("save", function (data) {...})
// and send
// channel.sendToAll("saved", data);
// The server differs slightly from the client channel, because the server
// sends her messages to all her clients, while the client channel
// communicates only with the server. Hence client.send and server.sendToAll
function createChannel(server) {
	// expecting
	// config = {
	//   server: serverobject
	// }
	var channel             = Object.create(null);
	var listeners           = {};
	var connectionListeners = [];

	channel.ws = new WebSocketServer({server: server});

	channel.sendToAll = function (messageType, data) {
		var message;

		data.type = messageType;
		message = JSON.stringify(data);

		channel.ws.clients.forEach(function(client) {
			client.send(message);
		});
	};

	channel.on = function (messageType, callback) {
		if (messageType in listeners) {
			listeners[messageType].push(callback);
		} else {
			listeners[messageType] = [callback];
		}
	};

	channel.onConnection = function (callback) {
		connectionListeners.push(callback);
	};

	channel.ws.on('connection', function (client) {
		console.log("opened ws");
		connectionListeners.forEach(function (connectionListener) {
			connectionListener.call(channel, client);
		});

		client.on('message', function (message) {
			var data = JSON.parse(message);

			var type = data.type;

			if (type in listeners) {
				listeners[type].forEach(function (listener) {
					listener(data);
				});
			} else {
				console.log("A client is saying \"%s\", but you're not listening...", type);
			}
		});

	});

	channel.ws.on('error', function(error) {
		console.log(error);
	});

	return channel;
}

module.exports = {
	createChannel: createChannel
};
