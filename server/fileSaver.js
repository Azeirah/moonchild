var fs = require("fs");

function createFileSaver(channel) {
    var filename = process.argv[2];

    channel.on("saveFile", function (data) {
        if (filename) {
            console.log("Writing to file %s", filename);
            fs.writeFile(filename, data.content);
        }
    });
}

module.exports = {
    createFileSaver: createFileSaver
};