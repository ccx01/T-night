/***
模块名定义在对应模块里，调用时需填写正确模块名
***/
(function(){

	var module = function(){
		//公共状态
		var head = document.getElementsByTagName("head")[0];
		//load时记录当前模块的require和callback
		var buffer = {};
		var loaded = function(){
			for(var from in buffer){
				var ready = true;
				// var con = []
				for (var i = 0, len = buffer[from].length; i < len; i++) {
					if(!I.mod[buffer[from][i].name]){
						ready = false;
					}
					// var con = [from,buffer[from][i].name,I.mod[buffer[from][i].name]]
				}
				if(ready){
					console.log(arguments,from,buffer,I.mod)
					// console.log("check",arguments,ready,from,con)
					buffer[from].func(I.mod);
					delete buffer[from];
				}
			}
		}
		setInterval(loaded,300)
		var I = {};
			I.mod = [];
			I.add = function(name, obj){
				// console.log(name,I.mod,!I.mod[name])
				if(!I.mod[name]){
					// console.log(buffer,name)
					I.mod[name] = obj;
					// loaded("add",name);
				}
			}
			I.load = function(from, mods, callback ){
				// console.log(buffer,from,buffer[from])
				// console.log(!buffer[from],from)
				if(!buffer[from]){
					buffer[from] = {}
					buffer[from] = mods;
					buffer[from].func = callback;

					for (var i = 0, len = mods.length; i < len; i++) {

						var name = mods[i].name;
						var url = mods[i].url;

						if(document.querySelector("#" + name)){
							// loaded("loaded");
							continue;
						}else{
							var node = document.createElement("script");
								node.src = url;
								node.id = name;

							//多重加载要处理
							head.appendChild(node);
							// node.onload = loaded;
						}
					}
				}
				// check(buffer);
			}
		return I;
	};

	window.module = module();

}());