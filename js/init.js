/* init */

	/* 先把这几个js塞到head里，暂时先这样了 */
	module.load("init", [{
		"name": "game",
		"url": "js/game.js"
	}], function(mod){

		function parents(node, tar) {
			while (node) {
				if (node.className == tar || node.id == tar) {
					return node;
				}
				node = node.parentNode;
			}
			return false;
		}

		function gotoChapter(e){
			//冒泡处理
			var node = parents(e.target,'chapter');
			var chapter = node.dataset['chapter'];

			game.drawPool = []; //empty the game.objectPools
			game.collidePool = [];

			game.begin();

			module.load("call" + chapter, [{
				"name": chapter,
				"url": "js/chapters/" + chapter + ".js"
			}]);
		}

		document.querySelector("#chapter").onclick = gotoChapter;
		
		game.stage.setSize(screen.width, screen.height);
		game.menu();
	});
 
