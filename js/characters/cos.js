//这个类的结构比较特殊，没有按照标准设置(因为不想修改了)
//Ming's summon 冥的召唤兽 十字架cross(cos)
var node = [],
	weak = 5,
	len = 15,
	statusef = [];
//body
for (var i = 0; i < len; i++) {
	node[i] = model();
	node[i].sprite = sprite("characters/cross.png", 60, 2);
	node[i].id = i;
	node[i].width = 30;
	node[i].height = 31;
	node[i].update = function() {
		//save the last position
		this.langle = this.angle;
		this.lx = this.x;
		this.ly = this.y;

		switch (node[0].mode) {
			case "flee":
				this.angle = node[this.id - 1].langle; //甩尾
			break;
			default:
				this.angle = Math.atan2(node[this.id - 1].ly - this.y, node[this.id - 1].lx - this.x); //蛇行
		}
		this.x = node[this.id - 1].lx - 0.9 * this.width * Math.cos(this.angle); // 0.9*this.width 风妖身体间距
		this.y = node[this.id - 1].ly - 0.9 * this.height * Math.sin(this.angle); //this width should be same with this height
	};
	node[i].coll = function(){       //被击中特效
		if(!statusef.in_array("col")){
			var col=nonmodel(300,this.x,this.y,0,this.angle);
				col.sprite=sprite("effect/effect1.png");
			var _this=col;
			col.update = function() {
				this.animation([
					[0,5,15,18],
					[18,2,36,25],
					[62,2,36,25],
					[102,2,36,25]
				],3,function(){
					effect.remove(_this);
					statusef.remove("col");
				});
			}
			effect.push(col);
			statusef.push("col");
		}
	};
	node[i].hurt = function(damage){
		node[0].shake(damage*200);
		this.coll();
	}
	collidable.push(node[i]);
}

node[weak].sprite = sprite("characters/cross.png", 103, 38);
node[weak].flash="#f90";
node[weak].flashGap=90;
node[weak].hurt = function(damage){
	if (time - node[0].timer > 500) { //防止受到连续伤害
		node[0].hurt(damage);
		node[0].shake(600);
		node[0].HP -= damage;
		node[0].angry += 1;
		$(".cos .hp div").animate({
			"width": "-=" + damage / node[0].init.HP * 100 + "%"
		});
	}
	this.coll();
}

node[len-1].sprite = sprite("characters/cross.png", 0, 0);
node[len-1].width = 52;
node[len-1].height = 35;
node[len-1].update = function() {
	this.angle = node[this.id - 1].langle; //for the spacial node (width is different with height)
	this.x = node[this.id - 1].lx - 0.3 * this.width * Math.cos(this.angle);
	this.y = node[this.id - 1].ly - 0.3 * this.height * Math.sin(this.angle);
}

//summon core
node[0].init = {
	"HP": 10,
	"x": 0,
	"y": 0,
	"angle": 0,
	"speed": 3
}

node[0].target=this;
node[0].mode = "threaten";
node[0].HP = 10;
node[0].angry = 0;
node[0].speed = 3;
node[0].x = 0;
node[0].y = 200;
node[0].sprite = sprite("characters/cross.png", 89, 0);
node[0].width = 61;
node[0].height = 35;
node[0].hurt = function(damage) {
	if (time - this.timer > 500) { //防止受到连续伤害
		// Sound.play("hit");
		//this.coordinate(node[weak],60,2);
		node[weak].sprite = sprite("characters/cross.png", 60, 2);
		node[weak].flashGap = 0;
		var temp = node[weak].hurt;
		node[weak].hurt = function(){
			node[0].shake(600);
			this.coll();
		};
		
		weak = Math.ceil(Math.random() * (len - 8)) + 5;
		node[weak].hurt = temp;
		switch (true) {
			case this.HP > 3:
				this.mode = "threaten";
			break;
			case this.HP > 0:
				this.mode = "angry";
			break;
		}
		node[0].shake(damage*200);
		this.timer = new Date().getTime();
	}
	this.coll();
}
node[0].shake = function(time) {
	this.speed = 0;
	setTimeout(function() {
		node[0].speed = node[0].init.speed;
	}, time);
}
node[0].atk = function(target){
	if (collides(node[0], target)) {
		// Sound.play("beaten");
		node[0].bite=true;
		target.bounce.speed = 10;
		target.bounce.angle = Math.atan2(target.y - node[0].y, target.x - node[0].x);
		target.bounce.timer = time;
		target.bounce.cd = 200;
		target.bounce.active = true;	//通常只有在正常行走状态下有效
		target.mode = "bounce";		//强行激活bounce状态

		node[0].angry -= 1;
		target.hurt(1);
	}	
}
node[0].update = function() {
	this.langle = this.angle;
	this.lx = this.x;
	this.ly = this.y;
	node[0].atk(node[0].target);
	switch (this.mode) {
		case "random":
			node[weak].coordinate([103, 38]);
			node[weak].flash="#f90";
			node[weak].flashGap=90;
			if (Math.random() < 0.05) {
				this.direction = Math.atan2(Math.random() * 400 - this.y, Math.random() * 700 - this.x);
			}
			if (!this.inBounds()) {
				this.angle = this.direction;
			}
			this.aVelocity = this.direction < this.angle ? -Math.PI / 60 : Math.PI / 60; // angular velocity
			this.angle = Math.abs(this.direction - this.angle) < 0.1 ? this.direction : this.angle + this.aVelocity;
		break;
		case "angry":
			node[weak].coordinate([17, 38]);
			node[weak].flash="#f00";
			node[weak].flashGap=60;
			this.angle = Math.atan2(this.target.y - this.y, this.target.x - this.x); //紧追
			this.angry -= 0.2 / 60;
		break;
		case "flee":
			this.aVelocity = this.direction < this.angle ? -Math.PI / 60 : Math.PI / 60;
			this.angle = this.angle;
		break;
		case "control":
			this.angle = Math.atan2(mouse_y - this.y, mouse_x - this.x); //鼠标操纵
		break;
		default: //"threaten"
			/* 不完全追踪 */
			node[weak].flash="#f90";
			node[weak].flashGap=90;
			node[weak].coordinate([61, 38]);
			this.angry -= 0.2 / 60;
			this.direction = Math.atan2(this.target.y - this.y, this.target.x - this.x);
			if (!this.inBounds()) {
				this.angle = this.direction;
			}
			this.aVelocity = this.direction < this.angle ? -Math.PI / 60 : Math.PI / 60;
			this.angle = Math.abs(this.direction - this.angle) < 0.1 ? this.direction : this.angle + this.aVelocity;
			/* 不完全追踪 end */
	}

	if(this.bite){
		this.animation([
			[149,0,51,48],
			[199,8,50,38]
		],10);
		setTimeout(function(){
			node[0].bite=false;
			node[0].coordinate([89,0,61,35]);
		},300);
	}    

	this.xVelocity = this.speed * Math.cos(this.angle);
	this.yVelocity = this.speed * Math.sin(this.angle);

	this.x += this.xVelocity;
	this.y += this.yVelocity;

	if (this.HP <= 0) {
		this.speed = 10;
		this.mode = "flee";
	}
}