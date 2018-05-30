/**
 * Base module for the unpacker.
 * @author Jim Chen
 */
module Unpacker {
	var UnpackTable = {

	};

	export interface DOMObject {
		DOM:Element;
	}

	export interface Transformation {
		mode:string,
		matrix:number[],
	};

	export function _<T extends Element>(type:string, props:Object = {},
		children:Array<HTMLElement> = [], callback:Function = null):T {
		var elem:Element = null;
		if (type !== "svg") {
			elem = document.createElement(type);
		} else {
			elem = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		}
		for (var key in props) {
			if (props.hasOwnProperty(key)) {
				if (key === "style") {
					props[key] = Unpacker.modernize(props[key]);
					for (var style in props[key]) {
						elem["style"][style] = props[key][style];
					}
				} else if (key === "className") {
					elem["className"] = props[key];
				} else {
					elem.setAttribute(key, props[key]);
				}
			}
		}
		for (var c = 0; c < children.length; c++) {
			if (children[c] !== null) {
				elem.appendChild(children[c]);
			}
		}
		if (typeof callback === "function" && callback !== null) {
			callback(elem);
		}
		return <T> elem;
	}

	export function modernize(styles:Object):Object {
		var modernizeLibrary:Object = {
			"transform":["webkitTransform"],
			"transformOrigin":["webkitTransformOrigin"],
			"transformStyle":["webkitTransformStyle"],
			"perspective":["webkitPerspective"],
			"perspectiveOrigin":["webkitPerspectiveOrigin"]
		};
		for (var key in modernizeLibrary) {
			if (styles.hasOwnProperty(key)) {
				for(var i = 0; i < modernizeLibrary[key].length; i++){
					styles[modernizeLibrary[key][i]] = styles[key];
				}
			}
		}
		return styles;
	}

	export function sensibleDefaults(objectA:Object, defaults:Object):Object {
		for(var prop in defaults){
			if(!objectA.hasOwnProperty(prop)){
				objectA[prop] = defaults[prop]
			}
		}
		return objectA;
	}

	export function color(color:number | string):string {
		if (typeof color === 'string') {
			color = parseInt(color.toString());
			if (color === NaN) {
				color = 0;
			}
		}
		var code:string = color.toString(16);
		while (code.length < 6) {
			code = '0' + code;
		}
		return '#' + code;
	}

	export function unpack(className:string, data:Object):DOMObject {
		return;
	}
}
