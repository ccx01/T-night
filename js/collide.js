/* collision detection */
function collides(a, b){
	var dx = a.x - b.x + a.vx + b.vx;
	var dy = a.y - b.y + a.vy + b.vy;
	var dr = a.radius + b.radius;
	return dy * dy + dx * dx < dr * dr;
}

function touch(a, b){
	// avoid of stick together
	var dr = a.radius + b.radius;
	var dx = b.x - a.x;
	var dy = b.y - a.y;
	var angle = Math.atan2(dy, dx);
	a.dx = b.x - Math.cos(angle) * dr;
	a.dy = b.y - Math.sin(angle) * dr;
	/*a.vx = b.vx - a.vx;
	a.vy = b.vy - a.vy;*/
}

function handleCollisions(){
	var c = game.collidePool;
	var i = 0,j = 0;
	var len = c.length;
	for(; i < len; i++){
		if(c[i].moving){
			for(; j < len; j++){
				if(i == j) continue;
				collides(c[i], c[j]);
				if (collides(c[i], c[j])) {
					touch(c[i], c[j]);
					// c[i].isObstructed("stay");
					c[i].force(c[j]);
				}			
			}
		}
	}
}
