/** This represents an element in the HTML rendering **/
class DisplayObject {
	private id:string = Runtime.getId();
	private _alpha:number = 1;
	private _x:number = 0;
	private _y:number = 0;
	private _scaleX:number = 1;
	private _scaleY:number = 1;
	private _filters:Array<Filter> = [];

	private propertyUpdate(propertyName:string, updatedValue):void {
		__pchannel("Runtime:UpdateProperty", {
			"id": id,
			"name": propertyName,
			"value": updatedValue
		});
	}

	/** Properties **/
	set alpha(value:number) {
		_alpha = value;
		propertyUpdate("alpha", value);
	}

	get alpha():number {
		return _alpha;
	}

	set cacheAsBitmap(value:boolean) {
		__trace("DisplayObject.cacheAsBitmap is not supported", "warn");
	}

	get cacheAsBitmap():boolean {
		return false;
	}

	set filters(filters:Array<Filter>) {
		_filters = filters;
		propertyUpdate("filters", filters);
	}

	get filters():Array<Filter> {
		return _filters;
	}

	get root():DisplayObject {
		return $.root;
	}

	set scaleX(val:number) {
		_scaleX = val;
	}

	set scaleY(val:number) {
		_scaleY = val;
	}

	set scaleZ(val:number) {
		__trace("DisplayObject.scaleZ is not supported", "warn");
	}

	set x(val:number) {
		_x = val;
	}

	set y(val:number) {
		_y = val;
	}

	set z(val:number) {
		__trace("DisplayObject.z is not supported", "warn");
	}

	get scaleX():number {
		return _scaleX;
	}

	get scaleY():number {
		return _scaleY;
	}

	get scaleZ():number {
		return 1;
	}

	get x():number {
		return _x;
	}

	get y():number {
		return _y;
	}

	get z():number {
		return 0;
	}

	/** Common Functions **/
	unload():void {
		__pchannel("Runtime:CallMethod", {
			"id": id,
			"method": "unload",
			"params": null
		});
	}

	getId():string {
		return id;
	}
}