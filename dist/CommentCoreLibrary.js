/*!Copyright(c) CommentCoreLibrary v0.11.1 (//github.com/jabbany/CommentCoreLibrary) - Licensed under the MIT License */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.CommentCoreLibrary = {}));
})(this, (function (exports) { 'use strict';

  /**
   * Binary Search Stubs for JS Arrays
   * @license MIT
   * @author Jim Chen
   */ /**
   * Comparator for binary search. Returns positive value if a > b, negative if
   * a < b and 0 if they are equal
   */ /**
   * Performs binary search on the array
   * Note: The array MUST ALREADY BE SORTED. Some cases will fail but we don't
   * guarantee that we can catch all cases.
   *
   * @param arr - array to search on
   * @param what - element to search for (may not be present)
   * @param how - function comparator (a, b). Returns positive value if a > b
   * @return index of the element (or index of the element if it were in the array)
   **/ function bsearch(arr, what, how) {
      if (!Array.isArray(arr)) {
          throw new Error('Bsearch can only be run on arrays');
      }
      if (arr.length === 0) {
          return 0;
      }
      if (how(what, arr[0]) < 0) {
          return 0;
      }
      if (how(what, arr[arr.length - 1]) >= 0) {
          return arr.length;
      }
      var low = 0;
      var i = 0;
      var count = 0;
      var high = arr.length - 1;
      while(low <= high){
          i = Math.floor((high + low + 1) / 2);
          count++;
          if (how(what, arr[i - 1]) >= 0 && how(what, arr[i]) < 0) {
              return i;
          } else if (how(what, arr[i - 1]) < 0) {
              high = i - 1;
          } else if (how(what, arr[i]) >= 0) {
              low = i;
          } else {
              throw new Error('Program Error. Inconsistent comparator or unsorted array!');
          }
          if (count > 1500) {
              throw new Error('Iteration depth exceeded. Inconsistent comparator or astronomical dataset!');
          }
      }
      return -1;
  }
  /**
   * Insert an element into its position in the array signified by bsearch
   *
   * @param arr - array to insert into
   * @param what - element to insert
   * @param how - comparator (see bsearch)
   * @return index that the element was inserted to.
   **/ function binsert(arr, what, how) {
      var index = bsearch(arr, what, how);
      arr.splice(index, 0, what);
      return index;
  }

  var Array$1 = {
    __proto__: null,
    binsert: binsert,
    bsearch: bsearch
  };

  function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;

          if ("value" in descriptor) descriptor.writable = true;

          Object.defineProperty(target, descriptor.key, descriptor);
      }
  }
  function _create_class(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);

      return Constructor;
  }

  function _instanceof(left, right) {
      "@swc/helpers - instanceof";

      if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
          return !!right[Symbol.hasInstance](left);
      } else return left instanceof right;
  }

  function _set_prototype_of(o, p) {
      _set_prototype_of = Object.setPrototypeOf || function setPrototypeOf(o, p) {
          o.__proto__ = p;

          return o;
      };

      return _set_prototype_of(o, p);
  }

  function _inherits(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function");
      }

      subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });

      if (superClass) _set_prototype_of(subClass, superClass);
  }

  /**
   * Some Utility Classes
   *
   * @author Jim Chen
   * @license MIT License
   * @description Useful utility classes
   */ var Matrix3D = /*#__PURE__*/ function() {
      function Matrix3D(array) {
          if (!Array.isArray(array)) {
              throw new Error('Not an array. Cannot construct matrix.');
          }
          if (array.length != 16) {
              throw new Error('Illegal Dimensions. Matrix3D should be 4x4 matrix.');
          }
          this._internalArray = array;
      }
      var _proto = Matrix3D.prototype;
      /**
     * Check equality to identity matrix
     * @returns {boolean} indicates whether this is the identity matrix
     */ _proto.isIdentity = function isIdentity() {
          return this.equals(Matrix3D.identity());
      };
      /**
     * Computes dot product of two Matrix3D objects
     * @param {Matrix3D} input matrix b to compute dot product on
     * @returns {Matrix3D} dot product
     */ _proto.dot = function dot(matrix) {
          var a = this._internalArray.slice(0);
          var b = matrix._internalArray.slice(0);
          var res = [
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0
          ];
          for(var i = 0; i < 4; i++){
              for(var j = 0; j < 4; j++){
                  for(var k = 0; k < 4; k++){
                      res[i * 4 + j] += a[i * 4 + k] * b[k * 4 + j];
                  }
              }
          }
          return new Matrix3D(res);
      };
      /**
     * Check to see if two matrices are the same
     * @param {Matrix3D} input matrix b to compare to
     * @returns {boolean} indicator of whether two matrices are the same
     */ _proto.equals = function equals(matrix) {
          for(var i = 0; i < 16; i++){
              if (this._internalArray[i] !== matrix._internalArray[i]) {
                  return false;
              }
          }
          return true;
      };
      /**
     * Writes the matrix out to CSS compatible format
     * @returns {string} representation of matrix
     */ _proto.toCss = function toCss() {
          var matrix = this._internalArray.slice(0);
          for(var i = 0; i < matrix.length; i++){
              if (Math.abs(matrix[i]) < 0.000001) {
                  matrix[i] = 0;
              }
          }
          return 'matrix3d(' + matrix.join(',') + ')';
      };
      _create_class(Matrix3D, [
          {
              key: "flatArray",
              get: function get() {
                  return this._internalArray.slice(0);
              },
              set: function set(_array) {
                  throw new Error('Not permitted. Matrices are immutable.');
              }
          }
      ]);
      return Matrix3D;
  }();
  Matrix3D.identity = function() {
      return new Matrix3D([
          1,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          1
      ]);
  };
  Matrix3D.createScaleMatrix = function(xscale, yscale, zscale) {
      return new Matrix3D([
          xscale,
          0,
          0,
          0,
          0,
          yscale,
          0,
          0,
          0,
          0,
          zscale,
          0,
          0,
          0,
          0,
          1
      ]);
  };
  /**
     * Create a 3d rotation matrix from degrees of rotation specified
     * This uses eulerAngles as the orientation
     *
     * @param {number} xrot Rotate along x-axis
     * @param {number} yrot Rotate along y-axis
     * @param {number} zrot Rotate along z-axis
     * @return {Matrix3D} Rotation matrix
     */ Matrix3D.createRotationMatrix = function(xrot, yrot, zrot) {
      var COS = Math.cos;
      var SIN = Math.sin;
      var DEG2RAD = Math.PI / 180;
      var xr = xrot * DEG2RAD;
      var yr = yrot * DEG2RAD;
      var zr = zrot * DEG2RAD;
      var matrix = [
          COS(yr) * COS(zr),
          COS(yr) * SIN(zr),
          -SIN(yr),
          0,
          SIN(xr) * SIN(yr) * COS(zr) - COS(xr) * SIN(zr),
          SIN(xr) * SIN(yr) * SIN(zr) + COS(xr) * COS(zr),
          SIN(xr) * COS(yr),
          0,
          COS(xr) * SIN(yr) * COS(zr) + SIN(xr) * SIN(zr),
          COS(xr) * SIN(yr) * SIN(zr) - SIN(xr) * COS(zr),
          COS(xr) * COS(yr),
          0,
          0,
          0,
          0,
          1
      ];
      return new Matrix3D(matrix);
  };

  var CommentUtils = {
    __proto__: null,
    Matrix3D: Matrix3D
  };

  var CoreComment = /*#__PURE__*/ function() {
      function CoreComment(parent, init) {
          if (init === void 0) init = {};
          this.mode = 1;
          this.stime = 0;
          this.text = '';
          this.ttl = 4000;
          this.dur = 4000;
          this.cindex = -1;
          this.motion = [];
          this.movable = true;
          this._curMotion = 0;
          this._motionStart = [];
          this._motionEnd = [];
          this._alphaMotion = null;
          /**
     * Absolute coordinates. Use absolute coordinates if true otherwise use percentages.
     * @type {boolean} use absolute coordinates or not (default true)
     */ this.absolute = true;
          /**
     * Alignment
     * @type {number} 0=tl, 2=bl, 1=tr, 3=br
     */ this.align = 0;
          /**
     * Axis
     * @type {number} 0=dr, 1=dl, 2=ur, 3=ul
     */ this.axis = 0;
          this._alpha = 1;
          this._size = 25;
          this._color = 0xffffff;
          this._border = false;
          this._shadow = true;
          this._font = '';
          this._transform = null;
          this._className = '';
          if (!parent) {
              throw new Error('Comment not bound to comment manager.');
          } else {
              this.parent = parent;
          }
          if (init.stime !== undefined) {
              this.stime = init.stime;
          }
          if (init.mode !== undefined) {
              this.mode = init.mode;
          } else {
              this.mode = 1;
          }
          if (init.dur !== undefined) {
              this.dur = init.dur;
              this.ttl = this.dur;
          }
          this.dur *= this.parent.options.global.scale;
          this.ttl *= this.parent.options.global.scale;
          if (init.text !== undefined) {
              this.text = init.text;
          }
          if (init.motion !== undefined) {
              var motion = init.motion;
              this.motion = motion;
              var head = 0;
              for(var i = 0; i < motion.length; i++){
                  this._motionStart.push(head);
                  var maxDur = 0;
                  for(var k in motion[i]){
                      var m = motion[i][k];
                      maxDur = Math.max(m.dur + m.delay, maxDur);
                      if (m.easing === null || m.easing === undefined) {
                          m.easing = CoreComment.LINEAR;
                      }
                  }
                  head += maxDur;
                  this._motionEnd.push(head);
              }
              this._curMotion = 0;
          }
          if (init.color !== undefined) {
              this._color = init.color;
          }
          if (init.size !== undefined) {
              this._size = init.size;
          }
          if (init.border !== undefined) {
              this._border = init.border;
          }
          if (init.opacity !== undefined) {
              this._alpha = init.opacity;
          }
          if (init.alpha !== undefined) {
              this._alphaMotion = init.alpha;
          }
          if (init.font !== undefined) {
              this._font = init.font;
          }
          if (init.x !== undefined) {
              this._x = init.x;
          }
          if (init.y !== undefined) {
              this._y = init.y;
          }
          if (init.shadow !== undefined) {
              this._shadow = init.shadow;
          }
          if (init.align !== undefined) {
              this.align = init.align;
          }
          if (init.axis !== undefined) {
              this.axis = init.axis;
          }
          if (init.transform !== undefined) {
              this._transform = new Matrix3D(init.transform);
          }
          if (init.position === 'relative') {
              this.absolute = false;
              if (this.mode < 7) {
                  console.warn('Using relative position for CSA comment.');
              }
          }
          if (init.className !== undefined) {
              this._className = init.className;
          }
      }
      var _proto = CoreComment.prototype;
      _proto._toggleClass = function _toggleClass(className, toggle) {
          if (toggle === void 0) toggle = false;
          if (!this.dom) {
              return;
          }
          if (this.dom.classList) {
              this.dom.classList.toggle(className, toggle);
          } else {
              // Fallback to traditional method
              var classList = this.dom.className.split(' ');
              var index = classList.indexOf(className);
              if (index >= 0 && !toggle) {
                  classList.splice(index, 1);
                  this.dom.className = classList.join(' ');
              } else if (index < 0 && toggle) {
                  classList.push(className);
                  this.dom.className = classList.join(' ');
              }
          }
      };
      /**
     * Initializes the DOM element (or canvas) backing the comment
     * This method takes the place of 'initCmt' in the old CCL
     */ _proto.init = function init(recycle) {
          if (recycle === void 0) recycle = null;
          if (recycle !== null) {
              this.dom = recycle.dom;
          } else {
              this.dom = document.createElement('div');
          }
          this.dom.appendChild(document.createTextNode(this.text));
          this.dom.textContent = this.text;
          this.dom.innerText = this.text;
          this.size = this._size;
          this.className = this._className;
          if (this._color != 0xffffff) {
              this.color = this._color;
          }
          this.shadow = this._shadow;
          if (this._border) {
              this.border = this._border;
          }
          if (this._font !== '') {
              this.font = this._font;
          }
          // A null position is placed at 0 (as null coerces to 0)
          if (this._x !== undefined) {
              this.x = this._x !== null ? this._x : 0;
          }
          if (this._y !== undefined) {
              this.y = this._y !== null ? this._y : 0;
          }
          if (this._alpha !== 1 || this.parent.options.global.opacity < 1) {
              this.alpha = this._alpha;
          }
          if (this._transform !== null && !this._transform.isIdentity()) {
              this.transform = this._transform.flatArray;
          }
          if (this.motion.length > 0) {
              // Force a position update before doing anything
              this.animate();
          }
      };
      /**
     * Moves the comment by a number of milliseconds. When
     * the given parameter is greater than 0 the comment moves
     * forward. Otherwise it moves backwards.
     * @param time - elapsed time in ms
     */ _proto.time = function time(time) {
          this.ttl -= time;
          if (this.ttl < 0) {
              this.ttl = 0;
          }
          if (this.movable) {
              this.update();
          }
          if (this.ttl <= 0) {
              this.finish();
          }
      };
      /**
     * Update the comment's position depending on its mode and
     * the current ttl/dur values.
     */ _proto.update = function update() {
          this.animate();
      };
      /**
     * Invalidate the comment position.
     */ _proto.invalidate = function invalidate() {
          this._x = null;
          this._y = null;
          this._width = null;
          this._height = null;
      };
      /**
     * Executes a motion object
     * @param currentMotion - motion object
     * @private
     */ _proto._execMotion = function _execMotion(currentMotion, time) {
          // Motions animate properties by name (x, y, alpha, ...)
          var target = this;
          for(var prop in currentMotion){
              if (currentMotion.hasOwnProperty(prop)) {
                  var m = currentMotion[prop];
                  var easing = m.easing ? m.easing : CoreComment.LINEAR;
                  target[prop] = easing(Math.min(Math.max(time - m.delay, 0), m.dur), m.from, m.to - m.from, m.dur);
              }
          }
      };
      /**
     * Update the comment's position depending on the applied motion
     * groups.
     */ _proto.animate = function animate() {
          if (this._alphaMotion) {
              this.alpha = (this.dur - this.ttl) * (this._alphaMotion.to - this._alphaMotion.from) / this.dur + this._alphaMotion.from;
          }
          if (this.motion.length === 0) {
              return;
          }
          var ttl = Math.max(this.ttl, 0);
          var time = this.dur - ttl - this._motionStart[this._curMotion];
          this._execMotion(this.motion[this._curMotion], time);
          if (this.dur - ttl > this._motionEnd[this._curMotion]) {
              this._curMotion++;
              if (this._curMotion >= this.motion.length) {
                  this._curMotion = this.motion.length - 1;
              }
              return;
          }
      };
      /**
     * Notify the comment to stop. This has no effect if the comment
     * is driven by a timer.
     */ _proto.stop = function stop() {
      // Do nothing
      };
      /**
     * Remove the comment and do some cleanup.
     */ _proto.finish = function finish() {
          this.parent.finish(this);
      };
      /**
     * Returns string representation of comment
     * @returns {string}
     */ _proto.toString = function toString() {
          return [
              '[',
              this.stime,
              '|',
              this.ttl,
              '/',
              this.dur,
              ']',
              '(',
              this.mode,
              ')',
              this.text
          ].join('');
      };
      _create_class(CoreComment, [
          {
              key: "x",
              get: function get() {
                  if (this._x === null || this._x === undefined) {
                      if (this.axis % 2 === 0) {
                          if (this.align % 2 === 0) {
                              this._x = this.dom.offsetLeft;
                          } else {
                              this._x = this.dom.offsetLeft + this.width;
                          }
                      } else {
                          if (this.align % 2 === 0) {
                              this._x = this.parent.width - this.dom.offsetLeft;
                          } else {
                              this._x = this.parent.width - this.dom.offsetLeft - this.width;
                          }
                      }
                  }
                  if (!this.absolute) {
                      return this._x / this.parent.width;
                  }
                  return this._x;
              },
              set: function set(x) {
                  this._x = x;
                  if (!this.absolute) {
                      this._x *= this.parent.width;
                  }
                  if (this.axis % 2 === 0) {
                      this.dom.style.left = this._x + (this.align % 2 === 0 ? 0 : -this.width) + 'px';
                  } else {
                      this.dom.style.right = this._x + (this.align % 2 === 0 ? -this.width : 0) + 'px';
                  }
              }
          },
          {
              key: "y",
              get: function get() {
                  if (this._y === null || this._y === undefined) {
                      if (this.axis < 2) {
                          if (this.align < 2) {
                              this._y = this.dom.offsetTop;
                          } else {
                              this._y = this.dom.offsetTop + this.height;
                          }
                      } else {
                          if (this.align < 2) {
                              this._y = this.parent.height - this.dom.offsetTop;
                          } else {
                              this._y = this.parent.height - this.dom.offsetTop - this.height;
                          }
                      }
                  }
                  if (!this.absolute) {
                      return this._y / this.parent.height;
                  }
                  return this._y;
              },
              set: function set(y) {
                  this._y = y;
                  if (!this.absolute) {
                      this._y *= this.parent.height;
                  }
                  if (this.axis < 2) {
                      this.dom.style.top = this._y + (this.align < 2 ? 0 : -this.height) + 'px';
                  } else {
                      this.dom.style.bottom = this._y + (this.align < 2 ? -this.height : 0) + 'px';
                  }
              }
          },
          {
              key: "bottom",
              get: function get() {
                  var sameDirection = Math.floor(this.axis / 2) === Math.floor(this.align / 2);
                  return this.y + (sameDirection ? this.height : 0);
              }
          },
          {
              key: "right",
              get: function get() {
                  var sameDirection = this.axis % 2 === this.align % 2;
                  return this.x + (sameDirection ? this.width : 0);
              }
          },
          {
              key: "width",
              get: function get() {
                  if (typeof this._width === 'undefined' || this._width === null) {
                      this._width = this.dom.offsetWidth;
                  }
                  return this._width;
              },
              set: function set(w) {
                  this._width = w;
                  this.dom.style.width = this._width + 'px';
              }
          },
          {
              key: "height",
              get: function get() {
                  if (typeof this._height === 'undefined' || this._height === null) {
                      this._height = this.dom.offsetHeight;
                  }
                  return this._height;
              },
              set: function set(h) {
                  this._height = h;
                  this.dom.style.height = this._height + 'px';
              }
          },
          {
              key: "size",
              get: function get() {
                  return this._size;
              },
              set: function set(s) {
                  this._size = s;
                  this.dom.style.fontSize = this._size + 'px';
              }
          },
          {
              key: "color",
              get: function get() {
                  return this._color;
              },
              set: function set(c) {
                  this._color = c;
                  var color = c.toString(16);
                  color = color.length >= 6 ? color : new Array(6 - color.length + 1).join('0') + color;
                  this.dom.style.color = '#' + color;
                  if (this._color === 0) {
                      this._toggleClass('reverse-shadow', true);
                  }
              }
          },
          {
              key: "alpha",
              get: function get() {
                  return this._alpha;
              },
              set: function set(a) {
                  this._alpha = a;
                  this.dom.style.opacity = Math.min(this._alpha, this.parent.options.global.opacity) + '';
              }
          },
          {
              key: "border",
              get: function get() {
                  return this._border;
              },
              set: function set(b) {
                  this._border = b;
                  if (this._border) {
                      this.dom.style.border = '1px solid #00ffff';
                  } else {
                      this.dom.style.border = 'none';
                  }
              }
          },
          {
              key: "shadow",
              get: function get() {
                  return this._shadow;
              },
              set: function set(s) {
                  this._shadow = s;
                  if (!this._shadow) {
                      this._toggleClass('no-shadow', true);
                  }
              }
          },
          {
              key: "font",
              get: function get() {
                  return this._font;
              },
              set: function set(f) {
                  this._font = f;
                  if (this._font.length > 0) {
                      this.dom.style.fontFamily = this._font;
                  } else {
                      this.dom.style.fontFamily = '';
                  }
              }
          },
          {
              key: "transform",
              get: function get() {
                  if (this._transform === null) {
                      // No transform is the identity transform
                      return Matrix3D.identity().flatArray;
                  }
                  return this._transform.flatArray;
              },
              set: function set(array) {
                  this._transform = new Matrix3D(array);
                  if (this.dom !== null) {
                      this.dom.style.transform = this._transform.toCss();
                  }
              }
          },
          {
              key: "className",
              get: function get() {
                  return this._className;
              },
              set: function set(className) {
                  this._className = className;
                  this.dom.className = this.parent.options.global.className + ' ' + className;
              }
          }
      ]);
      return CoreComment;
  }();
  CoreComment.LINEAR = function(t, b, c, d) {
      return t * c / d + b;
  };
  var ScrollComment = /*#__PURE__*/ function(CoreComment) {
      _inherits(ScrollComment, CoreComment);
      function ScrollComment(parent, data) {
          var _this;
          _this = CoreComment.call(this, parent, data) || this;
          _this.dur *= _this.parent.options.scroll.scale;
          _this.ttl *= _this.parent.options.scroll.scale;
          return _this;
      }
      var _proto = ScrollComment.prototype;
      _proto.init = function init(recycle) {
          if (recycle === void 0) recycle = null;
          CoreComment.prototype.init.call(this, recycle);
          this.x = this.parent.width;
          if (this.parent.options.scroll.opacity < 1) {
              this.alpha = this._alpha;
          }
          this.absolute = true;
      };
      _proto.update = function update() {
          this.x = this.ttl / this.dur * (this.parent.width + this.width) - this.width;
      };
      _create_class(ScrollComment, [
          {
              key: "alpha",
              set: function set(a) {
                  this._alpha = a;
                  this.dom.style.opacity = Math.min(Math.min(this._alpha, this.parent.options.global.opacity), this.parent.options.scroll.opacity) + '';
              }
          }
      ]);
      return ScrollComment;
  }(CoreComment);

  var CssScrollComment = /*#__PURE__*/ function(ScrollComment) {
      _inherits(CssScrollComment, ScrollComment);
      function CssScrollComment() {
          var _this;
          _this = ScrollComment.apply(this, arguments) || this, // Marker for whether we need to re-create the CSS or not
          _this._dirtyCSS = true;
          return _this;
      }
      var _proto = CssScrollComment.prototype;
      _proto.init = function init(recycle) {
          if (recycle === void 0) recycle = null;
          ScrollComment.prototype.init.call(this, recycle);
          this._toggleClass('css-optimize', true);
      };
      _proto._calculateX = function _calculateX() {
          var width = typeof this._width === 'undefined' ? 0 : this.width;
          var x = this.ttl / this.dur * (this.parent.width + width) - width;
          return !this.absolute ? x / this.parent.width : x;
      };
      _proto.update = function update() {
          /*
        This is called by the update manager
        Since CSS updates are very different, super should not be called.
      */ if (this._dirtyCSS) {
              // Recreate the CSS
              this.dom.style.transition = "transform " + this.ttl + "ms linear";
              this.x = -this.width;
              this._dirtyCSS = false;
          }
      };
      _proto.invalidate = function invalidate() {
          ScrollComment.prototype.invalidate.call(this);
          this._dirtyCSS = true;
          if (!this.dom) {
              return; // DOM not created yet, do nothing
          } else {
              // Clear the transition to prepare for a rewrite
              this.dom.style.transition = '';
              this.x = this.x;
          }
      };
      /**
     * Override the toplevel stop to actually stop the CSS.
     */ _proto.stop = function stop() {
          ScrollComment.prototype.stop.call(this);
          this.invalidate();
      };
      _create_class(CssScrollComment, [
          {
              key: "x",
              get: function get() {
                  return this._calculateX();
              },
              set: function set(x) {
                  /*
        Re-pivot x to animate from the current _x location.
       */ // Convert to pixel space
                  if (!this.absolute) {
                      x *= this.parent.width;
                  }
                  var dx = x - this._calculateX();
                  this.dom.style.transform = "translateX(" + (this.axis % 2 === 0 ? dx : -dx) + "px)" + (this._transform === null || this._transform.isIdentity() ? '' : ' ' + this._transform.toCss());
                  if (this.axis % 2 === 0) {
                      // x-axis towards right
                      this.dom.style.left = this._calculateX() + 'px';
                  } else {
                      // x-axis towards left
                      this.dom.style.right = this._calculateX() + 'px';
                  }
              }
          }
      ]);
      return CssScrollComment;
  }(ScrollComment);

  var CommentFactory = /*#__PURE__*/ function() {
      function CommentFactory() {
          this._bindings = {};
      }
      var _proto = CommentFactory.prototype;
      _proto.bind = function bind(mode, factory) {
          this._bindings[mode] = factory;
      };
      _proto.canCreate = function canCreate(comment) {
          // Tests if a certain binding is available
          return this._bindings.hasOwnProperty(comment['mode']);
      };
      _proto.create = function create(manager, comment) {
          if (comment === null || !comment.hasOwnProperty('mode')) {
              throw new Error('Comment format incorrect');
          }
          if (!this._bindings.hasOwnProperty(comment['mode'])) {
              throw new Error('No binding for comment type ' + comment['mode']);
          }
          return this._bindings[comment['mode']](manager, comment);
      };
      CommentFactory._simpleCssScrollingInitializer = function _simpleCssScrollingInitializer(manager, data) {
          var cmt = new CssScrollComment(manager, data);
          switch(cmt.mode){
              case 1:
                  {
                      cmt.align = 0;
                      cmt.axis = 0;
                      break;
                  }
              case 2:
                  {
                      cmt.align = 2;
                      cmt.axis = 2;
                      break;
                  }
              case 6:
                  {
                      cmt.align = 1;
                      cmt.axis = 1;
                      break;
                  }
          }
          cmt.init();
          manager.stage.appendChild(cmt.dom);
          return cmt;
      };
      CommentFactory._simpleScrollingInitializer = function _simpleScrollingInitializer(manager, data) {
          var cmt = new ScrollComment(manager, data);
          switch(cmt.mode){
              case 1:
                  {
                      cmt.align = 0;
                      cmt.axis = 0;
                      break;
                  }
              case 2:
                  {
                      cmt.align = 2;
                      cmt.axis = 2;
                      break;
                  }
              case 6:
                  {
                      cmt.align = 1;
                      cmt.axis = 1;
                      break;
                  }
          }
          cmt.init();
          manager.stage.appendChild(cmt.dom);
          return cmt;
      };
      CommentFactory._simpleAnchoredInitializer = function _simpleAnchoredInitializer(manager, data) {
          var cmt = new CoreComment(manager, data);
          switch(cmt.mode){
              case 4:
                  {
                      cmt.align = 2;
                      cmt.axis = 2;
                      break;
                  }
              case 5:
                  {
                      cmt.align = 0;
                      cmt.axis = 0;
                      break;
                  }
          }
          cmt.init();
          manager.stage.appendChild(cmt.dom);
          return cmt;
      };
      CommentFactory._advancedCoreInitializer = function _advancedCoreInitializer(manager, data) {
          var cmt = new CoreComment(manager, data);
          cmt.init();
          cmt.transform = Matrix3D.createRotationMatrix(0, data.rY, data.rZ).flatArray;
          manager.stage.appendChild(cmt.dom);
          return cmt;
      };
      CommentFactory.defaultFactory = function defaultFactory() {
          var factory = new CommentFactory();
          factory.bind(1, CommentFactory._simpleScrollingInitializer);
          factory.bind(2, CommentFactory._simpleScrollingInitializer);
          factory.bind(6, CommentFactory._simpleScrollingInitializer);
          factory.bind(4, CommentFactory._simpleAnchoredInitializer);
          factory.bind(5, CommentFactory._simpleAnchoredInitializer);
          factory.bind(7, CommentFactory._advancedCoreInitializer);
          factory.bind(17, CommentFactory._advancedCoreInitializer);
          return factory;
      };
      CommentFactory.defaultCssRenderFactory = function defaultCssRenderFactory() {
          var factory = new CommentFactory();
          factory.bind(1, CommentFactory._simpleCssScrollingInitializer);
          factory.bind(2, CommentFactory._simpleCssScrollingInitializer);
          factory.bind(6, CommentFactory._simpleCssScrollingInitializer);
          factory.bind(4, CommentFactory._simpleAnchoredInitializer);
          factory.bind(5, CommentFactory._simpleAnchoredInitializer);
          factory.bind(7, CommentFactory._advancedCoreInitializer);
          factory.bind(17, CommentFactory._advancedCoreInitializer);
          return factory;
      };
      CommentFactory.defaultCanvasRenderFactory = function defaultCanvasRenderFactory() {
          throw new Error('Not implemented');
      };
      CommentFactory.defaultSvgRenderFactory = function defaultSvgRenderFactory() {
          throw new Error('Not implemented');
      };
      return CommentFactory;
  }();

  var CommentSpaceAllocator = /*#__PURE__*/ function() {
      function CommentSpaceAllocator(width, height) {
          if (width === void 0) width = 0;
          if (height === void 0) height = 0;
          this._pools = [
              []
          ];
          /**
     * Number of pixels to avoid from last possible y-offset
     * @type {number}
     */ this.avoid = 1;
          this._width = width;
          this._height = height;
      }
      var _proto = CommentSpaceAllocator.prototype;
      /**
     * Logic to determine if checked comment collides with existing comment
     * We say that comments collide if the existing comment finishes later
     * than the checked comment is halfway through
     *
     * @param existing - Existing comment;
     * @param check - Checked comment
     * @returns {boolean} checked collides with exisiting
     */ _proto.willCollide = function willCollide(existing, check) {
          return existing.stime + existing.ttl >= check.stime + check.ttl / 2;
      };
      /**
     * Validates sufficient space for a "bullet path" for the comment.
     *
     * @param y - Path starting at y offset (path height is the comment height)
     * @param comment - Comment instance to test
     * @param pool - The pool to test in.
     * @returns {boolean} whether or not a valid path exists in the tested pool.
     */ _proto.pathCheck = function pathCheck(y, comment, pool) {
          var bottom = y + comment.height;
          var right = comment.right;
          for(var i = 0; i < pool.length; i++){
              if (pool[i].y > bottom || pool[i].bottom < y) {
                  continue;
              } else if (pool[i].right < comment.x || pool[i].x > right) {
                  if (this.willCollide(pool[i], comment)) {
                      return false;
                  } else {
                      continue;
                  }
              } else {
                  return false;
              }
          }
          return true;
      };
      /**
     * Finds a good y-coordinate for comment such that minimal collision happens.
     * This method will also add the comment to the allocated pool and assign a proper cindex
     *
     * @param comment - Comment
     * @param cindex - Pool index
     * @returns {number} Y offset assigned
     */ _proto.assign = function assign(comment, cindex) {
          while(this._pools.length <= cindex){
              this._pools.push([]);
          }
          var pool = this._pools[cindex];
          if (pool.length === 0) {
              comment.cindex = cindex;
              return 0;
          } else if (this.pathCheck(0, comment, pool)) {
              // Has a path in the current pool
              comment.cindex = cindex;
              return 0;
          }
          var y = 0;
          for(var k = 0; k < pool.length; k++){
              y = pool[k].bottom + this.avoid;
              if (y + comment.height > this._height) {
                  break;
              }
              if (this.pathCheck(y, comment, pool)) {
                  // Has a path in the current pool
                  comment.cindex = cindex;
                  return y;
              }
          }
          // Assign one pool deeper
          return this.assign(comment, cindex + 1);
      };
      /**
     * Adds a comment to the space allocator. Will also assign the
     * comment's y values. Note that added comments may not be actually
     * recorded, check the cindex value.
     * @param comment
     */ _proto.add = function add(comment) {
          if (comment.height > this._height) {
              comment.cindex = -2;
              comment.y = 0;
          } else {
              comment.y = this.assign(comment, 0);
              binsert(this._pools[comment.cindex], comment, function(a, b) {
                  if (a.bottom < b.bottom) {
                      return -1;
                  } else if (a.bottom > b.bottom) {
                      return 1;
                  } else {
                      return 0;
                  }
              });
          }
      };
      /**
     * Remove the comment from the space allocator. Will silently fail
     * if the comment is not found
     * @param comment
     */ _proto.remove = function remove(comment) {
          if (comment.cindex < 0) {
              return;
          }
          if (comment.cindex >= this._pools.length) {
              throw new Error('cindex out of bounds');
          }
          var index = this._pools[comment.cindex].indexOf(comment);
          if (index < 0) return;
          this._pools[comment.cindex].splice(index, 1);
      };
      /**
     * Set the bounds (width, height) of the allocator. Normally this
     * should be as big as the stage DOM object. But you can manually set
     * this to another smaller value too.
     *
     * @param width
     * @param height
     */ _proto.setBounds = function setBounds(width, height) {
          this._width = width;
          this._height = height;
      };
      return CommentSpaceAllocator;
  }();
  var AnchorCommentSpaceAllocator = /*#__PURE__*/ function(CommentSpaceAllocator) {
      _inherits(AnchorCommentSpaceAllocator, CommentSpaceAllocator);
      function AnchorCommentSpaceAllocator() {
          return CommentSpaceAllocator.apply(this, arguments) || this;
      }
      var _proto = AnchorCommentSpaceAllocator.prototype;
      _proto.add = function add(comment) {
          CommentSpaceAllocator.prototype.add.call(this, comment);
          comment.x = (this._width - comment.width) / 2;
      };
      _proto.willCollide = function willCollide(a, b) {
          return true;
      };
      _proto.pathCheck = function pathCheck(y, comment, pool) {
          var bottom = y + comment.height;
          for(var i = 0; i < pool.length; i++){
              if (pool[i].y > bottom || pool[i].bottom < y) {
                  continue;
              } else {
                  return false;
              }
          }
          return true;
      };
      return AnchorCommentSpaceAllocator;
  }(CommentSpaceAllocator);

  /**
   * Comment Timers
   *
   * @author Jim Chen
   * @license MIT License
   * @description Clocks that drive the comments of a CommentManager
   */ /**
   * Timer based on setInterval. Ticks at a fixed interval, also when the page
   * is in the background.
   */ var IntervalTimer = /*#__PURE__*/ function() {
      function IntervalTimer(interval) {
          if (interval === void 0) interval = 10;
          this._handle = 0;
          this._interval = interval;
      }
      var _proto = IntervalTimer.prototype;
      _proto.start = function start(callback) {
          if (this._handle > 0) {
              return;
          }
          var last = new Date().getTime();
          this._handle = window.setInterval(function() {
              var now = new Date().getTime();
              var elapsed = now - last;
              last = now;
              callback(elapsed);
          }, this._interval);
      };
      _proto.stop = function stop() {
          window.clearInterval(this._handle);
          this._handle = 0;
      };
      return IntervalTimer;
  }();
  /**
   * Timer based on requestAnimationFrame. Ticks once per rendered frame and
   * pauses while the page is in the background. Falls back to setTimeout in
   * browsers without requestAnimationFrame.
   */ var AnimationFrameTimer = /*#__PURE__*/ function() {
      function AnimationFrameTimer() {
          this._handle = 0;
          // Identifies the running tick loop so that a stopped loop never reschedules
          this._token = null;
      }
      var _proto = AnimationFrameTimer.prototype;
      _proto.start = function start(callback) {
          if (this._token !== null) {
              return;
          }
          var token = {};
          var last = new Date().getTime();
          var timer = this;
          var tick = function tick1() {
              if (timer._token !== token) {
                  return;
              }
              var now = new Date().getTime();
              var elapsed = now - last;
              last = now;
              callback(elapsed);
              if (timer._token === token) {
                  timer._handle = AnimationFrameTimer._request(tick);
              }
          };
          this._token = token;
          this._handle = AnimationFrameTimer._request(tick);
      };
      _proto.stop = function stop() {
          if (this._token === null) {
              return;
          }
          AnimationFrameTimer._cancel(this._handle);
          this._handle = 0;
          this._token = null;
      };
      AnimationFrameTimer._request = function _request(callback) {
          if (typeof window.requestAnimationFrame === 'function') {
              return window.requestAnimationFrame(callback);
          }
          return window.setTimeout(callback, 16);
      };
      AnimationFrameTimer._cancel = function _cancel(handle) {
          if (typeof window.cancelAnimationFrame === 'function') {
              window.cancelAnimationFrame(handle);
          } else {
              window.clearTimeout(handle);
          }
      };
      return AnimationFrameTimer;
  }();

  /**
   * Comment Filters Module Simplified
   * @license MIT
   * @author Jim Chen
   */ /**
   * Rule for filtering comments
   */ /**
   * Matches a rule against an input that could be the full or a subset of
   * the comment data.
   *
   * @param rule - rule object to match
   * @param cmtData - full or portion of comment data
   * @return boolean indicator of match
   */ function _match(rule, cmtData) {
      var path = rule.subject.split('.');
      var extracted = cmtData;
      while(path.length > 0){
          var item = path.shift();
          if (item === '') {
              continue;
          }
          if (extracted.hasOwnProperty(item)) {
              extracted = extracted[item];
          }
          if (extracted === null || typeof extracted === 'undefined') {
              extracted = null;
              break;
          }
      }
      if (extracted === null) {
          // Null precondition implies anything
          return true;
      }
      switch(rule.op){
          case '<':
              return extracted < rule.value;
          case '>':
              return extracted > rule.value;
          case '~':
          case 'regexp':
              return new RegExp(rule.value).test(extracted.toString());
          case '=':
          case 'eq':
              return rule.value === (typeof extracted === 'number' ? extracted : extracted.toString());
          case '!':
          case 'not':
              return !_match(rule.value, extracted);
          case '&&':
          case 'and':
              if (Array.isArray(rule.value)) {
                  return rule.value.every(function(r) {
                      return _match(r, extracted);
                  });
              } else {
                  return false;
              }
          case '||':
          case 'or':
              if (Array.isArray(rule.value)) {
                  return rule.value.some(function(r) {
                      return _match(r, extracted);
                  });
              } else {
                  return false;
              }
          default:
              return false;
      }
  }
  var CommentFilter = /*#__PURE__*/ function() {
      function CommentFilter() {
          this.rules = [];
          this.modifiers = [];
          this.allowUnknownTypes = true;
          this.allowTypes = {
              '1': true,
              '2': true,
              '4': true,
              '5': true,
              '6': true,
              '7': true,
              '8': true,
              '17': true
          };
      }
      var _proto = CommentFilter.prototype;
      /**
     * Runs all modifiers against current comment
     *
     * @param cmt - comment to run modifiers on
     * @return modified comment
     */ _proto.doModify = function doModify(cmt) {
          return this.modifiers.reduce(function(c, f) {
              return f(c);
          }, cmt);
      };
      /**
     * Executes a method defined to be executed right before the comment object
     * (built from commentData) is placed onto the runline.
     *
     * @deprecated
     * @param cmt - comment data
     * @return cmt
     */ _proto.beforeSend = function beforeSend(cmt) {
          return cmt;
      };
      /**
     * Performs validation of the comment data before it is allowed to get sent
     * by applying type constraints and rules
     *
     * @param cmtData - comment data
     * @return boolean indicator of whether this commentData should be shown
     */ _proto.doValidate = function doValidate(cmtData) {
          if (!cmtData.hasOwnProperty('mode')) {
              return false;
          }
          if ((!this.allowUnknownTypes || cmtData.mode.toString() in this.allowTypes) && !this.allowTypes[cmtData.mode.toString()]) {
              return false;
          }
          return this.rules.every(function(rule) {
              // Decide if matched
              var matched;
              try {
                  matched = _match(rule, cmtData);
              } catch (e) {
                  matched = false;
              }
              return rule.mode === 'accept' ? matched : !matched;
          });
      };
      /**
     * Adds a rule for use with validation
     *
     * @param rule - object containing rule definitions
     * @throws Exception when rule mode is incorrect
     */ _proto.addRule = function addRule(rule) {
          if (rule.mode !== 'accept' && rule.mode !== 'reject') {
              throw new Error('Rule must be of accept type or reject type.');
          }
          this.rules.push(rule);
      };
      /**
     * Removes a rule
     *
     * @param rule - the rule that was added
     * @return true if the rule was removed, false if not found
     */ _proto.removeRule = function removeRule(rule) {
          var index = this.rules.indexOf(rule);
          if (index >= 0) {
              this.rules.splice(index, 1);
              return true;
          } else {
              return false;
          }
      };
      /**
     * Adds a modifier to be used
     *
     * @param modifier - modifier function that takes in comment data and
     *           returns modified comment data
     * @throws Exception when modifier is not a function
     */ _proto.addModifier = function addModifier(f) {
          if (typeof f !== 'function') {
              throw new Error('Modifiers need to be functions.');
          }
          this.modifiers.push(f);
      };
      return CommentFilter;
  }();

  var _defaultComparator = function _defaultComparator(a, b) {
      // date and dbid may be numbers, strings or missing. They are compared with
      // the plain JavaScript operators (missing values are never greater or less)
      var aDate = a.date, bDate = b.date;
      var aId = a.dbid, bId = b.dbid;
      if (a.stime > b.stime) {
          return 2;
      } else if (a.stime < b.stime) {
          return -2;
      } else {
          if (aDate > bDate) {
              return 1;
          } else if (aDate < bDate) {
              return -1;
          } else if (aId != null && bId != null) {
              if (aId > bId) {
                  return 1;
              } else if (aId < bId) {
                  return -1;
              }
              return 0;
          } else {
              return 0;
          }
      }
  };
  var CommentManager = /*#__PURE__*/ function() {
      function CommentManager(stageObject) {
          this._running = false;
          this._listeners = {};
          this._lastPosition = 0;
          this.options = {
              global: {
                  opacity: 1,
                  scale: 1,
                  className: "cmt"
              },
              scroll: {
                  opacity: 1,
                  scale: 1
              },
              limit: 0,
              seekTrigger: 2000
          };
          this.timeline = [];
          this.runline = [];
          this.position = 0;
          /**
     * Clock that drives the running comments. Replace it (e.g. with an
     * AnimationFrameTimer) while the manager is stopped.
     */ this.timer = new IntervalTimer();
          this.factory = null;
          this.filter = null;
          this.scripting = null;
          this.csa = {
              scroll: new CommentSpaceAllocator(0, 0),
              top: new AnchorCommentSpaceAllocator(0, 0),
              bottom: new AnchorCommentSpaceAllocator(0, 0),
              reverse: new CommentSpaceAllocator(0, 0),
              scrollbtm: new CommentSpaceAllocator(0, 0)
          };
          this.stage = stageObject;
          /** Precompute the offset width **/ this.width = this.stage.offsetWidth;
          this.height = this.stage.offsetHeight;
      }
      var _proto = CommentManager.prototype;
      _proto._startTimer = function _startTimer() {
          var cmMgr = this;
          this.timer.start(function(elapsed) {
              cmMgr.onTimerEvent(elapsed, cmMgr);
          });
      };
      _proto._stopTimer = function _stopTimer() {
          this.timer.stop();
      };
      /** Public **/ _proto.stop = function stop() {
          this._stopTimer();
          this._running = false;
          // Send stop signal to all comments
          this.runline.forEach(function(c) {
              c.stop();
          });
      };
      _proto.start = function start() {
          this._startTimer();
          this._running = true;
      };
      /**
     * Stops the manager and releases everything it holds: running comments,
     * the timeline and event listeners. Dispatches 'destroy' before the
     * listeners are removed.
     */ _proto.destroy = function destroy() {
          this.stop();
          this.clear();
          this.timeline = [];
          this.position = 0;
          this.dispatchEvent('destroy');
          this._listeners = {};
      };
      _proto.seek = function seek(time) {
          this.position = bsearch(this.timeline, time, function(a, b) {
              if (a < b.stime) {
                  return -1;
              } else if (a > b.stime) {
                  return 1;
              } else {
                  return 0;
              }
          });
      };
      _proto.validate = function validate(cmt) {
          if (cmt == null) {
              return false;
          }
          if (this.filter === null) {
              throw new Error('CommentManager has no filter. Call init() first.');
          }
          return this.filter.doValidate(cmt);
      };
      _proto.load = function load(a) {
          this.timeline = a;
          this.timeline.sort(_defaultComparator);
          this.dispatchEvent("load");
      };
      _proto.insert = function insert(c) {
          var index = binsert(this.timeline, c, _defaultComparator);
          if (index <= this.position) {
              this.position++;
          }
          this.dispatchEvent("insert");
      };
      /**
     * Removes comments from the timeline. Comments that are already running
     * are not affected.
     * @param target - the comment data instance to remove, or a function that
     *    returns true (strictly) for every comment that should be removed
     */ _proto.remove = function remove(target) {
          var filter;
          if (typeof target === 'function') {
              filter = target;
          } else {
              filter = function filter(data) {
                  return data === target;
              };
          }
          for(var i = this.timeline.length - 1; i >= 0; i--){
              if (filter(this.timeline[i]) === true) {
                  this.timeline.splice(i, 1);
                  if (i < this.position) {
                      this.position--;
                  }
              }
          }
          this.dispatchEvent("remove");
      };
      _proto.clear = function clear() {
          while(this.runline.length > 0){
              this.runline[0].finish();
          }
          this.dispatchEvent("clear");
      };
      _proto.setBounds = function setBounds() {
          this.width = this.stage.offsetWidth;
          this.height = this.stage.offsetHeight;
          this.dispatchEvent("resize");
          for(var comAlloc in this.csa){
              this.csa[comAlloc].setBounds(this.width, this.height);
          }
          // Update 3d perspective
          this.stage.style.perspective = this.width / Math.tan(55 * Math.PI / 180) / 2 + "px";
          this.stage.style['webkitPerspective'] = this.width / Math.tan(55 * Math.PI / 180) / 2 + "px";
      };
      _proto.init = function init(renderer) {
          this.setBounds();
          if (this.filter == null) {
              this.filter = new CommentFilter(); //Only create a filter if none exist
          }
          if (this.factory == null) {
              switch(renderer){
                  case 'legacy':
                      this.factory = CommentFactory.defaultFactory();
                      break;
                  default:
                  case 'css':
                      this.factory = CommentFactory.defaultCssRenderFactory();
                      break;
              }
          }
      };
      _proto.time = function time(time) {
          time = time - 1;
          if (this.position >= this.timeline.length || Math.abs(this._lastPosition - time) >= this.options.seekTrigger) {
              this.seek(time);
              this._lastPosition = time;
              if (this.timeline.length <= this.position) {
                  return;
              }
          } else {
              this._lastPosition = time;
          }
          var batch = [];
          for(; this.position < this.timeline.length; this.position++){
              if (this.timeline[this.position]['stime'] <= time) {
                  if (this.options.limit > 0 && this.runline.length + batch.length >= this.options.limit) {
                      continue; // Skip comments but still move the position pointer
                  } else if (this.validate(this.timeline[this.position])) {
                      batch.push(this.timeline[this.position]);
                  }
              } else {
                  break;
              }
          }
          if (batch.length > 0) {
              this.send(batch);
          }
      };
      _proto.rescale = function rescale() {
      // TODO: Implement rescaling
      };
      _proto._preprocess = function _preprocess(data) {
          if (data.mode === 8) {
              // This comment is not managed by the comment manager
              if (this.scripting) {
                  this.scripting.eval(typeof data.code === 'string' ? data.code : '');
              } else {
                  console.warn('CCL: Dropped scripting comment since no scripting ' + 'engine is attached.');
              }
              return null;
          }
          if (this.filter != null) {
              data = this.filter.doModify(data);
          }
          return data;
      };
      _proto._allocateSpace = function _allocateSpace(cmt) {
          switch(cmt.mode){
              default:
              case 1:
                  {
                      this.csa.scroll.add(cmt);
                  }
                  break;
              case 2:
                  {
                      this.csa.scrollbtm.add(cmt);
                  }
                  break;
              case 4:
                  {
                      this.csa.bottom.add(cmt);
                  }
                  break;
              case 5:
                  {
                      this.csa.top.add(cmt);
                  }
                  break;
              case 6:
                  {
                      this.csa.reverse.add(cmt);
                  }
                  break;
              case 7:
              case 17:
                  break;
          }
      };
      _proto.send = function send(data) {
          var input = Array.isArray(data) ? data : [
              data
          ];
          // Validate all the comments
          var cmMgr = this;
          var list = [];
          input.forEach(function(item) {
              var processed = cmMgr._preprocess(item);
              if (processed !== null) {
                  list.push(processed);
              }
          });
          if (list.length === 0) {
              return;
          }
          if (this.factory === null) {
              throw new Error('CommentManager has no comment factory. Call init() first.');
          }
          var factory = this.factory;
          list.map(function(item) {
              // Create and insert the comments into the DOM
              return factory.create(cmMgr, item);
          }).map(function(cmt) {
              cmMgr._allocateSpace(cmt);
              return cmt;
          }).forEach(function(cmt) {
              cmt.y = cmt.y;
              cmMgr.dispatchEvent("enterComment", cmt);
              cmMgr.runline.push(cmt);
          });
      };
      _proto.finish = function finish(cmt) {
          this.dispatchEvent("exitComment", cmt);
          this.stage.removeChild(cmt.dom);
          var index = this.runline.indexOf(cmt);
          if (index >= 0) {
              this.runline.splice(index, 1);
          }
          switch(cmt.mode){
              default:
              case 1:
                  {
                      this.csa.scroll.remove(cmt);
                  }
                  break;
              case 2:
                  {
                      this.csa.scrollbtm.remove(cmt);
                  }
                  break;
              case 4:
                  {
                      this.csa.bottom.remove(cmt);
                  }
                  break;
              case 5:
                  {
                      this.csa.top.remove(cmt);
                  }
                  break;
              case 6:
                  {
                      this.csa.reverse.remove(cmt);
                  }
                  break;
              case 7:
                  break;
          }
      };
      _proto.addEventListener = function addEventListener(event, listener) {
          if (typeof this._listeners[event] !== "undefined") {
              this._listeners[event].push(listener);
          } else {
              this._listeners[event] = [
                  listener
              ];
          }
      };
      _proto.removeEventListener = function removeEventListener(event, listener) {
          if (typeof this._listeners[event] === "undefined") {
              return;
          }
          var index = this._listeners[event].indexOf(listener);
          if (index >= 0) {
              this._listeners[event].splice(index, 1);
          }
      };
      _proto.dispatchEvent = function dispatchEvent(event, data) {
          if (typeof this._listeners[event] !== "undefined") {
              // Copy so listeners can remove themselves while being dispatched
              var listeners = this._listeners[event].slice();
              for(var i = 0; i < listeners.length; i++){
                  try {
                      listeners[i](data);
                  } catch (e) {
                      console.error(_instanceof(e, Error) ? e.stack : e);
                  }
              }
          }
      };
      /** Static Functions **/ _proto.onTimerEvent = function onTimerEvent(timePassed, cmObj) {
          for(var i = 0; i < cmObj.runline.length; i++){
              var cmt = cmObj.runline[i];
              cmt.time(timePassed);
          }
      };
      _create_class(CommentManager, [
          {
              key: "isRunning",
              get: /**
     * Whether the comments on the runline are moving (see start / stop)
     */ function get() {
                  return this._running;
              }
          }
      ]);
      return CommentManager;
  }();

  /**
   * Promises extra functionality
   * @license MIT
   * @author Jim Chen
   */ /**
   * Resolves as soon as any promise resolves in the order of the input array
   *
   * @param arr - array of promises
   * @return promise that resolves if any one promise resolves and rejects
   *     if otherwise
   **/ function any(promises) {
      if (!Array.isArray(promises)) {
          // Is raw object or promise, resolve it directly
          return Promise.resolve(promises);
      }
      if (promises.length === 0) {
          // No promises to resolve so we think it failed
          return Promise.reject();
      }
      return new Promise(function(resolve, reject) {
          var hasResolved = false;
          var hasCompleted = 0;
          var errors = [];
          for(var i = 0; i < promises.length; i++){
              promises[i].then(function(value) {
                  hasCompleted++;
                  if (!hasResolved) {
                      hasResolved = true;
                      resolve(value);
                  }
              }).catch(function(i) {
                  return function(e) {
                      hasCompleted++;
                      errors[i] = e;
                      if (hasCompleted === promises.length) {
                          // All promises have completed and we are in rejecting case
                          if (!hasResolved) {
                              reject(errors);
                          }
                      }
                  };
              }(i));
          }
      });
  }

  var Promises = {
    __proto__: null,
    any: any
  };

  var CommentProvider = /*#__PURE__*/ function() {
      function CommentProvider() {
          this._started = false;
          this._destroyed = false;
          this._staticSources = {};
          this._dynamicSources = {};
          this._parsers = {};
          this._targets = [];
      }
      var _proto = CommentProvider.prototype;
      /**
     * Attaches a static source to the corresponding type.
     * NOTE: Multiple static sources will race to determine the initial comment
     *     list so it is imperative that they all parse to the SAME content.
     *
     * @param {Provider} source - Promise that resolves to one of the supported types
     * @param {Type} type - Type that the provider resolves to
     * @return {CommentProvider} this
     **/ _proto.addStaticSource = function addStaticSource(source, type) {
          if (this._destroyed) {
              throw new Error('Comment provider has been destroyed, ' + 'cannot attach more sources.');
          }
          if (!(type in this._staticSources)) {
              this._staticSources[type] = [];
          }
          this._staticSources[type].push(source);
          return this;
      };
      /**
     * Attaches a dynamic source to the corresponding type
     * NOTE: Multiple dynamic sources will collectively provide comment data.
     *
     * @param {DynamicProvider} source - Listenable that resolves to one of the supported types
     * @param {Type} type - Type that the provider resolves to
     * @return {CommentProvider} this
     **/ _proto.addDynamicSource = function addDynamicSource(source, type) {
          if (this._destroyed) {
              throw new Error('Comment provider has been destroyed, ' + 'cannot attach more sources.');
          }
          if (!(type in this._dynamicSources)) {
              this._dynamicSources[type] = [];
          }
          this._dynamicSources[type].push(source);
          return this;
      };
      /**
     * Attaches a target comment manager so that we can stream comments to it
     *
     * @param {CommentTarget} commentManager - Comment Manager instance (or any
     *         object with load and send methods) to attach to
     * @return {CommentProvider} this
     **/ _proto.addTarget = function addTarget(commentManager) {
          if (this._destroyed) {
              throw new Error('Comment provider has been destroyed, ' + 'cannot attach more targets.');
          }
          if (commentManager == null || typeof commentManager.load !== 'function' || typeof commentManager.send !== 'function') {
              throw new Error('Expected the target to be a CommentManager (with load and send).');
          }
          this._targets.push(commentManager);
          return this;
      };
      /**
     * Adds a parser for an incoming data type. If multiple parsers are added,
     * parsers added later take precedence.
     *
     * @param {CommentParser} parser - Parser spec compliant parser
     * @param {Type} type - Type that the provider resolves to
     * @return {CommentProvider} this
     **/ _proto.addParser = function addParser(parser, type) {
          if (this._destroyed) {
              throw new Error('Comment provider has been destroyed, ' + 'cannot attach more parsers.');
          }
          if (!(type in this._parsers)) {
              this._parsers[type] = [];
          }
          this._parsers[type].unshift(parser);
          return this;
      };
      _proto.applyParsersOne = function applyParsersOne(data, type) {
          var parsers = this._parsers;
          return new Promise(function(resolve, reject) {
              if (!(type in parsers)) {
                  reject(new Error('No parsers defined for "' + type + '"'));
                  return;
              }
              for(var i = 0; i < parsers[type].length; i++){
                  var output = null;
                  try {
                      output = parsers[type][i].parseOne(data);
                  } catch (e) {
                      // TODO: log this failure
                      console.error(e);
                  }
                  if (output !== null) {
                      resolve(output);
                      return;
                  }
              }
              reject(new Error("Ran out of parsers for they target type"));
          });
      };
      _proto.applyParsersList = function applyParsersList(data, type) {
          var parsers = this._parsers;
          return new Promise(function(resolve, reject) {
              if (!(type in parsers)) {
                  reject(new Error('No parsers defined for "' + type + '"'));
                  return;
              }
              for(var i = 0; i < parsers[type].length; i++){
                  var output = null;
                  try {
                      output = parsers[type][i].parseMany(data);
                  } catch (e) {
                      // TODO: log this failure
                      console.error(e);
                  }
                  if (output !== null) {
                      resolve(output);
                      return;
                  }
              }
              reject(new Error("Ran out of parsers for the target type"));
          });
      };
      /**
     * (Re)loads static comments
     *
     * @return {Promise} that is resolved when the static sources have been
     *     loaded
     */ _proto.load = function load() {
          if (this._destroyed) {
              throw new Error('Cannot load sources on a destroyed provider.');
          }
          var provider = this;
          var promises = [];
          // TODO: This race logic needs to be rethought to provide redundancy
          for(var type in this._staticSources){
              promises.push(any(this._staticSources[type]).then(function(data) {
                  return provider.applyParsersList(data, type);
              }));
          }
          if (promises.length === 0) {
              // No static loaders
              return Promise.resolve([]);
          }
          return any(promises).then(function(commentList) {
              for(var i = 0; i < provider._targets.length; i++){
                  provider._targets[i].load(commentList);
              }
              return Promise.resolve(commentList);
          });
      };
      /**
     * Commit the changes and boot up the provider
     *
     * @return {Promise} that is resolved when all the static sources are loaded
     *     and all the dynamic sources are hooked up
     **/ _proto.start = function start() {
          if (this._destroyed) {
              throw new Error('Cannot start a provider that has been destroyed.');
          }
          this._started = true;
          var provider = this;
          return this.load().then(function(commentList) {
              // Bind the dynamic sources
              for(var type in provider._dynamicSources){
                  provider._dynamicSources[type].forEach(function(source) {
                      source.addEventListener('receive', function(data) {
                          provider.applyParsersOne(data, type).then(function(comment) {
                              for(var i = 0; i < provider._targets.length; i++){
                                  provider._targets[i].send(comment);
                              }
                          });
                      });
                  });
              }
              return Promise.resolve(commentList);
          });
      };
      /**
     * Send out comments to both dynamic sources and POST targets.
     *
     * @param commentData - commentData to be sent to the server. Object.
     * @param requireAll - Do we require that all servers to accept the comment
     *           for the promise to resolve. Defaults to true. If
     *           false, the returned promise will resolve as long as a
     *           single target accepts.
     * @return Promise that is resolved when the server accepts or rejects the
     *     comment. Dynamic sources will decide based on their promise while
     *     POST targets are considered accepted if they return a successful
     *     HTTP response code.
     **/ _proto.send = function send(commentData, requireAll) {
          throw new Error('Not implemented');
      };
      /**
     * Stop providing dynamic comments to the targets
     *
     * @return Promise that is resolved when all bindings between dynamic
     *     sources have been successfully unloaded.
     **/ _proto.destroy = function destroy() {
          if (this._destroyed) {
              return Promise.resolve();
          }
          // TODO: implement debinding for sources
          this._destroyed = true;
          return Promise.resolve();
      };
      /**
     * Provider for HTTP content. This returns a promise that resolves to TEXT.
     *
     * @param {string} method - HTTP method to use
     * @param {string} url - Base URL
     * @param {string} responseType - type of response expected.
     * @param {Object} args - Arguments for query string. Note: This is only used when
     *         method is POST or PUT
     * @param {any} body - Text body content. If not provided will omit a body
     * @return {Promise} that resolves or rejects based on the success or failure
     *         of the request
     **/ CommentProvider.BaseHttpProvider = function BaseHttpProvider(method, url, responseType, args, body) {
          return new Promise(function(resolve, reject) {
              var xhr = new XMLHttpRequest();
              var uri = url;
              if (args && (method === 'POST' || method === 'PUT')) {
                  uri += '?';
                  var argsArray = [];
                  for(var key in args){
                      if (args.hasOwnProperty(key)) {
                          argsArray.push(encodeURIComponent(key) + '=' + encodeURIComponent(args[key]));
                      }
                  }
                  uri += argsArray.join('&');
              }
              xhr.onload = function() {
                  if (this.status >= 200 && this.status < 300) {
                      resolve(this.response);
                  } else {
                      reject(new Error(this.status + " " + this.statusText));
                  }
              };
              xhr.onerror = function() {
                  reject(new Error(this.status + " " + this.statusText));
              };
              xhr.open(method, uri);
              // Limit the response type based on input
              xhr.responseType = typeof responseType === "string" ? responseType : "";
              if (typeof body !== 'undefined') {
                  xhr.send(body);
              } else {
                  xhr.send();
              }
          });
      };
      /**
     * Provider for JSON content. This returns a promise that resolves to JSON.
     *
     * @param {string} method - HTTP method to use
     * @param {string} url - Base URL
     * @param {Object} args - Arguments for query string. Note: This is only used when
     *         method is POST or PUT
     * @param {any} body - Text body content. If not provided will omit a body
     * @return {Promise} that resolves or rejects based on the success or failure
     *         of the request
     **/ CommentProvider.JSONProvider = function JSONProvider(method, url, args, body) {
          return CommentProvider.BaseHttpProvider(method, url, "json", args, body).then(function(response) {
              return response;
          });
      };
      /**
     * Provider for XML content. This returns a promise that resolves to Document.
     *
     * @param {string} method - HTTP method to use
     * @param {string} url - Base URL
     * @param {Object} args - Arguments for query string. Note: This is only used when
     *         method is POST or PUT
     * @param {any} body - Text body content. If not provided will omit a body
     * @return {Promise} that resolves or rejects based on the success or failure
     *         of the request
     **/ CommentProvider.XMLProvider = function XMLProvider(method, url, args, body) {
          return CommentProvider.BaseHttpProvider(method, url, "document", args, body).then(function(response) {
              return response;
          });
      };
      /**
     * Provider for text content. This returns a promise that resolves to Text.
     *
     * @param {string} method - HTTP method to use
     * @param {string} url - Base URL
     * @param {Object} args - Arguments for query string. Note: This is only used when
     *         method is POST or PUT
     * @param {any} body - Text body content. If not provided will omit a body
     * @return {Promise} that resolves or rejects based on the success or failure
     *     of the request
     **/ CommentProvider.TextProvider = function TextProvider(method, url, args, body) {
          return CommentProvider.BaseHttpProvider(method, url, "text", args, body).then(function(response) {
              return response;
          });
      };
      return CommentProvider;
  }();
  CommentProvider.SOURCE_JSON = 'JSON';
  CommentProvider.SOURCE_XML = 'XML';
  CommentProvider.SOURCE_TEXT = 'TEXT';

  function _type_of(obj) {
      "@swc/helpers - typeof";

      return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
  }

  // Fix comments to be valid
  var _format = function _format(text) {
      return text.replace(/\t/, "\\t");
  };
  // Fix Mode7 comments when they are bad
  var _formatmode7 = function _formatmode71(text) {
      if (text.charAt(0) === '[') {
          switch(text.charAt(text.length - 1)){
              case ']':
                  return text;
              case '"':
                  return text + ']';
              case ',':
                  return text.substring(0, text.length - 1) + '"]';
              default:
                  return _formatmode7(text.substring(0, text.length - 1));
          }
      } else {
          return text;
      }
  };
  // Try to escape unsafe HTML code. DO NOT trust that this handles all cases
  // Please do not allow insecure DOM parsing unless you can trust your input source.
  var _escapeUnsafe = function _escapeUnsafe(text) {
      text = text.replace(new RegExp('</([^d])', 'g'), '</disabled $1');
      text = text.replace(new RegExp('</(\S{2,})', 'g'), '</disabled $1');
      text = text.replace(new RegExp('<([^d/]\W*?)', 'g'), '<disabled $1');
      text = text.replace(new RegExp('<([^/ ]{2,}\W*?)', 'g'), '<disabled $1');
      return text;
  };
  var XMLParser$1 = /*#__PURE__*/ function() {
      function XMLParser(params) {
          this._attemptFix = true;
          this._logBadComments = true;
          if ((typeof params === "undefined" ? "undefined" : _type_of(params)) === 'object') {
              this._attemptFix = params.attemptFix === false ? false : true;
              this._logBadComments = params.logBadComments === false ? false : true;
          }
      }
      var _proto = XMLParser.prototype;
      _proto.parseOne = function parseOne(elem) {
          var params;
          try {
              var p = elem.getAttribute('p');
              if (p === null) {
                  return null;
              }
              params = p.split(',');
          } catch (e) {
              // Probably not XML
              return null;
          }
          var text = elem.textContent;
          var comment = {};
          comment.stime = Math.round(parseFloat(params[0]) * 1000);
          comment.size = parseInt(params[2]);
          comment.color = parseInt(params[3]);
          comment.mode = parseInt(params[1]);
          comment.date = parseInt(params[4]);
          comment.pool = parseInt(params[5]);
          comment.position = 'absolute';
          if (params[7] != null) {
              comment.dbid = parseInt(params[7]);
          }
          comment.hash = params[6];
          comment.border = false;
          if (comment.mode < 7) {
              comment.text = text.replace(/(\/n|\\n|\n|\r\n)/g, "\n");
          } else {
              if (comment.mode === 7) {
                  try {
                      if (this._attemptFix) {
                          text = _format(_formatmode7(text));
                      }
                      var extendedParams = JSON.parse(text);
                      comment.shadow = true;
                      comment.x = parseFloat(extendedParams[0]);
                      comment.y = parseFloat(extendedParams[1]);
                      if (Math.floor(comment.x) < comment.x || Math.floor(comment.y) < comment.y) {
                          comment.position = 'relative';
                      }
                      comment.text = extendedParams[4].replace(/(\/n|\\n|\n|\r\n)/g, "\n");
                      comment.rZ = 0;
                      comment.rY = 0;
                      if (extendedParams.length >= 7) {
                          comment.rZ = parseInt(extendedParams[5], 10);
                          comment.rY = parseInt(extendedParams[6], 10);
                      }
                      comment.motion = [];
                      comment.movable = false;
                      if (extendedParams.length >= 11) {
                          comment.movable = true;
                          var singleStepDur = 500;
                          var motion = {
                              'x': {
                                  'from': comment.x,
                                  'to': parseFloat(extendedParams[7]),
                                  'dur': singleStepDur,
                                  'delay': 0
                              },
                              'y': {
                                  'from': comment.y,
                                  'to': parseFloat(extendedParams[8]),
                                  'dur': singleStepDur,
                                  'delay': 0
                              }
                          };
                          if (extendedParams[9] !== '') {
                              singleStepDur = parseInt(extendedParams[9], 10);
                              motion.x.dur = singleStepDur;
                              motion.y.dur = singleStepDur;
                          }
                          if (extendedParams[10] !== '') {
                              motion.x.delay = parseInt(extendedParams[10], 10);
                              motion.y.delay = parseInt(extendedParams[10], 10);
                          }
                          if (extendedParams.length > 11) {
                              comment.shadow = extendedParams[11] !== 'false' && extendedParams[11] !== false;
                              if (extendedParams[12] != null) {
                                  comment.font = extendedParams[12];
                              }
                              if (extendedParams.length > 14) {
                                  // Support for Bilibili advanced Paths
                                  if (comment.position === 'relative') {
                                      if (this._logBadComments) {
                                          console.warn('Cannot mix relative and absolute positioning!');
                                      }
                                      comment.position = 'absolute';
                                  }
                                  var path = extendedParams[14];
                                  var lastPoint = {
                                      x: motion.x.from,
                                      y: motion.y.from
                                  };
                                  var pathMotion = [];
                                  var regex = new RegExp('([a-zA-Z])\\s*(\\d+)[, ](\\d+)', 'g');
                                  var counts = path.split(/[a-zA-Z]/).length - 1;
                                  var m = regex.exec(path);
                                  while(m !== null){
                                      switch(m[1]){
                                          case 'M':
                                              {
                                                  lastPoint.x = parseInt(m[2], 10);
                                                  lastPoint.y = parseInt(m[3], 10);
                                              }
                                              break;
                                          case 'L':
                                              {
                                                  pathMotion.push({
                                                      'x': {
                                                          'from': lastPoint.x,
                                                          'to': parseInt(m[2], 10),
                                                          'dur': singleStepDur / counts,
                                                          'delay': 0
                                                      },
                                                      'y': {
                                                          'from': lastPoint.y,
                                                          'to': parseInt(m[3], 10),
                                                          'dur': singleStepDur / counts,
                                                          'delay': 0
                                                      }
                                                  });
                                                  lastPoint.x = parseInt(m[2], 10);
                                                  lastPoint.y = parseInt(m[3], 10);
                                              }
                                              break;
                                      }
                                      m = regex.exec(path);
                                  }
                                  motion = null;
                                  comment.motion = pathMotion;
                              }
                          }
                          if (motion !== null) {
                              comment.motion.push(motion);
                          }
                      }
                      comment.dur = 2500;
                      if (extendedParams[3] < 12) {
                          comment.dur = extendedParams[3] * 1000;
                      }
                      var tmp = extendedParams[2].split('-');
                      if (tmp != null && tmp.length > 1) {
                          var alphaFrom = parseFloat(tmp[0]);
                          var alphaTo = parseFloat(tmp[1]);
                          comment.opacity = alphaFrom;
                          if (alphaFrom !== alphaTo) {
                              comment.alpha = {
                                  'from': alphaFrom,
                                  'to': alphaTo
                              };
                          }
                      }
                  } catch (e) {
                      if (this._logBadComments) {
                          console.warn('Error occurred in JSON parsing. Could not parse comment.');
                          console.log('[DEBUG] ' + text);
                      }
                  }
              } else if (comment.mode === 8) {
                  comment.code = text; // Code comments are special. Treat them that way.
              } else {
                  if (this._logBadComments) {
                      console.warn('Unknown comment type : ' + comment.mode + '. Not doing further parsing.');
                      console.log('[DEBUG] ' + text);
                  }
              }
          }
          if (comment.text !== null && typeof comment.text === 'string') {
              comment.text = comment.text.replace(/\u25a0/g, "\u2588");
          }
          return comment;
      };
      _proto.parseMany = function parseMany(xmldoc) {
          var elements = [];
          try {
              elements = xmldoc.getElementsByTagName('d');
          } catch (e) {
              // TODO: handle XMLDOC errors.
              return null; // Bail, I can't handle
          }
          var commentList = [];
          for(var i = 0; i < elements.length; i++){
              var comment = this.parseOne(elements[i]);
              if (comment !== null) {
                  commentList.push(comment);
              }
          }
          return commentList;
      };
      return XMLParser;
  }();
  var TextParser$1 = /*#__PURE__*/ function() {
      function TextParser(params) {
          this._allowInsecureDomParsing = true;
          this._attemptEscaping = true;
          this._canSecureNativeParse = false;
          if ((typeof params === "undefined" ? "undefined" : _type_of(params)) === 'object') {
              this._allowInsecureDomParsing = params.allowInsecureDomParsing === false ? false : true;
              this._attemptEscaping = params.attemptEscaping === false ? false : true;
          }
          if (typeof document === 'undefined' || !document || !document.createElement) {
              // We can't rely on innerHTML anyways. Maybe we're in a restricted context (i.e. node).
              this._allowInsecureDomParsing = false;
          }
          if (typeof DOMParser !== 'undefined' && DOMParser !== null) {
              this._canSecureNativeParse = true;
          }
          this._xmlParser = new XMLParser$1(params);
      }
      var _proto = TextParser.prototype;
      _proto.parseOne = function parseOne(comment) {
          // Attempt to parse a single tokenized tag
          if (this._allowInsecureDomParsing) {
              var source = comment;
              if (this._attemptEscaping) {
                  source = _escapeUnsafe(source);
              }
              var temp = document.createElement('div');
              temp.innerHTML = source;
              var tags = temp.getElementsByTagName('d');
              if (tags.length !== 1) {
                  return null; // Can't parse, delegate
              } else {
                  return this._xmlParser.parseOne(tags[0]);
              }
          } else if (this._canSecureNativeParse) {
              var domParser = new DOMParser();
              return this._xmlParser.parseOne(domParser.parseFromString(comment, 'application/xml'));
          } else {
              throw new Error('Secure native js parsing not implemented yet.');
          }
      };
      _proto.parseMany = function parseMany(comment) {
          // Attempt to parse a comment list
          if (this._allowInsecureDomParsing) {
              var source = comment;
              if (this._attemptEscaping) {
                  source = _escapeUnsafe(source);
              }
              var temp = document.createElement('div');
              temp.innerHTML = source;
              return this._xmlParser.parseMany(temp);
          } else if (this._canSecureNativeParse) {
              var domParser = new DOMParser();
              return this._xmlParser.parseMany(domParser.parseFromString(comment, 'application/xml'));
          } else {
              throw new Error('Secure native js parsing not implemented yet.');
          }
      };
      return TextParser;
  }();

  var BilibiliFormat = {
    __proto__: null,
    TextParser: TextParser$1,
    XMLParser: XMLParser$1
  };

  /**
   * Clamps alpha values to [0, 1]
   */ var _clampAlpha = function _clampAlpha(alpha) {
      return Math.min(Math.max(alpha, 0), 1);
  };
  var JSONParser$1 = /*#__PURE__*/ function() {
      function JSONParser(params) {
          this._logBadComments = true;
          this._logNotImplemented = false;
          if ((typeof params === "undefined" ? "undefined" : _type_of(params)) === 'object') {
              this._logBadComments = params.logBadComments === false ? false : true;
              this._logNotImplemented = params.logNotImplemented === true ? true : false;
          }
      }
      var _proto = JSONParser.prototype;
      _proto.parseOne = function parseOne(comment) {
          // Read a comment and generate a correct comment object
          var data = {};
          if ((typeof comment === "undefined" ? "undefined" : _type_of(comment)) !== 'object' || comment == null || !comment.hasOwnProperty('c')) {
              // This cannot be parsed. The comment contains no config data
              return null;
          }
          var config = comment['c'].split(',');
          if (config.length >= 6) {
              data.stime = parseFloat(config[0]) * 1000;
              data.color = parseInt(config[1]);
              data.mode = parseInt(config[2]);
              data.size = parseInt(config[3]);
              data.hash = config[4];
              data.date = parseInt(config[5]);
              data.position = "absolute";
              if (data.mode !== 7) {
                  // Do some text normalization on low complexity comments
                  data.text = comment.m.replace(/(\/n|\\n|\n|\r\n|\\r)/g, "\n");
                  data.text = data.text.replace(/\r/g, "\n");
                  data.text = data.text.replace(/\s/g, "\u00a0");
              } else {
                  var x;
                  try {
                      x = JSON.parse(comment.m);
                  } catch (e) {
                      if (this._logBadComments) {
                          console.warn('Error parsing internal data for comment');
                          console.log('[Dbg] ' + comment.m);
                      }
                      return null; // Can't actually parse this!
                  }
                  data.position = "relative";
                  data.text = x.n; /*.replace(/\r/g,"\n");*/ 
                  data.text = data.text.replace(/\ /g, "\u00a0");
                  if (typeof x.a === 'number') {
                      data.opacity = _clampAlpha(x.a);
                  } else {
                      data.opacity = 1;
                  }
                  if (_type_of(x.p) === 'object') {
                      // Relative position
                      data.x = x.p.x / 1000;
                      data.y = x.p.y / 1000;
                  } else {
                      data.x = 0;
                      data.y = 0;
                  }
                  if (typeof x.c === 'number') {
                      switch(x.c){
                          case 0:
                              data.align = 0;
                              break;
                          case 2:
                              data.align = 1;
                              break;
                          case 6:
                              data.align = 2;
                              break;
                          case 8:
                              data.align = 3;
                              break;
                          default:
                              if (this._logNotImplemented) {
                                  console.log('Cannot handle aligning to center! AlignMode=' + x.c);
                              }
                      }
                  }
                  // Use default axis
                  data.axis = 0;
                  data.shadow = x.b;
                  data.dur = 4000;
                  if (typeof x.l === 'number') {
                      data.dur = x.l * 1000;
                  }
                  if (x.z != null && x.z.length > 0) {
                      data.movable = true;
                      data.motion = [];
                      var moveDuration = 0;
                      var last = {
                          x: data.x,
                          y: data.y,
                          alpha: data.opacity,
                          color: data.color
                      };
                      for(var m = 0; m < x.z.length; m++){
                          var step = x.z[m];
                          var dur = step.l != null ? step.l * 1000 : 500;
                          moveDuration += dur;
                          var motion = {};
                          if (typeof step.rx === 'number') {
                              // TODO: Support this
                              if (this._logNotImplemented) {
                                  console.log('Encountered animated x-axis rotation. Ignoring.');
                              }
                          }
                          if (typeof step.e === 'number') {
                              // TODO: Support this
                              if (this._logNotImplemented) {
                                  console.log('Encountered animated y-axis rotation. Ignoring.');
                              }
                          }
                          if (typeof step.d === 'number') {
                              // TODO: Support this
                              if (this._logNotImplemented) {
                                  console.log('Encountered animated z-axis rotation. Ignoring.');
                              }
                          }
                          if (typeof step.x === 'number') {
                              motion.x = {
                                  from: last.x,
                                  to: step.x / 1000,
                                  dur: dur,
                                  delay: 0
                              };
                              last.x = motion.x.to;
                          }
                          if (typeof step.y === 'number') {
                              motion.y = {
                                  from: last.y,
                                  to: step.y / 1000,
                                  dur: dur,
                                  delay: 0
                              };
                              last.y = motion.y.to;
                          }
                          if (typeof step.t === 'number' && step.t !== last.alpha) {
                              motion.alpha = {
                                  from: last.alpha,
                                  to: _clampAlpha(step.t),
                                  dur: dur,
                                  delay: 0
                              };
                              last.alpha = motion.alpha.to;
                          }
                          if (typeof step.c === 'number' && step.c !== last.color) {
                              motion.color = {
                                  from: last.color,
                                  to: step.c,
                                  dur: dur,
                                  delay: 0
                              };
                              last.color = motion.color.to;
                          }
                          data.motion.push(motion);
                      }
                      data.dur = moveDuration;
                  }
                  var style = x.w;
                  if ((typeof style === "undefined" ? "undefined" : _type_of(style)) === 'object' && style !== null) {
                      if (typeof style.f === 'string') {
                          data.font = style.f;
                      }
                      if (Array.isArray(style.l) && style.l.length > 0) {
                          // Filters
                          if (this._logNotImplemented) {
                              console.log('[Dbg] Filters not supported! ' + JSON.stringify(style.l));
                          }
                      }
                  }
                  if (x.r != null && x.k != null) {
                      data.rX = x.r;
                      data.rY = x.k;
                  }
              }
              return data;
          } else {
              // Not enough arguments.
              if (this._logBadComments) {
                  console.warn('Dropping this comment due to insufficient parameters. Got: ' + config.length);
                  console.log('[Dbg] ' + comment['c']);
              }
              return null;
          }
      };
      _proto.parseMany = function parseMany(comments) {
          if (!Array.isArray(comments)) {
              return null;
          }
          var list = [];
          for(var i = 0; i < comments.length; i++){
              var comment = this.parseOne(comments[i]);
              if (comment !== null) {
                  list.push(comment);
              }
          }
          return list;
      };
      return JSONParser;
  }();
  var TextParser = /*#__PURE__*/ function() {
      function TextParser(param) {
          this._jsonParser = new JSONParser$1(param);
      }
      var _proto = TextParser.prototype;
      _proto.parseOne = function parseOne(comment) {
          try {
              return this._jsonParser.parseOne(JSON.parse(comment));
          } catch (e) {
              console.warn(e);
              return null;
          }
      };
      _proto.parseMany = function parseMany(comment) {
          try {
              return this._jsonParser.parseMany(JSON.parse(comment));
          } catch (e) {
              console.warn(e);
              return null;
          }
      };
      return TextParser;
  }();

  var AcfunFormat = {
    __proto__: null,
    JSONParser: JSONParser$1,
    TextParser: TextParser
  };

  /**
   * CommonDanmakuFormat Parser
   * Example parser for parsing comments that the CCL can accept directly.
   * @license MIT
   * @author Jim Chen
   **/ var _check = function _check(comment) {
      // Sanity check to see if we should be parsing these comments or not
      if (typeof comment.mode !== 'number' || typeof comment.stime !== 'number') {
          return false;
      }
      if (comment.mode === 8 && !(typeof comment.code === 'string')) {
          return false;
      }
      if (typeof comment.text !== 'string') {
          return false;
      }
      return true;
  };
  // Reads an attribute. Missing attributes read as '' (which parses to NaN)
  var _attribute = function _attribute(elem, name) {
      var value = elem.getAttribute(name);
      return value !== null ? value : '';
  };
  var JSONParser = /*#__PURE__*/ function() {
      function JSONParser() {}
      var _proto = JSONParser.prototype;
      _proto.parseOne = function parseOne(comment) {
          // Refuse to parse the comment does not pass sanity check
          return _check(comment) ? comment : null;
      };
      _proto.parseMany = function parseMany(comments) {
          // Refuse to parse if any comment does not pass sanity check
          return comments.every(_check) ? comments : null;
      };
      return JSONParser;
  }();
  var XMLParser = /*#__PURE__*/ function() {
      function XMLParser() {}
      var _proto = XMLParser.prototype;
      _proto.parseOne = function parseOne(comment) {
          var data = {};
          try {
              data.stime = parseInt(_attribute(comment, 'stime'));
              data.mode = parseInt(_attribute(comment, 'mode'));
              data.size = parseInt(_attribute(comment, 'size'));
              data.color = parseInt(_attribute(comment, 'color'));
              data.text = comment.textContent;
          } catch (e) {
              return null;
          }
          return data;
      };
      _proto.parseMany = function parseMany(commentsElem) {
          var comments;
          try {
              comments = commentsElem.getElementsByTagName('comment');
          } catch (e) {
              return null;
          }
          var commentList = [];
          for(var i = 0; i < comments.length; i++){
              var comment = this.parseOne(comments[i]);
              if (comment !== null) {
                  commentList.push(comment);
              }
          }
          return commentList;
      };
      return XMLParser;
  }();

  var CommonDanmakuFormat = {
    __proto__: null,
    JSONParser: JSONParser,
    XMLParser: XMLParser
  };

  exports.AcfunFormat = AcfunFormat;
  exports.AnchorCommentSpaceAllocator = AnchorCommentSpaceAllocator;
  exports.AnimationFrameTimer = AnimationFrameTimer;
  exports.BilibiliFormat = BilibiliFormat;
  exports.BinArray = Array$1;
  exports.CommentFactory = CommentFactory;
  exports.CommentFilter = CommentFilter;
  exports.CommentManager = CommentManager;
  exports.CommentProvider = CommentProvider;
  exports.CommentSpaceAllocator = CommentSpaceAllocator;
  exports.CommentUtils = CommentUtils;
  exports.CommonDanmakuFormat = CommonDanmakuFormat;
  exports.CoreComment = CoreComment;
  exports.CssScrollComment = CssScrollComment;
  exports.IntervalTimer = IntervalTimer;
  exports.Promises = Promises;
  exports.ScrollComment = ScrollComment;

}));
(function (root) {
  if ((typeof exports === 'object' && typeof module !== 'undefined') ||
    (typeof define === 'function' && define.amd)) {
    return;
  }
  var lib = root.CommentCoreLibrary;
  for (var key in lib) {
    if (Object.prototype.hasOwnProperty.call(lib, key)) {
      root[key] = lib[key];
    }
  }
})(typeof globalThis !== 'undefined' ? globalThis :
  typeof self !== 'undefined' ? self : this);
