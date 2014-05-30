/* preload img and audio */
var resource = [
	['characters/ochi.png'],
	[]
];

/*********map init*********/
$("#stage").css({
	'background':'url("img/map/bg1.png")',
	'background-position': '0px 0px',
	'background-repeat': 'no-repeat'
});
map.width=1900;
map.height=1000;
obstacles=[];

CGstep=190;
CG = function(step){
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
	}).html("揍它身上发光的地方<br>不要被它咬到");
}

$.when(
/* 载入资源js(角色，物品) */
/* 载入后根据不同的章节进行初始化 */
	$.ajax({
		url: "js/characters/ochi-backup.js",
		async: false,
		dataType: 'script'
	}).done(function(data){
		ochi.init(5, 5, 200, 300, 0);
		// ochi cmd 需要设个初始函数
		$("#myCanvas").click(function(){
			ochi.cmd("walk");
		});
		$("#player").addClass("ochi");

		$(".ochi .avatar img").attr("src","img/avatar/ochi/p1.png")
		$(".ochi .hp div").animate({
		    "width": "100%"
		});
		camera.center=ochi;
	}),
	$.ajax({
		url: "js/characters/ochi-1.js",
		async: false,
		dataType: "script"
	}).done(function(data){
		ochi1.init(5, 5, 300, 300, 0);
	})
).done(function(data){
	//外部命令监听，之后需封装 鼠标类目前还未开始修改
	// window.uni = mouseIcon();	//mouse click
	// uni = mouseIcon(500);
	// uni.sprite.draw();
	CG(CGstep);
});

result = function() {

	/*node.forEach(function(enemy) {
		if (collides(enemy, ochi)) {
			if (ochi.mode != "atk") {
				ochi.bounce.speed = 5;
				ochi.bounce.angle = Math.atan2(ochi.y - node[0].y, ochi.x - node[0].x);
				ochi.bounce.timer = time;
				ochi.bounce.cd = 50;
				ochi.bounce.active = true;
			}
		}
	});*/

	/*ochi.areaAtk.forEach(function(atk) {
		if (collides(node[weak], atk)) {
			node[0].hurt(ochi.damage);
		}
		node.forEach(function(enemy) {
			if (collides(enemy, atk)) {
				if(ochi.skillName=="uppercut"){
					node[0].shake(1000);
					atk.hit=true;
					atk.count=0;
				}else{
					node[0].shake(200);
				}
				enemy.coll();
			}
		});		
	});*/

	/*if (collides(node[0], node[0].target)) {
		// Sound.play("beaten");
		node[0].bite=true;

		node[0].target.bounce.speed = 10;
		node[0].target.bounce.angle = Math.atan2(node[0].target.y - node[0].y, node[0].target.x - node[0].x);
		node[0].target.bounce.timer = time;
		node[0].target.bounce.cd = 200;
		node[0].target.bounce.active = true;	//通常只有在正常行走状态下有效
		node[0].target.mode = "bounce";		//强行激活bounce状态

		node[0].angry -= 1;
		node[0].target.hurt(1);
	}*/
	/*if(node[0].HP<=0){
		result=function(){}
		CGstep=100;
		CG(CGstep);
		$(".tip").show();
		stop();
	}*/
	/*if(ochi.HP<=0){
		result=function(){}
		CGstep=200;
		CG(CGstep);
		$(".tip").show();
	}*/
}
// CGinit();

// chapterInit();