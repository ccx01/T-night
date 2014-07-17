/***
模块名定义在对应模块里，调用时需填写正确模块名
***/
(function(){

	var module = function(){
		//公共状态
		var head = document.getElementsByTagName("head")[0];
		//load时记录当前模块的require和callback
		var buffer = {};
		var check = function(buffer){
			for(var k in buffer){
				var ready = true;
				for (var i = 0, len = buffer[k].length; i < len; i++) {
					if(!I.mod[buffer[k][i].name]){
						ready = false;
					}
				}
				if(ready){
					buffer[k].func(I.mod);
					delete buffer[k];
				}
			}
		}
		var I = {};
			I.mod = [];
			I.add = function(name, obj){
				if(!I.mod[name]){
					I.mod[name] = obj;
					check(buffer);
				}
			}
			I.load = function(from, mods, callback ){
				var loaded_num = 0;
				var loaded_mod = {};
				var loaded = function(name){
					name = this.name || name;
					loaded_num++;
					loaded_mod[name] = I.mod[name];
					if(loaded_num == mods.length){
						callback && callback(I.mod);
						this.onload = null;
					}
				}

				// if(!buffer[from]){
					buffer[from] = {}
					buffer[from] = mods;
					buffer[from].func = callback;

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
							node.onload = loaded;
						}
					}
				// }
				// check(buffer);
			}
		return I;
	};

	window.module = module();

}());