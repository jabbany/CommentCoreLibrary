/**
 * WindowCanvas External Library
 * Licensed under the MIT License
 * Author: Jim Chen
 */

module WindowCanvas {
	class Window {
		private _innerHTML:String = "";
		private _x:number = 0;
		private _y:number = 0;
		private _width:number = 400;
		private _height:number = 300;
		private _windowInstance:any = null;

		constructor(x?:number, y?:number, w?:number, h?:number) {
			this._x = x;
			this._y = y;
			this._width = w;
			this._height = h;
		}

		set innerHTML(html:string) {
			this._innerHTML = html;
		}

		set width(w:number) {
			this._width = w;
			if (this._windowInstance !== null) {
				this._windowInstance.resizeTo(this._width, this._height);
			}
		}

		set height(h:number) {
			this._height = h;
			if (this._windowInstance !== null) {
				this._windowInstance.resizeTo(this._width, this._height);
			}
		}

		set x(x:number) {
			this._x = x;
			if (this._windowInstance !== null) {
				this._windowInstance.moveTo(this._x, this._y);
			}
		}

		set y(y:number) {
			this._y = y;
			if (this._windowInstance !== null) {
				this._windowInstance.moveTo(this._x, this._y);
			}
		}

		get innerHTML():string {
			return this._innerHTML;
		}

		get width():number {
			return this._width;
		}

		get height():number {
			return this._height;
		}

		get x():number {
			return this._x;
		};
		get y():number {
			return this._y;
		};

		public static createResource(data:string, contentType:string = "text/javascript"):string {
			var resource:Blob = new Blob([data], {type: contentType});
			return URL.createObjectURL(resource);
		}

		public createBaselinePage(title:string = "", scripts:Array<string> = []):void {
			this._innerHTML = "<head><title>" + title + "</title></head>";
			this._innerHTML += "<body><div id=\"main\"></div>";
			for (var i = 0; i < scripts.length; i++) {
				this._innerHTML += '<script src="' + scripts[i]
					+ '" type="text/javascript"></script>';
			}
			this._innerHTML += "</body>";
		}

		public launch(callback?:Function):void {
			var page:Blob = new Blob(["<html>", this._innerHTML, "</html>"],
				{type: 'text/html'});
			var self:Window = this;
			Runtime.openWindow(URL.createObjectURL(page), {
				"x": this._x,
				"y": this._y,
				"width": this._width,
				"height": this._height
			}, function (pageObject:any) {
				if (pageObject !== null) {
					self._windowInstance = pageObject;
					if (typeof callback === "function") {
						callback(true, pageObject);
					}
				} else {
					callback(false, null);
				}
			});
		}
	}

	export function createWindow(x?:number, y?:number, width?:number, height?:number):any {
		return new Window(x, y, width, height);
	}

	export function createDefaultScript():string{
		return Window.createResource("function $(id){return document.getElementById(id);}");
	}
}

var WND = WindowCanvas;