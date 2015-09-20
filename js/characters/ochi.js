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
		var sprite_cfg = {
			name: "characters/ochi.png",
			sourceX: 0,
			sourceY: 0,
			width: 32,
			height: 32
		}
		ochi.sprite = mod.sprite(sprite_cfg, game.ready);
		ochi.collidable = true;
		ochi.name = "ochi";
		// 受力时的施力方
		ochi.opp = {};

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
					x: ochi.x + vx * 10,
					y: ochi.y + vy * 10,
					vx: vx,
					vy: vy,
					angle: angle,
					toward: angle,
					radius: 50
				}

				var self = mod.model(cfg);
				var sprite_cfg = {
					name: "characters/tuchi.png",
					sourceX: 0,
					sourceY: 59,
					width: 156,
					height: 59
				}
					self.sprite = mod.sprite(sprite_cfg, game.ready);
					self.moving = true;
					self.collidable = true;
					self.update = function() {
						self.sprite.frame([
							[0, 236, 156, 59],
							[0, 295, 156, 59],
							[0, 354, 156, 59],
							[0, 413, 156, 59]
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
							var force_cfg = {
								t: self,
								mode: "be_attacked",
								dis: 1,
								s: 10
							}
							obj.forced(force_cfg);
							// obj.forced(self, "extra");
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
							this.dy = this.y + this.vy * 10;
							this.dx = this.x + this.vx * 10;
							this.mode = "sprint";
							this.status = "beyond_control";
						}
						dbclick = game.time;
					}
				break;
				case "keySSZ":
				case "keyNSZ":
					/*this.y = game.mouse_y;
					this.x = game.mouse_x;*/
				break;
				case "keyZX":
					this.angle = this.toward = Math.atan2(cfg.e.y - cfg.o.y, cfg.e.x - cfg.o.x);
					this.skill.tuchi(300, this.angle, 5, game.time);
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
			this.sprite.set([0,0,32,32]);
		}
		ochi.force = function (cfg) {
			//在写出移动路径算法前先无视角色作用力
		}
		ochi.forced = function (cfg) {
			//与force相对，受力时唯一的对外接口
			this.opp = cfg.t;
			this.mode = cfg.mode;
			this.opp.dis = cfg.dis || 1;
			this.opp.s = cfg.s || this.speed;
		}
		ochi.changeMode = function (mode) {
			//mode切换需统一管理
		}
		ochi.changeStatus = function (status) {
			//status切换需统一管理
		}
		ochi.extra = function(){/* 碰撞后的行为，由对方的force控住，如被击飞 */}
		ochi.action = function(cfg) {
			switch(this.mode){
				case "walk":
					// 技能施放时贴图可能不停的变化 => to Sign
					// 设计有变，行走无需更换图片
					// this.img("walk");
				break;
				case "be_bounced":
					//被击飞 或 弹飞
					this.sprite.set([0,0,32,32]);
					var dr = this.radius + ochi.opp.radius;
					var dx = ochi.opp.x - this.x;
					var dy = ochi.opp.y - this.y;
					this.angle = Math.atan2(dy, dx);
					this.vx = - Math.cos(this.angle) * ochi.opp.s;
					this.vy = - Math.sin(this.angle) * ochi.opp.s;
					this.dx = ochi.opp.x - Math.cos(this.angle) * (dr + ochi.opp.dis);
					this.dy = ochi.opp.y - Math.sin(this.angle) * (dr + ochi.opp.dis);
				break;
				case "touch":

				break;
				case "tuchi":
				break;
				case "sprint":
					this.sprite.set([34,36,61,30]);
				break;
				case "extra":
					this.extra();
				break;
			}
			this.move();
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