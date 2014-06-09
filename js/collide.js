/* collision detection */
var collide = {
	box_size: 50,
	boxes: [],
	init: function () {
		//划分区域
		var i, j, k;
		var pos;
		var box_x = game.map.w / this.box_size;
		var box_y = game.map.h / this.box_size;
		for(i = 0; i <= box_x; i++) {
			this.boxes[i] = [];
			for(j = 0; j <= box_y; j++){
				this.boxes[i][j] = [];
			}
		}

		var col_len = game.collidePool.length;
		for(k = 0; k < col_len; k++) {
			pos = this.getBoxPos(game.collidePool[k]);
			if(!this.boxes[pos.x][pos.y]) console.log(pos,game.collidePool[k],this.boxes[pos.x],this.boxes[pos.x][pos.y])
			this.boxes[pos.x][pos.y].push(game.collidePool[k]);
		}
	},
	getBoxPos: function(obj) {
		var ox, oy;
		ox = obj.x / this.box_size | 0;
		oy = obj.y / this.box_size | 0;
		return {x: ox, y: oy};
	},
	detect: function(a, b) {
		var dx = a.x - b.x + a.vx + b.vx;
		var dy = a.y - b.y + a.vy + b.vy;
		var dr = a.radius + b.radius;
		if (dy * dy + dx * dx < dr * dr) {
			this.touch(a, b);
		}
	},
	touch: function(a, b) {
		// avoid of stick together
		var dr = a.radius + b.radius;
		var dx = b.x - a.x;
		var dy = b.y - a.y;
		var angle = Math.atan2(dy, dx);
		a.dx = b.x - Math.cos(angle) * dr;
		a.dy = b.y - Math.sin(angle) * dr;
	},
	checkOneBox: function (x, y) {
		//同一区域进行监测
		var area = this.boxes[x][y];
		var a, b;
		var i;
		var len = area.length;
		for(i = 0; i < len; i++) {
			a = area[i];
			for(var j = i+1; j < area.length; j++) {
				b = area[j];
				(a.moving || b.moving) && this.detect(a, b);
			}
		}
	},
	checkTwoBoxes: function (x1, y1, x2, y2) {
		var areaA, areaB, a, b;
		if(!this.boxes[x2] || !this.boxes[x2][y2] || x2 > this.boxes.length || y2 > this.boxes[x2].length) {
			//判断右下的格子是否不存在
			return;
		}
		areaA = this.boxes[x1][y1];
		areaB = this.boxes[x2][y2];
		for(var i = 0; i < areaA.length; i++) {
			a = areaA[i];
			for(var j = 0; j < areaB.length; j++) {
				b = areaB[j];
				(a.moving || b.moving) && this.detect(a, b);
			}
		}
	},
	handle: function() {
		this.init();
		var i, j;
		for(i = 0; i < this.boxes.length; i++) {
			for(j = 0; j < this.boxes[i].length; j++) {
				this.checkOneBox(i, j);
				this.checkTwoBoxes(i, j, i + 1, j);
				this.checkTwoBoxes(i, j, i, j + 1);
				this.checkTwoBoxes(i, j, i + 1, j + 1);
			}
		}
	}
}
