//鼠标点击效果
(function(){

	module.load("mark", [{
		"name": "model",
		"url": "js/model.js"
	},{
		"name": "sprite",
		"url": "js/sprite.js"
	}], function(mod){

		var mark = mod.model();

		var sprite_cfg = {
			name: "ui/mark.png",
			sourceX: 0,
			sourceY: 0,
			width: 22,
			height: 20
		}
		mark.sprite = mod.sprite(sprite_cfg, game.ready);

		mark.update = function() {
			mark.sprite.frame([
				[0,0,22,20],
				[0,20,22,20]
			],100);
			(game.time - this.time > this.age) && (this.active = false);
		}

		mark.add = function(age, x, y, time){
			this.active = true;
			this.name = "mark";
			this.age = age || 0;
			this.x = x || 0;
			this.y = y || 0;
			this.time = game.time || 0;
			var count_objects = game.drawPool.length;
			var i = 0;
			for(; i < count_objects; i++){
				if(game.drawPool[i].name == "mark"){
					return;
				}
			}
			game.drawPool.push(this);
		}
		module.add("mark", mark);
	});
}());