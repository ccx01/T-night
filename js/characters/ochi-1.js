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
		ochi1.sprite = mod.sprite("characters/soldier.png", 0, 0, 32, 32, ready);

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
			this.sprite.set([0,0,32,32]);
			this.status = "";
		}

		ochi1.force = function(obj) {
			if(obj == this.target)
			ochi1.isObstructed();
			// ochi1.angry = 0;
			obj.forced(ochi1.force_cfg);
		}
		ochi1.forced = function(cfg) {
			if(this.status == "no_think") return;
			this.opp = cfg.t;
			this.mode = cfg.mode;
			this.opp.dis = cfg.dis || 1;
			this.opp.s = cfg.s || this.speed;
		}
		ochi1.extra = function(){/* 碰撞后的行为，由对方的force控住，如被击飞 */}
		ochi1.angry = 0;
		ochi1.action = function() {
			switch(this.mode){
				case "walk":
					ochi1.force_cfg = {
						t: ochi1,
						mode: "be_bounced",
						dis: 1
					}
					this.sprite.set([0,0,32,32]);
					this.move();
				break;
				case "chongzhuang":
					ochi1.force_cfg = {
						t: ochi1,
						mode: "be_bounced",
						dis: 100,
						s: 10
					}
					this.sprite.set([32,0,64,32]);
					this.move();
					this.angry = 0;
				break;
				case "angry":
					this.angry++;
					this.sprite.set([0,33,32,32]);
					if(this.angry > 70) {
						this.status = "no_think";
						this.angle = this.toward = Math.atan2(this.target.y - this.y, this.target.x - this.x);
						this.vx = Math.cos(this.angle) * 10 || 0;
						this.vy = Math.sin(this.angle) * 10 || 0;
						this.dy = this.y + this.vy * 30;
						this.dx = this.x + this.vx * 30;
						this.sprite.set([0,67,32,32]);
					}
					if(this.angry > 100) {
						this.mode = "chongzhuang";
					}
					ochi1.force_cfg = {
						t: ochi1,
						mode: "be_bounced",
						dis: 1
					}
				break;
				case "be_attacked":
					this.status = "no_think";
					var dr = this.radius + ochi1.opp.radius;
					var dx = ochi1.opp.x - this.x;
					var dy = ochi1.opp.y - this.y;
					this.angle = Math.atan2(dy, dx);
					this.vx = - Math.cos(this.angle) * ochi1.opp.s;
					this.vy = - Math.sin(this.angle) * ochi1.opp.s;
					this.dx = ochi1.opp.x - Math.cos(this.angle) * (dr + ochi1.opp.dis);
					this.dy = ochi1.opp.y - Math.sin(this.angle) * (dr + ochi1.opp.dis);
					this.move();
					this.angry += 10;
					if(this.angry > 70) {
						this.mode = "angry";
					}
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
			if(Math.abs(t.x - this.x) < 100 && Math.abs(t.y - this.y) < 100) {
				this.mode = "angry";
			} else if(t) {
				this.mode = "";
				if(game.time % 3000 < 2000) return;
				if(this.angry > 0) this.angry--;
				this.mode = "walk";
				this.dx = t.x;
				this.dy = t.y;
				this.angle = this.toward = Math.atan2(this.dy - this.y, this.dx - this.x);
				this.vx = Math.cos(this.angle) * this.speed || 0;
				this.vy = Math.sin(this.angle) * this.speed || 0;
			}
		}

		/**********update**********/
		ochi1.update = function() {
			// this.state();
			this.action();
			ochi1.AI(ochi1.target);	
		}
		/*setInterval(function() {
			//伟大的AI思考人生中
			if (Math.random() > 0.7) {
				ochi1.AI(ochi1.target);	
			};
		}, 500);*/

		game.drawPool.push(ochi1);
		game.collidePool.push(ochi1);

		module.add("ochi1", ochi1);
	});
}());