//Ochi 奥兹
var ochi=entity();
var uni=mouseIcon();	//mouse click
ochi.areaAtk=[];	//打击域
//ochi.areaDef=[];	//受击域,模型太小，不需要受击域= =
ochi.sprite=sprite("characters/ochi.png", 0, 0, preloading);//加载图片
/*************sprite***************/
ochi.actionSprite=function(ac){
	switch(ac){
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
}
ochi.effectSprite=function(ef){
	switch(ef){
		case "hurtA":
			effect.push(nonentity(1200,ochi.x,ochi.y,0,ochi.angle));
		break;
	}
}

/**************************/
ochi.init = {
	"HP": 5,
	"x": 0,
	"y": 0,
	"angle": 0,
	"speed": 5
}
ochi.HP=5;
ochi.x=420;
ochi.y=300;
ochi.speed=5;
ochi.xVelocity=0;
ochi.yVelocity=0;
/*************************** ochi behavior (with buff) *******************************/
/*********** ochi mode(control position,angle) *********/
/******base mode*****/
ochi.stiff=function() {
	//do nothing
};
ochi.bounce={
	"active": false,
	"timer": 0,
	"speed": 5,
	"cd": 1,
	"angle": 0,
	"release":function() {
		ochi.actionSprite("normal");
		ochi.xVelocity=Math.cos(this.angle) * this.speed;
		ochi.yVelocity=Math.sin(this.angle) * this.speed;
		if (time - this.timer > this.cd) {
			ochi.normal();
			ochi.bounce.active = false;
			ochi.bounce.speed = 1;
			ochi.bounce.cd = 50;
		} else {
			ochi.x += ochi.xVelocity;
			ochi.y += ochi.yVelocity;
		}
	}
};
ochi.manual=function() { //manual  if判断，可同时输入多指令
	/* skill set*/
	if (keydown.q) {
		this.skillSet(this.sprint,"Qkey");
	}
	if (keydown.w) {
		this.skillSet(this.uppercut,"Wkey");
	}
	if (keydown.e) {
		this.skillSet(this.roundkick,"Ekey");
	}
	this.moveWorking();
};
ochi.moveWorking=function(){
	if (this.move) {
		this.actionSprite("walk");

		this.angle=Math.atan2(this.mouse_y - this.y, this.mouse_x - this.x);
		this.xVelocity=Math.cos(this.angle) * this.speed;
		this.yVelocity=Math.sin(this.angle) * this.speed;

		if (Math.abs(this.mouse_x - this.x) < Math.abs(this.xVelocity)||Math.abs(this.mouse_y - this.y) < Math.abs(this.yVelocity)) {
			this.x=this.mouse_x;
			this.y=this.mouse_y;
			this.move=false;
		} else {
			this.x += this.xVelocity;
			this.y += this.yVelocity;
		}
	}	
}
ochi.actionWorking=function() {
	if (keydown.leftClick&&this.mouse_y!=mouse_y&&this.mouse_x!=mouse_x) {
		uni=mouseIcon(500, mouse_x, mouse_y);
		sign=[];
		sign.push(uni);

		this.mouse_y=mouse_y;
		this.mouse_x=mouse_x;
		this.move=true;
	}	
	switch (this.mode) {
		case "stiff":
			this.stiff();
			break;
		case "atk":
			this.atk();
			//攻击域碰撞判定
			ochi.areaAtk.forEach(function(atk) {
				enemyPool.forEach(function(emy) {
					if (collides(emy, atk)) {
						if(ochi.skillName=="uppercut"){
							atk.hit=true;
							atk.count=0;
						}
						emy.bounce.angle = Math.atan2(emy.y - ochi.y, emy.x - ochi.x);
						emy.mode = "bounce";
						emy.hurt(ochi.damage);
					}
				});
			});			
			break;
		// case "bounce":
		// 	this.bounce.release();
		// 	break;
		default: //bounce & normal
			if(this.bounce.active){
				this.bounce.release();
			}else{
				this.manual();
			}
	}
}

/********buff with effect*******/
ochi.invincible = {
	"timer": 0,
	"cd": 1000,
	"effect": function() {
		if (time - this.timer > this.cd) {
			ochi.buff.remove("invincible");
			ochi.flash=false;
		}else{
			ochi.flash="#f00";	//"#f90":flash color
			ochi.flashGap=60;	//flash gap	-required	
		}
	}
}
ochi.buffWorking=function() {
	for (i=0; i < this.buff.length; i++) {
		if(this.buff[i] == "invincible"){
			this.invincible.effect();
		}
	}
}

/******* ochi status with buff (control hp,speed) ********/
ochi.hurt=function(damage) {
	if (!this.buff.in_array("invincible")) {
		var dp=damage / this.init.HP * 100;
		// ochi.effectSprite("hurtA");
		this.HP -= damage;
		$(".ochi .hp div").animate({
			"width": "-=" + dp + "%"
		});
		this.buff.push("invincible");
		this.invincible.timer=new Date().getTime(); //set buff timer
	}
};

/******************behavior setting*********************/
ochi.mode = "manual";
ochi.buff = [];
/***********skill set************/
ochi.skillSet=function(ski,key){
	ochi.skill=function() {
		if (time - ski.timer > ski.cd) {
			ski.timer=new Date().getTime();
			ochi.mode = "atk";
			$(".cd."+key).css("height", "75px").animate({
				"height": 0
			}, ski.cd);
			//Sound.play("atk");
		}
	};
	ochi.atk=function() {
		ski.release();
	};		
	ochi.skill();
	ochi.move=false;
}
/********* skill detail *********/
ochi.sprint = { //真空百裂碎击拳 Q
	"timer": 0,
	"cd": 1000,
	"damage": 2,
	"release": function() {
		ochi.skillName="sprint";
		ochi.damage=this.damage;
		this.trans=time-this.timer;
		switch(true){
			case this.trans<200:
				ochi.actionSprite("sprintA");
				ochi.angle=Math.atan2(mouse_y - ochi.y, mouse_x - ochi.x);
				ochi.xVelocity=Math.cos(ochi.angle) * (ochi.speed+10);
				ochi.yVelocity=Math.sin(ochi.angle) * (ochi.speed+10);				
			break;
			case this.trans<500:
				ochi.areaAtk.push(ochi);
				ochi.actionSprite("sprintB");
				ochi.x += ochi.xVelocity;
				ochi.y += ochi.yVelocity;			
			break;
			default:
				ochi.normal();
		}
	}
}
ochi.uppercut = { //adogi W
	"timer": 0,
	"cd": 3000,
	"damage": 3,
	"working":false,
	"release": function() {
		ochi.skillName="uppercut";
		ochi.damage=this.damage;
		this.trans=time-this.timer;
		ochi.xVelocity=Math.cos(ochi.angle);
		ochi.yVelocity=Math.sin(ochi.angle);
		ochi.x += ochi.xVelocity;
		ochi.y += ochi.yVelocity;
		switch(true){
			case this.trans<50:
				ochi.actionSprite("uppercutA");
				this.working=true;
			break;
			case this.trans<200:
				ochi.actionSprite("uppercutB");
				ochi.angle=Math.atan2(mouse_y - ochi.y, mouse_x - ochi.x);
				if (this.working) {
					ochi.fountain=nonentity(300,ochi.x+20*ochi.xVelocity,ochi.y+20*ochi.yVelocity,10,ochi.angle);
					// ochi.fountain.sprite=sprite("characters/ochi.png",150,85);
					ochi.fountain.update = function() {
						if(this.hit){
							var _this=this;
							this.animation([
								[247,64,30,54],
								[197,85,29,20],
								[150,85,27,20],
								[247,64,30,54]
							],3,function(){
								effect.remove(_this);
								ochi.areaAtk.remove(_this);
							});
							this.x += this.xVelocity/Math.abs(this.xVelocity);
							this.y += this.yVelocity/Math.abs(this.yVelocity);
						}else{
							this.animation([
								[150,85,27,20],
								[197,85,29,20]
							],7);
							this.x += this.xVelocity;
							this.y += this.yVelocity;
							if (time-this.timer>this.age) {
								this.active=false;
								effect=effect.filter(function(o) {
									return o.active;
								});
								ochi.areaAtk=ochi.areaAtk.filter(function(o) {
									return o.active;
								});
							}
						}	
					}
					effect.push(ochi.fountain);
					ochi.areaAtk.push(ochi.fountain);
					this.working=false;
				}
			break;
			case this.trans<300:
				ochi.actionSprite("uppercutC");		
			break;
			default:
				ochi.normal();
		}
	}
}
ochi.roundkick = { //zaizaibologi E
	"timer": 0,
	"cd": 2000,
	"damage": 1,
	"release": function() {
		ochi.skillName="roundkick";
		ochi.damage=this.damage;
		this.trans=time-this.timer;
		switch(true){
			case this.trans<1000:
				ochi.areaAtk.push(ochi);
				ochi.actionSprite("roundkickA");
				ochi.angle+=0.5;			
			break;
			default:
				ochi.normal();
		}

		ochi.tmpangle=Math.atan2(mouse_y - ochi.y, mouse_x - ochi.x);
		ochi.xVelocity=Math.cos(ochi.tmpangle) * ochi.speed;
		ochi.yVelocity=Math.sin(ochi.tmpangle) * ochi.speed;

		ochi.x += ochi.xVelocity;
		ochi.y += ochi.yVelocity;

	}
}
ochi.normal=function(){
	this.skillName="";
	this.damage=0;
	this.areaAtk=[];
	this.actionSprite("normal");
	this.mode = "manual";
	this.move=false;
	this.mouse_x=this.x;
	this.mouse_y=this.y;
}
/**********update**********/
ochi.update=function() {
	this.buffWorking();
	this.actionWorking();
};
/*******具有碰撞属性*******/
collidable.push(ochi);