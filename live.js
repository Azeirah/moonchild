// by the way, this script needs to be built
// browserify live.js -o dist/live.js

var createChannel = require("./lib/channel.js").createChannel;
var channel = createChannel(8080);

var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");

document.body.appendChild(canvas);

// Live is currently just an empty canvas, in the live environment, ctx is available
// take this code as test code for this live environment
/*
ctx.fillRect(0, 0, 50, 50);
 */
// Then play around with the number scrubber, to see the black box move.

function clearStatefulStuff() {
	// since there's no sandboxing used here, things like eventListeners need to be cleared also
	ctx.clearRect(0, 0, canvas.width, canvas.height);

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