/**
 * Graphics Polyfill for AS3
 * Author: Jim Chen
 * Part of the CCLScripter
 */
class Graphics {
	private id:String;

	constructor(parent:DisplayObject) {
		id = parent.getId();
	}

	private _callDrawMethod(method:string, params):void {
		__pchannel("Runtime:CallMethod", {
			"id": id,
			"context": "graphics",
			"method": method,
			"params": params
		});
	}

	/**
	 * Line to point
	 * @param x - x coordinate
	 * @param y - y coordinate
	 */
	public lineTo(x:number, y:number):void {
		this._callDrawMethod("lineTo", [a, b]);
	}

	/**
	 * Move to point
	 * @param x - x coordinate
	 * @param y - y coordinate
	 */
	public moveTo(x:number, y:number):void {
		this._callDrawMethod("moveTo", [x, y]);
	}

	/**
	 * Quadratic Beizer Curve
	 * @param cx - Control point x
	 * @param cy - Control point y
	 * @param ax - Anchor x
	 * @param ay - Anchor y
	 */
	public curveTo(cx:number, cy:number, ax:number, ay:number):void {
		this._callDrawMethod("curveTo", [cx, cy, ax, ay]);
	}

	/**
	 * Cubic Beizer Curve
	 * @param cax - Control point A x
	 * @param cay - Control point A y
	 * @param cbx - Control point B x
	 * @param cby - Control point B y
	 * @param ax - Anchor x
	 * @param ay - Anchor y
	 */
	public cubicCurveTo(cax:number, cay:number, cbx:number, cby:number, ax:number, ay:number):void {
		this._callDrawMethod("cubicCurveTo", [cax, cay, cbx, cby, ax, ay]);
	}

	/**
	 * Set line style
	 * @param thickness - line thickness
	 * @param color - line color (default 0)
	 * @param alpha - alpha (default 1)
	 * @param hinting - pixel hinting (default false)
	 * @param scale - scale mode (default "normal")
	 * @param caps - line cap mode (default "none")
	 * @param joints - line joint mode (default "round")
	 * @param miterlim - miter limit (default 3)
	 */
	public lineStyle(thickness:number, color:number = 0, alpha:number = 1.0, hinting:boolean = false, scale:string = "normal", caps:string = "none", joints:string = "round", miter:number = 3):void {
		this._callDrawMethod("lineStyle", [thickness, color, alpha, caps, joints, miter]);
	}

	/**
	 * Draw a rectangle
	 * @param x - x coordinate
	 * @param y - y coordinate
	 * @param w - width
	 * @param h - height
	 */
	public drawRect(x:number, y:number, w:number, h:number):void {
		this._callDrawMethod("drawRect", [x, y, w, h]);
	}

	/**
	 * Draws a circle
	 * @param x - center x
	 * @param y - center y
	 * @param r - radius
	 */
	public drawCircle(x:number, y:number, r:number):void {
		this._callDrawMethod("drawCircle", [x, y , r]);
	}

	/**
	 * Draws an ellipse
	 * @param cx - center x
	 * @param cy - center y
	 * @param w - width
	 * @param h - height
	 */
	public drawEllipse(cx:number, cy:number, w:number, h:number):void {
		this._callDrawMethod("drawEllipse", [cx + w / 2, cy + h / 2, w / 2, h / 2]);
	}

	/**
	 * Draws a rounded rectangle
	 * @param x - x coordinate
	 * @param y - y coordinate
	 * @param w - width
	 * @param h - height
	 * @param elw - ellipse corner width
	 * @param elh - ellipse corner height
	 */
	public drawRoundRect(x:number, y:number, w:number, h:number, elw:number, elh:number):void {
		this._callDrawMethod("drawRoundRect", [x, y, w, h, elw, elh]);
	}

	/**
	 * Fill next shape with solid color
	 * @param color
	 * @param alpha
	 */
	public beginFill(color:number, alpha:number = 1.0):void {
		this._callDrawMethod("beginFill", [color, alpha]);
	}

	/**
	 * Gradient Fill Not Supported yet
	 */
	public beginGradientFill():void {
		__trace("Graphics: Gradients not supported yet.", 'warn');
	}

	/**
	 * Shader Fill Not Supported yet
	 */
	public beginShaderFill():void {
		__trace("Graphics: Shaders not supported yet.", 'warn');
	}

	/**
	 * Stop and finalize fill
	 */
	public endFill():void {
		this._callDrawMethod("endFill", []);
	}

	/**
	 * Clears everything the current graphics context has drawn
	 */
	public clear():void {
		this._callDrawMethod("clear", []);
	}
}