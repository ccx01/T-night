/* collision detection */
function collides(a, b){
	OBB1 = new OBB(new Vector2(a.x, a.y), a.OBBw, a.OBBh, a.angle);
	OBB2 = new OBB(new Vector2(b.x, b.y), b.OBBw, b.OBBh, b.angle);
	return CollisionDetector.detectorOBBvsOBB(OBB1, OBB2);
}

function reaction(obj){
	// 反弹，无技能冲突时默认碰撞后的行为
	var vx = Math.cos(obj.angle) * obj.speed || 0;
	var vy = Math.sin(obj.angle) * obj.speed || 0;
	obj.x -= vx;
	obj.y -= vy;
	obj.touched = false;
}

function handleCollisions(){
	var c = collidePool;
	var i = 0,j;
	var j_len = c.length;
	var i_len = j_len - 1;
	for(; i < i_len; i++){
		if(c[i].moving){
			j = i + 1;
			for(; j < j_len; j++){
				if (collides(c[i], c[j])) {
					c[i].touched = true;
					c[i].touchResult(c[j]);
					// c[j].is_touched = c[i].touchResult();
				}			
			}
		}
	}
}
