/*********map init*********/
game.map.init("img/map/bg1.png", 1900, 1000);

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
	stage.click(function(e, stage){
		game.mouse_x = e.pageX - stage.offsetLeft + camera.x,
		game.mouse_y = e.pageY - stage.offsetTop + camera.y;
		ochi.cmd("walk");
	});
	//外部命令监听，之后需封装 鼠标类目前还未开始修改
	// window.uni = mouseIcon();	//mouse click
	// uni = mouseIcon(500);
	// uni.sprite.draw();
	// CG(CGstep);
});