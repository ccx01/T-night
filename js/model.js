(function(){
	module.load("model", [{
		"name": "sprite",
		"url": "js/sprite.js"
	}], function(mod){
		var model = function(cfg) {
			var I = cfg || {};
			I.active = I.active || true;
			I.age = I.age || 0;
			I.mode = I.mode || "stay";
			//sprite
			I.x = I.x || 0;
			I.y = I.y || 0;
			I.angle = I.angle || 0;
			I.toward = I.toward || 0;
			I.sprite = I.sprite || mod.sprite("model.png", 0, 0, 32, 32);
			//sprite end
			I.speed = I.speed || 2;	//speed 将影响 v
			// v 是即时速度，与speed并非完全对应关系
			I.vx = I.vx || 0;
			I.vy = I.vy || 0;
			I.mass = I.mass || 1;	//质量
			I.radius = I.radius || 0;	//半径，碰撞用
			I.draw = function() {
				game.stage.save();
				game.stage.translate(this.x - game.camera.x, this.y - game.camera.y);
				game.stage.rotate(this.toward);
				this.sprite.draw(game.stage);
				/* OBB stroke */
				this.sprite.stroke(game.stage, 0, 0, this.radius);
				/* OBB stroke end */
				game.stage.restore();
				this.update();
			}
			I.img  = {
				time: 0,
				frame: 0,
				//animation
				ani: function(arr, during) {
					//制作特效，需要有动画函数=>Sign
					if(game.time - this.time > during){
						this.frame = this.frame < arr.length - 1 ? this.frame + 1 : 0;
						this.time = game.time;
						I.sprite.set(arr[this.frame]);
					}
				}
			}
			return I;
		}

		module.add("model", model);
	});
}());