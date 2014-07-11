/**
 * Easing functions for the Tween Library
 * Adapted from Flash ActionScript
 * http://www.robertpenner.com/easing/penner_chapter7_tweening.pdf
 */

module Tween {
	/**
	 * Standard linear tween.
	 * @param t - time *dynamic
	 * @param b - begin value *static
	 * @param c - change from b *static
	 * @param d - duration of tween *static
	 */
	export function linear(t:number, b:number, c:number, d:number):number {
		return t * c / d + b;
	}

	export function quadratic(t:number, b:number, c:number, d:number):number {
		t /= d / 2;
		if (t < 1) return c / 2 * t * t + b;
		t--;
		return -c / 2 * (t * (t - 2) - 1) + b;
	}

	export function cubic(t:number, b:number, c:number, d:number):number {
		t /= d / 2;
		if (t < 1) return c / 2 * t * t * t + b;
		t -= 2;
		return c / 2 * (t * t * t + 2) + b;
	}

	export function quartic(t:number, b:number, c:number, d:number):number {
		t /= d / 2;
		if (t < 1) return c / 2 * t * t * t * t + b;
		t -= 2;
		return -c / 2 * (t * t * t * t - 2) + b;
	}

	export function quintic(t:number, b:number, c:number, d:number):number {
		t /= d / 2;
		if (t < 1) return c / 2 * t * t * t * t * t + b;
		t -= 2;
		return c / 2 * (t * t * t * t * t + 2) + b;
	}

	export function circuar(t:number, b:number, c:number, d:number):number {
		t /= d / 2;
		if (t < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
		t -= 2;
		return c / 2 * (Math.sqrt(1 - t * t) + 1) + b;
	}

	export function sine(t:number, b:number, c:number, d:number):number {
		return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
	}

	export function exponential(t:number, b:number, c:number, d:number):number {
		t /= d / 2;
		if (t < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
		t--;
		return c / 2 * ( -Math.pow(2, -10 * t) + 2 ) + b;
	}

	/**
	 * Extends the input object with easing functions
	 * @param runtime - Runtime to extend the easing function to
	 */
	export function extendWithEasingFunctions(runtime:any):void {
		/** TODO: Remove when BSE no longer requires this **/
		var load:Object = {
			linear: Tween.linear,
			back: null,
			bounce: null,
			circular: Tween.circuar,
			cubic: Tween.cubic,
			elastic: null,
			exponential: Tween.exponential,
			sine: Tween.sine,
			quintic: Tween.quintic
		};
		for (var i in load) {
			runtime[i] = load[i];
		}
	}

	export function getEasingFuncByName(easing:string = "None"):Function {
		easing = easing.toLowerCase();
		switch (easing) {
			case "none":
			case "linear":
			default:
				return Tween.linear;
			case "exponential":
				return Tween.exponential;
			case "circular":
				return Tween.circuar;
			case "quadratic":
				return Tween.quadratic;
			case "cubic":
				return Tween.cubic;
			case "quartic":
				return Tween.quartic;
			case "quintic":
				return Tween.quintic;
			case "sine":
				return Tween.sine;
		}
	}
}

/** Remove when unnecessary **/
Tween.extendWithEasingFunctions(self);