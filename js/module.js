/***
模块名定义在对应模块里，调用时需填写正确模块名
***/
(function(){

	var module = function(){
		//公共状态
		var head = document.getElementsByTagName("head")[0];
		//load时记录当前模块的require和callback
		var buffer = {};
		var bufferCheck = function(){
			for(var buffer_name in buffer){
				var ready = true;
				for (var i = 0, len = buffer[buffer_name].length; i < len; i++) {
					if(!I.mod[buffer[buffer_name][i].name]){
						ready = false;
					}
				}
				if(ready && !I.mod[buffer_name]){
					buffer[buffer_name].func(I.mod);
					delete buffer[buffer_name];
				}
			}
		}
		var I = {};
			I.mod = [];
			I.add = function(name, obj){
				if(!I.mod[name]){
					I.mod[name] = obj;
					bufferCheck();
				}
			}
			I.load = function(buffer_name, mods, callback){
				if(!buffer[buffer_name]){
					buffer[buffer_name] = {}
					buffer[buffer_name] = mods;
					buffer[buffer_name].func = callback || function(){};

					for (var i = 0, len = mods.length; i < len; i++) {
						var name = mods[i].name;
						var url = mods[i].url;

						if(document.getElementById(name)){
							bufferCheck();
							continue;
						}else{
							var node = document.createElement("script");
								node.src = url;
								node.id = name;

							head.appendChild(node);
							node.onload = bufferCheck;
						}
					}
				}
			}
		return I;
	}

	window.module = module();

}());