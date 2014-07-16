/***
模块名定义在对应模块里，调用时需填写正确模块名
***/
(function(){

	var module = (function(){
		var head = document.getElementsByTagName("head")[0];
		//公共状态
		var need = {};
		var I = {};
			I.mod = [];
			I.mod_name = [];
			I.add = function(name, obj){
				if(!I.mod[name]){
					I.mod[name] = obj;
					I.mod_name.push(name);
					for(var k in need){
						need[k].ac = true;
						for (var i = 0, len = need[k].length; i < len; i++) {
							if(!I.mod[need[k][i].name]){
								need[k].ac = false;
							}
							// console.log(I.mod[need[k][i].name])
						}
						// console.log(need[k].ac,I.mod)
						need[k].ac && need[k].func(I.mod);
						// console.log(k,need,need[k].func)
					}
				}
			}
			I.load = function(mods, callback, from){
				var loaded_num = 0;
				var loaded_mod = {};
				var loaded = function(name){
					name = this.name || name;
					console.log(name)
					loaded_num++;
					loaded_mod[name] = I.mod[name];
					if(loaded_num == mods.length){
						callback && callback(I.mod);
						this.onload = null;
					}
				}
				if(from){
					need[from] = {}
					need[from] = mods;
					need[from].func = callback;
				}
				for (var i = 0, len = mods.length; i < len; i++) {

					var name = mods[i].name;
					var url = mods[i].url;

					if(I.mod[name]){
						loaded(name);
						continue;
					}else{
						var node = document.createElement("script");
							node.src = url;
							node.name = name;

						//多重加载要处理
						head.appendChild(node);
						if(!from)
						{node.onload = loaded;}
					}
				}
			}
		return I;
	}());

	window.module = module;

}());