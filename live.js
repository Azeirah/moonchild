// by the way, this script needs to be built
// browserify live.js -o dist/live.js

var createChannel = require("./lib/channel.js").createChannel;
var channel = createChannel(8080);

function clearStatefulStuff() {
	// since there's no sandboxing used here, things like eventListeners need to be cleared also
	document.body.innerHTML = "";

	// if someone does this
	/*
	
	window.setInterval(function () {
		console.log("hi");
	}, 100);

	 */
	
	// then that would persist across multiple evals, 
	// so stuff like event listeners and timeouts/intervals need to be replaced with resettable alternatives
	// I've chosen not to use iframes because they are incredibly slow.
}

channel.on("file", function execute(data) {
	clearStatefulStuff();
	eval(data.file);
});