(function(){
	module.load("model", [{
		"name": "sprite",
		"url": "js/sprite.js"
	}], function(mod){
		//初始化实体
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
			I.sprite = I.sprite || {};
			I.hasImg = true;
			I.flash = false;
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
				this.hasImg && this.sprite.draw();
				this.flash && this.sprite.flash(this.flash);
				/* OBB stroke */
				this.sprite.stroke(0, 0, this.radius);
				/* OBB stroke end */
				game.stage.restore();
				this.update();
			}
			I.force = function() {}
			I.forced = function() {}
			I.update = function() {}
			return I;
		}

		module.add("model", model);
	});
}());