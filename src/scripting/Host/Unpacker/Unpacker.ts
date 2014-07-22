module Unpacker{
	export function _(type:string, props:Object = {}, children:Array<HTMLElement> = [], callback:Function = null):Element{
		var elem:Element = null;
		if(type !== "svg"){
			elem = document.createElement(type);
		}else{
			elem = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		}
		for(var key in props){
			if(props.hasOwnProperty(key)){
				if(key === "style"){
					props[key] = Unpacker.modernize(props[key]);
					for(var style in props[key]) {
						elem["style"][style] = props[key][style];
					}
				}else if(key === "className"){
					elem["className"] = props[key];
				}else {
					elem.setAttribute(key, props[key]);
				}
			}
		}
		for(var c = 0; c < children.length; c++){
			if(children[c] !== null)
				elem.appendChild(children[c]);
		}
		if(typeof callback === "function" && callback !== null){
			callback(elem);
		}
		return elem;
	}

	export function modernize(styles:Object):Object{
		var modernizeLibrary:Object = {
			"transform":["webkitTransform"],
			"transformOrigin":["webkitTransformOrigin"],
			"transformStyle":["webkitTransformStyle"],
			"perspective":["webkitPerspective"],
			"perspectiveOrigin":["webkitPerspectiveOrigin"]
		};
		for(var key in modernizeLibrary){
			if(styles.hasOwnProperty(key)){
				for(var i = 0; i < modernizeLibrary[key].length; i++){
					styles[modernizeLibrary[key][i]] = styles[key];
				}
			}
		}
		return styles;
	}

	export function sensibleDefaults(objectA:Object, defaults:Object):Object{
		for(var prop in defaults){
			if(!objectA.hasOwnProperty(prop)){
				objectA[prop] = defaults[prop]
			}
		}
		return objectA;
	}

	export function color(color:number):string{
		if(typeof color === "string"){
			color = parseInt("" + color);
			if(color === NaN){
				color = 0;
			}
		}
		var code:string = color.toString(16);
		while(code.length < 6){
			code = "0" + code;
		}
		return "#" + code;
	}
}

/// <reference path="TextField.ts" />