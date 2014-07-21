/**
 * Base64 External Library
 * Author: Jim Chen
 */

module Base64{
	export function encode(s:string):string{

	}

	export function decode(s:string):string{

	}
}

String.prototype.toBase64 = function():string{
	return Base64.encode(this);
}

String.prototype.decodeBase64 = function():string{
	return Base64.decode(this);
}