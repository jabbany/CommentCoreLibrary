/// <reference path="DisplayObject.ts" />

module Display {

  /**
   * Graphics Polyfill for AS3
   * @author Jim Chen
   */
  export class Graphics {
    private _parent:DisplayObject;
    private _lineWidth:number = 1;

    constructor(parent:DisplayObject) {
      if (typeof parent === 'undefined' || parent === null) {
        throw new Error('Cannot initialize a display not bound to an element.');
      }
      this._parent = parent;
    }

    /**
     * Private method to re-evaluate a bounding box for the parent
     * @param {number} x - x coordinate of point
     * @param {number} y - y coordinate of point
     */
    private _evaluateBoundingBox(x:number, y:number):void {
      this._parent.boundingBox.unionCoord(x + this._lineWidth / 2,
        y + this._lineWidth / 2);
    }

    /**
     * Private method to call a drawing method
     * @param {number} method name - method name
     * @param {any} params - parameters to the method
     */
    private _callDrawMethod(method:string, params:any):void {
      __pchannel('Runtime:CallMethod', {
        'id': this._parent.getId(),
        'context': 'graphics',
        'method': method,
        'params': params
      });
    }

    /**
     * Line to point
     * @param {number} x - x coordinate
     * @param {number} y - y coordinate
     */
    public lineTo(x:number, y:number):void {
      this._evaluateBoundingBox(x,y);
      this._callDrawMethod('lineTo', [x, y]);
    }

    /**
     * Move to point
     * @param {number} x - x coordinate
     * @param {number} y - y coordinate
     */
    public moveTo(x:number, y:number):void {
      this._evaluateBoundingBox(x,y);
      this._callDrawMethod('moveTo', [x, y]);
    }

    /**
     * Quadratic Beizer Curve
     * @param {number} cx - Control point x
     * @param {number} cy - Control point y
     * @param {number} ax - Anchor x
     * @param {number} ay - Anchor y
     */
    public curveTo(cx:number, cy:number, ax:number, ay:number):void {
      this._evaluateBoundingBox(ax,ay);
      this._evaluateBoundingBox(cx,cy);
      this._callDrawMethod('curveTo', [cx, cy, ax, ay]);
    }

    /**
     * Cubic Beizer Curve
     * @param {number} cax - Control point A x
     * @param {number} cay - Control point A y
     * @param {number} cbx - Control point B x
     * @param {number} cby - Control point B y
     * @param {number} ax - Anchor x
     * @param {number} ay - Anchor y
     */
    public cubicCurveTo(cax:number,
      cay:number,
      cbx:number,
      cby:number,
      ax:number,
      ay:number):void {

      this._evaluateBoundingBox(cax,cay);
      this._evaluateBoundingBox(cbx,cby);
      this._evaluateBoundingBox(ax,ay);
      this._callDrawMethod('cubicCurveTo', [cax, cay, cbx, cby, ax, ay]);
    }

    /**
     * Set line style
     * @param {number} thickness - line thickness
     * @param {number} color - line color (default 0)
     * @param {number} alpha - alpha (default 1)
     * @param {boolean} hinting - pixel hinting (default false)
     * @param {string} scale - scale mode (default "normal")
     * @param {string} caps - line cap mode (default "none")
     * @param {strings} joints - line joint mode (default "round")
     * @param {number} miterlim - miter limit (default 3)
     */
    public lineStyle(thickness:number,
      color:number = 0,
      alpha:number = 1.0,
      hinting:boolean = false,
      scale:string = 'normal',
      caps:string = 'none',
      joints:string = 'round',
      miter:number = 3):void {

      this._lineWidth = thickness;
      this._callDrawMethod('lineStyle', [thickness, color, alpha, caps, joints, miter]);
    }

    /**
     * Draw a rectangle
     * @param {number} x - x coordinate
     * @param {number} y - y coordinate
     * @param {number} w - width
     * @param {number} h - height
     */
    public drawRect(x:number, y:number, w:number, h:number):void {
      this._evaluateBoundingBox(x,y);
      this._evaluateBoundingBox(x + w,y + h);
      this._callDrawMethod('drawRect', [x, y, w, h]);
    }

    /**
     * Draws a circle
     * @param {number} x - center x
     * @param {number} y - center y
     * @param {number} r - radius
     */
    public drawCircle(x:number, y:number, r:number):void {
      this._evaluateBoundingBox(x - r,y - r);
      this._evaluateBoundingBox(x + r,y + r);
      this._callDrawMethod('drawCircle', [x, y , r]);
    }

    /**
     * Draws an ellipse
     * @param {number} cx - center x
     * @param {number} cy - center y
     * @param {number} w - width
     * @param {number} h - height
     */
    public drawEllipse(cx:number, cy:number, w:number, h:number):void {
      this._evaluateBoundingBox(cx - w/2,cy - h/2);
      this._evaluateBoundingBox(cx + w/2,cy + h/2);
      this._callDrawMethod('drawEllipse', [cx + w / 2, cy + h / 2, w / 2, h / 2]);
    }

    /**
     * Draws a rounded rectangle
     * @param {number} x - x coordinate
     * @param {number} y - y coordinate
     * @param {number} w - width
     * @param {number} h - height
     * @param {number} elw - ellipse corner width
     * @param {number} elh - ellipse corner height
     */
    public drawRoundRect(x:number,
      y:number,
      w:number,
      h:number,
      elw:number,
      elh:number):void {

      this._evaluateBoundingBox(x,y);
      this._evaluateBoundingBox(x+w,y+h);
      this._callDrawMethod('drawRoundRect', [x, y, w, h, elw, elh]);
    }

    /**
     * Executes a list of drawing commands with their data given in the data array
     * @param {Array<number>} commands - Commands by index
     * @param {Array<number>} data - List of data
     * @param {string} winding - evenOdd or nonZero
     */
    public drawPath(commands:Array<number>, data:Array<number>, winding:string = "evenOdd"):void {
      /** TODO: Evaluate bounding box **/
      this._callDrawMethod('drawPath', [commands, data, winding]);
    }

    /**
     * Fill next shape with solid color
     * @param {number} color - color RGB values
     * @param {number} alpha - alpha value
     */
    public beginFill(color:number, alpha:number = 1.0):void {
      this._callDrawMethod('beginFill', [color, alpha]);
    }

    /**
     * Gradient Fill Not Supported yet
     */
    public beginGradientFill(fillType:string,
      colors:Array<number>,
      alphas:Array<number>,
      ratios:Array<number>,
      matrix:Matrix = null,
      spreadMethod:string = 'pad',
      interpolationMethod:string = 'rgb',
      focalPointRatio:number = 0):void {

      __trace('Graphics.beginGradientFill still needs work.', 'warn');
      if (fillType !== 'linear' && fillType !== 'radial') {
        __trace('Graphics.beginGradientFill unsupported fill type : ' +
          fillType, 'warn');
        return;
      }
      this._callDrawMethod('beginGradientFill', [
        fillType,
        colors,
        alphas,
        ratios,
        matrix === null ? null : matrix.serialize,
        spreadMethod,
        interpolationMethod,
        focalPointRatio]);
    }

    /**
     * Shader Fill Not Supported yet
     */
    public beginShaderFill(shader:any, matrix:Matrix):void {
      __trace('Graphics.beginShaderFill not supported.', 'warn');
    }

    /**
     * Stop and finalize fill
     */
    public endFill():void {
      this._callDrawMethod('endFill', []);
    }

    /**
     * Given a list of vertices (and optionally indices). Draws triangles to the screen
     * @param {Array<number>} verts - Vertices (x,y) as a list
     * @param {Array<number>} indices - Indices for positions in verts[2 * i], verts[2 * i + 1]
     * @param {Array<number>} uvtData - Texture mapping stuff. Not supported any time soon.
     * @param {string} culling - "none" shows all triangles, "positive"/"negative" will cull triangles by normal along z-axis
     */
    public drawTriangles(verts:Array<number>,
      indices:Array<number> = null,
      uvtData:Array<number> = null,
      culling:String = 'none'):void {

      if (indices === null) {
        indices = [];
        for (var i = 0; i < verts.length; i += 2) {
          indices.push(i / 2);
        }
      } else {
        indices = indices.slice(0);
      }
      if (indices.length % 3 !== 0) {
        __trace('Graphics.drawTriangles malformed indices count. ' +
          'Must be multiple of 3.', 'err');
        return;
      }
      /** Do culling of triangles here to lessen work later **/
      if (culling !== 'none') {
        for (var i = 0; i < indices.length / 3; i++) {
          var ux = verts[2 * indices[i * 3 + 1]] - verts[2 * indices[i * 3]],
            uy = verts[2 * indices[i * 3 + 1] + 1] - verts[2 * indices[i * 3] + 1],
            vx = verts[2 * indices[i * 3 + 2]] - verts[2 * indices[i * 3 + 1]],
            vy = verts[2 * indices[i * 3 + 2] + 1] - verts[2 * indices[i * 3 + 1] + 1];
          var zcomp = ux * vy - vx * uy;
          if (zcomp < 0 && culling === 'positive' ||
            zcomp > 0 && culling === 'negative') {
            /** Remove the indices. Leave the vertices. **/
            indices.splice(i * 3, 3);
            i--;
          }
        }
      }
      /** Update the bounding box **/
      for(var i = 0; i < indices.length; i++){
        this._evaluateBoundingBox(verts[2 * indices[i]], verts[2 * indices[i] + 1]);
      }
      this._callDrawMethod('drawTriangles', [verts, indices, culling]);
    }

    /**
     * Clears everything the current graphics context has drawn
     */
    public clear():void {
      this._parent.boundingBox.setEmpty();
      this._callDrawMethod('clear', []);
    }
  }
}
