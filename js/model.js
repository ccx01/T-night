function model() {
	var I = {};
	I.age = 0;
	I.active = true;
	I.sprite = sprite("model.png", 0, 0);
	I.mode = "stay";
	I.x = 0;
	I.y = 0;
	I.angle = 0;
	I.width = 32;
	I.height = 32;
	I.speed = 2;
	I.OBBw = 20;
	I.OBBh = 20;
	I.OBB = function() {
		return OBB(Vector2(this.x, this.y), this.OBBw, this.OBBh, this.angle);
	};
	I.draw = function() {
		canvas.save();
		canvas.translate(this.x-camera.x, this.y-camera.y);
		canvas.rotate(this.angle);
		this.sprite.draw(canvas, -this.width / 2, -this.height / 2, this.width, this.height);
		/* OBB stroke */
		this.sprite.stroke(canvas, -this.OBBw / 2, -this.OBBh / 2, this.OBBw, this.OBBh);
		/* OBB stroke end */
		canvas.restore();
		this.update();
	};
	I.coordinate = function(arr) {
		//arr:[sx, sy, w, h]
		this.sprite.setSx(arr[0]);
		this.sprite.setSy(arr[1]);
		this.width = arr[2] || this.width;
		this.height = arr[3] || this.height;
	};
	return I;
};