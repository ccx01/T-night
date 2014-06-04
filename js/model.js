function model() {
	var I = {};
	I.age = 0;
	I.active = true;
	I.sprite = sprite("model.png", 0, 0);
	I.mode = "stay";
	I.collidable = false;
	I.timer = 0; //计时用
	I.count = 0; //计数用
	I.x = 0;
	I.y = 0;
	I.angle = 0;
	/*for drawing*/
	I.width = 32;
	I.height = 32;
	/*for collide*/
	I.speed = 2;
	I.center = function() {
		//似乎是向量处出错了
		//向量半径
		var axes_1 = {
			x: Math.cos(this.angle) * this.width / 2,
			y: Math.sin(this.angle) * this.height / 2
		}
		//法向量半径
		var axes_2 = {
			x: -1 * Math.sin(this.angle) * this.width / 2,
			y: Math.cos(this.angle) * this.height / 2
		}
		var cx = axes_1.x + this.x;
		var cy = axes_1.x + this.y;
		return {
			x: cx,
			y: cy,
			axes_1: axes_1,
			axes_2: axes_2,
			sub: function(v) {
				//中心距离向量
				var x = cx - v.x;
				var y = cy - v.y;
				// console.log(cx, cy);
				return {
					dot: function(v) {
						//投影
						return x * v.x + y * v.y;
					}
				}
			},
			dot: function(v) {
				//投影
				return cx * v.x + cy * v.y;
			}
		}
	};
	I.draw = function() {
		canvas.save();
		canvas.translate(this.x-camera.x, this.y-camera.y);
		canvas.rotate(this.angle);
		this.sprite.draw(canvas, -this.width / 2, -this.height / 2, this.width, this.height);
		/* OBB stroke */
		this.sprite.stroke(canvas, -this.OBBw / 2, -this.OBBh / 2, this.OBBw, this.OBBh);
		/* OBB stroke end */
		canvas.restore();
		this.update();
	};
	I.coordinate = function(arr) {
		//arr:[sx, sy, w, h]
		this.sprite.setSx(arr[0]);
		this.sprite.setSy(arr[1]);
		this.width = arr[2] || this.width;
		this.height = arr[3] || this.height;
	};
	I.update = function() {
		//for customize
	};
	return I;
};
/**********expand**********/
var effect = [];
function nonmodel(age, x, y, speed, angle) {
	var I = model();
	I.age = age;
	I.x = x;
	I.y = y;
	I.width = 1;
	I.height = 1;
	I.speed = speed;
	I.angle = angle;
	I.timer=time||0;
	I.xVelocity = speed * Math.cos(angle);
	I.yVelocity = speed * Math.sin(angle);
	I.update = function() {
		this.x += this.xVelocity;
		this.y += this.yVelocity;
		I.end();
	}
	I.end=function(){
		if (time-this.timer>this.age) {
			this.active = false;
			effect = effect.filter(function(o) {
				return o.active;
			});
		}		
	}

	return I;
}

var sign = [];
function mouseIcon(age, x, y) {
	var I = model();
	I.age = age||0;
	I.x = x||0;
	I.y = y||0;
	I.timer=time||0;
	I.width = 20;
	I.height = 20;
	I.sprite = sprite("ui/cur.png");
	I.update = function() {
		I.end();
		this.animation([
			[0,0],
			[0,20]
		],10);
	}
	I.end=function(){
		if (time-this.timer>this.age) {
			this.active = false;
			sign = sign.filter(function(s) {
				return s.active;
			});
		}	
	}
	return I;
}