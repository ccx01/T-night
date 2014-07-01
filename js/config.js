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
	var dom_stage = $stage[0];

	var $gesture = $("#gesture");
	var dom_gesture = $gesture[0];
	var ges = dom_gesture.getContext("2d");

	var I = dom_stage.getContext("2d");
		I.x = 0;
		I.y = 0;
		I.setSize = function(w, h){
			dom_stage.width = this.w = dom_gesture.width = ges.w = w || 600;
			dom_stage.height = this.h = dom_gesture.height = ges.h = h || 400;
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
		//pending
		I.move = function(callback){
			var check_mouse;
			dom_stage.onmousedown = function(e){
				ges.beginPath();
				/*var radius = 15;
				var dis = 100;
				ges.moveTo(e.offsetX - dis + radius, e.offsetY);
				ges.arc(e.offsetX - dis, e.offsetY, radius, 0, Math.PI*2);
				ges.moveTo(e.offsetX + radius, e.offsetY - dis);
				ges.arc(e.offsetX, e.offsetY - dis, radius, 0, Math.PI*2);
				ges.moveTo(e.offsetX + dis + radius, e.offsetY);
				ges.arc(e.offsetX + dis, e.offsetY, radius, 0, Math.PI*2);
				ges.moveTo(e.offsetX + radius, e.offsetY + dis);
				ges.arc(e.offsetX, e.offsetY + dis, radius, 0, Math.PI*2);
				ges.moveTo(e.offsetX, e.offsetY);*/

				dom_stage.onmousemove = function(ev){
					e = ev;
				}
				check_mouse = setInterval(function(){
					ges.lineTo(e.offsetX, e.offsetY);
					ges.stroke();
				}, 10);
				var cmd = "walk";
				document.onmouseup = function(ev){
					callback(e, cmd);
					clearInterval(check_mouse);
					ges.clearRect(0, 0, ges.w, ges.h);
					dom_stage.onmousemove = null;
					document.onmouseup = null;
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