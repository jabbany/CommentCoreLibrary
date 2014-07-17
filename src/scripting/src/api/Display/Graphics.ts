/**
 * Graphics Polyfill for AS3
 * Author: Jim Chen
 * Part of the CCLScripter
 */
/// <reference path="DisplayObject.ts" />
module Display {
	export class Graphics {
		private _id:String;

		constructor(parent:DisplayObject) {
			this._id = parent.getId();
		}

		private _callDrawMethod(method:string, params):void {
			__pchannel("Runtime:CallMethod", {
				"id": this._id,
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
			this._callDrawMethod("lineTo", [x, y]);
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
		 * Executes a list of drawing commands with their data given in the data array
		 * @param commands - Commands by index
		 * @param data - List of data
		 * @param winding - evenOdd or nonZero
		 */
		public drawPath(commands:Array<number>, data:Array<number>, winding:string = "evenOdd"):void {
			this._callDrawMethod("drawPath", [commands, data, winding]);
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
		 * Given a list of vertices (and optionally indices). Draws triangles to the screen
		 * @param verts - Vertices (x,y) as a list
		 * @param indices - Indices for positions in verts[2 * i], verts[2 * i + 1]
		 * @param uvtData - Texture mapping stuff. Not supported any time soon.
		 * @param culling - "none" shows all triangles, "positive"/"negative" will cull triangles by normal along z-axis
		 */
		public drawTriangles(verts:Array<number>, indices:Array<number> = null, uvtData:Array<number> = null, culling:String = "none"):void {
			if (indices === null) {
				indices = [];
				for (var i = 0; i < verts.length; i += 2) {
					indices.push(i / 2);
				}
			} else {
				indices = indices.slice(0);
			}
			if (indices.length % 3 !== 0) {
				__trace("Graphics.drawTriangles malformed indices count. Must be multiple of 3.", "err");
				return;
			}
			/** Do culling of triangles here to lessen work later **/
			if (culling !== "none") {
				for (var i = 0; i < indices.length / 3; i++) {
					var ux = verts[2 * indices[i * 3 + 1]] - verts[2 * indices[i * 3]],
						uy = verts[2 * indices[i * 3 + 1] + 1] - verts[2 * indices[i * 3] + 1],
						vx = verts[2 * indices[i * 3 + 2]] - verts[2 * indices[i * 3 + 1]],
						vy = verts[2 * indices[i * 3 + 2] + 1] - verts[2 * indices[i * 3 + 1] + 1];
					var zcomp = ux * vy - vx * uy;
					if (zcomp < 0 && culling === "positive" ||
						zcomp > 0 && culling === "negative") {
						/** Remove the indices. Leave the vertices. **/
						indices.splice(i * 3, 3);
						i--;
					}
				}
			}
			this._callDrawMethod("drawTriangles", [verts, indices, culling]);
		}

		/**
		 * Clears everything the current graphics context has drawn
		 */
		public clear():void {
			this._callDrawMethod("clear", []);
		}
	}
}