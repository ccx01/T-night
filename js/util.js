/*****************
base function
*****************/
(function(){

	/* simulate jquery dom */
	var $ = function(selector){
		var ani = function(obj, prop, cur, tar, incr){
			obj.style[prop] = cur + "px";
			if(incr < 0 && cur > tar){
				cur = (cur + incr) > tar ? (cur + incr) : tar;
				setTimeout(function(){
					ani(obj, prop, cur, tar, incr);
				}, 10)
			}else if(incr > 0 && cur < tar){
				cur = (cur + incr) < tar ? (cur + incr) : tar;
				setTimeout(function(){
					ani(obj, prop, cur, tar, incr);
				}, 10)
			}
		}
		var I = document.querySelector(selector);
			I.html = function(code){
				this.innerHTML = code;
			}
			I.find = function(sel){
				return $(sel);
			}
			I.css = function(props){
				for(var i in props){
					this.style[i] = props[i];
				}
			}
			I.animate = function(props, time){
				var cur_prop = {}
				var incr = 10;
					time = time / 10;
				for(var i in props){
					cur_prop[i] = parseInt(getComputedStyle(this)[i]);
					incr = (props[i] - cur_prop[i]) / time;
					ani(this, i, cur_prop[i], props[i], incr);
				}
			}
			return I;
	}
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
				var count_objects = game.objectPool.length;
				for(; i < count_objects; i++){
					if(!game.objectPool[i]){
						continue;
					}
					game.objectPool[i].draw(game.stage);
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
	var load = function(){
		var $loading = $("#loading");
		var $chapter = $("#chapter");
		var $info = $("#info");
		var $stage = $("#stage");
		var I = {
			start: function(){
				$loading.css({
					"display": "block"
				});
				$chapter.css({
					"display": "none"
				});
			},
			end: function(){
				$loading.css({
					"display": "none"
				});
				$info.css({
					"display": "block"
				});
				$stage.css({
					"display": "block"
				});
			},
			ing: function(loaded, count_objects){
				$loading.find("div").animate({
					"width": loaded / count_objects * 100 + "%"
				});
			}
		};
		return I;
	}
	var fps = function(rate){
		var $fps = $("#fps");
		var I = function(){
			$fps.html(rate);
		}
		return I;
	}
	var menu = function(rate){
		var $chapter = $("#chapter");
		var I = function(){
			$chapter.css({
				"display": "block"
			});
		}
		return I;
	}

	var game = {
		objectPool: [],
		collidePool: [],
		mouse_x: 0,
		mouse_y: 0,
		time: 0
	}
	game.map = {
		w: 600,
		h: 400,
		init: function(url, w, h){
			game.stage.bg(url);
			this.w = w;
			this.h = h;
		}
	}

	game.camera = {
		x:0,
		y:0,
		center:game.map,
		update:function(){
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
	game.load = load();
	game.fps = fps();
	game.menu = menu();

	window.game = game;
	//bound checked
	Number.prototype.clamp = function(min, max) {
		return Math.min(Math.max(this, min), max);
	};

	/* window */
	window.requestAnimationFrame = (function() {
		return window.requestAnimationFrame || function(callback) {
			return setTimeout(callback, 1000 / 60); // shoot for 60 fps
		};
	}());

	window.cancelAnimationFrame = (function() {
		return window.cancelAnimationFrame || function(id) {
			clearTimeout(id);
		};
	}());

	function parents(node, tar) {
		while (node) {
			if (node.className == tar || node.id == tar) {
				return node;
			}
			node = node.parentNode;
		}
		return false;
	}
	$("#chapter").onclick = function(e){
		//冒泡处理
		var node = parents(e.target,'chapter');
		var chapter = node.dataset['chapter'];

		game.objectPool = []; //empty the game.objectPools
		game.collidePool = [];

		game.load.start();

		module.load("call" + chapter, [{
			"name": chapter,
			"url": "js/chapters/" + chapter + ".js"
		}], function(){});
	}

}());