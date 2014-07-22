/// <reference path="DisplayObject.ts" />
module Unpacker{
	export class DisplayObject{
		public DOM:HTMLDivElement;
		private _x:number;
		private _y:number;
		private _alpha:number;
		private _transform:Object = {
			"mode":"3d",
			"matrix":[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]
		};

		constructor(stage:any, data:Object, context:any){
			Unpacker.sensibleDefaults(data,{
				"x":0,
				"y":0,
				"alpha":1
			});
			this.DOM = <HTMLDivElement> Unpacker._("div",{
				"style": {
					"position":"absolute",
					"transform":"matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)",
					"transformOrigin":"0 0 0",
					"opacity": data["alpha"],
					"top": data["y"],
					"left": data["x"]
				}
			});
			this._x = data["x"];
			this._y = data["y"];
			this._alpha = data["alpha"];
		}

		set x(x:number){
			this._x = x;
			this.DOM.style.left = x + "px";
		}

		set y(y:number){
			this._y = y;
			this.DOM.style.top = y + "px";
		}

		set alpha(alpha:number){
			this._alpha = alpha;
			this.DOM.style.opacity = alpha + "";
		}

		set visible(v:boolean){
			this.DOM.style.visibility = v ? "visible" : "hidden";
		}

		get x():number{
			return this._x;
		}

		get y():number{
			return this._y;
		}

		get alpha():number{
			return this._alpha;
		}

		get visible():boolean{
			return this.DOM.style.visibility !== "hidden";
		}

		/** Transform **/
		set transform(t:Object){
			this._transform = t;
			if(this._transform["mode"] === "2d"){

			}else{

			}
		}

		get transform():Object{
			return this._transform;
		}
	}
}