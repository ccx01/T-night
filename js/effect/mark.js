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

		mark.sprite = mod.sprite("ui/mark.png", 0, 0, 22, 20, ready);

		mark.update = function() {
			this.img.ani([
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
			var count_objects = game.objectPool.length;
			var i = 0;
			for(; i < count_objects; i++){
				if(game.objectPool[i].name == "mark"){
					return;
				}
			}
			game.objectPool.push(this);
		}
		module.add("mark", mark);
	});
}());