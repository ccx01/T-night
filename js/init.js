/* init */
(function(){
	window.game = {
		drawPool: [],
		collidePool: [],
		mouse_x: 0,
		mouse_y: 0,
		time: 0
	}

	module.load("init", [{
		"name": "util",
		"url": "js/util.js"
	}, {
		"name": "collide",
		"url": "js/collide.js"
	}], function(mod){
		var collide = mod.collide;

		var loop_id;

		function ready(loaded, total) {
			game.load.ing(loaded, total);
			if (loaded == total) {
				start();
			};
		}

		function start() {
			// prevent loading many times
			// start功能独立出来是为了实现暂停
			loop_id && cancelAnimationFrame(loop_id);
			loop_id = requestAnimationFrame(loop);
			game.load.end();
		}

		function stop() {
			cancelAnimationFrame(loop_id);
		}

		function loop(now) {
			collide.handle();
			game.camera.update();
			game.stage.update();
			loop_id = requestAnimationFrame(loop);
			game.fps(now);
			game.time = now | 0;
		}

		function gotoChapter(e){
			//冒泡处理
			var node = e.target.parents('chapter');
			var chapter = node.dataset['chapter'];

			game.drawPool = []; //empty the game.objectPools
			game.collidePool = [];

			game.load.start();

			module.load("call" + chapter, [{
				"name": chapter,
				"url": "js/chapters/" + chapter + ".js"
			}], function(){});
		}

		$("#chapter").onclick = gotoChapter;

		game.ready = ready;
		game.menu();
	});
}());