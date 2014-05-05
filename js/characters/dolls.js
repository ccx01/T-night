//特别角色
var dolls=entity();
dolls.sprite=sprite("characters/dolls.png");
dolls.init = {
	"HP": 10,
	"x": 0,
	"y": 0,
	"angle": 0,
	"speed": 5
}
dolls.HP=5;
dolls.x=820;
dolls.y=300;

dolls.bounce={
	"timer": 0,
	"speed": 6,
	"cd": 100,
	"angle":0,
	"release":function() {
		if (time - this.timer > this.cd) {
			dolls.mode="static";
        	dolls.coll();
			this.timer = new Date().getTime();
		}
		dolls.xVelocity=Math.cos(this.angle) * this.speed;
		dolls.yVelocity=Math.sin(this.angle) * this.speed;
		dolls.x += dolls.xVelocity;
		dolls.y += dolls.yVelocity;
	}
};
dolls.coll =function(){
	var col=nonentity(300,this.x,this.y,0,this.angle);
	col.sprite=sprite("effect/effect1.png");
	col.update = function() {
		this.animation([
			[0,5,15,18],
			[18,2,36,25],
			[62,2,36,25],
			[102,2,36,25]
			],5,function(){
			effect.remove(col);
		});
	}
	effect.push(col);
}
dolls.hurt = function(damage) {
    if (time - this.timer > 1000) { //防止受到连续伤害
    	var dp=damage / this.init.HP * 100;
        this.HP -= damage;
        $(".dolls .hp div").animate({
            "width": "-=" + dp + "%"
        });
        this.timer = new Date().getTime();
    }
}

dolls.update=function(){
	switch (this.mode) {
		case "bounce":
			this.bounce.release();
			break;
		default:
	}
	this.x = this.x.clamp(100, 900);
	this.y = this.y.clamp(100, 500);
}
collidable.push(dolls);