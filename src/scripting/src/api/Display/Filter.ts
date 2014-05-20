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
				"class":"Filter",
				"type":"nullfilter"
			};
		}
	}

	class BlurFilter extends Filter{
		constructor(blurX:number, blurY:number){
			super();
		}
		public serialize():Object{
			var s:Object = super.serialize();
			s["type"] = "blur";
			return s;
		}
	}

	class GlowFilter extends Filter{
		constructor(blurX:number, blurY:number){
			super();
		}
		public serialize():Object{
			var s:Object = super.serialize();
			s["type"] = "glow";
			return s;
		}
	}

	export function createGlowFilter(color:number, alpha:number = 1.0, blurX:number = 6.0, blurY:number = 6.0, strength:number = 2, quality = null, inner:boolean = false, knockout:boolean = false):any {
		return new GlowFilter(blurX, blurY);
	}

	export function createBlurFilter(blurX:number = 6.0, blurY:number = 6.0, strength:number = 2):any {
		return new BlurFilter(blurX, blurY);
	}
}