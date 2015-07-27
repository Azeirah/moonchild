var fs = require("fs");

function createFileLoader (channel) {
  var fileLoader = Object.create(null);

  fileLoader.sendFile = function sendFile(channel, filePath) {
    fs.readFile(filePath, {encoding: "utf-8"}, function (error, data) {
      if (error) {
        console.log(error);
      } else {
        console.log("sending file %s to editor!", filePath);
        channel.sendToAll("fileLoad", {content: data, filePath: filePath});
      }
    });
  }

  channel.onConnection(function () {
    var filename = process.argv[2];

    if (filename) {
      // the this argument here is channel
      fileLoader.sendFile(this, process.argv[2]);
    }
  });

  return fileLoader;
}

module.exports = {
  createFileLoader: createFileLoader
};