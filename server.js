var Server           = require('node-static').Server;
var http             = require('http');

var port             = 8080;
var fileServer       = new(Server)('.');
var server           = http.createServer(handleRequest);

// these are made in such a way that they can be loaded like plugins,
// I guess this can later be abstracted over, keep the server as simple as it
// was before
// And use some kind of plugin loading mechanism (commonJS..?)
var createFileloader      = require("./server/fileloader.js").createFileloader;
var createLiveEnvironment = require("./server/live.js").createLiveEnvironment;
var createChannel         = require('./server/channel.js').createChannel;

var channel               = createChannel(server);
createFileloader(channel);
createLiveEnvironment(channel);

function handleRequest(req, res) {
  req.addListener('end', function() {
    fileServer.serve(req, res, function(err, result) {
      if (err) {
        console.error('Error serving %s - %s', req.url, err.message);
        res.statusCode = err.status;
        res.end(String(err.status));
        return;
      }
      console.log('%s - %s', req.url, res.message);
    });
  }).resume();
}

function tryNextPort(err) {
  if (err.code == 'EADDRINUSE' || err.code == 'EACCES') {
    port += 1;
    server.listen(port);
  }
}

server.on('error', tryNextPort);

server.on('listening', function() {
  server.removeListener('error', tryNextPort);
  console.log('Moonchild is running at http://localhost:' + port + '/editor/');
});

server.listen(port);
