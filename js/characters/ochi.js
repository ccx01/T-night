//Ochi 奥兹
(function(){
	module.load("ochi", [{
		"name": "model",
		"url": "js/model.js"
	},{
		"name": "sprite",
		"url": "js/sprite.js"
	}], function(mod){

		var ochi = mod.model();
		// var ochi = module.mod['model']();

		/*************sprite***************/
		ochi.sprite = mod.sprite("characters/ochi.png", 0, 0, 32, 32, game.ready);
		ochi.collidable = true;
		ochi.name = "ochi";

		ochi.init = function(hp, speed, x, y, angle){
			this.type = "character";
			this.radius = 15;
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

		ochi.skill = (function(){
			var I = {}
			var Qkey = function(age, x, y, dx, dy, speed, time) {
				var active = true;
				var angle = Math.atan2(dy - y, dx - x);
				var vx = Math.cos(angle) * speed || 0;
				var vy = Math.sin(angle) * speed || 0;

				var cfg = {
					name: "ochi",
					age: age,
					x: x,
					y: y,
					vx: vx,
					vy: vy
				}

				var self = mod.model(cfg);
					self.sprite = mod.sprite("ui/mark.png", 0, 0, 22, 20, game.ready);
					self.moving = true;
					self.collidable = true;
					self.update = function() {
						this.img.ani([
							[0,0,22,20],
							[0,20,22,20]
						],100);
						this.x += this.vx;
						this.y += this.vy;
						if(this.x < 0 || this.x > game.map.w || this.y < 0 || this.y > game.map.h) {
							this.active = false;
						}
						(game.time - time > this.age) && (this.active = false);
					}
					self.force = function(obj) {
						if(obj.name != ochi.name) {
							var t = 5;
							var dr = this.radius + obj.radius;
							var tx = obj.x - this.x;
							var ty = obj.y - this.y;
							var angle = Math.atan2(ty, tx);
							var cos = Math.cos(angle);
							var sin = Math.sin(angle);

							var vx = cos * this.speed * 2;
							var vy = sin * this.speed * 2;
							var dx = obj.x + vx * t;
							var dy = obj.y + vy * t;

							obj.mode = "extra";
							obj.extra = function(){
								obj.move("stay", {
									dx: dx,
									dy: dy,
									vx: vx,
									vy: vy
								});
							}
							self.collidable = false;
							self.active = false;
						}
					}

				game.drawPool.push(self);
				game.collidePool.push(self);
			}
			I.Qkey = Qkey;
			return I;
		}());

		ochi.cmd = function(listener) { //cmd drived by the event listener, listener set by chapter
			switch(listener){
				case "walk":
					if(Math.abs(game.mouse_x - this.x) > this.radius || Math.abs(game.mouse_y - this.y) > this.radius){
						this.dy = game.mouse_y;
						this.dx = game.mouse_x;
						this.angle = this.toward = Math.atan2(this.dy - this.y, this.dx - this.x);
						this.vx = Math.cos(this.angle) * this.speed || 0;
						this.vy = Math.sin(this.angle) * this.speed || 0;
						this.movable = true;
						this.mode = "walk";
					}
				break;
				case "Qkey":
					this.skill.Qkey(500, this.x, this.y, game.mouse_x, game.mouse_y, 10, game.time);
				break;
			}
		}
		ochi.move = function(end, extra){
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
		ochi.isObstructed = function(end, callback){
			// 移动停止需要独立一个功能，以此来应付其他情况(其他情况可直接调用此功能)
			this.vx = 0;
			this.vy = 0;
			this.moving = false;
			this.mode = end;
			callback && callback();
		}
		
		ochi.force = function(obj) {
			//在写出移动路径算法前先无视角色作用力
		}
		ochi.extra = function(){/* 碰撞后的行为，由对方的force控住，如被击飞 */}
		ochi.action = function() {
			switch(this.mode){
				case "walk":
					// 技能施放时贴图可能不停的变化 => to Sign
					// 设计有变，行走无需更换图片
					// this.img("walk");
					this.move();
				break;
				case "be_bounced":
					//被击飞
				break;
				case "extra":
					this.extra();
				break;
			}
		}

		/**********update**********/
		ochi.update = function() {
			// this.state();
			this.action();
		}

		game.drawPool.push(ochi);
		game.collidePool.push(ochi);

		module.add("ochi", ochi);
	});
}());