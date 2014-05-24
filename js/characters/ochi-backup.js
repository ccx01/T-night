//Ochi 奥兹
var ochi=model();

/*************sprite***************/
ochi.sprite = sprite("characters/ochi.png", 0, 0, isReady);

ochi.name = "ochi1";
ochi.img=function(ac){
	switch(ac){
		case "walk":
			// this.coordinate([0,64,32,32]);
			this.animation([
				[0,0,32,32],
				[0,32,32,32],
				[0,64,32,32]
			],7);
		break;
		default:	//normal
			this.coordinate([0,0,32,32]);
	}
}

// animation功能还有待考量
ochi.animation = (function(){
	var count = 0;	//此处count为animation内部用，与对象的count无关，对象的count目前暂时没什么用
	return function(arr,frame,fn){
		var during=arr.length*frame-1;
		count%=during;
		count++;
		this.coordinate(arr[Math.floor(count / frame)]);
		if(count==during&&fn){
			fn();
		}
	}
}());

ochi.init = function(hp, speed, x, y, angle){
	/* 碰撞属性 */
	this.collidable = true;
	this.OBBw = 20;
	this.OBBh = 20;
	/* 碰撞属性 end */
	/* 状态属性 */
	this.movable = true;
	this.moving = false;
	/* 状态属性 end */
	this.hp = this.init_hp = hp;
	this.speed = this.init_speed = speed;
	this.x = this.dx = x;
	this.y = this.dy = y;
	this.angle = angle;
}

ochi.cmd = function(listener) { //cmd drived by the event listener, listener set by chapter
	switch(listener){
		case "walk":
			this.dy = mouse_y;
			this.dx = mouse_x;
			this.movable = true;
			this.mode = "walk";
			break;
	}
}
ochi.move = function(behavior, stop){
	if (this.movable) {
		// 移动是一种状态，非行为，贴图由发起移动的指令来决定
		// 移动状态通常伴随多种状态，所以不要再试图把贴图功能独立出去 => to Sign
		// 设计有变化，图片可以独立到外部进行控制 => to Sign
		// this.img(behavior);
		this.moving = true;

		this.angle = Math.atan2(this.dy - this.y, this.dx - this.x);
		this.vx = Math.cos(this.angle) * this.speed || 0;
		this.vy = Math.sin(this.angle) * this.speed || 0;

		if (Math.abs(this.dx - this.x) < Math.abs(this.vx) || Math.abs(this.dy - this.y) < Math.abs(this.vy)) {
			this.x = this.dx;
			this.y = this.dy;
			// moving的定义似乎有问题，中途停止的话moving无法复原
			this.moving = false;
			// 移动到目标位置结束状态
			ochi.isStoped(stop || "stay");
			// callback ? callback() : (this.mode = "stay");
		} else {
			this.x += this.vx;
			this.y += this.vy;
		}
	}
}
ochi.isStoped = function(stop, callback){
	// 临时方法
	this.moving = false;
	this.mode = stop;
	callback && callback();
}
ochi.behavior = function() {
	switch (this.mode) {
		case "walk":
			this.move("walk");
			// 技能施放时贴图可能不停的变化 => to Sign
			this.img("walk");
			break;
	}
}

/**********update**********/
ochi.update = function() {
	// this.state();
	this.behavior();
}

objs.push(ochi);
collidePool.push(ochi);