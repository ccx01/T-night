(function(){
	game.map.init("img/map/bg1.png", 1900, 1000);
	module.load([{
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

			ochi.init(5, 5, 200, 300, 0);
			ochi1.init(5, 5, 300, 300, 0);
			// ochi cmd 需要设个初始函数
			/*$("#player").addClass("ochi");

			$(".ochi .avatar img").attr("src","img/avatar/ochi/p1.png")
			$(".ochi .hp div").animate({
			    "width": "100%"
			});*/
			camera.center=ochi;
			stage.move(function(e, cmd){
				game.mouse_x = e.offsetX + camera.x,
				game.mouse_y = e.offsetY + camera.y;
				ochi.cmd(cmd);

				mark.add(500, game.mouse_x, game.mouse_y, game.time, 20, 20);
			});

			// start();
		});
	module.add('m1',"第一章");
}());