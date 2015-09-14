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
		ochi.sprite = mod.sprite("characters/ochi.png", 0, 0, 32, 32, ready);
		ochi.collidable = true;
		ochi.name = "ochi";

		ochi.init = function(hp, speed, x, y, angle){
			this.type = "character";
			this.radius = 15;
			/* 状态属性 */
			this.status = "normal";
			this.debuff = "";
			// this.movable = true;
			this.moving = false;	//碰撞检测只判断moving为true的对象
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
			//突刺
			var tuchi = function(age, angle, speed, time) {
				var active = true;
				var vx = Math.cos(angle) * speed || 0;
				var vy = Math.sin(angle) * speed || 0;

				var cfg = {
					name: "ochi",
					age: age,
					x: ochi.x,
					y: ochi.y,
					vx: vx,
					vy: vy
				}

				var self = mod.model(cfg);
					self.sprite = mod.sprite("ui/mark.png", 0, 0, 22, 20, ready);
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
						if(game.time - time > this.age) {
							this.active = false;
							ochi.status = "normal";
						}
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
						}
					}

				game.drawPool.push(self);
				game.collidePool.push(self);
			}

			I.tuchi = tuchi;
			return I;
		}());
		
		var dbclick = 0;
		ochi.cmd = function(cfg) {
			if(this.status == "beyond_control" || this.debuff == "daze") {
				return;
			}
			//命令监听设置在chapter里
			switch(cfg.cmd){
				case "keyN":
					if(Math.abs(game.mouse_x - this.x) > this.radius || Math.abs(game.mouse_y - this.y) > this.radius){
						this.dy = game.mouse_y;
						this.dx = game.mouse_x;
						this.angle = this.toward = Math.atan2(this.dy - this.y, this.dx - this.x);
						this.vx = Math.cos(this.angle) * this.speed || 0;
						this.vy = Math.sin(this.angle) * this.speed || 0;
						// this.movable = true;
						if(game.time - dbclick > 300) {
							//单击
							this.mode = "walk";
						} else {
							//双击
							this.vx = Math.cos(this.angle) * 20 || 0;
							this.vy = Math.sin(this.angle) * 20 || 0;
							this.dy = this.y + this.vy * 20;
							this.dx = this.x + this.vx * 20;
							this.mode = "sprint";
							this.status = "beyond_control";
						}
						dbclick = game.time;
					}
				break;
				case "keySSZ":
				case "keyNSZ":
					this.y = game.mouse_y;
					this.x = game.mouse_x;
				break;
				case "keyZX":
					this.angle = this.toward = Math.atan2(cfg.e.y - cfg.o.y, cfg.e.x - cfg.o.x);
					this.skill.tuchi(300, this.angle, 10, game.time);
					this.mode = "tuchi";
					// this.status = "beyond_control";
				break;
				// case "keySJ":
				// 	this.angle = this.toward = Math.atan2(cfg.e.y - cfg.o.y, cfg.e.x - cfg.o.x);
				// 	this.vx = Math.cos(this.angle) * 15 || 0;
				// 	this.vy = Math.sin(this.angle) * 15 || 0;
				// 	this.dy = this.y + this.vy * 20;
				// 	this.dx = this.x + this.vx * 20;
				// 	this.mode = "sprint";
				// 	this.status = "beyond_control";
				// break;
			}
		}
		ochi.move = function(end, extra){
			// if (this.movable) {
				// 特殊情况下出现的移动行为，如被对方击飞
				// 移动时的速度并非完全按本身速度进行
				extra = extra || {};
				this.dx = extra.dx || this.dx;
				this.dy = extra.dy || this.dy;
				this.vx = extra.vx || this.vx;
				this.vy = extra.vy || this.vy;

				this.moving = true;

				if((this.x <= this.radius) || (this.x >= game.map.w - this.radius) || (this.y <= this.radius) || (this.y >= game.map.h - this.radius) || (this.vx > 0 && this.x > this.dx) || (this.vx < 0 && this.x < this.dx) || (this.vy > 0 && this.y > this.dy) || (this.vy < 0 && this.y < this.dy)){
					//防止出界，这判断太糟糕了，需优先优化
					this.x = this.x.clamp(this.radius + 1, game.map.w - 1 - this.radius);
					this.y = this.y.clamp(this.radius + 1, game.map.h - 1 - this.radius);
					this.isObstructed(end);
				} else {
					this.x += this.vx;
					this.y += this.vy;
				}
			// }
		}
		ochi.isObstructed = function(end){
			// 移动停止需要独立一个功能，以此来应付其他情况(其他情况可直接调用此功能)
			this.vx = 0;
			this.vy = 0;
			this.moving = false;
			this.mode = "";
			this.status = end || "normal";
		}
		
		ochi.force = function(obj) {
			//在写出移动路径算法前先无视角色作用力
		}
		ochi.extra = function(){/* 碰撞后的行为，由对方的force控住，如被击飞 */}
		ochi.action = function(cfg) {
			switch(this.mode){
				case "walk":
					// 技能施放时贴图可能不停的变化 => to Sign
					// 设计有变，行走无需更换图片
					// this.img("walk");
					this.move();
				break;
				case "be_bounced":
					//被击飞 或 弹飞
				break;
				case "tuchi":

				break;
				case "sprint":
					this.move();
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