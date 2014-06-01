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
// window.game.objectPool = [];
// window.game.collidePool = [];

var CANVAS_WIDTH = 600;
var CANVAS_HEIGHT = 400;

$("#stage").css({
	"width":CANVAS_WIDTH,
	"height":CANVAS_HEIGHT,
	"margin-left":-CANVAS_WIDTH/2,
	"margin-top":-CANVAS_HEIGHT/2
});
var myCanvas=$("#myCanvas").get(0);
	myCanvas.width=CANVAS_WIDTH;
	myCanvas.height=CANVAS_HEIGHT;
var canvas = myCanvas.getContext("2d");

var mouse_x = 0,
	mouse_y = 0;
$("#stage").mousemove(function(e) {
	mouse_x = e.pageX - this.offsetLeft + camera.x,
	mouse_y = e.pageY - this.offsetTop + camera.y;
});

function setSize(w,h){
	CANVAS_WIDTH = w;
	CANVAS_HEIGHT = h;

	$("#stage").animate({
		"width":CANVAS_WIDTH,
		"height":CANVAS_HEIGHT,
		"margin-left":-CANVAS_WIDTH/2,
		"margin-top":-CANVAS_HEIGHT/2
	});
	myCanvas.width=CANVAS_WIDTH;
	myCanvas.height=CANVAS_HEIGHT;

	// camera = {
	// 	x:0,
	// 	y:0,
	// 	update:function(center,stage){
	// 		this.x = center.x-CANVAS_WIDTH/2;
	// 		this.x = this.x.clamp(0, map.width-CANVAS_WIDTH);
	// 		this.y = center.y-CANVAS_HEIGHT/2;
	// 		this.y = this.y.clamp(0, map.height-CANVAS_HEIGHT);

	// 		$(stage).css({
	// 			'background-position-x': -camera.x+'px',
	// 			'background-position-y': -camera.y+'px'
	// 		});
	// 	}
	// }

}
