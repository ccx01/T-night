/* init */

/* 先把这几个js塞到head里，暂时先这样了 */
module.load("game", [{
	"name": "util",
	"url": "js/util.js"
}, {
	"name": "collide",
	"url": "js/collide.js"
}, {
	"name": "model",
	"url": "js/model.js"
}, {
	"name": "sprite",
	"url": "js/sprite.js"
}], function(mod){

	var requestAnimationFrame = (function() {
		return window.requestAnimationFrame || function(callback) {
			return setTimeout(callback, 1000 / 60); // shoot for 60 fps
		};
	}());

	var cancelAnimationFrame = (function() {
		return window.cancelAnimationFrame || function(id) {
			clearTimeout(id);
		};
	}());

	var collide = mod.collide;
	var quadMouse = function(o, e, r){
		/***
		o: 象限中心
		e: 鼠标位置
		r: 敏感范围
		***/
		if(e.layerX - o.layerX > r && e.layerY - o.layerY > r) return "4";
		if(o.layerX - e.layerX > r && e.layerY - o.layerY > r) return "3";
		if(o.layerX - e.layerX > r && o.layerY - e.layerY > r) return "2";
		if(e.layerX - o.layerX > r && o.layerY - e.layerY > r) return "1";
		return "";
	}
	var gesture = function(quad){
		var rex = /123|234|341|412|432|321|214|143|232|323|242|424|121|212|131|313|141|414|4|3|2|1/;
		//反转，优先匹配最后的手势
		quad = quad.slice(-10).split("").reverse().join("");
		var q = quad.match(rex);
			q = q ? q[0] : "0";
		//添加2圈 3圈手势？ => Sign?
		switch(q){
			case "123":
			case "234":
			case "341":
			case "412":
				console.log("顺时针");
				return "Wkey";
				break;
			case "432":
			case "321":
			case "214":
			case "143":
				console.log("逆时针");
				return "Ekey";
				break;
			case "232":
			case "323":
			case "242":
			case "424":
			case "121":
			case "212":
			case "131":
			case "313":
			case "141":
			case "414":
				console.log("切割");
				return "Rkey";
				break;
			case "4":
			case "3":
			case "2":
			case "1":
				console.log("直线");
				return "Qkey";
				break;
			default:
				//默认为行走
				console.log("无手势");
				return "walk";
		}
	}

	var stage = function(){
		var $main = $("#main");
		var $stage = $("#stage");
		var $gesture = $("#gesture");
		var ges = $gesture.getContext("2d");

		var I = $stage.getContext("2d");
			I.x = 0;
			I.y = 0;
			I.setSize = function(w, h){
				$stage.width = this.w = $gesture.width = ges.w = w || 600;
				$stage.height = this.h = $gesture.height = ges.h = h || 400;
				$main.animate({
					"width":w,
					"height":h,
					"marginLeft":-w/2,
					"marginTop":-h/2
				}, 400);
			}
			I.update = function() {
				this.clearRect(0, 0, this.w, this.h);
				var i = 0;
				var count_objs = game.drawPool.length;
				for(; i < count_objs; i++){
					if(!game.drawPool[i]){
						continue;
					}
					game.drawPool[i].draw(game.stage);
					!game.drawPool[i].active && game.drawPool.splice(i, 1);
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
		return I;
	}

	var cmd = function(){
		var $gesture = $("#gesture");
		var ges = $gesture.getContext("2d");
		var I = function(callback){
			var check_mouse;
			$gesture.onmousedown = function(e){
				ges.beginPath();
				var o = e;
				var quad = "";
				//上一次象限
				var quad_l = "";
				//当前象限
				var quad_c = "";
				//敏感度
				var sens = 15;

				$gesture.onmousemove = function(ev){
					e = ev;
				}
				check_mouse = setInterval(function(){
					quad_c = quadMouse(o, e, sens);
					if(quad_c){
						if(quad_c != quad_l){
							quad += quad_c;
							quad_l = quad_c;
							// mark.add(500, e.layerX + camera.x, e.layerY + camera.y, game.time, 20, 20);
						}
						o = e;
					}
					ges.lineTo(e.layerX, e.layerY);
					ges.stroke();
				}, 10);
				document.onmouseup = function(ev){
					var cmd = gesture(quad);
					callback(e, cmd);
					clearInterval(check_mouse);
					ges.clearRect(0, 0, ges.w, ges.h);
					$gesture.onmousemove = null;
					document.onmouseup = null;
				}
			}
		}
		return I;
	}
	/* load function */

	var $loading = $("#loading"),
		$chapter = $("#chapter"),
		$info = $("#info"),
		$stage = $("#stage"),
		$fps = $("#fps"),
		$chapter = $("#chapter");

	var loop_id,
		last_loop_time = 0,
		last_fps_time = 0;

	function begin() {
		$loading.css({
			"display": "block"
		});
		$chapter.css({
			"display": "none"
		});
	}

	function ready(loaded, total) {
		$loading.find("div").animate({
			"width": loaded / total * 100 + "%"
		});
		if (loaded == total) {
			$loading.css({
				"display": "none"
			});
			$info.css({
				"display": "block"
			});
			$stage.css({
				"display": "block"
			});
			loop_id && cancelAnimationFrame(loop_id);
			loop_id = requestAnimationFrame(loop);
		}
	}

	function stop() {
		cancelAnimationFrame(loop_id);
	}
	
	function loop(now) {
		game.update();
		loop_id = requestAnimationFrame(loop);
		if (now - last_fps_time > 1000) {
			$fps.html(1000 / (now - last_loop_time) | 0);
			last_fps_time = now;
		}
		last_loop_time = now;
		game.time = now | 0;
	}

	function menu(){
		$chapter.css({
			"display": "block"
		});
	}

	var game = {
		drawPool: [],
		collidePool: [],
		mouse_x: 0,
		mouse_y: 0,
		time: 0
	}
	game.map = {
		w: 600,
		h: 400,
		init: function (url, w, h) {
			game.stage.bg(url);
			this.w = w;
			this.h = h;
		}
	}

	game.camera = {
		x:0,
		y:0,
		center:game.map,
		update: function() {
			/*******camera*******/
			this.x = this.center.x - game.stage.w / 2;	//lock the camera
			this.y = this.center.y - game.stage.h / 2;
			this.x = this.x.clamp(0, game.map.w - game.stage.w);
			this.y = this.y.clamp(0, game.map.h - game.stage.h);
			game.stage.cameraMove(this.x, this.y);
		}
	}

	game.cmd = cmd();
	game.stage = stage();
	game.begin = begin;
	game.menu = menu;
	game.ready = ready;

	game.update = function() {
		collide.handle();
		game.camera.update();
		game.stage.update();
	}

	window.game = game;

	module.add("game", "游戏框架");
});
