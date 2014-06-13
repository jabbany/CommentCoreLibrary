/**
 * Matrix Polyfill for AS3.
 * Author: Jim Chen
 * Part of the CCLScripter
 */

module Display{
	export class Matrix{
		private _data:Array<number> = [];
		public setTo():void{

		}

		public clone():Matrix{
			return null;
		}
	}

	export class Matrix3D{

	}

	export function createMatrix():any{
		return new Matrix();
	}

	export function createMatrix3D():any{
		return new Matrix3D();
	}

	export function createColorTransform():any{
		return null;
	}

	export function createGradientBox():any{
		return null;
	}
}