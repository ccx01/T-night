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
	objectPool = []; //empty the objectPools
	loaded = 0;
	chapter = "chapter" + chapter;
	$.ajax({
		type: "GET",
		url: "js/chapter/" + chapter + ".js",
		async: false,
		dataType: "script"
	}).done(function() {
		$("#loading").show();
		totalLen = objectPool.length;

		$("#chapter").hide();
	});
}

function ready() {
	loaded++;
	$("#loading div").stop().animate({
		width: loaded / totalLen * 100 + "%"
	});
	if (loaded == totalLen) {
		// $("#loading").hide();
		start();
	};
}

/* canvas update */

function clear() {
	canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function draw() {
	var i = 0;
	for(; i < totalLen; i++){
		objectPool[i].draw();
	}
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