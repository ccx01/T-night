/* init */
var loaded;
var count_objects;
var loop_id;
var last_loop_time = 0;
var last_fps_time = 0;

function gotoChapter(chapter) {
	/* init 也许init应该在chapter里进行，因为部分chapter可能需要继承- -，待定 => Sign */
	game.objectPool = []; //empty the game.objectPools
	game.collidePool = [];
	loaded = 0;

	load.start();

	$.ajax({
		url: "js/chapters/" + chapter + ".js",
		dataType: "script"
	}).done(function() {
		count_objects = game.objectPool.length;

	});
}

function ready() {
	loaded++;
	load.ing(loaded, count_objects);
	if (loaded == count_objects) {
		start();
	};
}

function start() {
	loop_id = requestAnimationFrame(loop);
	load.end();
}

function stop() {
	cancelAnimationFrame(loop_id);
}

/* canvas update */

function canvasUpdate() {
	canvas.clearRect(0, 0, canvas.w, canvas.h);
	var i = 0;
	for(; i < count_objects; i++){
		game.objectPool[i].draw();
	}
}

function fps(now) {
	if (now - last_fps_time > 1000) {
		global.fps(1000 / (now - last_loop_time) | 0);
		last_fps_time = now;
	}
	last_loop_time = now;
}

function loop(now) {
	collide.handle();
	camera.update();
	canvasUpdate();
	loop_id = requestAnimationFrame(loop);
	fps(now);
	game.time = now | 0;
}

global.menu();