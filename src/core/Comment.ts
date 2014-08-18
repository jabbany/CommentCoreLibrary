interface CCLOptions {
	globalScale:number;
	scrollScale:number;
	opacity:number;
}
interface CommentManager {
	width:number;
	height:number;
	options:CCLOptions;
	finish(c:IComment):void;
}

interface IMotion {
	from:number;
	to:number;
	delay:number;
	dur:number;
	ttl:number;
	easing:Function;
}

interface IComment {
	dom:any;
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
	movable:boolean;
	border:boolean;
	shadow:boolean;
	font:string;
	color:number;
	alpha:number;
	size:number;
	time(t:number):void;
	update():void;
	invalidate():void;
	animate():void;
}

class CoreComment implements IComment {
	public static LINEAR:Function = function(t:number, b:number, c:number, d:number):number {
		return t * c / d + b;
	};
	public mode:number = 1;
	public stime:number = 0;
	public text:string = "";
	public ttl:number = 4000;
	public dur:number = 4000;
	public cindex:number = -1;

	public motion:Array<Object> = [];
	public movable:boolean = true;
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
	private _border:boolean = false;
	private _alpha:number = 1;
	private _shadow:boolean = true;
	private _font:string = "";

	public parent:CommentManager;
	public dom:HTMLDivElement;

	constructor(parent:CommentManager, init:Object = {}) {
		if (!parent) {
			throw new Error("Comment not bound to comment manager.");
		} else {
			this.parent = parent;
		}
		if (init.hasOwnProperty("stime")){
			this.stime = init["stime"];
		}
		if (init.hasOwnProperty("mode")) {
			this.mode = init["mode"];
		} else {
			this.mode = 1;
		}
		if (init.hasOwnProperty("dur")) {
			this.dur = init["dur"];
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
			this.motion = init["motion"];
			var head = 0;
			for (var i = 0; i < init["motion"].length; i++) {
				this._motionStart.push(head);
				var maxDur = 0;
				for (var k in init["motion"][i]) {
					var m = <IMotion> init["motion"][i][k];
					maxDur = Math.max(m.dur, maxDur);
					if(m.easing === null || m.easing === undefined){
						init["motion"][i][k]["easing"] = CoreComment.LINEAR;
					}
				}
				head += maxDur;
				this._motionEnd.push(head);
			}
			this._curMotion = 0;
		}
		if (init.hasOwnProperty("color")) {
			this._color = init["color"];
		}
		if (init.hasOwnProperty("size")) {
			this._size = init["size"];
		}
		if (init.hasOwnProperty("border")) {
			this._border = init["border"];
		}
		if (init.hasOwnProperty("opacity")) {
			this._alpha = init["opacity"];
		}
		if (init.hasOwnProperty("font")) {
			this._font = init["font"];
		}
		if (init.hasOwnProperty("x")) {
			this._x = init["x"];
		}
		if (init.hasOwnProperty("y")) {
			this._y = init["y"];
		}
		if (init.hasOwnProperty("shadow")) {
			this._shadow = init["shadow"];
		}
	}

	/**
	 * Initializes the DOM element (or canvas) backing the comment
	 * This method takes the place of 'initCmt' in the old CCL
	 */
	public init(recycle:IComment = null):void {
		if (recycle !== null) {
			this.dom = <HTMLDivElement> recycle.dom;
		} else {
			this.dom = document.createElement("div");
		}
		this.dom.className = "cmt";
		this.dom.appendChild(document.createTextNode(this.text));
		this.dom.textContent = this.text;
		this.dom.innerText = this.text;
		this.size = this._size;
		if (this._color != 0xffffff) {
			this.color = this._color;
		}
		this.shadow = this._shadow;
		if (this._font !== "") {
			this.font = this._font;
		}
		if (this._x !== undefined) {
			this.x = this._x;
		}
		if (this._y !== undefined) {
			this.y = this._y;
		}
		if (this._alpha !== 1) {
			this.alpha = this._alpha;
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

	get alpha():number {
		return this._alpha;
	}

	get border():boolean {
		return this._border;
	}

	get shadow():boolean {
		return this._shadow;
	}

	get font():string {
		return this._font;
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
			this.dom.style.top = this._y + "px";
		} else {
			this.dom.style.bottom = this._y + "px";
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
		var color:string = c.toString(16);
		color = color.length >= 6 ? color : new Array(6 - color.length + 1).join("0") + color;
		this.dom.style.color = "#" + color;
		if (this._color === 0) {
			this.dom.className = "cmt rshadow";
		}
	}

	set alpha(a:number) {
		this._alpha = a;
		this.dom.style.opacity = Math.min(this._alpha, this.parent.options.opacity) + "";
	}

	set border(b:boolean) {
		this._border = b;
		if (this._border) {
			this.dom.style.border = "1px solid #00ffff";
		} else {
			this.dom.style.border = "none";
		}
	}

	set shadow(s:boolean) {
		this._shadow = s;
		if (!this._shadow) {
			this.dom.className = "cmt noshadow";
		}
	}

	set font(f:string) {
		this._font = f;
		if (this._font.length > 0) {
			this.dom.style.fontFamily = this._font;
		} else {
			this.dom.style.fontFamily = "";
		}
	}

	/**
	 * Moves the comment by a number of milliseconds. When
	 * the given parameter is greater than 0 the comment moves
	 * forward. Otherwise it moves backwards.
	 * @param time - elapsed time in ms
	 */
	public time(time:number):void {
		this.ttl -= time;
		if (this.movable) {
			this.update();
		}
		if (this.ttl <= 0) {
			this.finish();
		}
	}

	/**
	 * Update the comment's position depending on its mode and
	 * the current ttl/dur values.
	 */
	public update():void {
		this.animate();
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
		if(this.motion.length === 0){
			return;
		}
		if(this.dur - this.ttl > this._motionEnd[this._curMotion]){
			this._curMotion ++;
		}else{
			var currentMotion = this.motion[this._curMotion];
			var time = (this.dur - Math.max(this.ttl,0)) - this._motionStart[this._curMotion];
			for(var prop in currentMotion){
				if(currentMotion.hasOwnProperty(prop)){
					var m = <IMotion> currentMotion[prop];
					this[prop] = m.easing(Math.min(Math.max(time - m.delay, 0), m.dur), m.from, m.to - m.from, m.dur);
				}
			}
		}
	}

	/**
	 * Remove the comment and do some cleanup.
	 */
	public finish():void {
		this.parent.finish(this);
	}

	/**
	 * Returns string representation of comment
	 * @returns {string}
	 */
	public toString():string{
		return ["[", this.stime, "|", this.ttl, "/",this.dur,"]","(",this.mode,")",this.text].join("");
	}
}

class ScrollComment extends CoreComment {
	constructor(parent:CommentManager, data:Object) {
		super(parent, data);
		this.dur *= this.parent.options.scrollScale;
		this.ttl *= this.parent.options.scrollScale;
	}

	public init(recycle:IComment = null):void {
		super.init(recycle);
		this.x = this.parent.width;
	}

	public update():void {
		this.x = (this.ttl / this.dur) * (this.parent.width + this.width) - this.width;
	}
}
