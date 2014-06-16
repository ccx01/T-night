function model() {
	var I = {};
	I.age = 0;
	I.active = true;
	I.mode = "stay";
	//sprite
	I.x = 0;
	I.y = 0;
	I.angle = 0;
	I.toward = 0;
	I.sprite = sprite("model.png", 0, 0, 32, 32);
	//sprite end
	I.speed = 2;	//speed 将影响 v
	// v 是即时速度，与speed并非完全对应关系
	I.vx = 0;
	I.vy = 0;
	I.mass = 1;	//质量
	I.radius = 0;	//半径，碰撞用
	I.draw = function() {
		canvas.save();
		canvas.translate(this.x-camera.x, this.y-camera.y);
		canvas.rotate(this.toward);
		this.sprite.draw(canvas);
		/* OBB stroke */
		this.sprite.stroke(canvas, 0, 0, this.radius);
		/* OBB stroke end */
		canvas.restore();
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