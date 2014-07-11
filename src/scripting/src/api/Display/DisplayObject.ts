/**
 * Shape Polyfill for AS3.
 * Author: Jim Chen
 * Part of the CCLScripter
 */
/// <reference path="../Runtime.d.ts" />
/// <reference path="ISerializable.ts" />
/// <reference path="Filter.ts" />
module Display {
	class ColorTransform implements ISerializable {
		public serialize():Object {
			return {};
		}
	}

	class Transform implements ISerializable {
		private _parent:DisplayObject;
		private _matrix:Display.Matrix = new Matrix();
		private _matrix3d:Display.Matrix3D = null;

		constructor(parent:DisplayObject) {
			this._parent = parent;
		}

		set parent(p:DisplayObject) {
			this._parent = p;
		}

		get parent():DisplayObject {
			return this._parent;
		}

		set matrix3D(m:Display.Matrix3D) {
			this._matrix = null;
			this._matrix3d = m;
		}

		set matrix(m:Display.Matrix) {
			this._matrix3d = null;
			this._matrix = m;
		}

		get matrix3D():Display.Matrix3D {
			return this._matrix3d;
		}

		get matrix():Display.Matrix {
			return this._matrix;
		}

		public box3d(sX:number = 1, sY:number = 1, sZ:number = 1, rotX:number = 0, rotY:number = 0, rotZ:number = 0, tX:number = 0, tY:number = 0, tZ:number = 0):void {
			if(this._matrix !== null){
				this._matrix = null;
				this._matrix3d = new Matrix3D();
			}
			this._matrix3d.identity();
		}

		public box(sX:number = 1, sY:number = 1, rot:number = 0, tX:number = 0, tY:number = 0):void {
			if (this._matrix) {
				this._matrix.createBox(sX, sY, rot, tX, tY);
			} else {
				this.box3d(sX, sY, 1, 0, 0, rot, tX, tY, 0);
			}
		}

		private update():void {
			this._parent.transform = this;
		}

		/**
		 * Returns the working matrix as a serializable object
		 * @returns {*} Serializable Matrix
		 */
		public getMatrix():Display.ISerializable {
			if (this._matrix) {
				return this._matrix;
			} else {
				return this._matrix3d;
			}
		}

		/**
		 * Returns matrix type in use
		 * @returns {string} - "2d" or "3d"
		 */
		public getMatrixType():string {
			return this._matrix ? "2d" : "3d";
		}

		/**
		 * Clones the current transform object
		 * The new transform still binds to the old DisplayObject
		 * unless the parent is modifed
		 * @returns {Transform} - Clone of transform object
		 */
		public clone():Transform {
			var t:Transform = new Transform(this._parent);
			t._matrix = this._matrix;
			t._matrix3d = this._matrix3d;
			return t;
		}

		public serialize():Object {
			return {
				"mode": this.getMatrixType(),
				"matrix": this.getMatrix()
			};
		}

	}
	export class DisplayObject implements ISerializable, Runtime.RegisterableObject {
		private static SANDBOX_EVENTS:Array<string> = ["enterFrame"];
		/** This represents an element in the HTML rendering **/
		private _id:string;
		private _alpha:number = 1;
		private _x:number = 0;
		private _y:number = 0;
		private _z:number = 0;
		private _width:number;
		private _height:number;
		private _scaleX:number = 1;
		private _scaleY:number = 1;
		private _scaleZ:number = 1;
		private _rotationX:number = 0;
		private _rotationY:number = 0;
		private _rotationZ:number = 0;
		private _filters:Array<Filter> = [];
		private _visible:boolean = false;
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
						this._x = motion["x"]["fromValue"];
					}
					if (motion.hasOwnProperty("y")) {
						this._y = motion["y"]["fromValue"];
					}
				} else if (defaults.hasOwnProperty("motionGroup") &&
					defaults["motionGroup"] && defaults["motionGroup"].length > 0) {
					var motion:Object = defaults["motionGroup"][0];
					if (motion.hasOwnProperty("alpha")) {
						this._alpha = motion["alpha"]["fromValue"];
					}
					if (motion.hasOwnProperty("x")) {
						this._x = motion["x"]["fromValue"];
					}
					if (motion.hasOwnProperty("y")) {
						this._y = motion["y"]["fromValue"];
					}
				}
			} catch (e) {

			}
			if (defaults.hasOwnProperty("alpha")) {
				this._alpha = defaults["alpha"];
			}
			if (defaults.hasOwnProperty("x")) {
				this._x = defaults["x"];
			}
			if (defaults.hasOwnProperty("y")) {
				this._y = defaults["y"];
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
		set alpha(value:number) {
			this._alpha = value;
			this.propertyUpdate("alpha", value);
		}

		get alpha():number {
			return this._alpha;
		}

		set cacheAsBitmap(value:boolean) {
			__trace("DisplayObject.cacheAsBitmap is not supported", "warn");
		}

		get cacheAsBitmap():boolean {
			return false;
		}

		set filters(filters:Array<Filter>) {
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

		get filters():Array<Filter> {
			return this._filters;
		}

		get root():DisplayObject {
			return Display.root;
		}

		set root(s:DisplayObject){
			__trace("DisplayObject.root is read-only.","warn");
		}

		get stage():DisplayObject{
			return Display.root;
		}

		set stage(s:DisplayObject){
			__trace("DisplayObject.stage is read-only.","warn");
		}

		/** Start Transform Area **/
		private _updateBox():void{
			if(this._transform.getMatrixType() === "3d"){
				this._transform.box3d(this._scaleX, this._scaleY, this._scaleZ, this._rotationX, this._rotationY, this._rotationZ, 0, 0, this._z);
			}else{
				this._transform.box(this._scaleX, this._scaleY, this._rotationZ);
			}
		}

		set rotationX(x:number){
			this._rotationX = x;
			this._updateBox();
		}

		set rotationY(y:number){
			this._rotationY = y;
			this._updateBox();
		}

		set rotationZ(z:number){
			this._rotationZ = z;
			this._updateBox();
		}

		set rotation(r:number){
			this._rotationZ = r;
			this._updateBox();
		}

		set scaleX(val:number) {
			this._scaleX = val;
			this._updateBox();
		}

		set scaleY(val:number) {
			this._scaleY = val;
			this._updateBox();
		}

		set scaleZ(val:number) {
			this._scaleZ = val;
			this._updateBox();
		}

		set x(val:number) {
			this._x = val;
			this.propertyUpdate("x", val);
		}

		set y(val:number) {
			this._y = val;
			this.propertyUpdate("y", val);
		}

		set z(val:number) {
			this._z = val;
			this._updateBox();
		}

		get rotationX():number{
			return this._rotationX;
		}

		get rotationY():number{
			return this._rotationY;
		}

		get rotationZ():number{
			return this._rotationZ;
		}

		get rotation():number{
			return this._rotationZ;
		}

		get scaleX():number {
			return this._scaleX;
		}

		get scaleY():number {
			return this._scaleY;
		}

		get scaleZ():number {
			return this._scaleZ;
		}

		get x():number {
			return this._x;
		}

		get y():number {
			return this._y;
		}

		get z():number {
			return this._z;
		}
		/** End Transform Area **/

		set width(w:number) {
			this._width = w;
			this.propertyUpdate("width", w);
		}

		get width():number {
			return this._width;
		}

		set height(h:number) {
			this._height = h;
			this.propertyUpdate("height", h);
		}

		get height():number {
			return this._height;
		}

		set visible(visible:boolean) {
			this._visible = visible;
			this.propertyUpdate("visible", visible);
		}

		get visible():boolean {
			return this._visible;
		}

		set blendMode(blendMode:string) {
			__trace("DisplayObject.blendMode not supported.", "warn");
		}

		get blendMode():string {
			return "normal";
		}

		set transform(t:any) {
			this._transform = t;
			if(this._transform.parent !== this){
				this._transform.parent = this;
			}
			this.propertyUpdate("transform", this._transform.serialize());
		}

		get transform():any {
			return this._transform;
		}

		set name(name:string) {
			this._name = name;
			this.propertyUpdate("name", name);
		}

		get name():string {
			return this._name;
		}

		set loaderInfo(name:any) {
			__trace("DisplayObject.loaderInfo is read-only", "warn");
		}

		get loaderInfo():any {
			__trace("DisplayObject.loaderInfo is not supported", "warn");
			return {};
		}

		set parent(p:DisplayObject) {
			__trace("DisplayObject.parent is read-only", "warn");
		}

		get parent():DisplayObject {
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
							if (e.hasOwnProperty("stack")) {
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
				this.eventToggle(event, "enable");
			}
		}

		public removeEventListener(event:string, listener:Function):void {
			if (!this._listeners.hasOwnProperty(event) ||
				this._listeners["event"].length === 0) {
				return;
			}
			var index = this._listeners[event].indexOf(listener);
			if (index >= 0) {
				this._listeners[event].splice(index, 1);
			}
			if (this._listeners[event].length === 1) {
				this.eventToggle(event, "disable");
			}
		}

		/** DisplayObjectContainer **/
		get numChildren():number{
			return this._children.length;
		}

		public addChild(o:DisplayObject):void {
			this._children.push(o);
			o._parent = this;
			this.methodCall("addChild", o._id);
		}

		public removeChild(o:DisplayObject):void {
			var index = this._children.indexOf(o);
			if (index >= 0) {
				this.removeChildAt(index);
			}
		}

		public getChildAt(index:number):DisplayObject{
			if(index < 0 || index > this._children.length){
				throw new RangeError("No child at index " + index);
			}
			return this._children[index];
		}

		public getChildIndex(o:DisplayObject):number{
			return this._children.indexOf(o);
		}

		public removeChildAt(index:number):void{
			var o:DisplayObject = this.getChildAt(index);
			this._children.splice(index, 1);
			o._parent = null;
			this.methodCall("removeChild", o._id);
		}

		public removeChildren(begin:number, end:number = this._children.length):void{
			var removed:Array<DisplayObject> = this._children.splice(begin, end - begin);
			var ids:Array<string> = [];
			for(var i = 0; i < removed.length; i++){
				removed[i]._parent = null;
				ids.push(removed[i]._id);
			}
			this.methodCall("removeChildren", ids);
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

		public toString():string{
			return "[" + (this._name.length > 0 ? this._name : "displayObject") + " DisplayObject]@" + this._id;
		}

		/**
		 * Clones the current display object
		 */
		public clone():DisplayObject {
			var alternate:DisplayObject = new DisplayObject();
			alternate._transform = this._transform;
			alternate._x = this._x;
			alternate._y = this._y;
			alternate.alpha = this._alpha;
			return alternate;
		}

		public hasOwnProperty(prop:string):boolean{
			if(prop === "clone") {
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
				"class": "DisplayObject",
				"x": this._x,
				"y": this._y,
				"alpha": this._alpha,
				"filters": filters
			};
		}

		public unload():void {
			this._visible = false;
			this.remove();
			__pchannel("Runtime:CallMethod", {
				"id": this._id,
				"method": "unload",
				"params": null
			});
		}

		public getId():string {
			return this._id;
		}
	}
}