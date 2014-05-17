//Ming 冥
var Ming = model();
Ming.init = { //初始化
	"hp": 5,
	"x": 520,
	"y": 320,
	"speed": 5
};
Ming.sprite = sprite("characters/Ming.png");
Ming.mode = "normal";
Ming.HP = Ming.init.hp;
Ming.x = Ming.init.x;
Ming.y = Ming.init.y;
Ming.speed = Ming.init.speed; //特定的条件下需要修改初始速度
Ming.angry = 0;
Ming.mode = "normal";

Ming.attackArea = model(); //攻击域
Ming.attackArea.width = 500;
Ming.attackArea.height = 500;

Ming.grinji = function() { //式神
	if (time - this.timer > 500) {
		this.timer = new Date().getTime();
		this.mode = "grinji";
	}
}

Ming.update = function() {
	switch (this.mode) {
		case "stiff":
			//do nothing
			break;
		case "grinji":
			if (time - this.timer < 200) {

			} else if (time - this.timer < 400) {
				object.push(
				gulinji(0.5, this.x, this.y, 20, this.angle));
				this.mode = "normal";
			}
			break;
		default:
			if (this.angry == 0) {
				this.speed = 0;
			}
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

			this.xVelocity = this.speed * Math.cos(this.angle);
			this.yVelocity = this.speed * Math.sin(this.angle);

			Ming.attackArea.x = this.x += this.xVelocity;
			Ming.attackArea.y = this.y += this.yVelocity;
	}
}

function gulinji(age, x, y, speed, angle) {
	var I = model();
	I.age = age;
	I.x = x;
	I.y = y;
	I.speed = speed;
	I.angle = angle;
	I.update = function() {
		this.xVelocity = this.speed * Math.cos(this.angle);
		this.yVelocity = this.speed * Math.sin(this.angle);
		this.x += this.xVelocity;
		this.y += this.yVelocity;
		this.age -= 1 / 60;
		if (this.age < 0) {
			this.active = false;
			object = object.filter(function(o) {
				return o.active;
			});
		}
	}

	return I;
}