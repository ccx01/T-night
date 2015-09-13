//Ochi 奥兹
(function(){

	module.load("ochi1", [{
		"name": "model",
		"url": "js/model.js"
	},{
		"name": "sprite",
		"url": "js/sprite.js"
	}], function(mod){

		var ochi1 = mod.model();
		ochi1.collidable = true;

		/*************sprite***************/
		ochi1.sprite = mod.sprite("characters/ochi1.png", 0, 0, 32, 32, ready);

		ochi1.name = "ochi1";

		ochi1.init = function(hp, speed, x, y, angle){
			this.type = "nocharacter";
			/* 碰撞属性 */
			this.radius = 15;
			this.mass = 20;
			/* 碰撞属性 end */
			/* 状态属性 */
			this.movable = true;
			this.moving = false;
			/* 状态属性 end */
			this.hp = this.init_hp = hp;
			this.speed = this.init_speed = speed;
			this.x = this.dx = x;
			this.y = this.dy = y;
			this.vx = this.vy = 0;
			this.angle = angle;
		}

		ochi1.cmd = function(listener) { //cmd drived by the event listener, listener set by chapter
			switch(listener){
				case "walk":
					this.dy = game.mouse_y;
					this.dx = game.mouse_x;
					this.angle = this.toward = Math.atan2(this.dy - this.y, this.dx - this.x);
					this.vx = Math.cos(this.angle) * this.speed || 0;
					this.vy = Math.sin(this.angle) * this.speed || 0;
					this.movable = true;
					this.mode = "walk";
				break;
			}
		}
		ochi1.move = function(end, extra){
			if (this.movable) {
				// 特殊情况下出现的移动行为，如被对方击飞
				// 移动时的速度并非完全按本身速度进行
				extra = extra || {};
				this.dx = extra.dx || this.dx;
				this.dy = extra.dy || this.dy;
				this.vx = extra.vx || this.vx;
				this.vy = extra.vy || this.vy;

				this.moving = true;
				if((this.vx > 0 && this.x > this.dx) || (this.vx < 0 && this.x < this.dx) || (this.vy > 0 && this.y > this.dy) || (this.vy < 0 && this.y < this.dy)){
					// this.x = this.dx;
					// this.y = this.dy;
					// 移动到目标位置结束状态
					this.isObstructed(end || "stay");
				} else {
					this.x += this.vx;
					this.y += this.vy;
				}
			}
		}
		ochi1.isObstructed = function(end, callback){
			// 移动停止需要独立一个功能，以此来应付其他情况(其他情况可直接调用此功能)
			this.vx = 0;
			this.vy = 0;
			this.moving = false;
			this.mode = end;
			callback && callback();
		}
		ochi1.force = function(obj){
			var dr = obj.radius + this.radius;
			var dx = this.x - obj.x;
			var dy = this.y - obj.y;
			var angle = Math.atan2(dy, dx);
			obj.x = this.x - Math.cos(angle) * dr * 1.1;
			obj.y = this.y - Math.sin(angle) * dr * 1.1;
			obj.status = "";
		}
		ochi1.extra = function(){/* 碰撞后的行为，由对方的force控住，如被击飞 */}
		ochi1.behavior = function() {
			switch(this.mode){
				case "walk":
					// 技能施放时贴图可能不停的变化 => to Sign
					// 设计有变，行走无需更换图片
					// this.img("walk");
					this.move();
				break;
				case "extra":
					this.extra();
				break;
			}
		}

		/**********update**********/
		ochi1.update = function() {
			// this.state();
			this.behavior();
		}

		game.drawPool.push(ochi1);
		game.collidePool.push(ochi1);

		module.add("ochi1", ochi1);
	});
}());