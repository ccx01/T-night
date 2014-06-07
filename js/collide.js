/* collision detection */
function collides(a, b){
	var dy = a.y - b.y;
	var dx = a.x - b.x;
	var dr = a.radius + b.radius;
	return dy * dy + dx * dx <= dr * dr;
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
