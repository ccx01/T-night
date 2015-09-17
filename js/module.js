/***
模块名定义在对应模块里，调用时需填写正确模块名
***/
(function(){

	var module = function(){
		//公共状态
		var version = "1";	//用来清除缓存
		var head = document.getElementsByTagName("head")[0];
		//load时记录当前模块的require和callback
		var buffer = {};
		var loaded = function(){
			for(var from in buffer){
				var ready = true;
				for (var i = 0, len = buffer[from].length; i < len; i++) {
					if(!I.mod[buffer[from][i].name]){
						ready = false;
					}
				}
				if(ready && !I.mod[from]){
					buffer[from].func(I.mod);
					delete buffer[from];
				}
			}
		}
		var I = {};
			I.mod = [];
			I.add = function(name, obj){
				if(!I.mod[name]){
					I.mod[name] = obj;
					loaded("add",name);
				}
			}
			I.load = function(from, mods, callback ){
				if(!buffer[from]){
					buffer[from] = {}
					buffer[from] = mods;
					buffer[from].func = callback;

					for (var i = 0, len = mods.length; i < len; i++) {

						var name = mods[i].name;
						var url = mods[i].url + "?v=" + version;

						if(document.getElementById(name)){
							loaded("loaded");
							continue;
						}else{
							var node = document.createElement("script");
								node.src = url;
								node.id = name;

							head.appendChild(node);
							node.onload = loaded;
						}
					}
				}
			}
		return I;
	};

	window.module = module();

}());