//Ochi 奥兹

var ochi = {
	mode: "manual",
	age: 0,
	active: true,
	timer: 0, //计时用
	count: 0, //计数用
	// state
	init_hp: 5,
	init_speed: 5,
	// changable 
	buff: [],
	hp: 5,
	speed: 2,
	// for drawing
	flash: false,
	angle: 0,
	x: 0,
	y: 0,
	width: 32,
	height: 32,
	// for collide
	OBBwidth: 32,
	OBBheight: 32,
	//加载图片
	sprite: sprite("characters/ochi.png", 0, 0, preloading),
	//restriction
	movable: true,	//for move function
	// init set by charpter
	init: function(hp, speed, x, y, angle){
		this.hp = this.init_hp = hp;
		this.speed = this.init_speed = speed;
		this.x = this.mouse_x = x;
		this.y = this.mouse_y = y;
		this.angle = angle;
	},
	// common function
	draw: function() {
		canvas.save();
		canvas.translate(this.x-camera.x, this.y-camera.y);
		canvas.rotate(this.angle);
		this.sprite.draw(canvas, -this.width / 2, -this.height / 2, this.width, this.height);
		canvas.restore();
		this.update();
		this.inBounds();
	},
	//arr:[sx, sy, w, h] 图片坐标
	coordinate: function(arr) {
		this.sprite.sourceX = arr[0];
		this.sprite.sourceY = arr[1];
		this.width = arr[2] || this.width;
		this.height = arr[3] || this.height;
	},
	animation: function(arr,frame,fn){
		var during=arr.length*frame-1;
		this.count%=during;
		this.count++;
		this.coordinate(arr[Math.floor(this.count / frame)]);
		if(this.count==during&&fn){
			fn();
		}
	},
	inBounds: function(x,y) {
		//return I.x >= -100 && I.x <= CANVAS_WIDTH + 100 && I.y >= -100 && I.y <= CANVAS_HEIGHT + 100;
	},
	update: function() {
		this.buffWorking();
		this.actionWorking();
	},
	// 状态贴图
	actionSprite: function(ac){
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
	},
	effectSprite: function(ef){
		switch(ef){
			case "hurtA":
				effect.push(nonentity(1200,this.x,this.y,0,this.angle));
			break;
		}
	},
	// 特殊状态
	stiff: function() {
		//do nothing
	},
	bounce: {
		"active": false,
		"timer": 0,
		"speed": 5,
		"cd": 1,
		"angle": 0,
		"release":function() {
			this.actionSprite("normal");
			this.vx=Math.cos(this.angle) * this.speed;
			this.vy=Math.sin(this.angle) * this.speed;
			if (time - this.timer > this.cd) {
				this.normal();
				this.bounce.active = false;
				this.bounce.speed = 1;
				this.bounce.cd = 50;
			} else {
				this.x += this.vx;
				this.y += this.vy;
			}
		}
	},
	manual: function() { //manual  if判断，可同时输入多指令
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
		this.move();
	},
	move: function(){
		if (this.movable) {
			this.actionSprite("walk");

			this.angle=Math.atan2(this.mouse_y - this.y, this.mouse_x - this.x);
			this.vx=Math.cos(this.angle) * this.speed || 0;
			this.vy=Math.sin(this.angle) * this.speed || 0;

			if (Math.abs(this.mouse_x - this.x) < Math.abs(this.vx)||Math.abs(this.mouse_y - this.y) < Math.abs(this.vy)) {
				this.x=this.mouse_x;
				this.y=this.mouse_y;
				this.movable=false;
			} else {
				this.x += this.vx;
				this.y += this.vy;
			}
		}	
	},
	actionWorking: function() {
		if (keydown.leftClick&&this.mouse_y!=mouse_y&&this.mouse_x!=mouse_x) {
			uni=mouseIcon(500, mouse_x, mouse_y);
			sign=[];
			sign.push(uni);

			this.mouse_y=mouse_y;
			this.mouse_x=mouse_x;
			this.movable=true;
		}	
		switch (this.mode) {
			case "stiff":
				this.stiff();
				break;
			case "atk":
				this.atk();
				//攻击域碰撞判定
				this.areaAtk.forEach(function(atk) {
					enemyPool.forEach(function(emy) {
						if (collides(emy, atk)) {
							if(this.skillName=="uppercut"){
								atk.hit=true;
								atk.count=0;
							}
							emy.bounce.angle = Math.atan2(emy.y - this.y, emy.x - this.x);
							emy.mode = "bounce";
							emy.hurt(this.damage);
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
	},
	invincible: {
		"timer": 0,
		"cd": 1000,
		"effect": function() {
			if (time - this.timer > this.cd) {
				this.buff.remove("invincible");
				this.flash=false;
			}else{
				this.flash="#f00";	//"#f90":flash color
				this.flashGap=60;	//flash gap	-required	
			}
		}
	},
	buffWorking: function() {
		for (i=0; i < this.buff.length; i++) {
			if(this.buff[i] == "invincible"){
				this.invincible.effect();
			}
		}
	},
	hurt: function(damage) {
		if (!this.buff.in_array("invincible")) {
			var dp=damage / this.init.HP * 100;
			// this.effectSprite("hurtA");
			this.HP -= damage;
			$(".this .hp div").animate({
				"width": "-=" + dp + "%"
			});
			this.buff.push("invincible");
			this.invincible.timer=new Date().getTime(); //set buff timer
		}
	},
	skillSet: function(ski,key){
		this.skill=function() {
			if (time - ski.timer > ski.cd) {
				ski.timer=new Date().getTime();
				this.mode = "atk";
				$(".cd."+key).css("height", "75px").animate({
					"height": 0
				}, ski.cd);
				//Sound.play("atk");
			}
		};
		this.atk=function() {
			ski.release();
		};		
		this.skill();
		this.movable=false;
	},
	sprint: { //真空百裂碎击拳 Q
		"timer": 0,
		"cd": 1000,
		"damage": 2,
		"release": function() {
			this.skillName="sprint";
			this.damage=this.damage;
			this.trans=time-this.timer;
			switch(true){
				case this.trans<200:
					this.actionSprite("sprintA");
					this.angle=Math.atan2(mouse_y - this.y, mouse_x - this.x);
					this.vx=Math.cos(this.angle) * (this.speed+10);
					this.vy=Math.sin(this.angle) * (this.speed+10);				
				break;
				case this.trans<500:
					this.areaAtk.push(this);
					this.actionSprite("sprintB");
					this.x += this.vx;
					this.y += this.vy;			
				break;
				default:
					this.normal();
			}
		}
	},
	uppercut: { //adogi W
		"timer": 0,
		"cd": 3000,
		"damage": 3,
		"working":false,
		"release": function() {
			this.skillName="uppercut";
			this.damage=this.damage;
			this.trans=time-this.timer;
			this.vx=Math.cos(this.angle);
			this.vy=Math.sin(this.angle);
			this.x += this.vx;
			this.y += this.vy;
			switch(true){
				case this.trans<50:
					this.actionSprite("uppercutA");
					this.working=true;
				break;
				case this.trans<200:
					this.actionSprite("uppercutB");
					this.angle=Math.atan2(mouse_y - this.y, mouse_x - this.x);
					if (this.working) {
						this.fountain=nonentity(300,this.x+20*this.vx,this.y+20*this.vy,10,this.angle);
						// this.fountain.sprite=sprite("characters/this.png",150,85);
						this.fountain.update = function() {
							if(this.hit){
								var _this=this;
								this.animation([
									[247,64,30,54],
									[197,85,29,20],
									[150,85,27,20],
									[247,64,30,54]
								],3,function(){
									effect.remove(_this);
									this.areaAtk.remove(_this);
								});
								this.x += this.vx/Math.abs(this.vx);
								this.y += this.vy/Math.abs(this.vy);
							}else{
								this.animation([
									[150,85,27,20],
									[197,85,29,20]
								],7);
								this.x += this.vx;
								this.y += this.vy;
								if (time-this.timer>this.age) {
									this.active=false;
									effect=effect.filter(function(o) {
										return o.active;
									});
									this.areaAtk=this.areaAtk.filter(function(o) {
										return o.active;
									});
								}
							}	
						}
						effect.push(this.fountain);
						this.areaAtk.push(this.fountain);
						this.working=false;
					}
				break;
				case this.trans<300:
					this.actionSprite("uppercutC");		
				break;
				default:
					this.normal();
			}
		}
	},
	roundkick: { //zaizaibologi E
		"timer": 0,
		"cd": 2000,
		"damage": 1,
		"release": function() {
			this.skillName="roundkick";
			this.damage=this.damage;
			this.trans=time-this.timer;
			switch(true){
				case this.trans<1000:
					this.areaAtk.push(this);
					this.actionSprite("roundkickA");
					this.angle+=0.5;			
				break;
				default:
					this.normal();
			}

			this.tmpangle=Math.atan2(mouse_y - this.y, mouse_x - this.x);
			this.vx=Math.cos(this.tmpangle) * this.speed;
			this.vy=Math.sin(this.tmpangle) * this.speed;

			this.x += this.vx;
			this.y += this.vy;

		}
	},
	normal: function(){
		this.skillName="";
		this.damage=0;
		this.areaAtk=[];
		this.actionSprite("normal");
		this.mode = "manual";
		this.movable=false;
		this.mouse_x=this.x;
		this.mouse_y=this.y;
	}

}

var uni=mouseIcon();	//mouse click
ochi.areaAtk=[];	//打击域
//ochi.areaDef=[];	//受击域,模型太小，不需要受击域=
// ochi.sprite=sprite("characters/ochi.png", 0, 0, preloading);//加载图片

/*******具有碰撞属性*******/
collidable.push(ochi);