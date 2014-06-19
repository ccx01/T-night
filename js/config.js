/* window */
window.requestAnimationFrame = (function() {
	return requestAnimationFrame || function(callback) {
		return setTimeout(callback, 1000 / 60); // shoot for 60 fps
	};
}());

window.cancelAnimationFrame = (function() {
	return cancelAnimationFrame || function(id) {
		clearTimeout(id);
	};
}());

window.game = {
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
window.camera = {
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
window.canvas = (function(){
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
		I.update = function() {
			this.clearRect(0, 0, this.w, this.h);
			var i = 0;
			count_objects = game.objectPool.length;
			for(; i < count_objects; i++){
				if(!game.objectPool[i]){
					continue;
				}
				game.objectPool[i].draw();
				!game.objectPool[i].active && game.objectPool.splice(i, 1);
			}
		}
	return I;
}());

/* #stage */
window.stage = (function($){
	var $stage = $("#stage");
	var dom = $stage[0];
	var moving = false;
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
				'background-position-x': - x + 'px',
				'background-position-y': - y + 'px'
			});
		},
		move: function(callback){
			var check_mouse;
			dom.onmousedown = function(e){
				// var last_time = Date.now();
				dom.onmousemove = function(ev){
					e = ev;
					/*console.log(Date.now() - last_time);
					last_time = Date.now();*/
				}
				check_mouse = setInterval(function(){
					callback(e);
				},10);
			}
			document.onmouseup = function(e){
				clearInterval(check_mouse);
				dom.onmousemove = null;
			}
		},
		key: function(callback){
			document.onkeydown = function(e){
				console.log(e);
				callback(e.which);
			}
		}
	};
	return I;
}(jQuery));

/* loading */
window.load = (function($){
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

window.global = (function($){
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