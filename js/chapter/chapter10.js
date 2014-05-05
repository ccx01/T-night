/* preload images and audio */
var resource = [
	['characters/ochi', 'characters/cross'],
	['atk', 'beaten', 'hit']
];

/* dialog */
var dialog = {
	'begin': [{
		'avatar': 'ming.png',
		'position': '.right',
		'words': '<img src="images/ui/tipLc.png" / >X1 = 攻击！<br><img src="images/ui/tipRc.png" / >X1 = 移动！'
	}, {
		'words': '如果浏览器安装了鼠标手势之类的扩展，可以<img src="images/ui/tipRc.png" / >X2 = 移动！'
	}, {
		'words': '<div class="start" onclick="start();">start</div>'
	}],
	'win': [{
		'avatar': 'ming.png',
		'position': '.right',
		'words': 'aoaoaoaoaoaoao！'
	}, {
		'avatar': 'ming.png',
		'position': '.left',
		'words': '混蛋！居然敢偷袭我！<div class="start" onclick="menu();">next</div>'
	}],
	'lost': [{
		'avatar': 'ming.png',
		'position': '.right',
		'words': 'oaoaoaoaoaoaoao5↓oaoaoaoaoaoaoao！<div class="start" onclick="menu();">restart</div>'
	}]
};

handleCollisions = function() {

	node.forEach(function(enemy) {
		if (collides(enemy, ochi)) {
			if (ochi.mode != "atk") {
				ochi.explode(enemy.x, enemy.y);
			}
		}
	});

	if (collides(node[weak], ochi)) {
		if (ochi.mode == "atk") {

			animation(ochi, 37, 65, 57, 29);
			node[0].hit();

		}
	}

	if (collides(node[0], ochi)) {
		if (!ochi.buff.in_array("invincible")) {
			Sound.play("beaten");
			node[0].angry -= 1;
			ochi.HP -= 1;
			ochi.hurt(node[0].x, node[0].y);
		}
	}

}

//Ochi 奥兹
var ochi = entity();
object.push(ochi);
ochi.sprite = sprite("characters/ochi",0,0);
ochi.mode = "manual"; //行为，主要控制移动 跳跃 反弹 恐惧后乱动 硬直
ochi.HP = 5;
ochi.x = 520;
ochi.y = 320;
ochi.speed = 3;
ochi.skill = function() {
	if (time - this.timer > 1000) { //1000:cd
		this.timer = new Date().getTime();
		this.mode = "atk";
		$(".cd").css("height", "75px").animate({
			"height": 0
		}, 1000);
		Sound.play("atk");
	}
};
ochi.update = function() {
	switch (this.mode) {
		case "stiff":
			//do nothing
			break;
		case "atk":
			if (time - this.timer < 200) {

				animation(this, 33, 0, 46, 36);

				//this.speed=30;
				this.angle = Math.atan2(mouse_y - this.y, mouse_x - this.x);
				this.xVelocity = Math.cos(this.angle) * (this.speed + 10);
				this.yVelocity = Math.sin(this.angle) * (this.speed + 10);
			} else if (time - this.timer < 400) {

				animation(this, 34, 36, 61, 30);

				this.x += this.xVelocity;
				this.y += this.yVelocity;
			} else {
				animation(this, 0, 0, 32, 32);

				// this.speed=this.initSpeed;
				this.mode = "manual";
			}
			break;
		case "bounce":
			this.angle = Math.atan2(this.mouse_y - this.y, this.mouse_x - this.x);
			this.xVelocity = Math.cos(this.angle) * (this.speed + 5);
			this.yVelocity = Math.sin(this.angle) * (this.speed + 5);
			if (time - this.timer > 200) {
				// this.speed=this.initSpeed;
				this.x = this.mouse_x;
				this.y = this.mouse_y;
				this.mode = "manual";
			} else {
				this.x += this.xVelocity;
				this.y += this.yVelocity;
			}
			break;
		default:
			//manual  if判断，可同时输入多指令

			animation(this, 0, 0, 32, 32);

			if (keydown.leftClick) {
				this.skill();
				this.move = false;
			}

			if (keydown.rightClick) {
				this.mouse_y = mouse_y;
				this.mouse_x = mouse_x;
				this.move = true;
			}
			if (this.move) {
				if (this.count == 8) this.count = 0;
				this.count++;
				this.sprite.sourceY = this.height * Math.floor(this.count / 3);

				this.angle = Math.atan2(this.mouse_y - this.y, this.mouse_x - this.x);
				this.xVelocity = Math.cos(this.angle) * this.speed;
				this.yVelocity = Math.sin(this.angle) * this.speed;

				if (Math.abs(this.mouse_x - this.x) < Math.abs(this.xVelocity)) {
					// this.speed=this.initSpeed;
					this.x = this.mouse_x;
					this.y = this.mouse_y;
					this.move = false;
				} else {
					this.x += this.xVelocity;
					this.y += this.yVelocity;
				}
			}
	}
	if (this.HP <= 0) {
		stop();
		words(dialog["win"]);
	}

	this.x = this.x.clamp(0, CANVAS_WIDTH - this.width);
	this.y = this.y.clamp(0, CANVAS_HEIGHT - this.height);
	this.angle = Math.atan2(mouse_y - this.y, mouse_x - this.x);

};
ochi.explode = function(x, y) {
	// this.speed=10;
	this.mouse_x = this.x * 2 - x; //this.x-(x-this.x)
	this.mouse_y = this.y * 2 - y;
	this.mode = "bounce";
	this.timer = new Date().getTime();
};
ochi.hurt = function(x, y) {

	animation(this, 95, 2, 32, 32);

	$(".hp div").animate({
		"width": "-=20%"
	});

	// this.speed=20;
	this.mouse_x = this.x * 3 - x * 2; //this.x-(x-this.x)
	this.mouse_y = this.y * 3 - y * 2;
	this.mode = "bounce";
	this.timer = new Date().getTime();
	ochi.buff.push("invincible"); //防止受到连续伤害
	setTimeout(function() {
		ochi.buff.remove("invincible");
	}, 1000);
};

//monster
var node = [],
	weak = 3,
	len = 12;
//Ming's summon 冥的召唤兽 风氏
//body
for (var i = 0; i < len; i++) {
	node[i] = entity();
	object.push(node[i]);

	node[i].sprite = sprite("characters/cross", 60, 2);
	node[i].id = i;
	node[i].width = 30;
	node[i].height = 31;
	node[i].update = function() {
		//save the last position
		this.langle = this.angle;
		this.lx = this.x;
		this.ly = this.y;

		switch (node[0].mode) {
			case "swing":
				this.angle = node[this.id - 1].langle; //甩尾
				break;
			default:
				this.angle = Math.atan2(node[this.id - 1].ly - this.y, node[this.id - 1].lx - this.x); //蛇行
		}
		this.x = node[this.id - 1].lx - 0.9 * this.width * Math.cos(this.angle); // 0.9*this.width 风妖身体间距
		this.y = node[this.id - 1].ly - 0.9 * this.height * Math.sin(this.angle); //this width should be same with this height
	};
}

node[weak].sprite = sprite("characters/cross", 103, 38);; //17,61,103

node[len - 1].sprite = sprite("characters/cross", 0, 0);
node[len - 1].width = 52;
node[len - 1].height = 35;
node[len - 1].update = function() {
	this.angle = node[this.id - 1].langle; //for the spacial node (width is different with height)
	this.x = node[this.id - 1].lx - 0.3 * this.width * Math.cos(this.angle);
	this.y = node[this.id - 1].ly - 0.3 * this.height * Math.sin(this.angle);
}

//summon core
node[0].mode = "random";
node[0].HP = 1;
node[0].angry = 0;
node[0].speed = 3;
node[0].x = 0;
node[0].y = 200;
node[0].sprite = sprite("characters/cross", 89, 0);
node[0].width = 61;
node[0].height = 35;
node[0].hit = function() {

	if (time - this.timer > 500) { //防止受到连续伤害
		Sound.play("hit");
		animation(node[weak], 60, 2);
		this.HP -= 1;
		this.angry += 1;
		weak = Math.ceil(Math.random() * (len - 5)) + 2;
		switch (true) {
			case this.HP > 3:
				this.mode = "panic";
				break;
			case this.HP > 0:
				this.mode = "angry";
				break;
		}

		node[0].speed = 0;
		setTimeout(function() {
			node[0].speed = 3;
		}, 200);
		this.timer = new Date().getTime();
	}

}
node[0].update = function() {
	this.langle = this.angle;
	this.lx = this.x;
	this.ly = this.y;

	if (this.angry < 0) {
		this.angry = 0;
		this.mode = "random";
	}

	switch (this.mode) {
		case "random":
			animation(node[weak], 103, 38);
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
			animation(node[weak], 17, 38);
			this.angle = Math.atan2(ochi.y - this.y, ochi.x - this.x); //紧追
			this.angry -= 0.2 / fps;
			break;
		case "flee":
			this.aVelocity = this.direction < this.angle ? -Math.PI / 60 : Math.PI / 60;
			this.angle += this.aVelocity;
			break;
		case "control":
			this.angle = Math.atan2(mouse_y - this.y, mouse_x - this.x); //鼠标操纵
			break;
		default:
			//"panic"
			/* 不完全追踪 */
			animation(node[weak], 61, 38);
			this.angry -= 0.2 / fps;
			this.direction = Math.atan2(ochi.y - this.y, ochi.x - this.x);
			if (!this.inBounds()) {
				this.angle = this.direction;
			}

			if (Math.abs(this.direction - this.angle) > Math.PI) { //防止死循环
				if (this.direction > this.angle) this.aVelocity = -Math.PI / 60;
				else this.aVelocity = Math.PI / 60;
			} else {
				if (this.direction < this.angle) this.aVelocity = -Math.PI / 60;
				else this.aVelocity = Math.PI / 60;
			}
			this.angle = this.angle > Math.PI ? this.angle - Math.PI * 2 : this.angle;
			this.angle = this.angle < -Math.PI ? this.angle + Math.PI * 2 : this.angle;

			this.angle = Math.abs(this.direction - this.angle) < 0.1 ? this.direction : this.angle + this.aVelocity;
			/* 不完全追踪 end */
	}

	this.xVelocity = this.speed * Math.cos(this.angle);
	this.yVelocity = this.speed * Math.sin(this.angle);

	this.x += this.xVelocity;
	this.y += this.yVelocity;

	if (this.HP <= 0) {

		this.speed = 5;
		this.mode = "flee";
		if (!node[len - 1].inBounds()) {
			stop();
			words(dialog["win"]);
		}
	}
}