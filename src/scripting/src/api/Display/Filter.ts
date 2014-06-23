/**
 * Filter Polyfill for AS3.
 * Author: Jim Chen
 * Part of the CCLScripter
 */

/// <reference path="ISerializable.ts" />
module Display {
	export class Filter implements ISerializable {
		public serialize():Object {
			return {
				"class": "Filter",
				"type": "nullfilter"
			};
		}
	}

	class BlurFilter extends Filter {
		private _blurX:number;
		private _blurY:number;

		constructor(blurX:number = 4.0, blurY:number = 4.0) {
			super();
			this._blurX = blurX;
			this._blurY = blurY;
		}

		public serialize():Object {
			var s:Object = super.serialize();
			s["type"] = "blur";
			s["params"] = {
				"blurX": this._blurX,
				"blurY": this._blurY
			}
			return s;
		}
	}

	class GlowFilter extends Filter {
		private _color:number;
		private _alpha:number;
		private _blurX:number;
		private _blurY:number;
		private _strength:number;
		private _quality:number;
		private _inner:boolean;
		private _knockout:boolean;

		constructor(color:number = 16711680, alpha:number = 1.0, blurX:number = 6.0, blurY:number = 6.0, strength:number = 2, quality = null, inner:boolean = false, knockout:boolean = false) {
			super();
			this._color = color;
			this._alpha = alpha;
			this._blurX = blurX;
			this._blurY = blurY;
			this._strength = strength;
			this._quality = quality;
			this._inner = inner;
			this._knockout = knockout;
		}

		public serialize():Object {
			var s:Object = super.serialize();
			s["type"] = "glow";
			s["params"] = {
				"color": this._color,
				"alpha": this._alpha,
				"blurX": this._blurX,
				"blurY": this._blurY,
				"strength": this._strength,
				"inner": this._inner,
				"knockout": this._knockout
			}
			return s;
		}
	}

	class DropShadowFilter extends Filter {
		private _color:number;
		private _alpha:number;
		private _blurX:number;
		private _blurY:number;
		private _strength:number;
		private _quality:number;
		private _inner:boolean;
		private _knockout:boolean;
		private _distance:number;
		private _angle:number;

		constructor(distance:number = 4.0, angle:number = 45, color:number = 0, alpha:number = 1, blurX:number = 4.0, blurY:number = 4.0, strength:number = 1.0, quality:number = 1) {
			super();
			this._color = color;
			this._alpha = alpha;
			this._blurX = blurX;
			this._blurY = blurY;
			this._strength = strength;
			this._quality = quality;
			/* TODO: Update to support inner & knockout */
			this._inner = false;
			this._knockout = false;
			this._distance = distance;
			this._angle = angle;
		}

		public serialize():Object {
			var s:Object = super.serialize();
			s["type"] = "dropShadow";
			s["params"] = {
				"distance": this._distance,
				"angle": this._angle,
				"color": this._color,
				"alpha": this._alpha,
				"blurX": this._blurX,
				"blurY": this._blurY,
				"strength": this._strength,
				"inner": this._inner,
				"knockout": this._knockout
			}
			return s;
		}
	}

	export function createDropShadowFilter(distance:number = 4.0, angle:number = 45, color:number = 0, alpha:number = 1, blurX:number = 4.0, blurY:number = 4.0, strength:number = 1.0, quality:number = 1):any {
		return new DropShadowFilter(distance, angle, color, alpha, blurX, blurY, strength, quality);
	}

	export function createGlowFilter(color:number = 16711680, alpha:number = 1.0, blurX:number = 6.0, blurY:number = 6.0, strength:number = 2, quality = null, inner:boolean = false, knockout:boolean = false):any {
		return new GlowFilter(color, alpha, blurX, blurY, strength, quality, inner, knockout);
	}

	export function createBlurFilter(blurX:number = 6.0, blurY:number = 6.0, strength:number = 2):any {
		return new BlurFilter(blurX, blurY);
	}
}