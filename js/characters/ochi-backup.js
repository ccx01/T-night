//Ochi 奥兹
var ochi=model();

/*************sprite***************/
ochi.sprite = sprite("characters/ochi.png", 0, 0, ready);

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
/*ochi.animation = (function(){
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
}());*/

ochi.init = function(hp, speed, x, y, angle){
	this.type = "character";
	/* 碰撞属性 */
	this.OBBw = 20;
	this.OBBh = 20;
	this.mass = 10;
	/* 碰撞属性 end */
	/* 状态属性 */
	this.movable = true;
	this.moving = false;
	/* 状态属性 end */
	this.hp = this.init_hp = hp;
	this.speed = this.init_speed = speed;
	this.x = this.dx = x;
	this.y = this.dy = y;
	this.vx = this.vy = 0;
	this.angle = angle;
}

ochi.cmd = function(listener) { //cmd drived by the event listener, listener set by chapter
	switch(listener){
		case "walk":
			this.dy = game.mouse_y;
			this.dx = game.mouse_x;
			this.angle = this.toward = Math.atan2(this.dy - this.y, this.dx - this.x);
			this.vx = Math.cos(this.angle) * this.speed || 0;
			this.vy = Math.sin(this.angle) * this.speed || 0;
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
		this.dx = extra.dx || this.dx;
		this.dy = extra.dy || this.dy;
		this.vx = extra.vx || this.vx;
		this.vy = extra.vy || this.vy;

		this.moving = true;
		if((this.vx > 0 && this.x > this.dx) || (this.vx < 0 && this.x < this.dx) || (this.vy > 0 && this.y > this.dy) || (this.vy < 0 && this.y < this.dy)){
			// this.x = this.dx;
			// this.y = this.dy;
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
	this.vx = 0;
	this.vy = 0;
	this.moving = false;
	this.mode = end;
	callback && callback();
}
ochi.force = function(obj){
	//作用力
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
			// this.isObstructed("stay");
			if(obj.type == "character"){
				var t = 10;
				var dr = this.radius + obj.radius;
				var tx = obj.x - this.x;
				var ty = obj.y - this.y;
				var angle = Math.atan2(ty, tx);
				var cos = Math.cos(angle);
				var sin = Math.sin(angle);
				var ratio = this.mass / obj.mass;

				var vx = cos * this.speed * ratio;
				var vy = sin * this.speed * ratio;
				var dx = obj.x + vx * t;
				var dy = obj.y + vy * t;

				obj.mode = "extra";
				obj.extra = function(){
					obj.move("stay", {
						dx: dx,
						dy: dy,
						vx: vx,
						vy: vy
					});
				}
			}
		break;
	}
}
// touch 功能完全由force执行
/*ochi.touch = function(mode){
	//反作用力
	//只有可操作状态的对象才有touch属性，有待考量
	switch(mode){
		case "walk":
			this.isObstructed("stay", reaction(this));
		break;
	}
}*/
ochi.extra = function(){/* 碰撞后的行为，由对方的force控住，如被击飞 */}
ochi.behavior = function() {
	switch(this.mode){
		case "walk":
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

game.objectPool.push(ochi);
game.collidePool.push(ochi);