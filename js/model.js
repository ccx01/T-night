window.object = [];
var enemyPool = [];
var collidable = [];	//可碰撞物
var obstacles = [];
// var map = [];
function model() {
	var I = {};
	I.mode = "stay";
	I.loaded = false;
	I.collidable = false;
	I.age = 0;
	I.active = true;
	I.timer = 0; //计时用
	I.count = 0; //计数用
	I.buff = [];
	I.x = 0;
	I.y = 0;
	I.angle = 0;
	/*for drawing*/
	I.width = 32;
	I.height = 32;
	/*for collide*/
	I.speed = 2;
	sprite.apply(I,["model.png", 0, 0]);
	I.draw = function() {
		canvas.save();
		canvas.translate(this.x-camera.x, this.y-camera.y);
		canvas.rotate(this.angle);
		this.sprite.draw(canvas, -this.width / 2, -this.height / 2, this.width, this.height);
		/* OBB stroke */
		this.collidable && this.sprite.stroke(canvas, -this.OBBw / 2, -this.OBBh / 2, this.OBBw, this.OBBh);
		/* OBB stroke end */
		canvas.restore();
		this.update();
	};
	I.coordinate = function(arr) {
		//arr:[sx, sy, w, h]
		this.sprite.sourceX = arr[0];
		this.sprite.sourceY = arr[1];
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

/*function generateObstacle(x,y,width,height,angle) {
	var obstacle=model();
	obstacle.x=x;
	obstacle.y=y;
	obstacle.OBBwidth=obstacle.width=width;
	obstacle.OBBheight=obstacle.height=height;
	obstacle.angle=angle;
	obstacles.push(obstacle);
}*/