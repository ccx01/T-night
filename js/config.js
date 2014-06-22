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
		this.x = this.center.x - stage.w / 2;	//lock the camera
		this.y = this.center.y - stage.h / 2;
		this.x = this.x.clamp(0, game.map.w - stage.w);
		this.y = this.y.clamp(0, game.map.h - stage.h);
		stage.cameraMove(this.x, this.y);
	}
}

/* jquery dom */

/* #stage */
window.stage = (function($){
	var $main = $("#main");
	var $stage = $("#stage");
	var dom = $stage[0];

	var I = dom.getContext("2d");
		I.x = 0;
		I.y = 0;
		I.setSize = function(w, h){
			dom.width = this.w = w || 600;
			dom.height = this.h = h || 400;
			$main.animate({
				"width":w,
				"height":h,
				"margin-left":-w/2,
				"margin-top":-h/2
			},"fast");
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
		I.bg = function(url){
			$stage.css({
				'background':'url("' + url + '")'
			});
		}
		I.cameraMove = function(x, y){
			$stage.css({
				'background-position-x': - x + 'px',
				'background-position-y': - y + 'px'
			});
		}
		I.move = function(callback){
			var check_mouse;
			dom.onmousedown = function(e){
				dom.onmousemove = function(ev){
					e = ev;
				}
				check_mouse = setInterval(function(){
					callback(e);
				},10);
				document.onmouseup = function(e){
					clearInterval(check_mouse);
					dom.onmousemove = null;
				}
			}
		}
		I.card = function(card, callback){
			card.onmousedown = function(){
				dom.onmouseup = function(e){
					callback(e);
				}
				document.onmouseup = function(){
					dom.onmouseup = null;
				}
			}
		}
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
stage.setSize(600, 400);