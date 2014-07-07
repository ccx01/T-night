(function() {

	window.sprite = function(name, sourceX, sourceY, width, height, callback) {
		var img = new Image();
			img.src = "img/" + name;
			img.onload = function() {
				callback && callback();
				img.onload = null;
			}
		var I = {
			img: img,
			sourceX: sourceX || 0,
			sourceY: sourceY || 0,
			width: width, 
			height: height,
			draw: function(stage) {
				stage.drawImage(this.img, this.sourceX, this.sourceY, this.width, height, -this.width / 2, -this.height / 2, this.width, this.height);
			},
			set: function(arr){
				this.sourceX = arr[0];
				this.sourceY = arr[1];
				this.width = arr[2];
				this.height = arr[3];
			},
			/*flash: function(stage, rate, color) {
				color = time % rate < 10 ? color : "#f00";
				stage.globalCompositeOperation = "source-atop";
				stage.fillStyle = color;
				stage.fillRect(x, y, width, height);
			},*/
			stroke: function(stage, x, y, radius) {
				//查看碰撞区域
				stage.beginPath();
				stage.lineWidth = 1;
				stage.strokeStyle = '#f00';
				stage.arc(x, y, radius, 0, Math.PI*2); 
				stage.stroke();
			}
		};
		return I;
	};
	
}());