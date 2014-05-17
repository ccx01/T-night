(function() {

	function render(image, sourceX, sourceY) {
		var I = {
			sourceX: sourceX || 0,
			sourceY: sourceY || 0,

			draw: function(canvas, x, y, width, height) {
				canvas.drawImage(image, this.sourceX, this.sourceY, width, height, x, y, width, height);
			},
			flash: function(rate,olor) {
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
		var path = "img/";
		var img = new Image();
		var proxy = {};

		img.onload = function() {
			var tile = render(this, sourceX, sourceY);
			$.extend(proxy, tile);

			if (callback) {
				callback(proxy);
			}
		};

		img.src = path + name;
		return proxy;
	};
	
}());