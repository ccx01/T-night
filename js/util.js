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
		var qx = e.x - o.x;
		var qy = e.y - o.y;
		if(qx * qx + qy * qy > r * r) {	
			if(qx > 0 && qy > 0) return "4";
			if(qx < 0 && qy > 0) return "3";
			if(qx < 0 && qy < 0) return "2";
			if(qx > 0 && qy < 0) return "1";	
		}
		return "";
	}
	var getGestureCode = function(quad){
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
				return "keySSZ";
				break;
			case "432":
			case "321":
			case "214":
			case "143":
				console.log("逆时针");
				return "keyNSZ";
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
				return "keyQG";
				break;
			case "4":
			case "3":
			case "2":
			case "1":
				console.log("直线");
				return "keyZX";
				break;
			default:
				//默认为行走
				console.log("无手势");
				return "keyN";
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
		document.oncontextmenu = function () {
			return false;
		}
		document.addEventListener("touchmove", function(ev) {
	        ev.preventDefault();
	    });
		var $gesture = $("#gesture");
		var ges = $gesture.getContext("2d");
		var e, o, s;
		//手势值
		var quad = "";
		//上一次象限
		var quad_l = "";
		//当前象限
		var quad_c = "";
		//敏感度
		var sens = 15;
		var start;
		var move ;
		var end;
		if ("ontouchstart" in document) {
			start = "touchstart";
			move = "touchmove";
			end = "touchend";
		} else {
			start = "mousedown";
			move = "mousemove";
			end = "mouseup";
		}
		var eMove = function(ev){
			e = {
				"x": ev.changedTouches ? ev.changedTouches[0].clientX : ev.layerX,
				"y": ev.changedTouches ? ev.changedTouches[0].clientY : ev.layerY
			}
		}
		var I = function(callback){
			var check_mouse;
			var touch_lock = 0;
			$gesture.addEventListener(start, function(ev){
				//多点触控暂时不需要，直接锁了
				if(touch_lock) return;
				touch_lock = 1;

				ges.beginPath();
				e = o = s = {
					"x": ev.changedTouches ? ev.changedTouches[0].clientX : ev.layerX,
					"y": ev.changedTouches ? ev.changedTouches[0].clientY : ev.layerY
				}
				quad = "";
				//上一次象限
				quad_l = "";
				//当前象限
				quad_c = "";

				$gesture.addEventListener(move, eMove);
				check_mouse = setInterval(function(){
					quad_c = quadMouse(s, e, sens);
					if(quad_c){
						if(quad_c != quad_l){
							quad += quad_c;
							quad_l = quad_c;
						}
						s = e;
					}
					ges.lineTo(e.x, e.y);
					ges.stroke();
				}, 10);
			});

			document.addEventListener(end, function(ev){
				//debug
				/*console.log(ev)
				var info = ""
				for (var i = 0; i < ev.changedTouches.length; i++) {
					var ec = ev.changedTouches[i];
					for(var ee in ec) {
						info += ee + " : " + ec[ee] + "<br>";
					}
				}
				$("#info").html(info)*/
				touch_lock = 0;
				e = {
					"x": ev.changedTouches ? ev.changedTouches[0].clientX : ev.layerX,
					"y": ev.changedTouches ? ev.changedTouches[0].clientY : ev.layerY
				}

				var cmd = getGestureCode(quad);
				
				var cfg = {
					"o": o,
					"e": e,
					"cmd": cmd
				}
				callback(cfg);
				clearInterval(check_mouse);
				ges.clearRect(0, 0, ges.w, ges.h);
				$gesture.removeEventListener('touchmove', eMove);
			});
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
		var I = function(rate){
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
	//bound checked
	Number.prototype.clamp = function(min, max) {
		return Math.min(Math.max(this, min), max);
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

	module.add("util", "功能块");

}());