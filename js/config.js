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
		function quadMouse(o, e, r){
			/***
			o: 象限中心
			e: 鼠标位置
			r: 敏感范围
			***/
			if(e.offsetX - o.offsetX > r && e.offsetY - o.offsetY > r) return 4;
			if(o.offsetX - e.offsetX > r && e.offsetY - o.offsetY > r) return 3;
			if(o.offsetX - e.offsetX > r && o.offsetY - e.offsetY > r) return 2;
			if(e.offsetX - o.offsetX > r && o.offsetY - e.offsetY > r) return 1;
			return "";
		}
		function gesture(quad){
			var rex = /123|234|341|412|432|321|214|143|23|32|24|42|12|21|13|31|14|41/;
			var q = quad.match(rex);
				q = q ? q[0] : "0";
			switch(q){
				case "123":
				case "234":
				case "341":
				case "412":
					console.log("逆时针");
					break;
				case "432":
				case "321":
				case "214":
				case "143":
					console.log("顺时针");
					break;
				case "23":
				case "32":
				case "24":
				case "42":
				case "12":
				case "21":
				case "13":
				case "31":
				case "14":
				case "41":
					console.log("切割");
					break;
				default:
					//默认为行走
					console.log("无手势");
			}
			// quad.match();
		}
		I.move = function(callback){
			var check_mouse;
			dom_stage.onmousedown = function(e){
				ges.beginPath();
				var o = e;
				var quad = "";
				//上一次象限
				var quad_l = "";
				//当前象限
				var quad_c = "";
				//敏感度
				var sens = 15;

				dom_stage.onmousemove = function(ev){
					e = ev;
				}
				check_mouse = setInterval(function(){
					quad_c = quadMouse(o, e, sens);
					if(quad_c){
						if(quad_c != quad_l){
							quad += quad_c;
							quad_l = quad_c;
						}
						o = e;
					}
					ges.lineTo(e.offsetX, e.offsetY);
					ges.stroke();
				}, 10);
				var cmd = "walk";
				document.onmouseup = function(ev){
					gesture(quad);
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