var object = [];
var enemyPool = [];
var collidable = [];	//可碰撞物
var obstacles = [];
// var map = [];
function entity() {
	var I = {};
	I.age = 0;
	I.active = true;
	I.timer = 0; //计时用
	I.count = 0; //计数用
	I.buff = [];
	I.flash = false;
	I.x = 0;
	I.y = 0;
	I.angle = 0;
	/*for drawing*/
	I.width = 32;
	I.height = 32;
	/*for collide*/
	I.OBBwidth = 32;
	I.OBBheight = 32;
	I.speed = 2;
	// I.sprite = sprite("model.png");
	I.bounce={};
	I.draw = function() {
		canvas.save();
		canvas.translate(this.x-camera.x, this.y-camera.y);
		canvas.rotate(this.angle);
		this.sprite.draw(canvas, -this.width / 2, -this.height / 2, this.width, this.height);
		canvas.restore();
		this.update();
		this.inBounds();
	};
	I.coordinate = function(arr) {	//arr:[sx, sy, w, h]
		this.sprite.sourceX = arr[0];
		this.sprite.sourceY = arr[1];
		this.width = arr[2] || this.width;
		this.height = arr[3] || this.height;
	};
	I.animation = function(arr,frame,fn){
		var during=arr.length*frame-1;
		this.count%=during;
		this.count++;
		this.coordinate(arr[Math.floor(this.count / frame)]);
		if(this.count==during&&fn){
			fn();
		}
	}
	I.update = function() {		//for customize
		/*this.x = this.x.clamp(0, CANVAS_WIDTH - this.width);
		this.y = this.y.clamp(0, CANVAS_HEIGHT - this.height);*/
		// this.angle = Math.atan2(mouse_y + this.y, mouse_x + this.x);
	};
	I.inBounds = function(x,y) {
		//return I.x >= -100 && I.x <= CANVAS_WIDTH + 100 && I.y >= -100 && I.y <= CANVAS_HEIGHT + 100;
	};
	return I;
};
/**********expand**********/
var effect = [];
function nonentity(age, x, y, speed, angle) {
	var I = entity();
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
	var I = entity();
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
	var obstacle=entity();
	obstacle.x=x;
	obstacle.y=y;
	obstacle.OBBwidth=obstacle.width=width;
	obstacle.OBBheight=obstacle.height=height;
	obstacle.angle=angle;
	obstacles.push(obstacle);
}*/