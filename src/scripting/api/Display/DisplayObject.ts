/// <reference path="../Runtime.d.ts" />
/// <reference path="ISerializable.ts" />

/// <reference path="Display.ts" />
/// <reference path="Transform.ts" />
/// <reference path="Filter.ts" />
/// <reference path="ColorTransform.ts" />

module Display {
  export class BlendMode {
    static ADD:string = "add";
    static ALPHA:string = "alpha";
    static DARKEN:string = "darken";
    static DIFFERENCE:string = "difference";
    static ERASE:string = "erase";
    static HARDLIGHT:string = "hardlight";
    static INVERT:string = "invert";
    static LAYER:string = "layer";
    static LIGHTEN:string = "lighten";
    static MULTIPLY:string = "multiply";
    static NORMAL:string = "normal";
    static OVERLAY:string = "overlay";
    static SCREEN:string = "screen";
    static SHADER:string = "shader";
    static SUBTRACT:string = "subtract";
  }

  export class Rectangle implements ISerializable{
    private _x:number;
    private _y:number;
    private _width:number;
    private _height:number;
    constructor(x:number = 0,
      y:number = 0,
      width:number = 0,
      height:number = 0) {

      this._x = x;
      this._y = y;
      this._width = width;
      this._height= height;
    }

    public set x(v:number) {
      if (v !== null) {
        this._x = v;
      }
    }

    public set y(v:number) {
      if (v !== null) {
        this._y = v;
      }
    }

    public set width(v:number) {
      if (v !== null) {
        this._width = v;
      }
    }

    public set height(v:number) {
      if (v !== null) {
        this._height = v;
      }
    }

    public get x():number {
      return this._x;
    }

    public get y():number {
      return this._y;
    }

    public get width():number {
      return this._width;
    }

    public get height():number {
      return this._height;
    }

    public get left():number {
      return this._x;
    }

    public get right():number {
      return this._x + this._width;
    }

    public get top():number {
      return this._y;
    }

    public get bottom():number {
      return this._y + this._height;
    }

    public get size():any {
      return Display.createPoint(this._width, this._height);
    }

    public contains(x:number, y:number):boolean {
      return x >= this.left &&
        y >= this.top &&
        x <= this.right &&
        y <= this.bottom;
    }

    public containsPoint(p:Display.Point):boolean {
      return this.contains(p.x, p.y);
    }

    public containsRect(r:Rectangle):boolean {
      return this.contains(r.left, r.top) && this.contains(r.right, r.bottom);
    }

    public copyFrom(source:Rectangle):void {
      this._x = source._x;
      this._y = source._y;
      this._width = source._width;
      this._height = source._height;
    }

    public equals(other:Rectangle):boolean {
      return this._x === other._x &&
        this._y === other._y &&
        this._width === other._width &&
        this._height === other._height;
    }

    public inflate(dx:number = 0, dy:number = 0):void {
      this._x -= dx;
      this._width += 2 * dx;
      this._y -= dy;
      this._height += 2 * dy;
    }

    public inflatePoint(p:Display.Point):void {
      this.inflate(p.x, p.y);
    }

    public isEmpty():boolean {
      return this._width <= 0 || this.height <= 0;
    }

    public setTo(x:number = 0,
      y:number = 0,
      width:number = 0,
      height:number = 0):void {

      this._x = x;
      this._y = y;
      this._width = width;
      this._height = height;
    }

    public offset(x:number = 0, y:number = 0):void {
      this._x += x;
      this._y += y;
    }

    public offsetPoint(p:Point):void {
      this.offset(p.x, p.y);
    }

    public setEmpty():void {
      this.setTo(0,0,0,0);
    }

    /**
     * Unions the rectangle with a point coordinate
     * @param x - x coordinate
     * @param y - y coordinate
     */
    public unionCoord(x:number, y:number):void {
      var dx:number = x - this._x;
      var dy:number = y - this._y;
      if (dx >= 0) {
        this._width = Math.max(this._width, dx);
      } else {
        this._x += dx;
        this._width -= dx;
      }
      if (dy >= 0) {
        this._height = Math.max(this._height, dy);
      } else {
        this._y += dy;
        this._height -= dy;
      }
    }

    public unionPoint(p:Display.Point):void {
      this.unionCoord(p.x,p.y);
    }

    public union(r:Rectangle):Rectangle {
      var n = this.clone();
      n.unionCoord(r.left, r.top);
      n.unionCoord(r.right, r.bottom);
      return n;
    }

    public toString():string {
      return "(x=" + this._x + ", y=" + this._y + ", width=" + this._width +
        ", height=" + this._height + ")";
    }

    public clone():Rectangle {
      return new Rectangle(this._x, this._y, this._width, this._height);
    }

    public serialize():Object {
      return {
        x: this._x,
        y: this._y,
        width: this._width,
        height: this._height
      };
    }
  }

  export class DisplayObject implements ISerializable, Runtime.RegisterableObject, Transformable {
    private static SANDBOX_EVENTS:Array<string> = ["enterFrame"];
    /** This represents an element in the HTML rendering **/
    private _id:string;
    private _alpha:number = 1;
    private _anchor:Display.Point = new Point();
    private _boundingBox:Rectangle = new Rectangle();
    private _z:number = 0;
    private _scaleX:number = 1;
    private _scaleY:number = 1;
    private _scaleZ:number = 1;
    private _rotationX:number = 0;
    private _rotationY:number = 0;
    private _rotationZ:number = 0;
    private _filters:Array<Filter> = [];
    private _visible:boolean = false;
    private _blendMode:string = "normal";
    private _listeners:Object = {};
    private _parent:DisplayObject = null;
    private _name:string = "";
    private _children:Array<DisplayObject> = [];
    private _transform:Transform = new Transform(this);
    private _hasSetDefaults:boolean = false;

    constructor(id:string = Runtime.generateId()) {
      this._id = id;
      this._visible = true;
    }

    public setDefaults(defaults:Object = {}):void {
      if (this._hasSetDefaults) {
        __trace("DisplayObject.setDefaults called more than once.", "warn");
        return;
      }
      this._hasSetDefaults = true;
      try {
        /** Try reading the defaults from motion fields **/
        if (defaults.hasOwnProperty("motion")) {
          var motion:Object = defaults["motion"];
          if (motion.hasOwnProperty("alpha")) {
            this._alpha = motion["alpha"]["fromValue"];
          }
          if (motion.hasOwnProperty("x")) {
            this._anchor.x = motion["x"]["fromValue"];
          }
          if (motion.hasOwnProperty("y")) {
            this._anchor.y = motion["y"]["fromValue"];
          }
        } else if (defaults.hasOwnProperty("motionGroup") &&
          defaults["motionGroup"] && defaults["motionGroup"].length > 0) {
          var motion:Object = defaults["motionGroup"][0];
          if (motion.hasOwnProperty("alpha")) {
            this._alpha = motion["alpha"]["fromValue"];
          }
          if (motion.hasOwnProperty("x")) {
            this._anchor.x = motion["x"]["fromValue"];
          }
          if (motion.hasOwnProperty("y")) {
            this._anchor.y = motion["y"]["fromValue"];
          }
        }
      } catch (e) {

      }
      if (defaults.hasOwnProperty("alpha")) {
        this._alpha = defaults["alpha"];
      }
      if (defaults.hasOwnProperty("x")) {
        this._anchor.x = defaults["x"];
      }
      if (defaults.hasOwnProperty("y")) {
        this._anchor.y = defaults["y"];
      }
    }

    /**
     * These are meant to be internal public methods, so they
     * are named noun-verb instead of verb-noun
     */

    public eventToggle(eventName:string, mode:string = "enable"):void {
      if (DisplayObject.SANDBOX_EVENTS.indexOf(eventName) > -1) {
        return;
        /* No need to notify */
      }
      __pchannel("Runtime:ManageEvent", {
        "id": this._id,
        "name": eventName,
        "mode": mode
      });
    }

    public propertyUpdate(propertyName:string, updatedValue:any):void {
      __pchannel("Runtime:UpdateProperty", {
        "id": this._id,
        "name": propertyName,
        "value": updatedValue
      });
    }

    public methodCall(methodName:string, params:any):void {
      __pchannel("Runtime:CallMethod", {
        "id": this._id,
        "method": methodName,
        "params": params
      });
    }

    /** Properties **/
    public set alpha(value:number) {
      this._alpha = value;
      this.propertyUpdate("alpha", value);
    }

    public get alpha():number {
      return this._alpha;
    }

    public set anchor(p:Point) {
      this._anchor = p;
      this.propertyUpdate("x", p.x);
      this.propertyUpdate("y", p.y);
    }

    public get anchor():Point {
      return this._anchor;
    }

    public set boundingBox(r:Rectangle) {
      this._boundingBox = r;
      this.propertyUpdate("boundingBox", r.serialize());
    }

    public get boundingBox():Rectangle {
      return this._boundingBox;
    }

    public set cacheAsBitmap(value:boolean) {
      __trace("DisplayObject.cacheAsBitmap is not supported", "warn");
    }

    public get cacheAsBitmap():boolean {
      return false;
    }

    public set filters(filters:Array<Filter>) {
      this._filters = filters ? filters : [];
      var serializedFilters:Array<Object> = [];
      for (var i = 0; i < this._filters.length; i++) {
        if(!this.filters[i]){
          continue;
        }
        serializedFilters.push(this._filters[i].serialize());
      }
      this.propertyUpdate("filters", serializedFilters);
    }

    public get filters():Array<Filter> {
      return this._filters;
    }

    public get root():DisplayObject {
      return Display.root;
    }

    public set root(s:DisplayObject) {
      __trace("DisplayObject.root is read-only.","warn");
    }

    public get stage():DisplayObject {
      return Display.root;
    }

    public set stage(s:DisplayObject) {
      __trace("DisplayObject.stage is read-only.","warn");
    }

    /** Start Transform Area **/
    private _updateBox(mode:string = this._transform.getMatrixType()):void {
      if (mode === "3d") {
        this._transform.box3d(this._scaleX,
          this._scaleY,
          this._scaleZ,
          this._rotationX,
          this._rotationY,
          this._rotationZ,
          0,
          0,
          this._z);
      } else {
        this._transform.box(this._scaleX,
          this._scaleY,
          this._rotationZ * Math.PI / 180);
      }
      this.transform = this._transform;
    }

    public set rotationX(x:number) {
      this._rotationX = x;
      this._updateBox("3d");
    }

    public set rotationY(y:number) {
      this._rotationY = y;
      this._updateBox("3d");
    }

    public set rotationZ(z:number) {
      this._rotationZ = z;
      this._updateBox();
    }

    public set rotation(r:number) {
      this._rotationZ = r;
      this._updateBox();
    }

    public set scaleX(val:number) {
      this._scaleX = val;
      this._updateBox();
    }

    public set scaleY(val:number) {
      this._scaleY = val;
      this._updateBox();
    }

    public set scaleZ(val:number) {
      this._scaleZ = val;
      this._updateBox("3d");
    }

    public set x(val:number) {
      this._anchor.x = val;
      this.propertyUpdate("x", val);
    }

    public set y(val:number) {
      this._anchor.y = val;
      this.propertyUpdate("y", val);
    }

    public set z(val:number) {
      this._z = val;
      this._updateBox("3d");
    }

    public get rotationX():number {
      return this._rotationX;
    }

    public get rotationY():number {
      return this._rotationY;
    }

    public get rotationZ():number {
      return this._rotationZ;
    }

    public get rotation():number {
      return this._rotationZ;
    }

    public get scaleX():number {
      return this._scaleX;
    }

    public get scaleY():number {
      return this._scaleY;
    }

    public get scaleZ():number {
      return this._scaleZ;
    }

    public get x():number {
      return this._anchor.x;
    }

    public get y():number {
      return this._anchor.y;
    }

    public get z():number {
      return this._z;
    }
    /** End Transform Area **/

    public set width(w:number) {
      this._boundingBox.width = w;
      this.propertyUpdate('width', w);
    }

    public get width():number {
      return this._boundingBox.width;
    }

    public set height(h:number) {
      this._boundingBox.height = h;
      this.propertyUpdate('height', h);
    }

    public get height():number {
      return this._boundingBox.height;
    }

    public set visible(visible:boolean) {
      this._visible = visible;
      this.propertyUpdate('visible', visible);
    }

    public get visible():boolean {
      return this._visible;
    }

    public set blendMode(blendMode:string) {
      this._blendMode = blendMode;
      this.propertyUpdate('blendMode', blendMode);
    }

    public get blendMode():string {
      return this._blendMode;
    }

    public set transform(t:any) {
      this._transform = t;
      if (this._transform.parent !== this) {
        this._transform.parent = this;
      }
      this.propertyUpdate('transform', this._transform.serialize());
    }

    public get transform():any {
      return this._transform;
    }

    public set name(name:string) {
      this._name = name;
      this.propertyUpdate('name', name);
    }

    public get name():string {
      return this._name;
    }

    public set loaderInfo(name:any) {
      __trace("DisplayObject.loaderInfo is read-only", "warn");
    }

    public get loaderInfo():any {
      __trace("DisplayObject.loaderInfo is not supported", "warn");
      return {};
    }

    public set parent(p:DisplayObject) {
      __trace("DisplayObject.parent is read-only", "warn");
    }

    public get parent():DisplayObject {
      return this._parent !== null ? this._parent : Display.root;
    }

    /** AS3 Stuff **/
    public dispatchEvent(event:string, data?:any):void {
      if (this._listeners.hasOwnProperty(event)) {
        if (this._listeners[event] !== null) {
          for (var i = 0; i < this._listeners[event].length; i++) {
            try {
              this._listeners[event][i](data);
            } catch (e) {
              if (e.hasOwnProperty('stack')) {
                __trace(e.stack.toString(), 'err');
              } else {
                __trace(e.toString(), 'err');
              }
            }
          }
        }
      }
    }

    public addEventListener(event:string, listener:Function):void {
      if (!this._listeners.hasOwnProperty(event)) {
        this._listeners[event] = [];
      }
      this._listeners[event].push(listener);
      if (this._listeners[event].length === 1) {
        this.eventToggle(event, 'enable');
      }
    }

    public removeEventListener(event:string, listener:Function):void {
      if (!this._listeners.hasOwnProperty(event) ||
        this._listeners[event].length === 0) {
        return;
      }
      var index = this._listeners[event].indexOf(listener);
      if (index >= 0) {
        this._listeners[event].splice(index, 1);
      }
      if (this._listeners[event].length === 0) {
        this.eventToggle(event, 'disable');
      }
    }

    /** DisplayObjectContainer **/
    get numChildren():number {
      return this._children.length;
    }

    public addChild(o:DisplayObject):void {
      // Make sure we're not adding a child onto a parent
      if (typeof o === 'undefined' || o === null) {
        throw new Error('Cannot add an empty child!');
      }
      if (o.contains(this)) {
        throw new Error('Attempting to add an ancestor of this DisplayObject as a child!');
      }
      this._children.push(o);
      this._boundingBox.unionCoord(o._anchor.x + o._boundingBox.left, o._anchor.y + o._boundingBox.top);
      this._boundingBox.unionCoord(o._anchor.x + o._boundingBox.right, o._anchor.y + o._boundingBox.bottom);
      o._parent = this;
      this.methodCall('addChild', o._id);
    }

    public removeChild(o:DisplayObject):void {
      var index = this._children.indexOf(o);
      if (index >= 0) {
        this.removeChildAt(index);
      }
    }

    public getChildAt(index:number):DisplayObject {
      if (index < 0 || index > this._children.length) {
        throw new RangeError('No child at index ' + index);
      }
      return this._children[index];
    }

    public getChildIndex(o:DisplayObject):number {
      return this._children.indexOf(o);
    }

    public removeChildAt(index:number):void {
      var o:DisplayObject = this.getChildAt(index);
      this._children.splice(index, 1);
      o._parent = null;
      this.methodCall('removeChild', o._id);
    }

    public removeChildren(begin:number, end:number = this._children.length):void {
      var removed:Array<DisplayObject> = this._children.splice(begin, end - begin);
      var ids:Array<string> = [];
      for (var i = 0; i < removed.length; i++) {
        removed[i]._parent = null;
        ids.push(removed[i]._id);
      }
      this.methodCall('removeChildren', ids);
    }

    public contains(child:DisplayObject):boolean {
      if (child === this) {
        return true;
      }
      if (this._children.indexOf(child) >= 0) {
        return true;
      }
      for (var i = 0; i < this._children.length; i++) {
        if (this._children[i].contains(child)) {
          return true;
        }
      }
      return false;
    }

    /**
     * Removes the object from a parent if exists.
     */
    public remove():void {
      // Remove itself
      if (this._parent !== null) {
        this._parent.removeChild(this);
      } else {
        this.root.removeChild(this);
      }
    }

    public toString():string {
      return '[' + (this._name.length > 0 ? this._name : 'displayObject') +
        ' DisplayObject]@' + this._id;
    }

    /**
     * Clones the current display object
     */
    public clone():DisplayObject {
      var alternate:DisplayObject = new DisplayObject();
      alternate._transform = this._transform.clone();
      alternate._transform.parent = alternate;
      alternate._boundingBox = this._boundingBox.clone();
      alternate._anchor = this._anchor.clone();
      alternate._alpha = this._alpha;
      return alternate;
    }

    public hasOwnProperty(prop:string):boolean {
      if (prop === 'clone') {
        return true;
      }else{
        return Object.prototype.hasOwnProperty.call(this, prop);
      }
    }

    /** Common Functions **/
    public serialize():Object {
      this._hasSetDefaults = true;
      var filters:Array<Object> = [];
      for (var i:number = 0; i < this._filters.length; i++) {
        filters.push(this._filters[i].serialize());
      }
      return {
        'class': 'DisplayObject',
        'x': this._anchor.x,
        'y': this._anchor.y,
        'alpha': this._alpha,
        'filters': filters
      };
    }

    public unload():void {
      this._visible = false;
      this.remove();
      this.methodCall('unload', null);
    }

    public getId():string {
      return this._id;
    }
  }
}
