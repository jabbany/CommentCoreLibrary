var __extends = this.__extends || function (d, b) {
	for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	function __() {
		this.constructor = d;
	}

	__.prototype = b.prototype;
	d.prototype = new __();
};
var CCL;
(function (CCL) {
	var IComment = (function () {
		function IComment(parent, init) {
			if (typeof init === "undefined") {
				init = {};
			}
			this.mode = 1;
			this.stime = 0;
			this.text = "";
			this.ttl = 4000;
			this.dur = 4000;
			this.motion = [];
			this._size = 25;
			this._color = 0xffffff;
			if (!parent) {
				throw new Error("Comment not bound to comment manager.");
			} else {
				this.parent = parent;
			}
			if (init.hasOwnProperty("mode")) {
				this.mode = parseInt(init["mode"], 10);
			} else {
				this.mode = 1;
			}
			if (init.hasOwnProperty("dur")) {
				this.dur = parseInt(init["dur"], 10);
				this.ttl = this.dur;
			}
			this.dur *= this.parent.options.globalScale;
			this.ttl *= this.parent.options.globalScale;
			if (init.hasOwnProperty("text")) {
				this.text = init["text"];
			}
			if (init.hasOwnProperty("motion")) {
				this._motionStart = [];
				this._motionEnd = [];
				for (var i = 0; i < init["motion"].length; i++) {
					var maxDur = 0;
					for (var k in init["motion"][i]) {
						maxDur = Math.max(init["motion"][i][k].dur, maxDur);
					}
				}
			}
			if (init.hasOwnProperty("color")) {
				this.color = init["color"];
			}
			if (init.hasOwnProperty("size")) {
				this.size = init["size"];
			}
		}

		Object.defineProperty(IComment.prototype, "width", {
			get: function () {
				if (this._width === null || this._width === undefined) {
					this._width = this.dom.offsetWidth;
				}
				return this._width;
			},
			set: function (w) {
				this._width = w;
				this.dom.style.width = this._width + "px";
			},
			enumerable: true,
			configurable: true
		});

		Object.defineProperty(IComment.prototype, "height", {
			get: function () {
				if (this._height === null || this._height === undefined) {
					this._height = this.dom.offsetHeight;
				}
				return this._height;
			},
			set: function (h) {
				this._height = h;
				this.dom.style.height = this._height + "px";
			},
			enumerable: true,
			configurable: true
		});

		Object.defineProperty(IComment.prototype, "size", {
			get: function () {
				return this._size;
			},
			set: function (s) {
				this._size = s;
				this.dom.style.fontSize = this._size + "px";
			},
			enumerable: true,
			configurable: true
		});

		Object.defineProperty(IComment.prototype, "color", {
			get: function () {
				return this._color;
			},
			set: function (c) {
				this._color = c;
				var color = c.toString(16);
				color = color.length >= 6 ? color : new Array(6 - color.length + 1).join("0") + color;
				this.dom.style.color = "#" + color;
			},
			enumerable: true,
			configurable: true
		});


		/**
		 * Moves the comment by a number of milliseconds. When
		 * the given parameter is greater than 0 the comment moves
		 * forward. Otherwise it moves backwards.
		 * @param time - elapsed time in ms
		 */
		IComment.prototype.time = function (time) {
			this.ttl -= time;
			this.update();
			if (this.ttl <= 0) {
				this.finish();
			}
		};

		/**
		 * Update the comment's position depending on its mode and
		 * the current ttl/dur values.
		 */
		IComment.prototype.update = function () {
			this.dom.style.left = (this.ttl / this.dur) * (this.parent.width + this.width) - this.width + "px";
		};

		/**
		 * Updates the comment's position depending on the applied motion
		 * groups.
		 */
		IComment.prototype.animate = function () {
			this._curMotion;
			for (var i = 0; i < this.motion.length; i++) {
			}
		};

		/**
		 * Remove the comment and do some cleanup.
		 */
		IComment.prototype.finish = function () {
			this.dom.parentElement.removeChild(this.dom);
			this.parent.finish(this);
		};
		return IComment;
	})();
	CCL.IComment = IComment;

	var ScrollComment = (function (_super) {
		__extends(ScrollComment, _super);
		function ScrollComment() {
			_super.apply(this, arguments);
		}

		return ScrollComment;
	})(IComment);
	CCL.ScrollComment = ScrollComment;

	var ReverseComment = (function (_super) {
		__extends(ReverseComment, _super);
		function ReverseComment() {
			_super.apply(this, arguments);
		}

		ReverseComment.prototype.update = function () {
			this.dom.style.left = (1 - this.ttl / this.dur) * (this.parent.width + this.width) - this.width + "px";
		};
		return ReverseComment;
	})(IComment);
	CCL.ReverseComment = ReverseComment;

	var AnchorComment = (function (_super) {
		__extends(AnchorComment, _super);
		function AnchorComment() {
			_super.apply(this, arguments);
		}

		return AnchorComment;
	})(IComment);
	CCL.AnchorComment = AnchorComment;

	var PositionComment = (function (_super) {
		__extends(PositionComment, _super);
		function PositionComment() {
			_super.apply(this, arguments);
		}

		return PositionComment;
	})(IComment);
	CCL.PositionComment = PositionComment;
})(CCL || (CCL = {}));
