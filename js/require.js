(function(){
	var require = function(url, callback){
		var head = document.getElementsByTagName("head")[0];
		var node = document.createElement("script");
			node.src = url;

		head.appendChild(node);
		callback && callback();
	}

}());