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

		ochi.name = "ochi";

		ochi.init = function(hp, speed, x, y, angle){
			this.type = "character";
			this.radius = 15;
			this.mass = 20;
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
					age: age,
					x: x,
					y: y,
					vx: vx,
					vy: vy
				}

				var self = mod.model(cfg);
					self.sprite = mod.sprite("ui/mark.png", 0, 0, 22, 20, ready);
					self.update = function() {
						this.img.ani([
							[0,0,22,20],
							[0,20,22,20]
						],100);
						this.x += this.vx;
						this.y += this.vy;
						(game.time - this.time > this.age) && (this.active = false);
					}

				game.objectPool.push(self);
			}
			var Wkey = function(age, x, y, dx, dy, speed, time) {
				var active = true;
				var angle = Math.atan2(dy - y, dx - x);
				var vx = Math.cos(angle) * speed || 0;
				var vy = Math.sin(angle) * speed || 0;

				var cfg = {
					age: age,
					x: x,
					y: y,
					vx: vx,
					vy: vy
				}

				var self = mod.model(cfg);
					self.sprite = mod.sprite("ui/mark.png", 0, 0, 22, 20, ready);
					self.move = function(){
						if((this.vx > 0 && this.x > this.dx) || (this.vx < 0 && this.x < this.dx) || (this.vy > 0 && this.y > this.dy) || (this.vy < 0 && this.y < this.dy)){
							this.active = false;
						} else {
							this.x += this.vx;
							this.y += this.vy;
						}
					}
					self.update = function() {
					this.img.ani([
						[0,0,22,20],
						[0,20,22,20]
					],100);
					this.move();
					(game.time - this.time > this.age) && (this.active = false);
				}
				
				game.objectPool.push(self);
			}
			I.Qkey = Qkey;
			I.Wkey = Wkey;
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
					this.skill.Qkey(1000, this.x, this.y, game.mouse_x, game.mouse_y, 10, game.time);
				break;
				case "Wkey":
					this.skill.Wkey(1000, this.x, this.y, game.mouse_x, game.mouse_y, 10, game.time);
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
		ochi.force = function(obj){
			//作用力
			/*
			此函数与extra一样，将随时进行更新 
			碰撞后对方执行的效果，如击飞效果
			不同的技能有不同的效果
			*/
			switch(this.mode){
				/*
				各个状态需独立写一份碰撞事件
				若在behavior中再赋值将会出现首次无效的情况
				此处mode之后替换成对应的技能招式
				*/
				case "walk":
					// this.isObstructed("stay");
					if(obj.type == "character"){
						var t = 10;
						var dr = this.radius + obj.radius;
						var tx = obj.x - this.x;
						var ty = obj.y - this.y;
						var angle = Math.atan2(ty, tx);
						var cos = Math.cos(angle);
						var sin = Math.sin(angle);
						var ratio = this.mass / obj.mass;

						var vx = cos * this.speed * ratio;
						var vy = sin * this.speed * ratio;
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
					}
				break;
			}
		}
		// touch 功能完全由force执行
		/*ochi.touch = function(mode){
			//反作用力
			//只有可操作状态的对象才有touch属性，有待考量
			switch(mode){
				case "walk":
					this.isObstructed("stay", reaction(this));
				break;
			}
		}*/
		ochi.extra = function(){/* 碰撞后的行为，由对方的force控住，如被击飞 */}
		ochi.behavior = function() {
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
		ochi.update = function() {
			// this.state();
			this.behavior();
		}

		game.objectPool.push(ochi);
		game.collidePool.push(ochi);

		module.add("ochi", ochi);
	});
}());