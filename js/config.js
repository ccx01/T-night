window.game = {
	canvas: {
		x: 0,
		y: 0,
		w: 600,
		h: 400
	},
	map: {
		w: 600,
		h: 400
	},
	objectPool: [],
	collidePool: [],
	time: 0
}
window.camera = {
	x:0,
	y:0,
	center:game.map,
	update:function(){
		/*******camera*******/
		this.x = this.center.x - game.canvas.w / 2;	//lock the camera
		this.y = this.center.y - game.canvas.h / 2;
		this.x = this.x.clamp(0, game.map.w - game.canvas.w);
		this.y = this.y.clamp(0, game.map.h - game.canvas.h);

		$("#stage").css({
			'background-position-x': -this.x+'px',
			'background-position-y': -this.y+'px'
		});

	}
}
window.res = {
	loaded: 0,
	totalLen: 0,
	pause: false,
}

/* 需要集中对dom进行处理 */
$("#stage").css({
	"width":game.canvas.w,
	"height":game.canvas.h,
	"margin-left":-game.canvas.w/2,
	"margin-top":-game.canvas.h/2
});
var myCanvas=$("#myCanvas")[0];
	myCanvas.width=game.canvas.w;
	myCanvas.height=game.canvas.h;
var canvas = myCanvas.getContext("2d");

var mouse_x = 0,
	mouse_y = 0;
$("#stage").mousemove(function(e) {
	mouse_x = e.pageX - this.offsetLeft + camera.x,
	mouse_y = e.pageY - this.offsetTop + camera.y;
});

function setSize(w,h){
	game.canvas.w = w;
	game.canvas.h = h;

	$("#stage").animate({
		"width":game.canvas.w,
		"height":game.canvas.h,
		"margin-left":-game.canvas.w/2,
		"margin-top":-game.canvas.h/2
	});
	myCanvas.width=game.canvas.w;
	myCanvas.height=game.canvas.h;
}
