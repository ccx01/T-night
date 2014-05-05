(function(window) {
	window.requestAnimationFrame = (function() {
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || function(callback) {
			return window.setTimeout(callback, 1000 / 60); // shoot for 60 fps
		};
	})();

	window.cancelAnimationFrame = (function() {
		return window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || function(id) {
			window.clearTimeout(id);
		};
	})();

	/* OBB function */
	var OBB = function(centerPoint, width, height, rotation) {

		this.centerPoint = centerPoint;
		this.extents = [width / 2, height / 2];
		this.axes = [new Vector2(Math.cos(rotation), Math.sin(rotation)), new Vector2(-1 * Math.sin(rotation), Math.cos(rotation))];

		this._width = width;
		this._height = height;
		this._rotation = rotation;
	}

	window.OBB = OBB;

	OBB.prototype = {
		getProjectionRadius: function(axis) {
			return this.extents[0] * Math.abs(axis.dot(this.axes[0])) + this.extents[1] * Math.abs(axis.dot(this.axes[1]));
		}
	};

	Vector2 = function(x, y) {
		this.x = x || 0;
		this.y = y || 0;
	};

	Vector2.prototype = {
		sub: function(v) {
			return new Vector2(this.x - v.x, this.y - v.y)
		},
		dot: function(v) {
			return this.x * v.x + this.y * v.y;
		}
	};
	window.Vector2 = Vector2;

	var CollisionDetector = {
		detectorOBBvsOBB: function(OBB1, OBB2) {
			var nv = OBB1.centerPoint.sub(OBB2.centerPoint);
			var axisA1 = OBB1.axes[0];
			if (OBB1.getProjectionRadius(axisA1) + OBB2.getProjectionRadius(axisA1) <= Math.abs(nv.dot(axisA1))) return false;
			var axisA2 = OBB1.axes[1];
			if (OBB1.getProjectionRadius(axisA2) + OBB2.getProjectionRadius(axisA2) <= Math.abs(nv.dot(axisA2))) return false;
			var axisB1 = OBB2.axes[0];
			if (OBB1.getProjectionRadius(axisB1) + OBB2.getProjectionRadius(axisB1) <= Math.abs(nv.dot(axisB1))) return false;
			var axisB2 = OBB2.axes[1];
			if (OBB1.getProjectionRadius(axisB2) + OBB2.getProjectionRadius(axisB2) <= Math.abs(nv.dot(axisB2))) return false;
			return true;
		}
	}

	window.CollisionDetector = CollisionDetector;
	/* OBB function end */

	/* check buff array */
	Array.prototype.S = String.fromCharCode(2);
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
	};
	/* check buff array end */

})(window);