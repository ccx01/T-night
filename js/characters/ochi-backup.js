//Ochi 奥兹
var ochi=entity();
var uni=mouseIcon();	//mouse click
ochi.areaAtk=[];	//打击域
//ochi.areaDef=[];	//受击域,模型太小，不需要受击域= =
ochi.sprite=sprite("characters/ochi.png", 0, 0, preloading);//加载图片
/*************sprite***************/
ochi.img=function(ac){
	switch(ac){
		case "walk":
			this.coordinate([0,0,32,32]);
			this.animation.run([
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
}

//arr:[sx, sy, w, h] 图片坐标
ochi.coordinate = function(arr) {
	this.sprite.sourceX = arr[0];
	this.sprite.sourceY = arr[1];
	this.width = arr[2] || this.width;
	this.height = arr[3] || this.height;
}
var count = 0;
/*ochi.animation = function(arr,frame,fn){
	var during=arr.length*frame-1;
	count%=during;
	count++;
	this.coordinate(arr[Math.floor(count / frame)]);
	if(count==during&&fn){
		fn();
	}
}*/
ochi.animation = {
	count: 0,
	last_time: new Date().getTime(),
	run: function(arr,frame,fn){
		var during=arr.length*frame-1;
		count%=during;
		count++;
		ochi.coordinate(arr[Math.floor(count / frame)]);
		if(count==during&&fn){
			fn();
		}
		/*console.log(new Date().getTime()-this.last_time)
		if(new Date().getTime()-this.last_time>frame){
			var during = arr.length-1;
			this.count %= during;
			this.count++;
			if(count==during&&fn){
				fn();
			}
			// alert(this.count)
			ochi.coordinate(arr[this.count]);
			this.last_time = new Date().getTime();
		}*/
		/*var during=arr.length*frame-1;
		clearTimeout(this.last_time);
		this.last_time = setTimeout(function(){
			this.count%=during;
			this.count++;
			ochi.coordinate(arr[Math.floor(count / frame)]);
			ochi.animation.a(arr,frame,fn);
		},16);*/
	}
}

ochi.init = function(hp, speed, x, y, angle){
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
ochi.move = function(behavior){
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
}
ochi.behavior = function() {
	switch (this.mode) {
		case "walk":
			this.move("walk");
			break;
	}
}

/**********update**********/
ochi.update = function() {
	// this.state();
	this.behavior();
}
/*******具有碰撞属性*******/
collidable.push(ochi);