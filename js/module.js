/***
模块名定义在对应模块里，调用时需填写正确模块名
***/
(function(){

	var module = (function(){
		var total_mod = {};
		var I = {};
		I.add = function(name, obj){
			total_mod[name] = obj;
		}
		I.load = function(mods, callback){
			var loaded_mod = {};
			var loaded_num = 0;
			var loaded = function() {
					loaded_num++;
					loaded_mod[name] = total_mod[name];
					if(loaded_num == mods.length){
						callback && callback(loaded_mod);
						this.onload = null;
					}
				}
			for (var i = 0, len = mods.length; i < len; i++) {
				var name = mods[i].name;
				var url = mods[i].url;

				if(total_mod[name]){
					loaded();
					continue;
				}

				var head = document.getElementsByTagName("head")[0];
				var node = document.createElement("script");
					node.src = url;

				head.appendChild(node);

				node.onload = loaded;
			}
		}
		return I;
	}());

	window.module = module;

}());