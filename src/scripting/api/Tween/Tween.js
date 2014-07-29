var Tween = new function () {
	function ITween(dur) {
		this.currentTime = 0;
		this.duration = dur > 0 ? dur : 0;
		this.isPlaying = false;
		this.stopOnComplete = true;
		this.__timer = -1;
		this.__timestamp = 0;
		this.step = function () {
		};
	}

	ITween.prototype.clone = function () {
		var n = new ITween(this.duration);
		n.step = this.step;
		return n;
	};

	ITween.prototype.play = function () {
		if (this.isPlaying)
			return;
		this.gotoAndPlay(this.currentTime);
	};

	ITween.prototype.stop = function () {
		if (!this.isPlaying)
			return;
		this.gotoAndStop(this.currentTime);
	};

	ITween.prototype.gotoAndPlay = function (t) {
		this.gotoAndStop(t);
		var self = this;
		if (self.duration === 0)
			return;
		this.__timestamp = (new Date()).getTime();
		this.__timer = setInterval(function () {
			if (self.duration === 0)
				return;
			if (self.currentTime >= self.duration) {
				if (self.stopOnComplete) {
					self.stop(); // Stop
				} else {
					self.gotoAndPlay(0); // Loop
				}
			}
			var t = (new Date()).getTime();
			self.currentTime += t - self.__timestamp;
			self.__timestamp = t;
			self.step(self.currentTime, self.duration);
		}, 50);
		this.isPlaying = true;
	};

	ITween.prototype.gotoAndStop = function (t) {
		// Seek to playhead;
		if (t < this.duration) {
			this.currentTime = t;
		} else {
			this.currentTime = this.duration;
		}
		if (this.isPlaying) {
			clearInterval(this.__timer);
			this.__timer = -1;
		}
		this.isPlaying = false;
	};

	ITween.prototype.togglePause = function (t) {
		if (this.isPlaying) {
			this.stop();
		} else {
			this.play();
		}
	};

	this.tween = function (obj, dest, src, duration, easing) {
		// First initialize stuff
		if (!src)
			src = {};
		for (var y in src) {
			obj[y] = src[y];
		}
		for (var x in dest) {
			if (!src[x]) {
				src[x] = obj[x];
			}
		}
		// Assume everything is numbers
		var tweenf = new ITween(duration * 1000);
		tweenf.step = function (currentTime, duration) {
			for (var x in dest) {
				var curval = (dest[x] - src[x]) * (currentTime / duration) + src[x];
				obj[x] = curval;
			}
		};
		return tweenf;
	};

	this.to = function (obj, dest, duration, easing) {
		this.tween(obj, dest, null, duration, easing);
	};

	this.beizer = function () {
		__trace("Beizer not supported yet.", "warn");
	};

	this.scale = function (itw, scale) {
		var ntw = itw.clone();
		ntw.duration *= scale;
		return ntw;
	};

	this.delay = function (tw, delay) {
		return this.serial(new ITween(delay), tw.clone());
	};

	this.reverse = function (itw) {
		var ntw = new ITween(itw.duration);
		var oldStep = itw.step;
		ntw.step = function (currentTime, duration) {
			oldStep(duration - currentTime, duration);
		};
		return ntw;
	};

	this.repeat = function (itw, times) {
		// TODO: Fix this to be more effecient
		var t = itw.clone;
		for (var i = 1; i < times; i++) {
			t = this.serial(t, itw.clone());
		}
		;
		return t;
	};

	this.slice = function (itw, from, to) {
		var ntw = new ITween(to - from);
		ntw.step = function (currentTime, duration) {
			itw.step(currentTime + from, itw.duration);
		};
		return ntw;
	};

	this.serial = function () {
		var tweens = [];
		var totalTime = 0;
		for (var i = 0; i < arguments.length; i++) {
			tweens.push(arguments[i]);
			totalTime += arguments[i].duration;
		}

		if (tweens.length === 0) {
			return new ITween(0);
		}
		var current = tweens[0], currentIdx = 0, beforeT = 0;
		var tween = new ITween(totalTime);
		//TODO: Write step function
		return tween;
	};

	this.parallel = function () {
		var tweens = [];
		var maxTime = 0;
		for (var i = 0; i < arguments.length; i++) {
			tweens.push(arguments[i]);
			maxTime = Math.max(arguments[i].duration, maxTime);
		}
		var tween = new ITween(maxTime);
		tween.step = function (cT, dur) {
			for (var i = 0; i < tweens.length; i++) {
				if (cT < tweens[i].duration) {
					tweens[i].step(cT, tweens[i].duration);
				}
			}
		};
		return tween;
	};
};
