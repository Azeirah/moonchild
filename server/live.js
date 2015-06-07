function createLiveEnvironment(channel) {
	channel.on("file", function (data) {
		channel.sendToAll("file", data);
	});
}

module.exports = {
	createLiveEnvironment: createLiveEnvironment
};