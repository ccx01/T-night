//鼠标点击效果
var mark = model();

mark.sprite = sprite("ui/mark.png", 0, 0, ready);

mark.update = function() {
	if (game.time - this.time > this.age) {
		this.active = false;
	}
}

mark.add = function(age, x, y, time, width, height){
	this.active = true;
	this.name = "mark";
	this.age = age || 0;
	this.x = x || 0;
	this.y = y || 0;
	this.time = game.time || 0;
	this.width = width || 20;
	this.height = height || 20;
	game.objectPool.push(this);
	console.log(game.objectPool.length);
}
