//Ochi 奥兹

var ochi = (function() {
	var mode = "manual",
	age = 0,
	active = true,
	timer = 0, //计时用
	count = 0, //计数用
	// state
	init_hp = 5,
	init_speed = 5,
	// changable 
	buff = [],
	hp = 5,
	speed = 2,
	// destination depend on the mouse 
	dx = 0,
	dy = 0,
	// for drawing
	flash = false,
	angle = 0,
	x = 0,
	y = 0,
	width = 32,
	height = 32,
	// for collide
	OBBwidth = 32,
	OBBheight = 32,
	//加载图片
	sprite = sprite("characters/ochi.png", 0, 0, preloading),
	//restriction
	movable = true,	//for move function
	// init set by charpter
	init = function(hp, speed, x, y, angle){
		this.hp = this.init_hp = hp;
		this.speed = this.init_speed = speed;
		this.x = this.dx = x;
		this.y = this.dy = y;
		this.angle = angle;
	},
	// common function
	draw = function() {
		canvas.save();
		canvas.translate(this.x-camera.x, this.y-camera.y);
		canvas.rotate(this.angle);
		this.sprite.draw(canvas, -this.width / 2, -this.height / 2, this.width, this.height);
		canvas.restore();
		this.update();
		this.inBounds();
	},
	//arr:[sx, sy, w, h] 图片坐标
	coordinate = function(arr) {
		this.sprite.sourceX = arr[0];
		this.sprite.sourceY = arr[1];
		this.width = arr[2] || this.width;
		this.height = arr[3] || this.height;
	},
	animation = function(arr,frame,fn){
		var during=arr.length*frame-1;
		this.count%=during;
		this.count++;
		this.coordinate(arr[Math.floor(this.count / frame)]);
		if(this.count==during&&fn){
			fn();
		}
	},
	inBounds = function(x,y) {
		return I.x >= -100 && I.x <= CANVAS_WIDTH + 100 && I.y >= -100 && I.y <= CANVAS_HEIGHT + 100;
	},
	update = function() {
		this.state();
		this.behavior();
	},
	// 状态贴图
	img = function(state){
		switch(state){
			case "walk":
				this.coordinate([0,0,32,32]);
				this.animation([
					[0,0,32,32],
					[0,32,32,32],
					[0,64,32,32]
				],7);
			break;
			case "hurtA":
				this.coordinate([95,2,32,32]);
			break;
			case "sprintA":
				this.coordinate([33,0,46,36]);
			break;
			case "sprintB":
				this.coordinate([34,36,61,30]);
			break;
			case "uppercutA":
				this.coordinate([99,0,36,35]);
			break;
			case "uppercutB":
				this.coordinate([99,35,42,43]);
			break;
			case "uppercutC":
				this.coordinate([99,80,38,37]);
			break;
			case "roundkickA":
				this.coordinate([142,10,60,64]);
			break;
			default:	//normal
				this.coordinate([0,0,32,32]);
		}
	},
	cmd = function(listener) { //cmd drived by the event listener, listener set by chapter
		switch(listener){
			case "walk":
				this.dy = mouse_y;
				this.dx = mouse_x;
				this.movable = true;
				this.mode = "walk";
			break;
		}
	},
	move = function(behavior){
		if (this.movable) {
			// 移动是一种状态，非行为，贴图由发起移动的指令来决定
			this.img(behavior);

			this.angle = Math.atan2(this.dy - this.y, this.dx - this.x);
			this.vx = Math.cos(this.angle) * this.speed || 0;
			this.vy = Math.sin(this.angle) * this.speed || 0;

			if (Math.abs(this.dx - this.x) < Math.abs(this.vx) || Math.abs(this.dy - this.y) < Math.abs(this.vy)) {
				this.x = this.dx;
				this.y = this.dy;
				this.movable = false;
			} else {
				this.x += this.vx;
				this.y += this.vy;
			}
		}
	},
	behavior = function() {
		switch (this.mode) {
			case "walk":
				this.move("walk");
				break;
		}
	},
	state = function() {
		//当前状态 buff debuff，将影响behavior
	};

	var I = {
		init: init,
		draw : draw,
		update : update
	}
	return I;

})();