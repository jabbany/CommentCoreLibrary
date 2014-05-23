/**
 * Shape Polyfill for AS3.
 * Author: Jim Chen
 * Part of the CCLScripter
 */
/// <reference path="../Scripting.d.ts" />
/// <reference path="ISerializable.ts" />
/// <reference path="Filter.ts" />
module Display {
	export class DisplayObject implements ISerializable {
		/** This represents an element in the HTML rendering **/
		private _id:string;
		private _alpha:number = 1;
		private _x:number = 0;
		private _y:number = 0;
		private _scaleX:number = 1;
		private _scaleY:number = 1;
		private _filters:Array<Filter> = [];
		private _visible:boolean = false;

		constructor(id:string = Runtime.generateId()){
			this._id = id;
			this._visible = true;
		}

		private propertyUpdate(propertyName:string, updatedValue):void {
			__pchannel("Runtime:UpdateProperty", {
				"id": this._id,
				"name": propertyName,
				"value": updatedValue
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
			this._filters = filters;
			this.propertyUpdate("filters", filters);
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
			this.propertyUpdate("y",val);
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

		set visible(visible:boolean){
			this._visible = visible;
			this.propertyUpdate("visible", visible);
		}

		get visible():boolean{
			return this._visible;
		}
		/** AS3 Stuff **/
		public addEventListener(event:String, listener:Function):void{

		}

		/** Common Functions **/
		public serialize():Object {
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