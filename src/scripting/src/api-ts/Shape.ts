/**
 * Created by jim on 5/19/14.
 */
class Shape extends DisplayObject{
	private _graphics:Graphics;
	constructor(){
		_graphics = new Graphics(this);
	}
	get graphics():Graphics{
		return _graphics;
	}

	public serialize():Object{
		var serialized:Object = super.serialize();
		serialized["class"] = "Shape";
		return serialized;
	}
}