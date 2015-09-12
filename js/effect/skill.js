//技能模版
(function(){

	module.load("skill", [{
		"name": "model",
		"url": "js/model.js"
	},{
		"name": "sprite",
		"url": "js/sprite.js"
	}], function(mod){

		var Qkey = mod.model();
			Qkey.sprite = mod.sprite("ui/mark.png", 0, 0, 22, 20, game.ready);
			Qkey.move = function(){
				if((this.vx > 0 && this.x > this.dx) || (this.vx < 0 && this.x < this.dx) || (this.vy > 0 && this.y > this.dy) || (this.vy < 0 && this.y < this.dy)){
					this.active = false;
				} else {
					this.x += this.vx;
					this.y += this.vy;
				}
			}
			Qkey.update = function() {
				this.img.ani([
					[0,0,22,20],
					[0,20,22,20]
				],100);
				this.move();
				(game.time - this.time > this.age) && (this.active = false);
			}
			Qkey.add = function(age, x, y, dx, dy, speed, time){
				this.active = true;
				this.name = "Qkey";
				this.age = age || 0;
				this.x = x || 0;
				this.y = y || 0;
				this.dx = dx || 0;
				this.dy = dy || 0;		
				this.angle = Math.atan2(this.dy - this.y, this.dx - this.x);
				this.vx = Math.cos(this.angle) * speed || 0;
				this.vy = Math.sin(this.angle) * speed || 0;
				this.time = game.time || 0;
				game.drawPool.push(this);
			}

		var Wkey = mod.model();
			Wkey.sprite = mod.sprite("ui/mark.png", 0, 0, 22, 20, game.ready);
			Wkey.move = function(){
				if((this.vx > 0 && this.x > this.dx) || (this.vx < 0 && this.x < this.dx) || (this.vy > 0 && this.y > this.dy) || (this.vy < 0 && this.y < this.dy)){
					this.active = false;
				} else {
					this.x += this.vx;
					this.y += this.vy;
				}
			}
			Wkey.update = function() {
				this.img.ani([
					[0,0,22,20],
					[0,20,22,20]
				],100);
				this.move();
				(game.time - this.time > this.age) && (this.active = false);
			}
			Wkey.add = function(age, x, y, dx, dy, speed, time){
				this.active = true;
				this.name = "Wkey";
				this.age = age || 0;
				this.x = x || 0;
				this.y = y || 0;
				this.dx = dx || 0;
				this.dy = dy || 0;		
				this.angle = Math.atan2(this.dy - this.y, this.dx - this.x);
				this.vx = Math.cos(this.angle) * speed || 0;
				this.vy = Math.sin(this.angle) * speed || 0;
				this.time = game.time || 0;
				game.drawPool.push(this);
			}

		var skill = {
			"Qkey": Qkey,
			"Wkey": Wkey
		}

		module.add("skill", skill);
	});
}());