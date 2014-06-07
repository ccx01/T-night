var collision = {
	OBBvsOBB: function(OBB1, OBB2) {
		var nv = OBB1.centerPoint.sub(OBB2.centerPoint);
		var axisA1 = OBB1.axes[0];
		if (OBB1.projection(axisA1) + OBB2.projection(axisA1) <= Math.abs(nv.dot(axisA1))) return false;
		var axisA2 = OBB1.axes[1];
		if (OBB1.projection(axisA2) + OBB2.projection(axisA2) <= Math.abs(nv.dot(axisA2))) return false;
		var axisB1 = OBB2.axes[0];
		if (OBB1.projection(axisB1) + OBB2.projection(axisB1) <= Math.abs(nv.dot(axisB1))) return false;
		var axisB2 = OBB2.axes[1];
		if (OBB1.projection(axisB2) + OBB2.projection(axisB2) <= Math.abs(nv.dot(axisB2))) return false;
		return true;
	}
}

function OBB(centerPoint, width, height, angle) {
	var I = {};
	I.centerPoint = centerPoint;
	I.extents = [width / 2, height / 2];
	I.axes = [Vector2(Math.cos(angle), Math.sin(angle)), Vector2(-1 * Math.sin(angle), Math.cos(angle))];
	I.projection = function(axis) {
		return this.extents[0] * Math.abs(axis.dot(this.axes[0])) + this.extents[1] * Math.abs(axis.dot(this.axes[1]));
	}
	return I;
}

function Vector2(x, y) {
	var I = {};
	I.x = x || 0;
	I.y = y || 0;
	I.sub = function(v) {
		return new Vector2(this.x - v.x, this.y - v.y)
	}
	I.dot = function(v) {
		return this.x * v.x + this.y * v.y;
	}
	return I;
};

/* collision detection */
function collides(a, b){
	var dy = a.y - b.y;
	var dx = a.x - b.x;
	var dd = a.radius + b.radius;
	return dy * dy + dx * dx <= dd * dd;
}

function reaction(obj){
	// 反弹，无技能冲突时默认碰撞后的行为
	// 避免角色强行卡入障碍物中
	var vx = Math.cos(obj.angle) * obj.speed || 0;
	var vy = Math.sin(obj.angle) * obj.speed || 0;
	obj.x -= vx;
	obj.y -= vy;
}

function handleCollisions(){
	var c = game.collidePool;
	var i = 0,j = 0;
	var len = c.length;
	for(; i < len; i++){
		if(c[i].moving){
			for(; j < len; j++){
				if(i == j) continue;
				if (collides(c[i], c[j])) {
					c[i].force(c[j]);
				}			
			}
		}
	}
}
