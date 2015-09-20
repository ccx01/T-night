(function() {
	var loaded = 0;
	var total = 0;

	var sprite = function(cfg, callback) {
		total++;
		var img = new Image();
			img.src = "img/" + cfg.name;
			img.onload = function() {
				loaded++;
				callback && callback(loaded, total);
				img.onload = null;
			}
		var I = {
			img: img,
			sourceX: cfg.sourceX || 0,
			sourceY: cfg.sourceY || 0,
			width: cfg.width, 
			height: cfg.height,
			time: 0,
			cur: 0,		//当前帧，用于动画效果
			stage: cfg.stage || game.stage,
			draw: function() {
				this.stage.drawImage(this.img, this.sourceX, this.sourceY, this.width, this.height, -this.width / 2, -this.height / 2, this.width, this.height);
			},
			set: function(arr) {
				this.sourceX = arr[0];
				this.sourceY = arr[1];
				this.width = arr[2];
				this.height = arr[3];
			},
			frame: function(arr, t) {
				//帧动画
				if(game.time - this.time > t){
					this.cur = this.cur < arr.length - 1 ? this.cur + 1 : 0;
					this.time = game.time;
					this.set(arr[this.cur]);
				}
			},
			flash: function(cfg) {
				if(game.time % (cfg.t * 2) > cfg.t){
					this.time = game.time;
					this.stage.globalCompositeOperation = "source-atop";
					this.stage.fillStyle = cfg.color;
					this.stage.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
				}
			},
			stroke: function(x, y, radius) {
				//查看碰撞区域
				this.stage.beginPath();
				this.stage.lineWidth = 1;
				this.stage.strokeStyle = '#f00';
				this.stage.arc(x, y, radius, 0, Math.PI*2); 
				this.stage.stroke();
			}
		}
		return I;
	};

	module.add("sprite", sprite);
	
}());