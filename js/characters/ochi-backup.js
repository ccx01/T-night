//Ochi 奥兹
var ochi=model();

/*************sprite***************/
ochi.sprite = sprite("characters/ochi.png", 0, 0, isReady);

ochi.name = "ochi";
ochi.img=function(ac){
	switch(ac){
		case "walk":
			this.coordinate([0,64,32,32]);
			/*this.animation([
				[0,0,32,32],
				[0,32,32,32],
				[0,64,32,32]
			],7);*/
		break;
		default:	//stay
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
	this.type = "character";
	/* 碰撞属性 */
	this.collidable = true;
	/* 接触属性，用来判断碰撞后的行为 */
	this.touched = false;
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
ochi.move = function(end, extra){
	if (this.movable) {
		// 特殊情况下出现的移动行为，如被对方击飞
		// 移动时的速度并非完全按本身速度进行
		extra = extra || {};
		s = extra.speed || this.speed;
		this.dx = extra.dx || this.dx;
		this.dy = extra.dy || this.dy;

		this.moving = true;

		/*移动时也许可以加个 "朝向" toward
		目前的angle不是面对的方向
		而是移动的角度
		不过似乎也没有太大的必要
		先搁置吧 => to Sign*/
		this.angle = Math.atan2(this.dy - this.y, this.dx - this.x);
		this.vx = Math.cos(this.angle) * s || 0;
		this.vy = Math.sin(this.angle) * s || 0;

		if (Math.abs(this.dx - this.x) < Math.abs(this.vx) || Math.abs(this.dy - this.y) < Math.abs(this.vy)) {
			this.x = this.dx;
			this.y = this.dy;
			// 移动到目标位置结束状态
			this.isObstructed(end || "stay");
		} else {
			this.x += this.vx;
			this.y += this.vy;
		}
	}
}
ochi.isObstructed = function(end, callback){
	// 移动停止需要独立一个功能，以此来应付其他情况(其他情况可直接调用此功能)
	this.moving = false;
	this.mode = end;
	callback && callback();
}
ochi.touchResult = function(obj){
	/*
	此函数与extra一样，将随时进行更新 
	碰撞后对方执行的效果，如击飞效果
	不同的技能有不同的效果
	*/
	switch(this.mode){
		/*
		各个状态需独立写一份碰撞事件
		若在behavior中再赋值将会出现首次无效的情况
		此处mode之后替换成对应的技能招式
		*/
		case "walk":
			if(obj.type == "character"){
				// 接触过久dx和dy的值将会进行累加，需修改 => to Sign
				// 或者弹开的速度原本就不该小于施力方
				// 仔细想想，多次施力叠加是正常现象-_____-
				var dx = obj.dx + (this.vx * 10) || 0;
				var dy = obj.dy + (this.vy * 10) || 0;
				/* 碰撞只能改变对方的mode及extra
				改变前还收到对方的buff限制
				如对方无敌状态无法被击飞 */
				obj.mode = "extra";
				obj.extra = function(){
					obj.move("stay", {
						dx: dx,
						dy: dy,
						speed: 1
					});
				}
			}
		break;
	}
}
ochi.extra = function(){/* 碰撞后的行为，由对方的touchResult控住，如被击飞 */}
ochi.behavior = function() {
	switch(this.mode){
		case "walk":
			if(this.touched){
				//不同情况下，touch事件也不相同
				this.isObstructed("stay", reaction(this));
				return;
			}
			// 技能施放时贴图可能不停的变化 => to Sign
			// 设计有变，行走无需更换图片
			// this.img("walk");
			this.move();
		break;
		case "extra":
			this.extra();
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