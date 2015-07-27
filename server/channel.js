var WebSocketServer = require("ws").Server;
var fs              = require("fs");

// this channel.js is the server-side abstraction over websockets
// it exposes two functions
// a send function
// channel.sendToAll("type", {data: "some data", bla: "more data...", teleportation: "totally possible"})
// and a receive subscription function, the callback will be called whenever the cliend sends a channel.send("thisType", {...})
// channel.on("thisType", function (data) {
//     console.log(data);
// });
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

    channel.onConnection = function (listener) {
        connectionListeners.push(listener);
    };

    channel.on = function (messageType, callback) {
        if (messageType in listeners) {
            listeners[messageType].push(callback);
        } else {
            listeners[messageType] = [callback];
        }
    };

    channel.ws.on('connection', function (client) {
        console.log("opened websocket");
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