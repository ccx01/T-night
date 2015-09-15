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
			// this.movable = true;
			this.moving = false;
			/* 状态属性 end */
			this.hp = this.init_hp = hp;
			this.speed = this.init_speed = speed;
			this.x = this.dx = x;
			this.y = this.dy = y;
			this.vx = this.vy = 0;
			this.angle = angle;
		}

		ochi1.move = function(end, extra){
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
		ochi1.isObstructed = function(end, callback){
			// 移动停止需要独立一个功能，以此来应付其他情况(其他情况可直接调用此功能)
			this.vx = 0;
			this.vy = 0;
			this.moving = false;
			this.mode = end;
			callback && callback();
			this.status = "";
		}
		ochi1.force = function(obj) {
			obj.forced(ochi1, "be_bounced");
		}
		ochi1.forced = function(obj, mode) {
			var t = 5;
			var dr = this.radius + obj.radius;
			var tx = this.x - obj.x;
			var ty = this.y - obj.y;
			var angle = Math.atan2(ty, tx);
			var cos = Math.cos(angle);
			var sin = Math.sin(angle);

			var vx = cos * obj.speed * 2;
			var vy = sin * obj.speed * 2;
			var dx = this.x + vx * t;
			var dy = this.y + vy * t;

			this.mode = mode;
			this.extra = function(){
				this.move("stay", {
					dx: dx,
					dy: dy,
					vx: vx,
					vy: vy
				});
			}
		}
		ochi1.extra = function(){/* 碰撞后的行为，由对方的force控住，如被击飞 */}
		ochi1.angry = 0;
		ochi1.action = function() {
			switch(this.mode){
				case "walk":
					this.move();
				break;
				case "chongzhuang":
					this.move();
				break;
				case "angry":
					this.angry++;
					if(this.angry > 30) {
						this.angry = 0;
						this.mode = "chongzhuang";
					}
				break;
				case "be_attacked":

				break;
				case "extra":
					this.extra();
				break;
			}
		}
		ochi1.cz = function() {

		}
		ochi1.czt = game.time;
		ochi1.AI = function(t) {
			if(this.status == "no_think") return;
			if(Math.abs(t.x - this.x) < 200 && Math.abs(t.y - this.y) < 200) {
				this.mode = "angry";
				this.angle = this.toward = Math.atan2(this.target.y - this.y, this.target.x - this.x);
				this.vx = Math.cos(this.angle) * 10 || 0;
				this.vy = Math.sin(this.angle) * 10 || 0;
				this.dy = this.y + this.vy * 30;
				this.dx = this.x + this.vx * 30;
				this.status = "no_think";
			} else if(t) {
				this.angry = 0;
				this.dx = t.x;
				this.dy = t.y;
				this.angle = this.toward = Math.atan2(this.dy - this.y, this.dx - this.x);
				this.vx = Math.cos(this.angle) * this.speed || 0;
				this.vy = Math.sin(this.angle) * this.speed || 0;
				this.mode = "walk";
			}
		}

		/**********update**********/
		ochi1.update = function() {
			// this.state();
			this.action();
		}
		setInterval(function() {
			//伟大的AI思考人生中
			if (Math.random() > 0.7) {
				ochi1.AI(ochi1.target);	
			};
		}, 1000);

		game.drawPool.push(ochi1);
		game.collidePool.push(ochi1);

		module.add("ochi1", ochi1);
	});
}());