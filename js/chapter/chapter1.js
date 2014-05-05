/* preload images and audio */
var resource = [
	['characters/ochi.png', 'characters/dolls.png','effect/effect1.png'],
	[]
];

/*********map init*********/
$("#stage").css({
	'background':'url("images/map/bg1_0.png")',
	'background-position': '0px 0px',
	'background-repeat': 'no-repeat'
});
map.width = 900;
map.height = 600;
obstacles = [];
var boundary = function(){
	if(this.x-200>this.y){
		this.y = this.y.clamp(0, this.x-200);
		this.x = this.x.clamp(0, this.y+200);
	}
}
/*generateObstacle(900,0,900,450,Math.atan2(1,2));
generateObstacle(900,300,600,180,Math.atan2(1,0));
generateObstacle(900,600,900,450,Math.atan2(-1,2));*/

/************CG***********/
CGstep=1;
CG = function(step){
	switch(step){	
		case 1:
			$(".tip").show();
			$(".shadow,#cg").fadeIn();
			CGwidth=900;
			CGheight=600;
			$("#cg .content").html("");
			$("#cg .content").css({
				"background-image":"url(images/chapter/chapter1/lesson1.png)",
				"background-position":"0px 0px",
				"background-color":"#fff"
			});
			CGcontent(CGwidth,CGheight,1000);
		break;
		case 100:
			$("#info").fadeOut();
			$("#stage").fadeOut(1000,function(){
				init(1.1);
				stop();
			});
		break;
		default:
			$(".tip").hide();
			$("#cg").css({
				"-webkit-animation":"none"
			}).animate({
				"width": 300,
				"height": 95,
				"top": 150,
				"left": "0%",
				"margin-left": 0,
				"margin-top": 0
			},500);
			$("#cg .content").css({
				"background":"none"
			}).html("鼠标左键移动，按键Q W E攻击<br>干掉那个红色的家伙");
			chapterInit();
	}
}
/*WIN = function(){
	$("#info").fadeOut();
	$("#stage").fadeOut(1000,function(){
		init(1.1);
		stop();
	});
}*/

$.when(
$.ajax({
	url: "js/characters/ochi.js",
	async: false,
	dataType: "script"
}),
$.ajax({
	url: "js/characters/dolls.js",
	async: false,
	dataType: "script"
})
);

chapterInit = function(){
	/* load object */
	object=[];
	effect=[];
	enemyPool=[];
	collidable=[];
	object.push(ochi);
	object.push(dolls);
	collidable.push(ochi);
	collidable.push(dolls);
	enemyPool.push(dolls);
	$("#player").addClass("ochi");
		$(".ochi .avatar img").attr("src","images/avatar/ochi/p1.png")
		$(".ochi .hp div").animate({
				"width": "10%"
		});
	ochi.x=100;
	ochi.y=300;
	dolls.HP=5;
	dolls.x=420;
	dolls.y=300;
	$("#enemy").addClass("dolls");
	$(".dolls .avatar img").attr("src","images/avatar/dolls.png")
	var tHP=dolls.HP / dolls.init.HP * 100;
	$(".dolls .hp div").animate({
		"width": tHP + "%"
	});
	/*****map****/
	ochi.inBounds = boundary;
	dolls.inBounds = boundary;
	/******camera*****/
	camera.center = ochi;
	start();
}

result = function() {
	if(dolls.HP<1){
		CGstep=100;
		CG(CGstep);
		result=function(){}
	}
}
CGinit();
CG(CGstep);