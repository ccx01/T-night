(function(){

	var module = (function(){
		var total_mod = {};
		var I = {};
		I.load = function(name, obj){
			total_mod[name] = obj;
		}
		I.require = function(mods, callback){
			var loaded_mod = {};
			var loaded_num = 0;
			for (var i = 0, len = mods.length; i < len; i++) {
				var name = mods[i].name;
				var url = mods[i].url;

				if(total_mod[name]){
					loaded_num++;
					loaded_mod[name] = total_mod[name];
					if(loaded_num == mods.length){
						callback && callback(loaded_mod);
						node.onload = null;
					}
					continue;
				}

				var head = document.getElementsByTagName("head")[0];
				var node = document.createElement("script");
					node.src = url;

				head.appendChild(node);

				node.onload = function() {
					loaded_num++;
					loaded_mod[name] = total_mod[name];
					if(loaded_num == mods.length){
						callback && callback(loaded_mod);
						node.onload = null;
					}
				}
			}
		}
		return I;
	}());

	window.module = module;

}());
/*	var m = [{
			"name": "test",
			"url": "js/characters/test.js"
		},{
			"name": "test",
			"url": "js/characters/test1.js"
		}]
	module.require(m, function(data){
		console.log("require",data)
		// ready()
	});*/