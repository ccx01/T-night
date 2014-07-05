(function(){

	var module = (function(){
		var mod = {};
		var I = {};
		I.load = function(name){
			mod[name] = 0;
		}
		I.loaded = function(name){
			mod[name] = 1;
		}
		I.ready = function(name){
			// if(...) start();
		}
		return I;
	}());

	var require = function(url, callback){
		var name = url.match(/(\w+).js/)[0];
		var head = document.getElementsByTagName("head")[0];
		var node = document.createElement("script");
			node.src = url;

		head.appendChild(node);

		module.load(name);
		node.onload = function() {
			module.loaded(name);
			callback && callback();
			node.onload = null;
		}
	}
	// require("js/characters/test.js", function(){
	// 	ready()
	// });

}());