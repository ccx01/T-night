(function(){
	game.map.init("img/map/bg1.png", 1900, 1000);
	module.load("m1", [{
			"name": "ochi",
			"url": "js/characters/ochi.js"
		},{
			"name": "ochi1",
			"url": "js/characters/ochi-1.js"
		},{
			"name": "mark",
			"url": "js/effect/mark.js"
		}], function(mod){
			var ochi = mod.ochi;
			var ochi1 = mod.ochi1;
			var mark = mod.mark;

			ochi.init(5, 5, 100, 200, 0);
			ochi1.init(5, 3, 300, 400, 0);
			// ochi cmd 需要设个初始函数
			/*$("#player").addClass("ochi");

			$(".ochi .avatar img").attr("src","img/avatar/ochi/p1.png")
			$(".ochi .hp div").animate({
			    "width": "100%"
			});*/
			game.camera.center=ochi;
			ochi1.target = ochi;
			game.cmd(function(cfg){
				game.mouse_x = cfg.e.x + game.camera.x,
				game.mouse_y = cfg.e.y + game.camera.y;
				ochi.cmd(cfg);

				mark.add(500, game.mouse_x, game.mouse_y, game.time, 20, 20);
			});

			module.add('m1', "第一章");
		});
}());