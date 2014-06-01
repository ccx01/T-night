/* init */
var time; //current time
var loaded;
var count_objects;
var pause = false;
var loopHandle;
var last_loop_time = 0;
var last_fps_time = 0;
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
		count_objects = objectPool.length;

		$("#chapter").hide();
	});
}

function ready() {
	loaded++;
	$("#loading div").stop().animate({
		width: loaded / count_objects * 100 + "%"
	});
	if (loaded == count_objects) {
		// $("#loading").hide();
		start();
	};
}

/* canvas update */

function canvasUpdate() {
	canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	var i = 0;
	for(; i < count_objects; i++){
		objectPool[i].draw();
	}
}

function loop(now) {
	// cancelAnimationFrame(loopHandle);
	fps(now);
	camera.update();
	handleCollisions();
	canvasUpdate();
	time = Date.now();
	loopHandle = requestAnimationFrame(loop);
}

function fps(now) {
	if (now - last_fps_time > 1000) {
		$("#fps").text(1000 / (now - last_loop_time) | 0);
		last_fps_time = now;
	}
	last_loop_time = now;
}

// loopHandle = requestAnimationFrame(loop);
function start() {
	loopHandle = requestAnimationFrame(loop);
	$("#info").fadeIn();
	$("#stage").fadeIn();
}

$("#chapter").fadeIn();