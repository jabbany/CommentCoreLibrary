/**
 * TextField Polyfill for AS3.
 * Author: Jim Chen
 * Part of the CCLScripter
 */
/// <reference path="DisplayObject.ts" />
module Display {
	class TextFormat implements Display.ISerializable {
		public font:string;
		public size:number;
		public color:number;
		public bold:boolean;
		public italic:boolean;
		public underline:boolean;

		constructor(font:string = "SimHei", size:number = 25, color:number = 0xFFFFFF, bold:boolean = false, italic:boolean = false, underline:boolean = false, url:string = "", target:string = "", align:string = "left", leftMargin:number = 0, rightMargin:number = 0, indent:number = 0, leading:number = 0) {
			this.font = font;
			this.size = size;
			this.color = color;
			this.bold = bold;
			this.italic = italic;
			this.underline = underline;
		}

		public serialize():Object {
			return {
				"class": "TextFormat",
				"font": this.font,
				"size": this.size,
				"color": this.color,
				"bold": this.bold,
				"underline": this.underline,
				"italic": this.italic
			};
		}
	}

	export class TextField extends DisplayObject {
		private _text:string;
		private _textFormat:TextFormat;

		constructor(text:string = "", color:number = 0) {
			super();
			this._text = text;
			this._textFormat = new TextFormat();
			this._textFormat.color = color;
		}

		get text():string {
			return this._text;
		}

		set text(t:string) {
			this._text = t;
			this.propertyUpdate("text", this._text);
		}

		get length():number {
			return this.text.length;
		}

		set length(l:number) {
			__trace("TextField.length is read-only.", "warn");
		}

		get htmlText():string {
			return this.text;
		}

		set htmlText(text:string) {
			__trace("TextField.htmlText is restricted due to security policy.", "warn");
			this.text = text.replace(/<\/?[^>]+(>|$)/g, "");
		}

		set textWidth(w:number) {
			__trace("TextField.textWidth is read-only", "warn");
		}

		set textHeight(h:number) {
			__trace("TextField.textHeight is read-only", "warn");
		}

		get textWidth():number {
			/** TODO: Fix this to actually calculate the width **/
			return this._text.length * this._textFormat.size;
		}

		get textHeight():number {
			/** TODO: Fix this to actually calculate the height **/
			return this._textFormat.size;
		}

		get color():number {
			return this._textFormat.color;
		}

		set color(c:number) {
			this._textFormat.color = c;
			this.setTextFormat(this._textFormat);
		}

		public getTextFormat():any {
			return this._textFormat;
		}

		public setTextFormat(tf:any) {
			this._textFormat = <TextFormat> tf;
			this.methodCall("setTextFormat", tf);
		}

		public appendText(t:string):void {
			this.text = this.text + t;
		}

		public serialize():Object {
			var serialized:Object = super.serialize();
			serialized["class"] = "TextField";
			serialized["text"] = this._text;
			serialized["textFormat"] = this._textFormat.serialize();
			return serialized;
		}
	}

	export function createTextFormat():any {
		return new TextFormat();
	}
}