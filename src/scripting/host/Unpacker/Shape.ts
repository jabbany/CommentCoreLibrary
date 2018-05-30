/**
 * Host end unpacker for Shapes
 * @author Jim Chen
 */
/// <reference path='Unpacker.ts' />
module Unpacker{
	interface LineContext {
		width: number;
		color: string;
		alpha: number;
		caps: string;
		joints: string;
		miterLimit: string;
	}
	interface FillContext {
		fill: string;
		alpha: number;
		fillRule: string;
	}
	interface GraphicsContext {
		line:LineContext;
		fill:FillContext;
	}

	interface ShapeState {
		lastPath: SVGPathElement
	}

	export class Shape implements DOMObject {
		public DOM:SVGSVGElement;
		private _x:number;
		private _y:number;
		private _alpha:number;
		private _transform:Transformation = {
			'mode': '3d',
			'matrix': [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]
		};

		private _defaultGroup:Element;
		private _defaultEffect:Element;
		private _defaultContainer:Element;
		private _defaultGroupWithEffects:Element;

		private _state:ShapeState = {
			'lastPath': null
		};

		private _graphics:GraphicsContext = {
			'line': {
				'width': 0,
				'color': '#ffffff',
				'alpha': 1,
				'caps': null,
				'joints': null,
				'miterLimit': null
			},
			'fill': {
				'fill': 'none',
				'alpha': 1,
				'fillRule': 'nonzero'
			}
		};

		/**
		 * Creates elements with attributes or set attributes on existing ones
		 * @param element - string to create new element or existing element
		 * @param attr - map containing the attributes and values
		 * @return returns the element
		 */
		private static _svg<T extends Element>(element:T | string, attr:Object):T {
			var elem:Element;
			if (typeof element === 'string') {
				// Create a new element
				elem = document.createElementNS('http://www.w3.org/2000/svg', element);
			} else {
				elem = element;
			}
			if (attr !== null) {
				for (var attrName in attr) {
					elem.setAttribute(attrName, attr[attrName]);
				}
			}
			return <T> elem;
		}

		private static _position(x:number, y:number):string {
			return 'translate(' + x + ',' + y + ')';
		}

		constructor(stage:any, data:Object, context:any) {
			Unpacker.sensibleDefaults(data, {
				'x': 0,
				'y': 0,
				'alpha': 1
			});
			this.DOM = Unpacker._<SVGSVGElement>('svg', {
				'width': stage.offsetWidth,
				'height': stage.offsetHeight,
				'style': {
					'position': 'absolute',
					'top': '0px',
					'left': '0px',
					'width': stage.offsetWidth + 'px',
					'height': stage.offsetHeight + 'px',
					'transform': 'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)'
				}
			});
			// Create the default groups
			this._defaultEffect = Shape._svg('defs', {});
			this._defaultGroup = Shape._svg('g', {});
			this._defaultContainer = Shape._svg('g', {
				'transform': Shape._position(this._x, this._y),
				'opacity': this._alpha
			});
			this._defaultGroupWithEffects = this._defaultContainer;

			this._defaultContainer.appendChild(this._defaultGroup);
			this.DOM.appendChild(this._defaultEffect);
			this.DOM.appendChild(this._defaultGroupWithEffects);
		}

		set visible(visibility:boolean) {
			this.DOM.style.visibility = visibility ? 'visible' : 'hidden';
		}

		get visible():boolean {
			return this.DOM.style.visibility === 'hidden' ? false : true;
		}

		set x(x:number) {
			this._x = x;
			Shape._svg(this._defaultContainer, {
				'transform': Shape._position(this._x, this._y)
			});
		}

		set y(y:number) {
			this._y = y;
			Shape._svg(this._defaultContainer, {
				'transform': Shape._position(this._x, this._y)
			});
		}

		get x():number {
			return this._x;
		}

		get y():number {
			return this._y;
		}

		set alpha(alpha:number) {
			this._alpha = alpha;
			Shape._svg(this._defaultContainer, {
				'opacity': this._alpha
			});
		}

		get alpha():number {
			return this._alpha;
		}

		set transform(transformation:Transformation) {
			if (transformation.hasOwnProperty('mode')) {
				this._transform = transformation;
				if (transformation['mode'] === '2d') {
					this.DOM.style.transform = 'matrix(1,0,0,1,0,0)';
					// Shape._svg()
				} else if (transformation['mode'] === '3d') {

				}
			}
		}

		get transform():Transformation {
			return this._transform;
		}

		private applyFill(element:Element, context:FillContext) {
			Shape._svg(element, {
				'fill': context.fill,
				'fill-opacity': context.alpha,
				'fill-rule': context.fillRule
			});
		}

		private applyStroke(element:Element, context:LineContext) {
			Shape._svg(element, {
				'stroke': context.color,
				'stroke-width': context.width,
				'stroke-opacity': context.alpha
			});
			if (context.caps !== null) {
				Shape._svg(element, {
					'stroke-linecap': context.caps
				});
			}
			if (context.joints !== null) {
				Shape._svg(element, {
					'stroke-linejoin': context.joints
				});
			}
			if (context.miterLimit !== null) {
				Shape._svg(element, {
					'stroke-miterlimit': context.miterLimit
				});
			}
		}

		private _ensurePathStart() {
			if (this._state.lastPath === null) {
				this._state.lastPath = Shape._svg<SVGPathElement>('path', {
					'd': 'M0 0'
				});
				this.applyFill(this._state.lastPath, this._graphics.fill);
				this.applyStroke(this._state.lastPath, this._graphics.line);
				this._defaultGroup.appendChild(this._state.lastPath);
			}
		}

		public moveTo(params:number[]) {
			var p = Shape._svg<SVGPathElement>('path', {
				'd': 'M' + params.join(' ')
			});
			this.applyFill(p, this._graphics.fill);
			this.applyStroke(p, this._graphics.line);
			this._state.lastPath = p;
			this._defaultGroup.appendChild(this._state.lastPath);
		}

		public lineTo(params:number[]) {
			this._ensurePathStart();
			Shape._svg(this._state.lastPath, {
				'd': this._state.lastPath.getAttribute('d') + ' L' + params.join(' ')
			});
		}

		public curveTo(params:number[]) {
			this._ensurePathStart();
			Shape._svg(this._state.lastPath, {
				'd': this._state.lastPath.getAttribute('d') + ' Q' + params.join(' ')
			});
		}

		public lineStyle(params:any[]) {
			if (params.length < 3) {
				throw new Error('Insufficient parameters, expected 3 or more.');
			}
			let context:LineContext = this._graphics.line;
			context.width = params[0];
			context.color = Unpacker.color(params[1]);
			context.alpha = params[2];
			if (params.length > 3) {
				context.caps = params[3];
			}
			if (params.length > 4) {
				context.joints = params[4];
			}
			if (params.length > 5) {
				context.joints = params[5];
			}
			if (this._state.lastPath) {
				this.applyStroke(this._state.lastPath, context);
			}
		}

		public drawPath(params:any[]) {

		}

		public beginFill(params:any[]) {

		}
	}
}
