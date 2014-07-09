/**
 * Shape Polyfill for AS3.
 * Author: Jim Chen
 * Part of the CCLScripter
 */
/// <reference path="../Runtime.d.ts" />
/// <reference path="ISerializable.ts" />
/// <reference path="Filter.ts" />
module Display {
	class ColorTransform implements ISerializable{
		public serialize():Object{
			return {};
		}
	}
	class Transform implements ISerializable {
		private _parent:DisplayObject;
		private _scaleX:number;
		private _scaleY:number;
		private _matrix:Display.Matrix = new Matrix();
		private _matrix3d:Display.Matrix3D = null;

		constructor(parent:DisplayObject) {
			this._parent = parent;
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

		private updateProperty(propertyName:string, value:any):void {
			this._parent.transform = this;
		}

		/**
		 * Returns the working matrix as a serializable object
		 * @returns {*} Serializable Matrix
		 */
		public getMatrix():Display.ISerializable{
			if(this._matrix){
				return this._matrix;
			}else{
				return this._matrix3d;
			}
		}

		/**
		 * Returns matrix type in use
		 * @returns {string} - "2d" or "3d"
		 */
		public getMatrixType():string{
			return this._matrix ? "2d" : "3d";
		}

		public serialize():Object {
			return {
				"mode":this.getMatrixType(),
				"matrix":this.getMatrix()
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
		private _width:number;
		private _height:number;
		private _scaleX:number = 1;
		private _scaleY:number = 1;
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
			try{
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
				}else if(defaults.hasOwnProperty("motionGroup") &&
					defaults["motionGroup"] && defaults["motionGroup"].length > 0){
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
			}catch(e){

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

		public eventToggle(eventName:string,mode:string = "enable"):void {
			if(DisplayObject.SANDBOX_EVENTS.indexOf(eventName) > -1){
				return; /* No need to notify */
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

		set scaleX(val:number) {
			this._scaleX = val;
			this.propertyUpdate("scaleX", val);
		}

		set scaleY(val:number) {
			this._scaleY = val;
			this.propertyUpdate("scaleY", val);
		}

		set scaleZ(val:number) {
			__trace("DisplayObject.scaleZ is not supported", "warn");
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
			__trace("DisplayObject.z is not supported", "warn");
		}

		get scaleX():number {
			return this._scaleX;
		}

		get scaleY():number {
			return this._scaleY;
		}

		get scaleZ():number {
			return 1;
		}

		get x():number {
			return this._x;
		}

		get y():number {
			return this._y;
		}

		get z():number {
			return 0;
		}

		set width(w:number){
			this._width = w;
			this.propertyUpdate("width", w);
		}

		get width():number{
			return this._width;
		}

		set height(h:number){
			this._height = h;
			this.propertyUpdate("height", h);
		}

		get height():number{
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
			if(this._listeners[event].length === 1){
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
			if(this._listeners[event].length === 1){
				this.eventToggle(event, "disable");
			}
		}

		public addChild(o:DisplayObject):void {
			this._children.push(o);
			o._parent = this;
			this.methodCall("addChild", o._id);
		}

		public removeChild(o:DisplayObject):void {
			var index = this._children.indexOf(o);
			if (index >= 0) {
				this._children.splice(index, 1);
				o._parent = null;
				this.methodCall("removeChild", o._id);
			}
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