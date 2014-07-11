/**
 * Compliant CommentField Polyfill For BiliScriptEngine
 */
/// <reference path="TextField.ts" />
/// <reference path="IComment.ts" />
/// <reference path="MotionManager.ts" />
module Display {
	class CommentField extends TextField implements IComment {
		private _mM:MotionManager = new MotionManager(this);

		constructor(text:string, params:Object) {
			super(text, 0xffffff);
			this.setDefaults(params);
			this.initStyle(params);
			Runtime.registerObject(this);
			this.bindParent(params);
			this._mM.play();
		}

		set fontsize(size:number) {
			var tf = this.getTextFormat();
			tf.size = size;
			this.setTextFormat(tf);
		}

		get fontsize():number {
			return this.getTextFormat().fontsize;
		}

		set font(fontname:string) {
			var tf = this.getTextFormat();
			tf.font = fontname;
			this.setTextFormat(tf);
		}

		get font():string {
			return this.getTextFormat().font;
		}

		set align(a:string) {
			var tf = this.getTextFormat();
			tf.align = a;
			this.setTextFormat(tf);
		}

		get align():string {
			return this.getTextFormat().align;
		}

		set bold(b:boolean) {
			var tf = this.getTextFormat();
			tf.bold = b;
			this.setTextFormat(tf);
		}

		get bold():boolean {
			return this.getTextFormat().bold;
		}

		get motionManager():MotionManager {
			return this._mM;
		}

		set motionManager(m:MotionManager) {
			__trace("IComment.motionManager is read-only", "warn");
		}

		private bindParent(params:Object):void {
			if (params.hasOwnProperty("parent")) {
				(<DisplayObject> params["parent"]).addChild(this);
			}
		}

		public initStyle(style:Object):void {
			if (style["lifeTime"]) {
				this._mM.dur = style["lifeTime"] * 1000;
			}
			if (style["fontsize"]) {
				this.getTextFormat().size = style["fontsize"];
			}
			if (style["font"]) {
				this.getTextFormat().font = style["font"];
			}
			if (style["color"]) {
				this.getTextFormat().color = style["color"];
			}
			if (style["bold"]) {
				this.getTextFormat().bold = style["bold"];
			}
			if (style.hasOwnProperty("motionGroup")) {
				this._mM.initTweenGroup(style["motionGroup"], this._mM.dur);
			} else if (style.hasOwnProperty("motion")) {
				this._mM.initTween(style["motion"], false);
			}
		}
	}

	export function createComment(text:string, params:Object):any {
		return new CommentField(text, params);
	}

}