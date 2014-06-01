/* init */
var time; //current time
var loaded;
var totalLen;
var pause = false;
var requestId = 0;
var lastAnimationFrameTime = 0;
var lastFpsUpdateTime = 0;
/* level setting */

function gotoChapter(chapter) {
	objectPool = []; //empty the objectPools
	collidePool = [];
	loaded = 0;
	chapter = chapter + ".js";
	$.ajax({
		type: "GET",
		url: "js/chapters/" + chapter,
		dataType: "script"
	}).done(function() {
		$("#loading").show();
		totalLen = objectPool.length;

		$("#chapter").hide();
	});
}

function ready() {
	loaded++;
	$("#loading div").stop().animate({
		width: loaded / totalLen * 100 + "%"
	});
	if (loaded == totalLen) {
		// $("#loading").hide();
		start();
	};
}

/* canvas update */

function canvasDraw() {
	canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	var i = 0;
	for(; i < totalLen; i++){
		objectPool[i].draw();
	}
}

function loop(now) {
	if (!pause) {
		cancelAnimationFrame(requestId);
		calculateFps(now);
		camera.update();
		handleCollisions();
		canvasDraw();
		time = new Date().getTime();
		requestId = requestAnimationFrame(loop);
	}
}

function calculateFps(now) {
	var fps = 1000 / (now - lastAnimationFrameTime);
	lastAnimationFrameTime = now;

	if (now - lastFpsUpdateTime > 1000) {
		lastFpsUpdateTime = now;
		$("#fps").text(fps|0);
	}
}

requestId = requestAnimationFrame(loop);
function start() {
		pause = false;
		requestId = requestAnimationFrame(loop);
		$("#dialog").fadeOut();
		$("#info").fadeIn();
		$("#stage").fadeIn();
}

$("#chapter").fadeIn();