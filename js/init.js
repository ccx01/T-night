/* init */
var time; //current time
var loaded;
var totalLen;
var fps;
var pause = false;
var requestId = 0;
var lastAnimationFrameTime = 0;
var lastFpsUpdateTime = 0;
/* level setting */

function init(chapter) {
	object = []; //empty the objects
	loaded = 0;
	chapter = "chapter" + chapter;
	$.ajax({
		type: "GET",
		url: "js/chapter/" + chapter + ".js",
		async: false,
		dataType: "script"
	}).done(function() {
		$("#loading").show();
		totalLen = object.length;

		$("#chapter").hide();
	});
}

function isReady() {
	loaded++;
	$("#loading div").stop().animate({
		width: loaded / totalLen * 100 + "%"
	});
	if (loaded == totalLen) {
		// $("#loading").hide();
		start();
	};
}

/* collision detection */

function collides(a, b) {
	OBB1 = new OBB(new Vector2(a.x, a.y), a.OBBwidth, a.OBBheight, a.angle);
	OBB2 = new OBB(new Vector2(b.x, b.y), b.OBBwidth, b.OBBheight, b.angle);
	return CollisionDetector.detectorOBBvsOBB(OBB1, OBB2);
}

function handleCollisions(){
	for(var i=0;i<collidable.length-1;i++){
		for(var j=i+1;j<collidable.length;j++){
			if (collides(collidable[i], collidable[j])) {
				var objA=collidable[i];
				var objB=collidable[j];
				objA.bounce.angle = Math.atan2(objA.y - objB.y, objA.x - objB.x);
				objA.bounce.timer = time;
				objA.bounce.active = true;
				objB.bounce.angle = Math.atan2(objB.y - objA.y, objB.x - objA.x);
				objB.bounce.timer = time;
				objB.bounce.active = true;
			}			
		}
		for(var k=0;k<obstacles.length;k++){
			if (collides(collidable[i], obstacles[k])) {
				var objA=collidable[i];
				var objB=obstacles[k];
				objA.bounce.angle = Math.atan2(objA.y - objB.y, objA.x - objB.x);
				objA.bounce.timer = time;
				objA.bounce.active = true;
				objA.mode = "bounce";
			}					
		}
	}
}

/* canvas update */

function clear() {
	canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function draw() {
	sign.forEach(function(s) {
		s.draw();
	});
	object.forEach(function(o) {
		o.draw();
	});
	effect.forEach(function(ef) {
		ef.draw();
	});
}

function result(){}

function animate(now) {
	if (!pause) {
		fps = calculateFps(now);
		camera.update();
		handleCollisions();
		clear();
		draw();
		result();
		time = new Date().getTime();
		requestId = requestAnimationFrame(animate);
	}
}

function calculateFps(now) {
	var fps = 1000 / (now - lastAnimationFrameTime);
	lastAnimationFrameTime = now;

	if (now - lastFpsUpdateTime > 1000) {
		lastFpsUpdateTime = now;
		$("#fps").text(fps.toFixed(0));
	}

	return fps;
}

/************CG***************/
var CGinit=function(){
	$(".tip").hide();
	$("#cg").css({
		"-webkit-animation":"none",
		"width": 0,
		"height": 0,
		"top": "50%",
		"left": "50%",
		"margin-left": 0,
		"margin-top": 0
	});
	$("#cg .content").css({
		"background":"none"
	}).html("");
}
$(".tip").click(function(){
	CGstep++;
    CG(CGstep);
});
var CGwidth,CGheight,CGstep=1;
var CG = function(){}
/*var WIN = function(){}
var LOSE = function(){}*/
var chapterInit = function(){}
var CGcontent = function(w,h,time,auto){
	$("#cg").animate({
		"width": w,
		"height": h,
		"top": "50%",
		"left": "50%",
		"margin-left": -w/2,
		"margin-top": -h/2
	},time,function() {
		if(auto){
			CGstep++;
			CG(CGstep);
		}
    });	
}

requestId = requestAnimationFrame(animate);
function start() {
	// if (loaded == totalLen) {
		pause = false;
		cancelAnimationFrame(requestId);
		requestId = requestAnimationFrame(animate);
		$("#dialog").fadeOut();
		$("#info").fadeIn();
		$("#stage").fadeIn();
	/*} else {
		$("#loading").show();
		setTimeout(start, 500);
	}*/
}

function stop(delay) {
	if(delay){
		setTimeout("start()",delay);
	}
	pause = true;
	cancelAnimationFrame(requestId);
}

function menu() {
	$("#stage").fadeOut();
	$("#info").fadeOut();
	$("#chapter").show();
}

$("#chapter").fadeIn();

/* for checking image position */
// var testIMG = model();
// testIMG.sprite = sprite("effect/effect1.png");
// object.push(testIMG);
// testIMG.update = function() {
// 		if (keydown.q) {
// 		  console.log(this.sprite.sourceX+","+this.sprite.sourceY+","+this.width+","+this.height);
// 		}

// 		if (keydown.a) {
// 		  this.sprite.sourceX--;
// 		}
// 		if (keydown.d) {
// 		  this.sprite.sourceX++;       
// 		} 
// 		if (keydown.w) {
// 		  this.sprite.sourceY++;
// 		}
// 		if (keydown.s) {
// 		  this.sprite.sourceY--;
// 		}

// 		if (keydown.up) {
// 		  this.height++; 
// 		}
// 		if (keydown.down) {
// 		  this.height--;       
// 		} 
// 		if (keydown.left) {
// 		  this.width--;
// 		}
// 		if (keydown.right) {
// 		  this.width++;
// 		}

//   };
//   testIMG.draw = function() {
// 	canvas.fillStyle = "#998";
// 	canvas.fillRect(this.x, this.y, this.width, this.height);
// 	this.sprite.draw(canvas, this.x, this.y, this.width, this.height);
// 	this.update();
//   };