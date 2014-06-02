/* window */
var game = {
	canvas: {
		x: 0,
		y: 0,
		w: 600,
		h: 400,
		setSize: function(w, h){
			domCanvas.width = this.w = w;
			domCanvas.height = this.h = h;
			stageShow(w, h);
		}
	},
	map: {
		w: 600,
		h: 400,
		init: function(url, w, h){
			stageBG(url);
			this.w = w;
			this.h = h;
		}
	},
	objectPool: [],
	collidePool: [],
	time: 0
}
var camera = {
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

var mouse_x = 0,
	mouse_y = 0;
$("#stage").mousemove(function(e) {
	mouse_x = e.pageX - this.offsetLeft + camera.x,
	mouse_y = e.pageY - this.offsetTop + camera.y;
});

/* jquery dom */
var domCanvas=$("#myCanvas")[0];
var canvas = domCanvas.getContext("2d");
var $stage = $("#stage");
function stageShow(w, h){
	$stage.animate({
		"width":w,
		"height":h,
		"margin-left":-w/2,
		"margin-top":-h/2
	},"fast");
}
function stageBG(url){
	$stage.css({
		'background':'url("' + url + '")'
	});
}

/* init */
game.canvas.setSize(600, 400);