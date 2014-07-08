/* init */
var model,collide;
	module.load([{
		"name": "model",
		"url": "js/characters/model.js"
	},{
		"name": "collide",
		"url": "js/collide.js"
	}], function(mod){
	// console.log(module.mod)
		console.log(mod)
		model = module.mod.model,collide = module.mod.collide;
	}());

var loaded;
var count_objects = 0;
var loop_id;
var last_loop_time = 0;
var last_fps_time = 0;

function gotoChapter(chapter) {
	/* init 也许init应该在chapter里进行，因为部分chapter可能需要继承- -，待定 => Sign */
	game.objectPool = []; //empty the game.objectPools
	game.collidePool = [];
	loaded = 0;

	load.start();

	module.load([{
		"name": chapter,
		"url": "js/chapters/" + chapter + ".js"
	}]);
}

function ready(loaded, total) {
	load.ing(loaded, total);
	if (loaded == total) {
		start();
	};
}

function start() {
	// prevent loading many times
	loop_id && cancelAnimationFrame(loop_id);
	loop_id = requestAnimationFrame(loop);
	load.end();
}

function stop() {
	cancelAnimationFrame(loop_id);
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
	stage.update(count_objects);
	loop_id = requestAnimationFrame(loop);
	fps(now);
	game.time = now | 0;
}

global.menu();