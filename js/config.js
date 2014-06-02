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
			stage.show(w, h);
		}
	},
	map: {
		w: 600,
		h: 400,
		init: function(url, w, h){
			stage.bg(url);
			this.w = w;
			this.h = h;
		}
	},
	objectPool: [],
	collidePool: [],
	mouse_x: 0,
	mouse_y: 0,
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
		stage.cameraMove(this.x, this.y);
	}
}

//mousemove 太伤
/*var game.mouse_x = 0,
	game.mouse_y = 0;
$("#stage").mousemove(function(e) {
	game.mouse_x = e.pageX - this.offsetLeft + camera.x,
	game.mouse_y = e.pageY - this.offsetTop + camera.y;
});*/

/* jquery dom */
var domCanvas=$("#myCanvas")[0];
var canvas = domCanvas.getContext("2d");
/* #stage */
var stage = (function($){
	var $stage = $("#stage");
	var I = {
		show: function(w, h){
			$stage.animate({
				"width":w,
				"height":h,
				"margin-left":-w/2,
				"margin-top":-h/2
			},"fast");
		},
		bg: function(url){
			$stage.css({
				'background':'url("' + url + '")'
			});
		},
		cameraMove: function(x, y){
			$stage.css({
				'background-position-x': -x+'px',
				'background-position-y': -y+'px'
			});
		},
		click: function(callback){
			$stage.click(function(e){
				var _this = this;
				callback(e, _this);
			});
		}
	};
	return I;
}(jQuery));

/* loading */
var load = (function($){
	var $loading = $("#loading");
	var $chapter = $("#chapter");
	var $info = $("#info");
	var $stage = $("#stage");
	var I = {
		start: function(){
			$loading.show();
			$chapter.hide();
		},
		end: function(){
			$loading.hide();
			$info.fadeIn();
			$stage.fadeIn();
		},
		ing: function(loaded, count_objects){
			$loading.find("div").stop().animate({
				width: loaded / count_objects * 100 + "%"
			});
		}
	};
	return I;
}(jQuery));

/* init */
game.canvas.setSize(600, 400);