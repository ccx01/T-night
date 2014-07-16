/* init */

	//bound checked
	Number.prototype.clamp = function(min, max) {
		return Math.min(Math.max(this, min), max);
	};

	/* window */
	window.requestAnimationFrame = (function() {
		return window.requestAnimationFrame || function(callback) {
			return setTimeout(callback, 1000 / 60); // shoot for 60 fps
		};
	}());

	window.cancelAnimationFrame = (function() {
		return window.cancelAnimationFrame || function(id) {
			clearTimeout(id);
		};
	}());

	function gotoChapter(chapter) {
		/* init 也许init应该在chapter里进行，因为部分chapter可能需要继承- -，待定 => Sign */
		game.objectPool = []; //empty the game.objectPools
		game.collidePool = [];

		game.load.start();

		module.load([{
			"name": chapter,
			"url": "js/chapters/" + chapter + ".js"
		}]);
	}

	/* 先把这几个js塞到head里，暂时先这样了 */
	module.load([{
		"name": "collide",
		"url": "js/collide.js"
	}], function(mod){
		var collide = mod.collide;
		// sprite = mod.sprite;

		var loop_id;
		var last_loop_time = 0;
		var last_fps_time = 0;

		function ready(loaded, total) {
			game.load.ing(loaded, total);
			if (loaded == total) {
				start();
			};
		}

		function start() {
			// prevent loading many times
			loop_id && cancelAnimationFrame(loop_id);
			loop_id = requestAnimationFrame(loop);
			game.load.end();
		}

		function stop() {
			cancelAnimationFrame(loop_id);
		}

		function fps(now) {
			if (now - last_fps_time > 1000) {
				game.fps(1000 / (now - last_loop_time) | 0);
				last_fps_time = now;
			}
			last_loop_time = now;
		}

		function loop(now) {
			collide.handle();
			game.camera.update();
			game.stage.update();
			loop_id = requestAnimationFrame(loop);
			fps(now);
			game.time = now | 0;
		}

		window.ready = ready;

		
		game.stage.setSize(600, 400);
		game.menu();
	});