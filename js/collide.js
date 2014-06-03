/* collision detection */
function collides(a, b){
	OBB1 = OBB(new Vector2(a.x, a.y), a.OBBw, a.OBBh, a.angle);
	OBB2 = OBB(new Vector2(b.x, b.y), b.OBBw, b.OBBh, b.angle);
	return CollisionDetector.detectorOBBvsOBB(OBB1, OBB2);
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
