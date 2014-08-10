export interface CCLOptions {
	globalScale:number;
	scrollScale:number;
	opacity:number;
}
export interface CommentManager {
	width:number;
	height:number;
	options:CCLOptions;
	finish(c:IComment):void;
}

export interface IMotion {
	from:number;
	to:number;
	delay:number;
	dur:number;
	ttl:number;
	easing:Function;
}

export interface IComment {
	stime:number;
	dur:number;
	ttl:number;
	cindex:number;
	align:number;
	x:number;
	y:number;
	bottom:number;
	right:number;
	width:number;
	height:number;
	time(t:number):void;
	update():void;
	invalidate():void;
	animate():void;
}

export class Comment implements IComment {
	public mode:number = 1;
	public stime:number = 0;
	public text:String = "";
	public ttl:number = 4000;
	public dur:number = 4000;
	public cindex:number = -1;

	public motion:Array<Object> = [];
	private _curMotion:number;
	private _motionStart:Array<number>;
	private _motionEnd:Array<number>;

	public _x:number;
	public _y:number;
	/**
	 * Alignment
	 * @type {number} 0=tl, 2=bl, 1=tr, 3=br
	 */
	public align:number = 0;
	private _width:number;
	private _height:number;
	private _size:number = 25;
	private _color:number = 0xffffff;

	public parent:CommentManager;
	public dom:HTMLDivElement;

	constructor(parent:CommentManager, init:Object = {}) {
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

	get x():number {
		if (this._x === null || this._x === undefined) {
			if (this.align % 2 === 0) {
				this._x = this.dom.offsetLeft;
			} else {
				this._x = this.parent.width - this.dom.offsetLeft - this.width;
			}
		}
		return this._x;
	}

	get y():number {
		if (this._y === null || this._y === undefined) {
			if (this.align < 2) {
				this._y = this.dom.offsetTop;
			} else {
				this._y = this.parent.height - this.dom.offsetTop - this.height;
			}
		}
		return this._y;
	}

	get bottom():number {
		return this.y + this.height;
	}

	get right():number {
		return this.x + this.width;
	}

	get width():number {
		if (this._width === null || this._width === undefined) {
			this._width = this.dom.offsetWidth;
		}
		return this._width;
	}

	get height():number {
		if (this._height === null || this._height === undefined) {
			this._height = this.dom.offsetHeight;
		}
		return this._height;
	}

	get size():number {
		return this._size;
	}

	get color():number {
		return this._color;
	}

	set x(x:number) {
		this._x = x;
		if (this.align % 2 === 0) {
			this.dom.style.left = this._x + "px";
		} else {
			this.dom.style.right = this._x + "px";
		}
	}

	set y(y:number) {
		this._y = y;
		if (this.align < 2) {
			this.dom.style.top = this._x + "px";
		} else {
			this.dom.style.bottom = this._x + "px";
		}
	}

	set width(w:number) {
		this._width = w;
		this.dom.style.width = this._width + "px";
	}

	set height(h:number) {
		this._height = h;
		this.dom.style.height = this._height + "px";
	}

	set size(s:number) {
		this._size = s;
		this.dom.style.fontSize = this._size + "px";
	}

	set color(c:number) {
		this._color = c;
		var color:String = c.toString(16);
		color = color.length >= 6 ? color : new Array(6 - color.length + 1).join("0") + color;
		this.dom.style.color = "#" + color;
	}

	/**
	 * Moves the comment by a number of milliseconds. When
	 * the given parameter is greater than 0 the comment moves
	 * forward. Otherwise it moves backwards.
	 * @param time - elapsed time in ms
	 */
	public time(time:number):void {
		this.ttl -= time;
		this.update();
		if (this.ttl <= 0) {
			this.finish();
		}
	}

	/**
	 * Update the comment's position depending on its mode and
	 * the current ttl/dur values.
	 */
	public update():void {
		this.x = (this.ttl / this.dur) * (this.parent.width + this.width) - this.width;
	}

	/**
	 * Invalidate the comment position.
	 */
	public invalidate():void {
		this._x = null;
		this._y = null;
	}

	/**
	 * Update the comment's position depending on the applied motion
	 * groups.
	 */
	public animate():void {
		this._curMotion;
		for (var i = 0; i < this.motion.length; i++) {

		}
	}

	/**
	 * Remove the comment and do some cleanup.
	 */
	public finish():void {
		this.dom.parentElement.removeChild(this.dom);
		this.parent.finish(this);
	}
}

export class ScrollComment extends Comment {
}

export class ReverseComment extends Comment {
	public update():void {
		this.dom.style.left = (1 - this.ttl / this.dur) * (this.parent.width + this.width) - this.width + "px";
	}
}

export class AnchorComment extends Comment {
}

export class PositionComment extends Comment {

}
