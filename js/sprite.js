(function() {

	window.sprite = function(name, sourceX, sourceY, width, height, callback) {
		var img = new Image();
			img.src = "img/" + name;
			img.onload = function() {
				callback&&callback();
			}
		var I = {
			img: img,
			sourceX: sourceX || 0,
			sourceY: sourceY || 0,
			width: width, 
			height: height,
			draw: function(canvas) {
				canvas.drawImage(this.img, this.sourceX, this.sourceY, this.width, height, -this.width / 2, -this.height / 2, this.width, this.height);
			},
			set: function(arr){
				//数组与变量 || 的时候似乎优先选择变量，现在脑袋浆糊中
				//看清楚，是因为0，脑袋真的有浆糊 =>Sign
				this.sourceX = arr[0];
				this.sourceY = arr[1];
				this.width = arr[2];
				this.height = arr[3];
			},
			/*flash: function(canvas, rate, color) {
				color = time % rate < 10 ? color : "#f00";
				canvas.globalCompositeOperation = "source-atop";
				canvas.fillStyle = color;
				canvas.fillRect(x, y, width, height);
			},*/
			stroke: function(canvas, x, y, radius) {
				//查看碰撞区域
				canvas.beginPath();
				canvas.lineWidth = 1;
				canvas.strokeStyle = '#f00';
				canvas.arc(x, y, radius, 0, Math.PI*2); 
				canvas.stroke();
			}
		};
		return I;
	};
	
}());