(function() {

	var render = function(image, sourceX, sourceY) {
		sourceX = sourceX || 0;
		sourceY = sourceY || 0;
		var I = {
			draw: function(canvas, x, y, width, height) {
				canvas.drawImage(image, sourceX, sourceY, width, height, x, y, width, height);
			},
			setSx: function(sx){
				sourceX = sx;
			},
			setSy: function(sy){
				sourceY = sy;
			},
			flash: function(rate, color) {
				color = time % rate < 10 ? color : "#f00";
				canvas.globalCompositeOperation = "source-atop";
				canvas.fillStyle = color;
				canvas.fillRect(x, y, width, height);
			},
			stroke: function(canvas, x, y, width, height) {
				//查看碰撞区域
				canvas.lineWidth = 1;
				canvas.strokeStyle = '#f00';
				canvas.strokeRect(x, y, width, height);
			}
		};
		return I;
	};

	window.sprite = function(name, sourceX, sourceY, callback) {
		var img = new Image();
			img.src = "img/" + name;
			img.onload = function() {
				callback&&callback();
			}
		return render(img, sourceX, sourceY);
	};
	
}());