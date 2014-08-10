/// <reference path="DisplayObject.ts" />
module Unpacker{
	export class TextField extends DisplayObject{
		constructor(stage:any, data:Object, context:any){
			super(stage, data, context);
			Unpacker.sensibleDefaults(data,{
				"text":"",
				"textFormat":{}
			});
			this.DOM.className = "cmt";
			this.setTextFormat(data["textFormat"]);
			this.DOM.appendChild(document.createTextNode(data["text"]));
		}

		public setTextFormat(tf:Object):void{
			Unpacker.sensibleDefaults(tf,{
				"font":"SimHei",
				"size":25,
				"color":0xffffff,
				"bold":false,
				"underline":false,
				"italic":false,
				"margin":0
			});
			this.DOM.style.fontFamily = tf["font"];
			this.DOM.style.fontSize = tf["size"];
			this.DOM.style.color = Unpacker.color(tf["color"]);
			if(tf["bold"])
				this.DOM.style.fontWeight = "bold";
			if(tf["italic"])
				this.DOM.style.fontStyle = "italic";
			if(tf["underline"])
				this.DOM.style.textDecoration = "underline";
			this.DOM.style.margin = tf["margin"] + "px";
		}

		set text(t:string){
			this.DOM.textContent = t;
		}

		get text():string{
			return this.DOM.textContent;
		}
	}
}