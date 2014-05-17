//Ochi 奥兹

var ochi = (function(sprite) {
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
	init = function(ihp, ispeed, ix, iy, iangle){
		hp = init_hp = ihp;
		speed = init_speed = ispeed;
		x = dx = ix;
		y = dy = iy;
		angle = iangle;
	},
	// common function
	draw = function() {
		canvas.save();
		canvas.translate(x-camera.x, y-camera.y);
		canvas.rotate(angle);
		sprite.draw(canvas, -width / 2, -height / 2, width, height);
		canvas.restore();
		update();
		inBounds();
	},
	//arr:[sx, sy, w, h] 图片坐标
	coordinate = function(arr) {
		sprite.sourceX = arr[0];
		sprite.sourceY = arr[1];
		width = arr[2] || width;
		height = arr[3] || height;
	},
	animation = function(arr,frame,fn){
		var during=arr.length*frame-1;
		count%=during;
		count++;
		coordinate(arr[Math.floor(count / frame)]);
		if(count==during&&fn){
			fn();
		}
	},
	inBounds = function(x,y) {
		return I.x >= -100 && I.x <= CANVAS_WIDTH + 100 && I.y >= -100 && I.y <= CANVAS_HEIGHT + 100;
	},
	update = function() {
		state();
		behavior();
	},
	// 状态贴图
	img = function(state){
		switch(state){
			case "walk":
				coordinate([0,0,32,32]);
				animation([
					[0,0,32,32],
					[0,32,32,32],
					[0,64,32,32]
				],7);
			break;
			case "hurtA":
				coordinate([95,2,32,32]);
			break;
			case "sprintA":
				coordinate([33,0,46,36]);
			break;
			case "sprintB":
				coordinate([34,36,61,30]);
			break;
			case "uppercutA":
				coordinate([99,0,36,35]);
			break;
			case "uppercutB":
				coordinate([99,35,42,43]);
			break;
			case "uppercutC":
				coordinate([99,80,38,37]);
			break;
			case "roundkickA":
				coordinate([142,10,60,64]);
			break;
			default:	//normal
				coordinate([0,0,32,32]);
		}
	},
	cmd = function(listener) { //cmd drived by the event listener, listener set by chapter
		switch(listener){
			case "walk":
				dy = mouse_y;
				dx = mouse_x;
				movable = true;
				mode = "walk";
			break;
		}
	},
	move = function(behavior){
		if (movable) {
			// 移动是一种状态，非行为，贴图由发起移动的指令来决定
			img(behavior);

			angle = Math.atan2(dy - y, dx - x);
			vx = Math.cos(angle) * speed || 0;
			vy = Math.sin(angle) * speed || 0;

			if (Math.abs(dx - x) < Math.abs(vx) || Math.abs(dy - y) < Math.abs(vy)) {
				x = dx;
				y = dy;
				movable = false;
			} else {
				x += vx;
				y += vy;
			}
		}
	},
	behavior = function() {
		switch (mode) {
			case "walk":
				move("walk");
				break;
		}
	},
	state = function() {
		//当前状态 buff debuff，将影响behavior
	};

	var I = {
		mode: mode,
		age: age,
		active: active,
		timer: timer, //计时用
		count: count, //计数用
		// state
		init_hp: init_hp,
		init_speed: init_speed,
		// changable 
		buff: buff,
		hp: hp,
		speed: speed,
		// destination depend on the mouse 
		dx: dx,
		dy: dy,
		// for drawing
		flash: flash,
		angle: angle,
		x: x,
		y: y,
		width: width,
		height: height,
		// for collide
		OBBwidth: OBBwidth,
		OBBheight: OBBheight,
		//加载图片
		sprite: sprite,
		//restriction
		movable: movable,	//for move function
		init: init,
		cmd: cmd,
		draw : draw,
		update : update
	}
	return I;

}(sprite));