/* init */
var time; //current time
var loaded;
var count_objects;
var pause = false;
var loop_id;
var last_loop_time = 0;
var last_fps_time = 0;
/* level setting */

function gotoChapter(chapter) {
	/* init 也许init应该在chapter里进行，因为部分chapter可能需要继承- -，待定 => Sign */
	game.objectPool = []; //empty the game.objectPools
	game.collidePool = [];
	loaded = 0;

	$("#loading").show();

	$.ajax({
		url: "js/chapters/" + chapter + ".js",
		dataType: "script"
	}).done(function() {
		count_objects = game.objectPool.length;

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
	canvas.clearRect(0, 0, game.canvas.w, game.canvas.h);
	var i = 0;
	for(; i < count_objects; i++){
		game.objectPool[i].draw();
	}
}

function loop(now) {
	handleCollisions();
	camera.update();
	canvasUpdate();
	loop_id = requestAnimationFrame(loop);
	fps(now);
	game.time = now | 0;
}

function fps(now) {
	if (now - last_fps_time > 1000) {
		$("#fps").text(1000 / (now - last_loop_time) | 0);
		last_fps_time = now;
	}
	last_loop_time = now;
}

function start() {
	loop_id = requestAnimationFrame(loop);
	$("#info").fadeIn();
	$("#stage").fadeIn();
}

function stop() {
	cancelAnimationFrame(loop_id);
}

$("#chapter").fadeIn();