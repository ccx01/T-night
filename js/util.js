/*****************
base function
*****************/
(function(){

	//bound checked
	Number.prototype.clamp = function(min, max) {
		return Math.min(Math.max(this, min), max);
	}
	
	/* simulate jquery dom */
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
	
	var $ = function(selector){
		var I = document.querySelectorAll(selector)[0];
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

	window.$ = $;

	module.add("util", "功能块");

}());