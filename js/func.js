(function(window) {
	window.requestAnimationFrame = (function() {
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || function(callback) {
			return window.setTimeout(callback, 1000 / 60); // shoot for 60 fps
		};
	}());

	window.cancelAnimationFrame = (function() {
		return window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || function(id) {
			window.clearTimeout(id);
		};
	}());

	/* OBB function end */

	/* check buff array */
	/*Array.prototype.S = String.fromCharCode(2);
	Array.prototype.in_array = function(e) {
		var r = new RegExp(this.S + e + this.S);
		return (r.test(this.S + this.join(this.S) + this.S));
	}
	Array.prototype.indexOf = function(val) {
		for (var i = 0; i < this.length; i++) {
			if (this[i] == val) return i;
		}
		return -1;
	};
	Array.prototype.remove = function(val) {
		var index = this.indexOf(val);
		if (index > -1) {
			this.splice(index, 1);
		}
	};*/
	/* check buff array end */

}(window));