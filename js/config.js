/* window */
var requestAnimationFrame = (function() {
	return requestAnimationFrame || function(callback) {
		return setTimeout(callback, 1000 / 60); // shoot for 60 fps
	};
}());

var cancelAnimationFrame = (function() {
	return cancelAnimationFrame || function(id) {
		clearTimeout(id);
	};
}());

var game = {
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
		this.x = this.center.x - canvas.w / 2;	//lock the camera
		this.y = this.center.y - canvas.h / 2;
		this.x = this.x.clamp(0, game.map.w - canvas.w);
		this.y = this.y.clamp(0, game.map.h - canvas.h);
		stage.cameraMove(this.x, this.y);
	}
}

/* jquery dom */
var canvas = (function(){
	var domCanvas=$("#myCanvas")[0];
	var I = domCanvas.getContext("2d");
		I.x = 0;
		I.y = 0;
		I.w = 600;
		I.h = 400;
		I.setSize = function(w, h){
			domCanvas.width = this.w = w;
			domCanvas.height = this.h = h;
			stage.show(w, h);
		}
	return I;
}());

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

var global = (function($){
	var $fps = $("#fps");
	var $chapter = $("#chapter");
	var I = {
		fps: function(rate){
			$fps.text(rate);
		},
		menu: function(){
			$chapter.fadeIn();
		}
	}
	return I;
}(jQuery));

/* init */
canvas.setSize(600, 400);