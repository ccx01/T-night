/***
模块名定义在对应模块里，调用时需填写正确模块名
***/
(function(){

	var module = (function(){
		var I = {};
			I.mod = {};
			I.add = function(name, obj){
				I.mod[name] = obj;
			}
			I.load = function(mods, callback){
				var loaded_num = 0;
				var loaded_mod = {};
				/*var loaded = function(name,callbak) {
					name = this.name || name;
					loaded_num++;
					loaded_mod[name] = I.mod[name];
					console.log(callback)
					if(loaded_num == mods.length){
						callback && callback(loaded_mod);
						(this != window) && (this.onload = null);
					}
				}*/
				console.log(mods,callback)
				for (var i = 0, len = mods.length; i < len; i++) {
					var name = mods[i].name;
					var url = mods[i].url;
					if(I.mod[name]){
						loaded_num++;
						loaded_mod[name] = I.mod[name];
						console.log(callback)
						if(loaded_num == mods.length){
							callback && callback(loaded_mod);
							(this != window) && (this.onload = null);
						}
						continue;
					}else{
						var head = document.getElementsByTagName("head")[0];
						var node = document.createElement("script");
							node.src = url;
							node.name = name;

						head.appendChild(node);
						node.onload = function(name,callbak) {
							name = this.name || name;
							loaded_num++;
							loaded_mod[name] = I.mod[name];
							console.log(callback)
							if(loaded_num == mods.length){
								callback && callback(loaded_mod);
								(this != window) && (this.onload = null);
							}
						}
					}
				}
			}
		return I;
	}());

	window.module = module;

}());