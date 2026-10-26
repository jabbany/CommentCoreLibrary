/*!Copyright(c) CommentCoreLibrary v0.11.1 (//github.com/jabbany/CommentCoreLibrary) - Licensed under the MIT License */
(function (Runtime, Tween) {
  'use strict';

  /**
   * Kagerou Engine Module Helpers
   * @author Jim Chen
   * @description Helpers used by the bundle entries (api/<Module>.ts) to build
   *    the global objects that scripts in the worker interact with.
   */ /**
   * Creates the global object for an API module.
   *
   * @param {Object} members - module namespace whose members are copied
   * @param {PropertyDescriptorMap} properties - accessor properties to define.
   *        Like BiliScriptEngine, these are not enumerable. Members with the same
   *        name are replaced by these properties.
   * @returns {Object} the module object
   */ function createModule(members, properties) {
      if (properties === void 0) properties = {};
      var module = {};
      for(var key in members){
          if (!properties.hasOwnProperty(key)) {
              module[key] = members[key];
          }
      }
      Object.defineProperties(module, properties);
      return module;
  }
  /**
   * Exposes a value as a global in the worker
   *
   * @param {string} name - name of the global
   * @param {any} value - value to expose
   */ function exportGlobal(name, value) {
      self[name] = value;
  }

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

  /**
   * Class that represents a 2d point
   */ var Point = /*#__PURE__*/ function() {
      function Point(x, y) {
          if (x === void 0) x = 0;
          if (y === void 0) y = 0;
          this.x = x;
          this.y = y;
      }
      var _proto = Point.prototype;
      _proto.add = function add(p) {
          return new Point(p.x + this.x, p.y + this.y);
      };
      _proto.subtract = function subtract(p) {
          return new Point(this.x - p.x, this.y - p.y);
      };
      _proto.offset = function offset(dx, dy) {
          this.x += dx;
          this.y += dy;
      };
      _proto.normalize = function normalize(thickness) {
          var ratio = thickness / this.length;
          this.x *= ratio;
          this.y *= ratio;
      };
      _proto.setTo = function setTo(x, y) {
          this.x = x;
          this.y = y;
      };
      _proto.equals = function equals(p) {
          if (p.x === this.x && p.y === this.y) {
              return true;
          }
          return false;
      };
      _proto.toString = function toString() {
          return '(x=' + this.x + ', y=' + this.y + ')';
      };
      _proto.clone = function clone() {
          return new Point(this.x, this.y);
      };
      Point.interpolate = function interpolate(a, b, f) {
          return new Point((b.x - a.x) * f + a.x, (b.y - a.y) * f + a.y);
      };
      Point.polar = function polar(r, theta) {
          return new Point(r * Math.cos(theta), r * Math.sin(theta));
      };
      _create_class(Point, [
          {
              key: "length",
              get: function get() {
                  return Math.sqrt(this.x * this.x + this.y * this.y);
              },
              set: function set(_l) {
                  __trace('Point.length is read-only', 'err');
              }
          }
      ]);
      return Point;
  }();
  /**
   * Matrix class to represent a 2d transformation matrix. This matrix will be
   * 3x3 with 9 configurable values.
   */ var Matrix = /*#__PURE__*/ function() {
      function Matrix(a, b, c, d, tx, ty) {
          if (a === void 0) a = 1;
          if (b === void 0) b = 0;
          if (c === void 0) c = 0;
          if (d === void 0) d = 1;
          if (tx === void 0) tx = 0;
          if (ty === void 0) ty = 0;
          this._data = [
              a,
              c,
              tx,
              b,
              d,
              ty,
              0,
              0,
              1
          ];
      }
      var _proto = Matrix.prototype;
      _proto.dotProduct = function dotProduct(o) {
          if (o.length < 9) {
              throw new Error('Matrix dot product expects a 3x3 Matrix');
          }
          var res = [
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
          for(var i = 0; i < 3; i++){
              for(var j = 0; j < 3; j++){
                  for(var k = 0; k < 3; k++){
                      res[i * 3 + j] += this._data[i * 3 + k] * o[k * 3 + j];
                  }
              }
          }
          return res;
      };
      _proto.setTo = function setTo(a, b, c, d, tx, ty) {
          if (a === void 0) a = 1;
          if (b === void 0) b = 0;
          if (c === void 0) c = 0;
          if (d === void 0) d = 1;
          if (tx === void 0) tx = 0;
          if (ty === void 0) ty = 0;
          this._data = [
              a,
              c,
              tx,
              b,
              d,
              ty,
              0,
              0,
              1
          ];
      };
      _proto.translate = function translate(tX, tY) {
          this._data[2] += tX;
          this._data[5] += tY;
      };
      _proto.rotate = function rotate(q) {
          this._data = this.dotProduct([
              Math.cos(q),
              -Math.sin(q),
              0,
              Math.sin(q),
              Math.cos(q),
              0,
              0,
              0,
              1
          ]);
      };
      _proto.scale = function scale(sx, sy) {
          this._data = this.dotProduct([
              sx,
              0,
              0,
              0,
              sy,
              0,
              0,
              0,
              1
          ]);
      };
      _proto.identity = function identity() {
          this.setTo(1, 0, 0, 1, 0, 0);
      };
      _proto.createGradientBox = function createGradientBox(width, height, rotation, tX, tY) {
          this.createBox(width, height, rotation, tX, tY);
      };
      _proto.createBox = function createBox(sX, sY, q, tX, tY) {
          this.identity();
          this.rotate(q);
          this.scale(sX, sY);
          this.translate(tX, tY);
      };
      _proto.clone = function clone() {
          var a = this._data[0], b = this._data[3], c = this._data[1], d = this._data[4], tx = this._data[2], ty = this._data[5];
          return new Matrix(a, b, c, d, tx, ty);
      };
      _proto.serialize = function serialize() {
          return this._data;
      };
      return Matrix;
  }();
  /**
   * Matrix class to represent a 3d transformation matrix. Such a matrix will be
   * 4x4 containing 16 configurable values.
   * API-compatible with AS3 class of same name.
   * @author Jim Chen
   */ var Matrix3D = /*#__PURE__*/ function() {
      function Matrix3D(iv) {
          if (iv === void 0) iv = [
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
          ];
          if (iv.length === 16) {
              this._data = iv;
          } else if (iv.length === 0) {
              this.identity();
          } else {
              __trace('Matrix3D initialization vector invalid', 'warn');
              this.identity();
          }
      }
      var _proto = Matrix3D.prototype;
      _proto.dotProduct = function dotProduct(a, b) {
          if (a.length !== 16 || b.length !== 16) {
              throw new Error('Matrix3D dot product expects a 4xr Matrix3D');
          }
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
          return res;
      };
      _proto.rotationMatrix = function rotationMatrix(angle, axis) {
          var sT = Math.sin(angle), cT = Math.cos(angle);
          return [
              cT + axis.x * axis.x * (1 - cT),
              axis.x * axis.y * (1 - cT) - axis.z * sT,
              axis.x * axis.z * (1 - cT) + axis.y * sT,
              0,
              axis.x * axis.y * (1 - cT) + axis.z * sT,
              cT + axis.y * axis.y * (1 - cT),
              axis.y * axis.z * (1 - cT) - axis.x * sT,
              0,
              axis.z * axis.x * (1 - cT) - axis.y * sT,
              axis.z * axis.y * (1 - cT) + axis.x * sT,
              cT + axis.z * axis.z * (1 - cT),
              0,
              0,
              0,
              0,
              1
          ];
      };
      _proto.identity = function identity() {
          this._data = [
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
          ];
      };
      _proto.append = function append(lhs) {
          this._data = this.dotProduct(lhs._data, this._data);
      };
      _proto.appendRotation = function appendRotation(degrees, axis, pivotPoint) {
          if (pivotPoint === void 0) pivotPoint = null;
          if (pivotPoint !== null) {
              this.appendTranslation(pivotPoint.x, pivotPoint.y, pivotPoint.z);
          }
          this._data = this.dotProduct(this.rotationMatrix(degrees * Math.PI / 180, axis), this._data);
          if (pivotPoint !== null) {
              this.appendTranslation(-pivotPoint.x, -pivotPoint.y, -pivotPoint.z);
          }
      };
      _proto.appendTranslation = function appendTranslation(x, y, z) {
          this._data = this.dotProduct([
              1,
              0,
              0,
              x,
              0,
              1,
              0,
              y,
              0,
              0,
              1,
              z,
              0,
              0,
              0,
              1
          ], this._data);
      };
      _proto.appendScale = function appendScale(sX, sY, sZ) {
          if (sX === void 0) sX = 1;
          if (sY === void 0) sY = 1;
          if (sZ === void 0) sZ = 1;
          this._data = this.dotProduct([
              sX,
              0,
              0,
              0,
              0,
              sY,
              0,
              0,
              0,
              0,
              sZ,
              0,
              0,
              0,
              0,
              1
          ], this._data);
      };
      _proto.prepend = function prepend(rhs) {
          this._data = this.dotProduct(this._data, rhs._data);
      };
      _proto.prependRotation = function prependRotation(degrees, axis, pivotPoint) {
          if (pivotPoint === void 0) pivotPoint = null;
          if (pivotPoint !== null) {
              this.prependTranslation(pivotPoint.x, pivotPoint.y, pivotPoint.z);
          }
          this._data = this.dotProduct(this._data, this.rotationMatrix(degrees * Math.PI / 180, axis));
          if (pivotPoint !== null) {
              this.prependTranslation(-pivotPoint.x, -pivotPoint.y, -pivotPoint.z);
          }
      };
      _proto.prependTranslation = function prependTranslation(x, y, z) {
          this._data = this.dotProduct(this._data, [
              1,
              0,
              0,
              x,
              0,
              1,
              0,
              y,
              0,
              0,
              1,
              z,
              0,
              0,
              0,
              1
          ]);
      };
      _proto.prependScale = function prependScale(sX, sY, sZ) {
          this._data = this.dotProduct(this._data, [
              sX,
              0,
              0,
              0,
              0,
              sY,
              0,
              0,
              0,
              0,
              sZ,
              0,
              0,
              0,
              0,
              1
          ]);
      };
      _proto.transformVector = function transformVector(v) {
          var rx = this._data[0] * v.x + this._data[1] * v.y + this._data[2] * v.z + this._data[3] * v.w;
          var ry = this._data[4] * v.x + this._data[5] * v.y + this._data[6] * v.z + this._data[7] * v.w;
          var rz = this._data[8] * v.x + this._data[9] * v.y + this._data[10] * v.z + this._data[11] * v.w;
          var rw = this._data[12] * v.x + this._data[13] * v.y + this._data[14] * v.z + this._data[15] * v.w;
          return new Vector3D(rx, ry, rz, rw);
      };
      /**
     * Given an array of numbers representing vectors, postMultiply them to the current matrix.
     * @param vin - input (x,y,z)
     * @param vout - output (x,y,z)
     */ _proto.transformVectors = function transformVectors(vin, vout) {
          if (vin.length % 3 !== 0) {
              __trace('Matrix3D.transformVectors expects input size to be multiple of 3.', 'err');
              return;
          }
          for(var i = 0; i < vin.length / 3; i++){
              var x = vin[i * 3], y = vin[i * 3 + 1], z = vin[i * 3 + 2];
              var rx = this._data[0] * x + this._data[1] * y + this._data[2] * z;
              var ry = this._data[4] * x + this._data[5] * y + this._data[6] * z;
              var rz = this._data[8] * x + this._data[9] * y + this._data[10] * z;
              vout.push(rx, ry, rz);
          }
      };
      _proto.transpose = function transpose() {
          this._data = [
              this._data[0],
              this._data[4],
              this._data[8],
              this._data[12],
              this._data[1],
              this._data[5],
              this._data[9],
              this._data[13],
              this._data[2],
              this._data[6],
              this._data[10],
              this._data[14],
              this._data[3],
              this._data[7],
              this._data[11],
              this._data[15]
          ];
      };
      _proto.clone = function clone() {
          return new Matrix3D(this._data);
      };
      _proto.serialize = function serialize() {
          return this._data;
      };
      return Matrix3D;
  }();
  var Vector3D = /*#__PURE__*/ function() {
      function Vector3D(x, y, z, w) {
          if (x === void 0) x = 0;
          if (y === void 0) y = 0;
          if (z === void 0) z = 0;
          if (w === void 0) w = 0;
          this.x = x;
          this.y = y;
          this.z = z;
          this.w = w;
      }
      var _proto = Vector3D.prototype;
      _proto.toString = function toString() {
          return '(x=' + this.x + ', y=' + this.y + ', z=' + this.z + ', w=' + this.w + ')';
      };
      return Vector3D;
  }();
  Vector3D.X_AXIS = new Vector3D(1, 0, 0);
  Vector3D.Y_AXIS = new Vector3D(0, 1, 0);
  Vector3D.Z_AXIS = new Vector3D(0, 0, 1);
  function createMatrix(a, b, c, d, tx, ty) {
      return new Matrix(a, b, c, d, tx, ty);
  }
  function createMatrix3D(iv) {
      return new Matrix3D(iv);
  }
  function createGradientBox(width, height, rotation, tX, tY) {
      var m = new Matrix();
      // Note: Magic number here is some flash scaling constant
      m.createGradientBox(width / 1638.4, height / 1638.4, rotation, tX + width / 2, tY + height / 2);
      return m;
  }
  function createVector3D(x, y, z, w) {
      if (x === void 0) x = 0;
      if (y === void 0) y = 0;
      if (z === void 0) z = 0;
      if (w === void 0) w = 0;
      return new Vector3D(x, y, z, w);
  }
  function projectVector(matrix, vector) {
      return matrix.transformVector(vector);
  }
  function projectVectors(matrix, verts, projectedVerts, uvts) {
      /** Clear projected Verts **/ while(projectedVerts.length > 0){
          projectedVerts.pop();
      }
      if (verts.length % 3 !== 0) {
          __trace('Display.projectVectors input vertex Vector must be a multiple of 3.', 'err');
          return;
      }
      var transformed = [];
      matrix.transformVectors(verts, transformed);
      for(var i = 0; i < transformed.length / 3; i++){
          var x = transformed[i * 3], y = transformed[i * 3 + 1];
          projectedVerts.push(x, y);
      }
  }
  function createPoint(x, y) {
      if (x === void 0) x = 0;
      if (y === void 0) y = 0;
      return new Point(x, y);
  }
  /**
   * Transforms a JS Array into an AS3 Vector<int>.
   *   Nothing is actually done since the methods are very
   *   similar across both.
   * @param {Array<number>} array - Array
   * @returns {Array<number>} - AS3 Integer Vector
   */ function toIntVector(array) {
      Object.defineProperty(array, 'as3Type', {
          get: function get() {
              return 'Vector<int>';
          },
          set: function set(_value) {
              __trace('as3Type should not be set.', 'warn');
          }
      });
      return array.map(Math.floor);
  }
  /**
   * Transforms a JS Array into an AS3 Vector<number>.
   *   Nothing is actually done since the methods are very
   *   similar across both.
   * @param {Array<number>} array - Array
   * @returns {Array<number>} - AS3 Number Vector
   */ function toNumberVector(array) {
      Object.defineProperty(array, 'as3Type', {
          get: function get() {
              return 'Vector<number>';
          },
          set: function set(_value) {
              __trace('as3Type should not be set.', 'warn');
          }
      });
      return array;
  }

  /**
   * Root of the display list
   * @author Jim Chen
   * @description The root sprite (Display.root) is created when the Display
   *    module loads (see ../Display.ts). It is held here so that display objects
   *    can reach it without depending on the module that creates it.
   */ var _root = null;
  function getRoot() {
      return _root;
  }
  function setRoot(root) {
      _root = root;
  }

  var ColorTransform = /*#__PURE__*/ function() {
      function ColorTransform(redMultiplier, greenMultiplier, blueMultiplier, alphaMultiplier, redOffset, greenOffset, blueOffset, alphaOffset) {
          if (redMultiplier === void 0) redMultiplier = 1;
          if (greenMultiplier === void 0) greenMultiplier = 1;
          if (blueMultiplier === void 0) blueMultiplier = 1;
          if (alphaMultiplier === void 0) alphaMultiplier = 1;
          if (redOffset === void 0) redOffset = 0;
          if (greenOffset === void 0) greenOffset = 0;
          if (blueOffset === void 0) blueOffset = 0;
          if (alphaOffset === void 0) alphaOffset = 0;
          this.redMultiplier = redMultiplier;
          this.greenMultiplier = greenMultiplier;
          this.blueMultiplier = blueMultiplier;
          this.alphaMultiplier = alphaMultiplier;
          this.redOffset = redOffset;
          this.greenOffset = greenOffset;
          this.blueOffset = blueOffset;
          this.alphaOffset = alphaOffset;
      }
      var _proto = ColorTransform.prototype;
      _proto.concat = function concat(second) {
          this.redMultiplier *= second.redMultiplier;
          this.greenMultiplier *= second.greenMultiplier;
          this.blueMultiplier *= second.blueMultiplier;
          this.alphaMultiplier *= second.alphaMultiplier;
          this.redOffset += second.redOffset;
          this.greenOffset += second.greenOffset;
          this.blueOffset += second.blueOffset;
          this.alphaOffset += second.alphaOffset;
      };
      _proto.serialize = function serialize() {
          return {
              'class': 'ColorTransform',
              'red': {
                  'offset': this.redOffset,
                  'multiplier': this.redMultiplier
              },
              'green': {
                  'offset': this.greenOffset,
                  'multiplier': this.greenMultiplier
              },
              'blue': {
                  'offset': this.blueOffset,
                  'multiplier': this.blueMultiplier
              },
              'alpha': {
                  'offset': this.alphaOffset,
                  'multiplier': this.alphaMultiplier
              }
          };
      };
      _create_class(ColorTransform, [
          {
              key: "color",
              get: function get() {
                  return this.redOffset << 16 | this.greenOffset << 8 | this.blueOffset;
              },
              set: function set(color) {
                  this.redOffset = color >> 16 & 0xFF;
                  this.greenOffset = color >> 8 & 0xFF;
                  this.blueOffset = color & 0xFF;
                  this.redMultiplier = 0;
                  this.greenMultiplier = 0;
                  this.blueMultiplier = 0;
              }
          }
      ]);
      return ColorTransform;
  }();
  function createColorTransform(redMultiplier, greenMultiplier, blueMultiplier, alphaMultiplier, redOffset, greenOffset, blueOffset, alphaOffset) {
      if (redMultiplier === void 0) redMultiplier = 1;
      if (greenMultiplier === void 0) greenMultiplier = 1;
      if (blueMultiplier === void 0) blueMultiplier = 1;
      if (alphaMultiplier === void 0) alphaMultiplier = 1;
      if (redOffset === void 0) redOffset = 0;
      if (greenOffset === void 0) greenOffset = 0;
      if (blueOffset === void 0) blueOffset = 0;
      if (alphaOffset === void 0) alphaOffset = 0;
      return new ColorTransform(redMultiplier, greenMultiplier, blueMultiplier, alphaMultiplier, redOffset, greenOffset, blueOffset, alphaOffset);
  }

  var PerspectiveProjection = /*#__PURE__*/ function() {
      function PerspectiveProjection(t) {
          if (t === void 0) t = null;
          this.fieldOfView = 55;
          this.projectionCenter = new Point(0, 0);
          this.focalLength = 0;
          if (t !== null) {
              this.projectionCenter = new Point(t.width / 2, t.height / 2);
              this.fieldOfView = 55;
              this.focalLength = t.width / 2 / Math.tan(this.fieldOfView / 2);
          }
      }
      var _proto = PerspectiveProjection.prototype;
      _proto.toMatrix3D = function toMatrix3D() {
          return new Matrix3D();
      };
      _proto.clone = function clone() {
          var proj = new PerspectiveProjection();
          proj.fieldOfView = this.fieldOfView;
          proj.projectionCenter = this.projectionCenter;
          proj.focalLength = this.focalLength;
          return proj;
      };
      return PerspectiveProjection;
  }();
  var Transform = /*#__PURE__*/ function() {
      function Transform(parent) {
          this._matrix = new Matrix();
          this._matrix3d = null;
          this._parent = parent;
      }
      var _proto = Transform.prototype;
      _proto.box3d = function box3d(sX, sY, sZ, rotX, rotY, rotZ, tX, tY, tZ) {
          if (sX === void 0) sX = 1;
          if (sY === void 0) sY = 1;
          if (sZ === void 0) sZ = 1;
          if (rotX === void 0) rotX = 0;
          if (rotY === void 0) rotY = 0;
          if (rotZ === void 0) rotZ = 0;
          if (tX === void 0) tX = 0;
          if (tY === void 0) tY = 0;
          if (tZ === void 0) tZ = 0;
          if (this._matrix !== null || this._matrix3d === null) {
              this._matrix = null;
              this._matrix3d = new Matrix3D();
          }
          this._matrix3d.identity();
          this._matrix3d.appendRotation(rotX, Vector3D.X_AXIS);
          this._matrix3d.appendRotation(rotY, Vector3D.Y_AXIS);
          this._matrix3d.appendRotation(rotZ, Vector3D.Z_AXIS);
          this._matrix3d.appendScale(sX, sY, sZ);
          this._matrix3d.appendTranslation(tX, tY, tZ);
      };
      _proto.box = function box(sX, sY, rot, tX, tY) {
          if (sX === void 0) sX = 1;
          if (sY === void 0) sY = 1;
          if (rot === void 0) rot = 0;
          if (tX === void 0) tX = 0;
          if (tY === void 0) tY = 0;
          if (this._matrix) {
              this._matrix.createBox(sX, sY, rot, tX, tY);
          } else {
              this.box3d(sX, sY, 1, 0, 0, rot, tX, tY, 0);
          }
      };
      _proto.update = function update() {
          if (this._parent === null) {
              return;
          }
          this._parent.transform = this;
      };
      _proto.getRelativeMatrix3D = function getRelativeMatrix3D(relativeTo) {
          __trace('Transform.getRelativeMatrix3D not implemented', 'warn');
          return new Matrix3D();
      };
      /**
     * Returns the working matrix as a serializable object
     * @returns {*} Serializable Matrix
     */ _proto.getMatrix = function getMatrix() {
          if (this._matrix) {
              return this._matrix;
          } else {
              return this._matrix3d;
          }
      };
      /**
     * Returns matrix type in use
     * @returns {string} - "2d" or "3d"
     */ _proto.getMatrixType = function getMatrixType() {
          return this._matrix ? '2d' : '3d';
      };
      /**
     * Clones the current transform object
     * The new transform does not bind to any object until it
     * is bound to an object. Before that, updates don't
     * take effect.
     *
     * @returns {Transform} - Clone of transform object
     */ _proto.clone = function clone() {
          var t = new Transform(null);
          t._matrix = this._matrix;
          t._matrix3d = this._matrix3d;
          return t;
      };
      _proto.serialize = function serialize() {
          return {
              'mode': this.getMatrixType(),
              'matrix': this.getMatrix().serialize()
          };
      };
      _create_class(Transform, [
          {
              key: "parent",
              get: function get() {
                  return this._parent;
              },
              set: function set(p) {
                  this._parent = p;
              }
          },
          {
              key: "perspectiveProjection",
              get: function get() {
                  if (typeof this._perspectiveProjection === 'undefined') {
                      this._perspectiveProjection = new PerspectiveProjection(this._parent);
                  }
                  return this._perspectiveProjection;
              },
              set: function set(projection) {
                  this._perspectiveProjection = projection;
              }
          },
          {
              key: "colorTransform",
              get: function get() {
                  if (typeof this._colorTransform === 'undefined') {
                      this._colorTransform = new ColorTransform();
                  }
                  return this._colorTransform;
              },
              set: function set(colorTransform) {
                  this._colorTransform = colorTransform;
              }
          },
          {
              key: "matrix3D",
              get: function get() {
                  return this._matrix3d;
              },
              set: function set(m) {
                  if (m === null) {
                      if (this._matrix3d === null) {
                          return;
                      }
                      this._matrix3d = null;
                      this._matrix = new Matrix();
                  } else {
                      this._matrix = null;
                      this._matrix3d = m;
                  }
                  this.update();
              }
          },
          {
              key: "matrix",
              get: function get() {
                  return this._matrix;
              },
              set: function set(m) {
                  if (m === null) {
                      if (this._matrix === null) {
                          return;
                      }
                      this._matrix = null;
                      this._matrix3d = new Matrix3D();
                  } else {
                      this._matrix3d = null;
                      this._matrix = m;
                  }
                  this.update();
              }
          }
      ]);
      return Transform;
  }();

  var BlendMode = function BlendMode() {
  };
  BlendMode.ADD = "add";
  BlendMode.ALPHA = "alpha";
  BlendMode.DARKEN = "darken";
  BlendMode.DIFFERENCE = "difference";
  BlendMode.ERASE = "erase";
  BlendMode.HARDLIGHT = "hardlight";
  BlendMode.INVERT = "invert";
  BlendMode.LAYER = "layer";
  BlendMode.LIGHTEN = "lighten";
  BlendMode.MULTIPLY = "multiply";
  BlendMode.NORMAL = "normal";
  BlendMode.OVERLAY = "overlay";
  BlendMode.SCREEN = "screen";
  BlendMode.SHADER = "shader";
  BlendMode.SUBTRACT = "subtract";
  var Rectangle = /*#__PURE__*/ function() {
      function Rectangle(x, y, width, height) {
          if (x === void 0) x = 0;
          if (y === void 0) y = 0;
          if (width === void 0) width = 0;
          if (height === void 0) height = 0;
          this._x = x;
          this._y = y;
          this._width = width;
          this._height = height;
      }
      var _proto = Rectangle.prototype;
      _proto.contains = function contains(x, y) {
          return x >= this.left && y >= this.top && x <= this.right && y <= this.bottom;
      };
      _proto.containsPoint = function containsPoint(p) {
          return this.contains(p.x, p.y);
      };
      _proto.containsRect = function containsRect(r) {
          return this.contains(r.left, r.top) && this.contains(r.right, r.bottom);
      };
      _proto.copyFrom = function copyFrom(source) {
          this._x = source._x;
          this._y = source._y;
          this._width = source._width;
          this._height = source._height;
      };
      _proto.equals = function equals(other) {
          return this._x === other._x && this._y === other._y && this._width === other._width && this._height === other._height;
      };
      _proto.inflate = function inflate(dx, dy) {
          if (dx === void 0) dx = 0;
          if (dy === void 0) dy = 0;
          this._x -= dx;
          this._width += 2 * dx;
          this._y -= dy;
          this._height += 2 * dy;
      };
      _proto.inflatePoint = function inflatePoint(p) {
          this.inflate(p.x, p.y);
      };
      _proto.isEmpty = function isEmpty() {
          return this._width <= 0 || this.height <= 0;
      };
      _proto.setTo = function setTo(x, y, width, height) {
          if (x === void 0) x = 0;
          if (y === void 0) y = 0;
          if (width === void 0) width = 0;
          if (height === void 0) height = 0;
          this._x = x;
          this._y = y;
          this._width = width;
          this._height = height;
      };
      _proto.offset = function offset(x, y) {
          if (x === void 0) x = 0;
          if (y === void 0) y = 0;
          this._x += x;
          this._y += y;
      };
      _proto.offsetPoint = function offsetPoint(p) {
          this.offset(p.x, p.y);
      };
      _proto.setEmpty = function setEmpty() {
          this.setTo(0, 0, 0, 0);
      };
      /**
     * Unions the rectangle with a point coordinate
     * @param x - x coordinate
     * @param y - y coordinate
     */ _proto.unionCoord = function unionCoord(x, y) {
          var dx = x - this._x;
          var dy = y - this._y;
          if (dx >= 0) {
              this._width = Math.max(this._width, dx);
          } else {
              this._x += dx;
              this._width -= dx;
          }
          if (dy >= 0) {
              this._height = Math.max(this._height, dy);
          } else {
              this._y += dy;
              this._height -= dy;
          }
      };
      _proto.unionPoint = function unionPoint(p) {
          this.unionCoord(p.x, p.y);
      };
      _proto.union = function union(r) {
          var n = this.clone();
          n.unionCoord(r.left, r.top);
          n.unionCoord(r.right, r.bottom);
          return n;
      };
      _proto.toString = function toString() {
          return "(x=" + this._x + ", y=" + this._y + ", width=" + this._width + ", height=" + this._height + ")";
      };
      _proto.clone = function clone() {
          return new Rectangle(this._x, this._y, this._width, this._height);
      };
      _proto.serialize = function serialize() {
          return {
              x: this._x,
              y: this._y,
              width: this._width,
              height: this._height
          };
      };
      _create_class(Rectangle, [
          {
              key: "x",
              get: function get() {
                  return this._x;
              },
              set: function set(v) {
                  if (v !== null) {
                      this._x = v;
                  }
              }
          },
          {
              key: "y",
              get: function get() {
                  return this._y;
              },
              set: function set(v) {
                  if (v !== null) {
                      this._y = v;
                  }
              }
          },
          {
              key: "width",
              get: function get() {
                  return this._width;
              },
              set: function set(v) {
                  if (v !== null) {
                      this._width = v;
                  }
              }
          },
          {
              key: "height",
              get: function get() {
                  return this._height;
              },
              set: function set(v) {
                  if (v !== null) {
                      this._height = v;
                  }
              }
          },
          {
              key: "left",
              get: function get() {
                  return this._x;
              }
          },
          {
              key: "right",
              get: function get() {
                  return this._x + this._width;
              }
          },
          {
              key: "top",
              get: function get() {
                  return this._y;
              }
          },
          {
              key: "bottom",
              get: function get() {
                  return this._y + this._height;
              }
          },
          {
              key: "size",
              get: function get() {
                  return createPoint(this._width, this._height);
              }
          }
      ]);
      return Rectangle;
  }();
  var DisplayObject = /*#__PURE__*/ function() {
      function DisplayObject(id) {
          if (id === void 0) id = Runtime.generateId();
          this._alpha = 1;
          this._anchor = new Point();
          this._boundingBox = new Rectangle();
          this._z = 0;
          this._scaleX = 1;
          this._scaleY = 1;
          this._scaleZ = 1;
          this._rotationX = 0;
          this._rotationY = 0;
          this._rotationZ = 0;
          this._filters = [];
          this._visible = false;
          this._blendMode = "normal";
          this._listeners = {};
          this._parent = null;
          this._name = "";
          this._children = [];
          this._transform = new Transform(this);
          this._hasSetDefaults = false;
          this._id = id;
          this._visible = true;
      }
      var _proto = DisplayObject.prototype;
      _proto.setDefaults = function setDefaults(defaults) {
          if (defaults === void 0) defaults = {};
          if (this._hasSetDefaults) {
              __trace("DisplayObject.setDefaults called more than once.", "warn");
              return;
          }
          this._hasSetDefaults = true;
          try {
              /** Try reading the defaults from motion fields **/ if (defaults.hasOwnProperty("motion")) {
                  var motion = defaults["motion"];
                  if (motion.hasOwnProperty("alpha")) {
                      this._alpha = motion["alpha"]["fromValue"];
                  }
                  if (motion.hasOwnProperty("x")) {
                      this._anchor.x = motion["x"]["fromValue"];
                  }
                  if (motion.hasOwnProperty("y")) {
                      this._anchor.y = motion["y"]["fromValue"];
                  }
              } else if (defaults.hasOwnProperty("motionGroup") && defaults["motionGroup"] && defaults["motionGroup"].length > 0) {
                  var motion = defaults["motionGroup"][0];
                  if (motion.hasOwnProperty("alpha")) {
                      this._alpha = motion["alpha"]["fromValue"];
                  }
                  if (motion.hasOwnProperty("x")) {
                      this._anchor.x = motion["x"]["fromValue"];
                  }
                  if (motion.hasOwnProperty("y")) {
                      this._anchor.y = motion["y"]["fromValue"];
                  }
              }
          } catch (e) {}
          if (defaults.hasOwnProperty("alpha")) {
              this._alpha = defaults["alpha"];
          }
          if (defaults.hasOwnProperty("x")) {
              this._anchor.x = defaults["x"];
          }
          if (defaults.hasOwnProperty("y")) {
              this._anchor.y = defaults["y"];
          }
      };
      /**
     * These are meant to be internal public methods, so they
     * are named noun-verb instead of verb-noun
     */ _proto.eventToggle = function eventToggle(eventName, mode) {
          if (mode === void 0) mode = "enable";
          if (DisplayObject.SANDBOX_EVENTS.indexOf(eventName) > -1) {
              return;
          /* No need to notify */ }
          __pchannel("Runtime:ManageEvent", {
              "id": this._id,
              "name": eventName,
              "mode": mode
          });
      };
      _proto.propertyUpdate = function propertyUpdate(propertyName, updatedValue) {
          __pchannel("Runtime:UpdateProperty", {
              "id": this._id,
              "name": propertyName,
              "value": updatedValue
          });
      };
      _proto.methodCall = function methodCall(methodName, params) {
          __pchannel("Runtime:CallMethod", {
              "id": this._id,
              "method": methodName,
              "params": params
          });
      };
      /** Start Transform Area **/ _proto._updateBox = function _updateBox(mode) {
          if (mode === void 0) mode = this._transform.getMatrixType();
          if (mode === "3d") {
              this._transform.box3d(this._scaleX, this._scaleY, this._scaleZ, this._rotationX, this._rotationY, this._rotationZ, 0, 0, this._z);
          } else {
              this._transform.box(this._scaleX, this._scaleY, this._rotationZ * Math.PI / 180);
          }
          this.transform = this._transform;
      };
      /** AS3 Stuff **/ _proto.dispatchEvent = function dispatchEvent(event, data) {
          if (this._listeners.hasOwnProperty(event)) {
              if (this._listeners[event] !== null) {
                  for(var i = 0; i < this._listeners[event].length; i++){
                      try {
                          this._listeners[event][i](data);
                      } catch (e) {
                          if (e.hasOwnProperty('stack')) {
                              __trace(e.stack.toString(), 'err');
                          } else {
                              __trace(e.toString(), 'err');
                          }
                      }
                  }
              }
          }
      };
      _proto.addEventListener = function addEventListener(event, listener) {
          if (!this._listeners.hasOwnProperty(event)) {
              this._listeners[event] = [];
          }
          this._listeners[event].push(listener);
          if (this._listeners[event].length === 1) {
              this.eventToggle(event, 'enable');
          }
      };
      _proto.removeEventListener = function removeEventListener(event, listener) {
          if (!this._listeners.hasOwnProperty(event) || this._listeners[event].length === 0) {
              return;
          }
          var index = this._listeners[event].indexOf(listener);
          if (index >= 0) {
              this._listeners[event].splice(index, 1);
          }
          if (this._listeners[event].length === 0) {
              this.eventToggle(event, 'disable');
          }
      };
      _proto.addChild = function addChild(o) {
          // Make sure we're not adding a child onto a parent
          if (typeof o === 'undefined' || o === null) {
              throw new Error('Cannot add an empty child!');
          }
          if (o.contains(this)) {
              throw new Error('Attempting to add an ancestor of this DisplayObject as a child!');
          }
          this._children.push(o);
          this._boundingBox.unionCoord(o._anchor.x + o._boundingBox.left, o._anchor.y + o._boundingBox.top);
          this._boundingBox.unionCoord(o._anchor.x + o._boundingBox.right, o._anchor.y + o._boundingBox.bottom);
          o._parent = this;
          this.methodCall('addChild', o._id);
      };
      _proto.removeChild = function removeChild(o) {
          var index = this._children.indexOf(o);
          if (index >= 0) {
              this.removeChildAt(index);
          }
      };
      _proto.getChildAt = function getChildAt(index) {
          if (index < 0 || index > this._children.length) {
              throw new RangeError('No child at index ' + index);
          }
          return this._children[index];
      };
      _proto.getChildIndex = function getChildIndex(o) {
          return this._children.indexOf(o);
      };
      _proto.removeChildAt = function removeChildAt(index) {
          var o = this.getChildAt(index);
          this._children.splice(index, 1);
          o._parent = null;
          this.methodCall('removeChild', o._id);
      };
      _proto.removeChildren = function removeChildren(begin, end) {
          if (end === void 0) end = this._children.length;
          var removed = this._children.splice(begin, end - begin);
          var ids = [];
          for(var i = 0; i < removed.length; i++){
              removed[i]._parent = null;
              ids.push(removed[i]._id);
          }
          this.methodCall('removeChildren', ids);
      };
      _proto.contains = function contains(child) {
          if (child === this) {
              return true;
          }
          if (this._children.indexOf(child) >= 0) {
              return true;
          }
          for(var i = 0; i < this._children.length; i++){
              if (this._children[i].contains(child)) {
                  return true;
              }
          }
          return false;
      };
      /**
     * Removes the object from a parent if exists.
     */ _proto.remove = function remove() {
          // Remove itself
          if (this._parent !== null) {
              this._parent.removeChild(this);
          } else {
              this.root.removeChild(this);
          }
      };
      _proto.toString = function toString() {
          return '[' + (this._name.length > 0 ? this._name : 'displayObject') + ' DisplayObject]@' + this._id;
      };
      /**
     * Clones the current display object
     */ _proto.clone = function clone() {
          var alternate = new DisplayObject();
          alternate._transform = this._transform.clone();
          alternate._transform.parent = alternate;
          alternate._boundingBox = this._boundingBox.clone();
          alternate._anchor = this._anchor.clone();
          alternate._alpha = this._alpha;
          return alternate;
      };
      _proto.hasOwnProperty = function hasOwnProperty(prop) {
          if (prop === 'clone') {
              return true;
          } else {
              return Object.prototype.hasOwnProperty.call(this, prop);
          }
      };
      /** Common Functions **/ _proto.serialize = function serialize() {
          this._hasSetDefaults = true;
          var filters = [];
          for(var i = 0; i < this._filters.length; i++){
              filters.push(this._filters[i].serialize());
          }
          return {
              'class': 'DisplayObject',
              'x': this._anchor.x,
              'y': this._anchor.y,
              'alpha': this._alpha,
              'filters': filters
          };
      };
      _proto.unload = function unload() {
          this._visible = false;
          this.remove();
          this.methodCall('unload', null);
      };
      _proto.getId = function getId() {
          return this._id;
      };
      _create_class(DisplayObject, [
          {
              key: "alpha",
              get: function get() {
                  return this._alpha;
              },
              set: /** Properties **/ function set(value) {
                  this._alpha = value;
                  this.propertyUpdate("alpha", value);
              }
          },
          {
              key: "anchor",
              get: function get() {
                  return this._anchor;
              },
              set: function set(p) {
                  this._anchor = p;
                  this.propertyUpdate("x", p.x);
                  this.propertyUpdate("y", p.y);
              }
          },
          {
              key: "boundingBox",
              get: function get() {
                  return this._boundingBox;
              },
              set: function set(r) {
                  this._boundingBox = r;
                  this.propertyUpdate("boundingBox", r.serialize());
              }
          },
          {
              key: "cacheAsBitmap",
              get: function get() {
                  return false;
              },
              set: function set(_value) {
                  __trace("DisplayObject.cacheAsBitmap is not supported", "warn");
              }
          },
          {
              key: "filters",
              get: function get() {
                  return this._filters;
              },
              set: function set(filters) {
                  this._filters = filters ? filters : [];
                  var serializedFilters = [];
                  for(var i = 0; i < this._filters.length; i++){
                      if (!this.filters[i]) {
                          continue;
                      }
                      serializedFilters.push(this._filters[i].serialize());
                  }
                  this.propertyUpdate("filters", serializedFilters);
              }
          },
          {
              key: "root",
              get: function get() {
                  return getRoot();
              },
              set: function set(_s) {
                  __trace("DisplayObject.root is read-only.", "warn");
              }
          },
          {
              key: "stage",
              get: function get() {
                  return getRoot();
              },
              set: function set(_s) {
                  __trace("DisplayObject.stage is read-only.", "warn");
              }
          },
          {
              key: "rotationX",
              get: function get() {
                  return this._rotationX;
              },
              set: function set(x) {
                  this._rotationX = x;
                  this._updateBox("3d");
              }
          },
          {
              key: "rotationY",
              get: function get() {
                  return this._rotationY;
              },
              set: function set(y) {
                  this._rotationY = y;
                  this._updateBox("3d");
              }
          },
          {
              key: "rotationZ",
              get: function get() {
                  return this._rotationZ;
              },
              set: function set(z) {
                  this._rotationZ = z;
                  this._updateBox();
              }
          },
          {
              key: "rotation",
              get: function get() {
                  return this._rotationZ;
              },
              set: function set(r) {
                  this._rotationZ = r;
                  this._updateBox();
              }
          },
          {
              key: "scaleX",
              get: function get() {
                  return this._scaleX;
              },
              set: function set(val) {
                  this._scaleX = val;
                  this._updateBox();
              }
          },
          {
              key: "scaleY",
              get: function get() {
                  return this._scaleY;
              },
              set: function set(val) {
                  this._scaleY = val;
                  this._updateBox();
              }
          },
          {
              key: "scaleZ",
              get: function get() {
                  return this._scaleZ;
              },
              set: function set(val) {
                  this._scaleZ = val;
                  this._updateBox("3d");
              }
          },
          {
              key: "x",
              get: function get() {
                  return this._anchor.x;
              },
              set: function set(val) {
                  this._anchor.x = val;
                  this.propertyUpdate("x", val);
              }
          },
          {
              key: "y",
              get: function get() {
                  return this._anchor.y;
              },
              set: function set(val) {
                  this._anchor.y = val;
                  this.propertyUpdate("y", val);
              }
          },
          {
              key: "z",
              get: function get() {
                  return this._z;
              },
              set: function set(val) {
                  this._z = val;
                  this._updateBox("3d");
              }
          },
          {
              key: "width",
              get: function get() {
                  return this._boundingBox.width;
              },
              set: /** End Transform Area **/ function set(w) {
                  this._boundingBox.width = w;
                  this.propertyUpdate('width', w);
              }
          },
          {
              key: "height",
              get: function get() {
                  return this._boundingBox.height;
              },
              set: function set(h) {
                  this._boundingBox.height = h;
                  this.propertyUpdate('height', h);
              }
          },
          {
              key: "visible",
              get: function get() {
                  return this._visible;
              },
              set: function set(visible) {
                  this._visible = visible;
                  this.propertyUpdate('visible', visible);
              }
          },
          {
              key: "blendMode",
              get: function get() {
                  return this._blendMode;
              },
              set: function set(blendMode) {
                  this._blendMode = blendMode;
                  this.propertyUpdate('blendMode', blendMode);
              }
          },
          {
              key: "transform",
              get: function get() {
                  return this._transform;
              },
              set: function set(t) {
                  this._transform = t;
                  if (this._transform.parent !== this) {
                      this._transform.parent = this;
                  }
                  this.propertyUpdate('transform', this._transform.serialize());
              }
          },
          {
              key: "name",
              get: function get() {
                  return this._name;
              },
              set: function set(name) {
                  this._name = name;
                  this.propertyUpdate('name', name);
              }
          },
          {
              key: "loaderInfo",
              get: function get() {
                  __trace("DisplayObject.loaderInfo is not supported", "warn");
                  return {};
              },
              set: function set(_name) {
                  __trace("DisplayObject.loaderInfo is read-only", "warn");
              }
          },
          {
              key: "parent",
              get: function get() {
                  return this._parent !== null ? this._parent : getRoot();
              },
              set: function set(_p) {
                  __trace("DisplayObject.parent is read-only", "warn");
              }
          },
          {
              key: "numChildren",
              get: /** DisplayObjectContainer **/ function get() {
                  return this._children.length;
              }
          }
      ]);
      return DisplayObject;
  }();
  DisplayObject.SANDBOX_EVENTS = [
      "enterFrame"
  ];

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
   * Filter Polyfill for AS3.
   * @author Jim Chen
   */ var Filter = /*#__PURE__*/ function() {
      function Filter() {}
      var _proto = Filter.prototype;
      _proto.serialize = function serialize() {
          return {
              'class': 'Filter',
              'type': 'nullfilter'
          };
      };
      return Filter;
  }();
  var BlurFilter = /*#__PURE__*/ function(Filter) {
      _inherits(BlurFilter, Filter);
      function BlurFilter(blurX, blurY) {
          if (blurX === void 0) blurX = 4.0;
          if (blurY === void 0) blurY = 4.0;
          var _this;
          _this = Filter.call(this) || this;
          _this._blurX = blurX;
          _this._blurY = blurY;
          return _this;
      }
      var _proto = BlurFilter.prototype;
      _proto.serialize = function serialize() {
          var s = Filter.prototype.serialize.call(this);
          s['type'] = 'blur';
          s['params'] = {
              'blurX': this._blurX,
              'blurY': this._blurY
          };
          return s;
      };
      return BlurFilter;
  }(Filter);
  var GlowFilter = /*#__PURE__*/ function(Filter) {
      _inherits(GlowFilter, Filter);
      function GlowFilter(color, alpha, blurX, blurY, strength, quality, inner, knockout) {
          if (color === void 0) color = 16711680;
          if (alpha === void 0) alpha = 1.0;
          if (blurX === void 0) blurX = 6.0;
          if (blurY === void 0) blurY = 6.0;
          if (strength === void 0) strength = 2;
          if (quality === void 0) quality = null;
          if (inner === void 0) inner = false;
          if (knockout === void 0) knockout = false;
          var _this;
          _this = Filter.call(this) || this;
          _this._color = color;
          _this._alpha = alpha;
          _this._blurX = blurX;
          _this._blurY = blurY;
          _this._strength = strength;
          _this._quality = quality;
          _this._inner = inner;
          _this._knockout = knockout;
          return _this;
      }
      var _proto = GlowFilter.prototype;
      _proto.serialize = function serialize() {
          var s = Filter.prototype.serialize.call(this);
          s['type'] = 'glow';
          s['params'] = {
              'color': this._color,
              'alpha': this._alpha,
              'blurX': this._blurX,
              'blurY': this._blurY,
              'strength': this._strength,
              'inner': this._inner,
              'knockout': this._knockout
          };
          return s;
      };
      return GlowFilter;
  }(Filter);
  var DropShadowFilter = /*#__PURE__*/ function(Filter) {
      _inherits(DropShadowFilter, Filter);
      function DropShadowFilter(distance, angle, color, alpha, blurX, blurY, strength, quality) {
          if (distance === void 0) distance = 4.0;
          if (angle === void 0) angle = 45;
          if (color === void 0) color = 0;
          if (alpha === void 0) alpha = 1;
          if (blurX === void 0) blurX = 4.0;
          if (blurY === void 0) blurY = 4.0;
          if (strength === void 0) strength = 1.0;
          if (quality === void 0) quality = 1;
          var _this;
          _this = Filter.call(this) || this;
          _this._color = color;
          _this._alpha = alpha;
          _this._blurX = blurX;
          _this._blurY = blurY;
          _this._strength = strength;
          _this._quality = quality;
          /* TODO: Update to support inner & knockout */ _this._inner = false;
          _this._knockout = false;
          _this._distance = distance;
          _this._angle = angle;
          return _this;
      }
      var _proto = DropShadowFilter.prototype;
      _proto.serialize = function serialize() {
          var s = Filter.prototype.serialize.call(this);
          s['type'] = 'dropShadow';
          s['params'] = {
              'distance': this._distance,
              'angle': this._angle,
              'color': this._color,
              'blurY': this._blurY,
              'strength': this._strength,
              'inner': this._inner,
              'knockout': this._knockout
          };
          return s;
      };
      return DropShadowFilter;
  }(Filter);
  var ConvolutionFilter = /*#__PURE__*/ function(Filter) {
      _inherits(ConvolutionFilter, Filter);
      function ConvolutionFilter(matrixX, matrixY, matrix, divisor, bias, preserveAlpha, clamp, color, alpha) {
          return Filter.call(this) || this;
      }
      var _proto = ConvolutionFilter.prototype;
      _proto.serialize = function serialize() {
          var s = Filter.prototype.serialize.call(this);
          s['type'] = 'convolution';
          s['matrix'] = {
              'x': this._matrixX,
              'y': this._matrixY,
              'data': this._matrix
          };
          s['divisor'] = this._divisor;
          s['preserveAlpha'] = this._preserveAlpha;
          s['clamp'] = this._clamp;
          s['color'] = this._color;
          s['alpha'] = this._alpha;
          return s;
      };
      return ConvolutionFilter;
  }(Filter);
  function createDropShadowFilter(distance, angle, color, alpha, blurX, blurY, strength, quality) {
      if (distance === void 0) distance = 4.0;
      if (angle === void 0) angle = 45;
      if (color === void 0) color = 0;
      if (alpha === void 0) alpha = 1;
      if (blurX === void 0) blurX = 4.0;
      if (blurY === void 0) blurY = 4.0;
      if (strength === void 0) strength = 1.0;
      if (quality === void 0) quality = 1;
      return new DropShadowFilter(distance, angle, color, alpha, blurX, blurY, strength, quality);
  }
  function createGlowFilter(color, alpha, blurX, blurY, strength, quality, inner, knockout) {
      if (color === void 0) color = 16711680;
      if (alpha === void 0) alpha = 1.0;
      if (blurX === void 0) blurX = 6.0;
      if (blurY === void 0) blurY = 6.0;
      if (strength === void 0) strength = 2;
      if (quality === void 0) quality = null;
      if (inner === void 0) inner = false;
      if (knockout === void 0) knockout = false;
      return new GlowFilter(color, alpha, blurX, blurY, strength, quality, inner, knockout);
  }
  function createBlurFilter(blurX, blurY, strength) {
      if (blurX === void 0) blurX = 6.0;
      if (blurY === void 0) blurY = 6.0;
      return new BlurFilter(blurX, blurY);
  }
  function createBevelFilter() {
      throw new Error('Display.createBevelFilter not implemented');
  }
  function createConvolutionFilter(matrixX, matrixY, matrix, divisor, bias, preserveAlpha, clamp, color, alpha) {
      return new ConvolutionFilter();
  }
  function createDisplacementMapFilter() {
      throw new Error('Display.createDisplacementMapFilter not implemented');
  }
  function createGradientBevelFilter() {
      throw new Error('Display.createGradientBevelFilter not implemented');
  }
  function createGradientGlowFilter() {
      throw new Error('Display.createGradientGlowFilter not implemented');
  }
  function createColorMatrixFilter() {
      throw new Error('Display.createColorMatrixFilter not implemented');
  }

  /**
   * Graphics Polyfill for AS3
   * @author Jim Chen
   */ var Graphics = /*#__PURE__*/ function() {
      function Graphics(parent) {
          this._lineWidth = 1;
          if (typeof parent === 'undefined' || parent === null) {
              throw new Error('Cannot initialize a display not bound to an element.');
          }
          this._parent = parent;
      }
      var _proto = Graphics.prototype;
      /**
     * Private method to re-evaluate a bounding box for the parent
     * @param {number} x - x coordinate of point
     * @param {number} y - y coordinate of point
     */ _proto._evaluateBoundingBox = function _evaluateBoundingBox(x, y) {
          this._parent.boundingBox.unionCoord(x + this._lineWidth / 2, y + this._lineWidth / 2);
      };
      /**
     * Private method to call a drawing method
     * @param {number} method name - method name
     * @param {any} params - parameters to the method
     */ _proto._callDrawMethod = function _callDrawMethod(method, params) {
          __pchannel('Runtime:CallMethod', {
              'id': this._parent.getId(),
              'context': 'graphics',
              'method': method,
              'params': params
          });
      };
      /**
     * Line to point
     * @param {number} x - x coordinate
     * @param {number} y - y coordinate
     */ _proto.lineTo = function lineTo(x, y) {
          this._evaluateBoundingBox(x, y);
          this._callDrawMethod('lineTo', [
              x,
              y
          ]);
      };
      /**
     * Move to point
     * @param {number} x - x coordinate
     * @param {number} y - y coordinate
     */ _proto.moveTo = function moveTo(x, y) {
          this._evaluateBoundingBox(x, y);
          this._callDrawMethod('moveTo', [
              x,
              y
          ]);
      };
      /**
     * Quadratic Beizer Curve
     * @param {number} cx - Control point x
     * @param {number} cy - Control point y
     * @param {number} ax - Anchor x
     * @param {number} ay - Anchor y
     */ _proto.curveTo = function curveTo(cx, cy, ax, ay) {
          this._evaluateBoundingBox(ax, ay);
          this._evaluateBoundingBox(cx, cy);
          this._callDrawMethod('curveTo', [
              cx,
              cy,
              ax,
              ay
          ]);
      };
      /**
     * Cubic Beizer Curve
     * @param {number} cax - Control point A x
     * @param {number} cay - Control point A y
     * @param {number} cbx - Control point B x
     * @param {number} cby - Control point B y
     * @param {number} ax - Anchor x
     * @param {number} ay - Anchor y
     */ _proto.cubicCurveTo = function cubicCurveTo(cax, cay, cbx, cby, ax, ay) {
          this._evaluateBoundingBox(cax, cay);
          this._evaluateBoundingBox(cbx, cby);
          this._evaluateBoundingBox(ax, ay);
          this._callDrawMethod('cubicCurveTo', [
              cax,
              cay,
              cbx,
              cby,
              ax,
              ay
          ]);
      };
      /**
     * Set line style
     * @param {number} thickness - line thickness
     * @param {number} color - line color (default 0)
     * @param {number} alpha - alpha (default 1)
     * @param {boolean} hinting - pixel hinting (default false)
     * @param {string} scale - scale mode (default "normal")
     * @param {string} caps - line cap mode (default "none")
     * @param {strings} joints - line joint mode (default "round")
     * @param {number} miterlim - miter limit (default 3)
     */ _proto.lineStyle = function lineStyle(thickness, color, alpha, hinting, scale, caps, joints, miter) {
          if (color === void 0) color = 0;
          if (alpha === void 0) alpha = 1.0;
          if (caps === void 0) caps = 'none';
          if (joints === void 0) joints = 'round';
          if (miter === void 0) miter = 3;
          this._lineWidth = thickness;
          this._callDrawMethod('lineStyle', [
              thickness,
              color,
              alpha,
              caps,
              joints,
              miter
          ]);
      };
      /**
     * Draw a rectangle
     * @param {number} x - x coordinate
     * @param {number} y - y coordinate
     * @param {number} w - width
     * @param {number} h - height
     */ _proto.drawRect = function drawRect(x, y, w, h) {
          this._evaluateBoundingBox(x, y);
          this._evaluateBoundingBox(x + w, y + h);
          this._callDrawMethod('drawRect', [
              x,
              y,
              w,
              h
          ]);
      };
      /**
     * Draws a circle
     * @param {number} x - center x
     * @param {number} y - center y
     * @param {number} r - radius
     */ _proto.drawCircle = function drawCircle(x, y, r) {
          this._evaluateBoundingBox(x - r, y - r);
          this._evaluateBoundingBox(x + r, y + r);
          this._callDrawMethod('drawCircle', [
              x,
              y,
              r
          ]);
      };
      /**
     * Draws an ellipse
     * @param {number} cx - center x
     * @param {number} cy - center y
     * @param {number} w - width
     * @param {number} h - height
     */ _proto.drawEllipse = function drawEllipse(cx, cy, w, h) {
          this._evaluateBoundingBox(cx - w / 2, cy - h / 2);
          this._evaluateBoundingBox(cx + w / 2, cy + h / 2);
          this._callDrawMethod('drawEllipse', [
              cx + w / 2,
              cy + h / 2,
              w / 2,
              h / 2
          ]);
      };
      /**
     * Draws a rounded rectangle
     * @param {number} x - x coordinate
     * @param {number} y - y coordinate
     * @param {number} w - width
     * @param {number} h - height
     * @param {number} elw - ellipse corner width
     * @param {number} elh - ellipse corner height
     */ _proto.drawRoundRect = function drawRoundRect(x, y, w, h, elw, elh) {
          this._evaluateBoundingBox(x, y);
          this._evaluateBoundingBox(x + w, y + h);
          this._callDrawMethod('drawRoundRect', [
              x,
              y,
              w,
              h,
              elw,
              elh
          ]);
      };
      /**
     * Executes a list of drawing commands with their data given in the data array
     * @param {Array<number>} commands - Commands by index
     * @param {Array<number>} data - List of data
     * @param {string} winding - evenOdd or nonZero
     */ _proto.drawPath = function drawPath(commands, data, winding) {
          if (winding === void 0) winding = "evenOdd";
          /** TODO: Evaluate bounding box **/ this._callDrawMethod('drawPath', [
              commands,
              data,
              winding
          ]);
      };
      /**
     * Fill next shape with solid color
     * @param {number} color - color RGB values
     * @param {number} alpha - alpha value
     */ _proto.beginFill = function beginFill(color, alpha) {
          if (alpha === void 0) alpha = 1.0;
          this._callDrawMethod('beginFill', [
              color,
              alpha
          ]);
      };
      /**
     * Gradient Fill Not Supported yet
     */ _proto.beginGradientFill = function beginGradientFill(fillType, colors, alphas, ratios, matrix, spreadMethod, interpolationMethod, focalPointRatio) {
          if (matrix === void 0) matrix = null;
          if (spreadMethod === void 0) spreadMethod = 'pad';
          if (interpolationMethod === void 0) interpolationMethod = 'rgb';
          if (focalPointRatio === void 0) focalPointRatio = 0;
          __trace('Graphics.beginGradientFill still needs work.', 'warn');
          if (fillType !== 'linear' && fillType !== 'radial') {
              __trace('Graphics.beginGradientFill unsupported fill type : ' + fillType, 'warn');
              return;
          }
          this._callDrawMethod('beginGradientFill', [
              fillType,
              colors,
              alphas,
              ratios,
              matrix === null ? null : matrix.serialize,
              spreadMethod,
              interpolationMethod,
              focalPointRatio
          ]);
      };
      /**
     * Shader Fill Not Supported yet
     */ _proto.beginShaderFill = function beginShaderFill(shader, matrix) {
          __trace('Graphics.beginShaderFill not supported.', 'warn');
      };
      /**
     * Stop and finalize fill
     */ _proto.endFill = function endFill() {
          this._callDrawMethod('endFill', []);
      };
      /**
     * Given a list of vertices (and optionally indices). Draws triangles to the screen
     * @param {Array<number>} verts - Vertices (x,y) as a list
     * @param {Array<number>} indices - Indices for positions in verts[2 * i], verts[2 * i + 1]
     * @param {Array<number>} uvtData - Texture mapping stuff. Not supported any time soon.
     * @param {string} culling - "none" shows all triangles, "positive"/"negative" will cull triangles by normal along z-axis
     */ _proto.drawTriangles = function drawTriangles(verts, indices, uvtData, culling) {
          if (indices === void 0) indices = null;
          if (culling === void 0) culling = 'none';
          if (indices === null) {
              indices = [];
              for(var i = 0; i < verts.length; i += 2){
                  indices.push(i / 2);
              }
          } else {
              indices = indices.slice(0);
          }
          if (indices.length % 3 !== 0) {
              __trace('Graphics.drawTriangles malformed indices count. ' + 'Must be multiple of 3.', 'err');
              return;
          }
          /** Do culling of triangles here to lessen work later **/ if (culling !== 'none') {
              for(var i = 0; i < indices.length / 3; i++){
                  var ux = verts[2 * indices[i * 3 + 1]] - verts[2 * indices[i * 3]], uy = verts[2 * indices[i * 3 + 1] + 1] - verts[2 * indices[i * 3] + 1], vx = verts[2 * indices[i * 3 + 2]] - verts[2 * indices[i * 3 + 1]], vy = verts[2 * indices[i * 3 + 2] + 1] - verts[2 * indices[i * 3 + 1] + 1];
                  var zcomp = ux * vy - vx * uy;
                  if (zcomp < 0 && culling === 'positive' || zcomp > 0 && culling === 'negative') {
                      /** Remove the indices. Leave the vertices. **/ indices.splice(i * 3, 3);
                      i--;
                  }
              }
          }
          /** Update the bounding box **/ for(var i = 0; i < indices.length; i++){
              this._evaluateBoundingBox(verts[2 * indices[i]], verts[2 * indices[i] + 1]);
          }
          this._callDrawMethod('drawTriangles', [
              verts,
              indices,
              culling
          ]);
      };
      /**
     * Clears everything the current graphics context has drawn
     */ _proto.clear = function clear() {
          this._parent.boundingBox.setEmpty();
          this._callDrawMethod('clear', []);
      };
      return Graphics;
  }();

  /**
   * Shape Polyfill for AS3.
   * @author Jim Chen
   */ var Shape = /*#__PURE__*/ function(DisplayObject) {
      _inherits(Shape, DisplayObject);
      function Shape() {
          var _this;
          _this = DisplayObject.call(this) || this;
          _this._graphics = new Graphics(_this);
          return _this;
      }
      var _proto = Shape.prototype;
      _proto.serialize = function serialize() {
          var serialized = DisplayObject.prototype.serialize.call(this);
          serialized['class'] = 'Shape';
          return serialized;
      };
      _create_class(Shape, [
          {
              key: "graphics",
              get: function get() {
                  return this._graphics;
              }
          }
      ]);
      return Shape;
  }(DisplayObject);

  /**
   * Sprite Polyfill for AS3. Is also a UIComponent.
   * @author Jim Chen
   */ var Sprite = /*#__PURE__*/ function(DisplayObject) {
      _inherits(Sprite, DisplayObject);
      function Sprite(id) {
          var _this;
          _this = DisplayObject.call(this, id) || this, _this._mouseEnabled = true, _this._mousePosition = new Point(0, 0), _this._useHandCursor = false;
          _this._graphics = new Graphics(_this);
          return _this;
      }
      var _proto = Sprite.prototype;
      _proto.serialize = function serialize() {
          var serialized = DisplayObject.prototype.serialize.call(this);
          serialized['class'] = 'Sprite';
          return serialized;
      };
      _create_class(Sprite, [
          {
              key: "graphics",
              get: function get() {
                  return this._graphics;
              },
              set: function set(_g) {
                  __trace('Sprite.graphics is read-only.', 'warn');
              }
          },
          {
              key: "mouseEnabled",
              get: function get() {
                  return this._mouseEnabled;
              },
              set: function set(enabled) {
                  this._mouseEnabled = enabled;
                  this.propertyUpdate('mouseEnabled', enabled);
              }
          },
          {
              key: "useHandCursor",
              get: function get() {
                  return this._useHandCursor;
              },
              set: function set(use) {
                  this._useHandCursor = use;
                  this.propertyUpdate('useHandCursor', use);
              }
          }
      ]);
      return Sprite;
  }(DisplayObject);
  /**
   * Special sprite used for the root sprite
   * @author Jim Chen
   */ var RootSprite = /*#__PURE__*/ function(Sprite) {
      _inherits(RootSprite, Sprite);
      function RootSprite() {
          var _this;
          _this = Sprite.call(this, '__root') || this;
          _this._metaRoot = Runtime.getObject('__root');
          return _this;
      }
      var _proto = RootSprite.prototype;
      _proto.addEventListener = function addEventListener(eventName, listener) {
          __trace('Listener[' + eventName + '] on root sprite inadvisible', 'warn');
          this._metaRoot.addEventListener(eventName, listener);
      };
      _proto.removeEventListener = function removeEventListener(eventName, listener) {
          this._metaRoot.removeEventListener(eventName, listener, false);
      };
      _create_class(RootSprite, [
          {
              key: "parent",
              get: function get() {
                  __trace('SecurityError: No access above root sprite.', 'err');
                  return null;
              }
          }
      ]);
      return RootSprite;
  }(Sprite);
  var UIComponent = /*#__PURE__*/ function(Sprite) {
      _inherits(UIComponent, Sprite);
      function UIComponent(id) {
          var _this;
          _this = Sprite.call(this, id) || this, _this._styles = {};
          return _this;
      }
      var _proto = UIComponent.prototype;
      /**
     * Clears the style for the UIComponent which this is
     * @param style - style to clear
     */ _proto.clearStyle = function clearStyle(style) {
          delete this._styles[style];
      };
      /**
     * Get the style for the UIComponent which this is
     * @param style - style to set
     * @return value - value of that style
     */ _proto.getStyle = function getStyle(style) {
          return this._styles[style];
      };
      /**
     * Set the style for the UIComponent which this is
     * @param styleProp - style to set
     * @param value - value to set the style to
     */ _proto.setStyle = function setStyle(styleProp, value) {
          __trace("UIComponent.setStyle not implemented", "warn");
          this._styles[styleProp] = value;
      };
      _proto.setFocus = function setFocus() {
          this.methodCall("setFocus", null);
      };
      _proto.setSize = function setSize(width, height) {
          this.width = width;
          this.height = height;
      };
      _proto.move = function move(x, y) {
          this.x = x;
          this.y = y;
      };
      return UIComponent;
  }(Sprite);

  /**
   * TextFormat polyfill for AS3
   * @author Jim Chen
   */ var TextFormat = /*#__PURE__*/ function() {
      function TextFormat(font, size, color, bold, italic, underline, _url, _target, _align, _leftMargin, _rightMargin, _indent, _leading) {
          if (font === void 0) font = "SimHei";
          if (size === void 0) size = 25;
          if (color === void 0) color = 0xFFFFFF;
          if (bold === void 0) bold = false;
          if (italic === void 0) italic = false;
          if (underline === void 0) underline = false;
          this.font = font;
          this.size = size;
          this.color = color;
          this.bold = bold;
          this.italic = italic;
          this.underline = underline;
      }
      var _proto = TextFormat.prototype;
      _proto.serialize = function serialize() {
          return {
              "class": "TextFormat",
              "font": this.font,
              "size": this.size,
              "color": this.color,
              "bold": this.bold,
              "underline": this.underline,
              "italic": this.italic
          };
      };
      return TextFormat;
  }();
  /**
   * TextField Polyfill for AS3.
   * @author Jim Chen
   */ var TextField = /*#__PURE__*/ function(DisplayObject) {
      _inherits(TextField, DisplayObject);
      function TextField(text, color) {
          if (text === void 0) text = "";
          if (color === void 0) color = 0;
          var _this;
          _this = DisplayObject.call(this, Runtime.generateId('obj-textfield')) || this, _this._background = false, _this._backgroundColor = 0xffffff, _this._border = false, _this._borderColor = 0;
          _this._text = text;
          _this._textFormat = new TextFormat();
          _this._textFormat.color = color;
          _this.boundingBox.width = _this.textWidth;
          _this.boundingBox.height = _this.textHeight;
          return _this;
      }
      var _proto = TextField.prototype;
      _proto.getTextFormat = function getTextFormat() {
          return this._textFormat;
      };
      _proto.setTextFormat = function setTextFormat(tf) {
          this._textFormat = tf;
          this.methodCall("setTextFormat", tf.serialize());
      };
      _proto.appendText = function appendText(t) {
          this.text = this.text + t;
      };
      _proto.serialize = function serialize() {
          var serialized = DisplayObject.prototype.serialize.call(this);
          serialized["class"] = "TextField";
          serialized["text"] = this._text;
          serialized["textFormat"] = this._textFormat.serialize();
          return serialized;
      };
      _create_class(TextField, [
          {
              key: "text",
              get: function get() {
                  return this._text;
              },
              set: function set(t) {
                  this._text = t;
                  this.boundingBox.width = this.textWidth;
                  this.boundingBox.height = this.textHeight;
                  this.propertyUpdate("text", this._text);
              }
          },
          {
              key: "length",
              get: function get() {
                  return this.text.length;
              },
              set: function set(_l) {
                  __trace("TextField.length is read-only.", "warn");
              }
          },
          {
              key: "htmlText",
              get: function get() {
                  return this.text;
              },
              set: function set(text) {
                  __trace("TextField.htmlText is restricted due to security policy.", "warn");
                  this.text = text.replace(/<\/?[^>]+(>|$)/g, '');
              }
          },
          {
              key: "textWidth",
              get: function get() {
                  /** TODO: Fix this to actually calculate the width **/ return this._text.length * this._textFormat.size;
              },
              set: function set(_w) {
                  __trace("TextField.textWidth is read-only", "warn");
              }
          },
          {
              key: "textHeight",
              get: function get() {
                  /** TODO: Fix this to actually calculate the height **/ return this._textFormat.size;
              },
              set: function set(_h) {
                  __trace("TextField.textHeight is read-only", "warn");
              }
          },
          {
              key: "color",
              get: function get() {
                  return this._textFormat.color;
              },
              set: function set(c) {
                  this._textFormat.color = c;
                  this.setTextFormat(this._textFormat);
              }
          },
          {
              key: "background",
              get: function get() {
                  return this._background;
              },
              set: function set(enabled) {
                  this._background = enabled;
                  this.propertyUpdate("background", enabled);
              }
          },
          {
              key: "backgroundColor",
              get: function get() {
                  return this._backgroundColor;
              },
              set: function set(color) {
                  this._backgroundColor = color;
                  this.propertyUpdate("backgroundColor", color);
              }
          },
          {
              key: "border",
              get: function get() {
                  return this._border;
              },
              set: function set(enabled) {
                  this._border = enabled;
                  this.propertyUpdate('border', enabled);
              }
          },
          {
              key: "borderColor",
              get: function get() {
                  return this._borderColor;
              },
              set: function set(color) {
                  this._borderColor = color;
                  this.propertyUpdate('borderColor', color);
              }
          }
      ]);
      return TextField;
  }(DisplayObject);
  function createTextFormat() {
      return new TextFormat();
  }

  function _is_native_reflect_construct() {
      // Since Reflect.construct can't be properly polyfilled, some
      // implementations (e.g. core-js@2) don't set the correct internal slots.
      // Those polyfills don't allow us to subclass built-ins, so we need to
      // use our fallback implementation.
      try {
          // If the internal slots aren't set, this throws an error similar to
          //   TypeError: this is not a Boolean object.
          var result = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
      } catch (_) {}
      return (_is_native_reflect_construct = function() {
          return !!result;
      })();
  }

  function _construct(Parent, args, Class) {
      if (_is_native_reflect_construct()) _construct = Reflect.construct;
      else {
          _construct = function construct(Parent, args, Class) {
              var a = [null];
              a.push.apply(a, args);
              var Constructor = Function.bind.apply(Parent, a);
              var instance = new Constructor();

              if (Class) _set_prototype_of(instance, Class.prototype);

              return instance;
          };
      }

      return _construct.apply(null, arguments);
  }

  function _get_prototype_of(o) {
      _get_prototype_of = Object.setPrototypeOf ? Object.getPrototypeOf : function getPrototypeOf(o) {
          return o.__proto__ || Object.getPrototypeOf(o);
      };

      return _get_prototype_of(o);
  }

  function _is_native_function(fn) {
      return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }

  function _wrap_native_super(Class) {
      var _cache = typeof Map === "function" ? new Map() : undefined;
      _wrap_native_super = function(Class) {
          if (Class === null || !_is_native_function(Class)) return Class;
          if (typeof Class !== "function") throw new TypeError("Super expression must either be null or a function");
          if (typeof _cache !== "undefined") {
              if (_cache.has(Class)) return _cache.get(Class);
              _cache.set(Class, Wrapper);
          }

          function Wrapper() {
              return _construct(Class, arguments, _get_prototype_of(this).constructor);
          }
          Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } });

          return _set_prototype_of(Wrapper, Class);
      };

      return _wrap_native_super(Class);
  }

  var ByteArray = /*#__PURE__*/ function(Array1) {
      _inherits(ByteArray, Array1);
      function ByteArray() {
          for(var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++){
              params[_key] = arguments[_key];
          }
          var _this;
          _this = Array1.call.apply(Array1, [].concat([
              this
          ], params)) || this, _this._readPosition = 0;
          try {
              Object['setPrototypeOf'](_this, ByteArray.prototype);
          } catch (e) {}
          return _this;
      }
      var _proto = ByteArray.prototype;
      _proto.clear = function clear() {
          this.length = 0;
          this._readPosition = 0;
      };
      _proto.compress = function compress(algorithm) {
          if (algorithm === void 0) algorithm = 'zlib';
          __trace('ByteArray.compress[' + algorithm + '] not implemented', 'warn');
          this._readPosition = 0;
      };
      _proto.uncompress = function uncompress(algorithm) {
          if (algorithm === void 0) algorithm = 'zlib';
          __trace('ByteArray.uncompress[' + algorithm + '] not implemented', 'warn');
          this._readPosition = 0;
      };
      _proto.deflate = function deflate() {
          __trace('ByteArray.deflate not implemented', 'warn');
      };
      _proto.inflate = function inflate() {
          __trace('ByteArray.inflate not implemented', 'warn');
      };
      _proto.readUTFBytes = function readUTFBytes(length) {
          // Get length
          var subArray = this.slice(this._readPosition, length);
          this._readPosition += Math.min(length, this.length - this._readPosition);
          var str = '';
          subArray.forEach(function(cc) {
              str += String.fromCharCode(cc);
          });
          return str;
      };
      _proto.readUnsignedByte = function readUnsignedByte() {
          return this[this._readPosition] & 0xff;
      };
      _proto.readUnsignedShort = function readUnsignedShort() {
          var top = this.readUnsignedByte(), bottom = this.readUnsignedByte();
          return (top << 8) + bottom & 0xffff;
      };
      _proto.readUnsignedInt = function readUnsignedInt() {
          var a = this.readUnsignedByte(), b = this.readUnsignedByte(), c = this.readUnsignedByte(), d = this.readUnsignedByte();
          return (a << 24) + (b << 16) + (c << 8) + d & 0xffffffff;
      };
      _proto.readByte = function readByte() {
          return this.readUnsignedByte() - 128;
      };
      _proto.readShort = function readShort() {
          return this.readUnsignedShort() - 0x7fff;
      };
      _proto.readBoolean = function readBoolean() {
          return this.readUnsignedByte() !== 0;
      };
      _proto.readFloat = function readFloat() {
          var source = this.readUnsignedInt();
          var fval = 0.0;
          var x = source & 0x80000000 ? -1 : 1;
          var m = source >> 23 & 0xff; //mantissa
          var s = source & 0x7fffff; //sign
          switch(x){
              case 0:
                  break;
              case 0xFF:
                  if (m) {
                      fval = NaN;
                  } else if (s > 0) {
                      fval = Number.POSITIVE_INFINITY;
                  } else {
                      fval = Number.NEGATIVE_INFINITY;
                  }
                  break;
              default:
                  x -= 127;
                  m += 0x800000;
                  fval = s * (m / 8388608.0) * Math.pow(2, x);
                  break;
          }
          return fval;
      };
      _proto.writeByte = function writeByte(value) {
          this.push(value & 0xff);
      };
      _proto.writeBytes = function writeBytes(bytes, offset, length) {
          if (offset === void 0) offset = 0;
          if (length === void 0) length = 0;
          for(var i = offset; i < Math.min(bytes.length - offset, length); i++){
              this.writeByte(bytes[i]);
          }
      };
      _proto.writeUTFBytes = function writeUTFBytes(value) {
          var bytesString = unescape(encodeURIComponent(value));
          for(var i = 0; i < value.length; i++){
              this.push(bytesString.charCodeAt(i));
          }
      };
      _proto.clone = function clone() {
          var cloned = new ByteArray();
          this.forEach(function(item) {
              cloned.push(item);
          });
          return cloned;
      };
      _create_class(ByteArray, [
          {
              key: "bytesAvailable",
              get: function get() {
                  return this.length - this._readPosition;
              },
              set: function set(_n) {
                  __trace('ByteArray.bytesAvailable is read-only', 'warn');
              }
          },
          {
              key: "position",
              get: function get() {
                  return this._readPosition;
              },
              set: function set(p) {
                  this._readPosition = p;
              }
          }
      ]);
      return ByteArray;
  }(_wrap_native_super(Array));

  function _instanceof(left, right) {
      "@swc/helpers - instanceof";

      if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
          return !!right[Symbol.hasInstance](left);
      } else return left instanceof right;
  }

  var DirtyArea = /*#__PURE__*/ function() {
      function DirtyArea() {
          this._xBegin = null;
          this._yBegin = null;
          this._xEnd = null;
          this._yEnd = null;
      }
      var _proto = DirtyArea.prototype;
      _proto.expand = function expand(x, y) {
          this._xBegin = this._xBegin === null ? x : Math.min(this._xBegin, x);
          this._xEnd = this._xEnd === null ? x : Math.max(this._xEnd, x);
          this._yBegin = this._yBegin === null ? y : Math.min(this._yBegin, y);
          this._yEnd = this._xEnd === null ? y : Math.max(this._yEnd, y);
      };
      _proto.asRect = function asRect() {
          if (this.isEmpty()) {
              return new Rectangle(0, 0, 0, 0);
          }
          return new Rectangle(this._xBegin, this._yBegin, this._xEnd - this._xBegin, this._yEnd - this._yBegin);
      };
      _proto.isEmpty = function isEmpty() {
          return this._xBegin === null || this._yBegin === null || this._xEnd === null || this._yEnd === null;
      };
      _proto.reset = function reset() {
          this._xBegin = null;
          this._xEnd = null;
          this._yBegin = null;
          this._yEnd = null;
      };
      return DirtyArea;
  }();
  /**
   * Bitmap AS3 Polyfill class
   * Note: This is NOT equivalent to the Bitmap library class of the same name!
   * @author Jim Chen
   */ var Bitmap = /*#__PURE__*/ function(DisplayObject) {
      _inherits(Bitmap, DisplayObject);
      function Bitmap(bitmapData) {
          if (bitmapData === void 0) bitmapData = null;
          var _this;
          _this = DisplayObject.call(this, Runtime.generateId('obj-bmp')) || this, _this._bitmapData = null;
          _this._bitmapData = bitmapData;
          return _this;
      }
      var _proto = Bitmap.prototype;
      _proto.getBitmapData = function getBitmapData() {
          return this._bitmapData;
      };
      _proto.setBitmapData = function setBitmapData(bitmapData) {
          if (typeof bitmapData !== 'undefined') {
              this._bitmapData = bitmapData;
              // Propagate up
              this.methodCall('setBitmapData', bitmapData.getId());
          }
      };
      _proto.serialize = function serialize() {
          var serialized = DisplayObject.prototype.serialize.call(this);
          serialized["class"] = 'Bitmap';
          if (this._bitmapData !== null) {
              serialized["bitmapData"] = this._bitmapData.getId();
          }
          return serialized;
      };
      _create_class(Bitmap, [
          {
              key: "width",
              get: function get() {
                  console.log(this._bitmapData);
                  return this._bitmapData !== null ? this._bitmapData.width * this.scaleX : 0;
              },
              set: function set(w) {
                  if (this._bitmapData !== null && this._bitmapData.width > 0) {
                      this.scaleX = w / this._bitmapData.width;
                  }
              }
          },
          {
              key: "height",
              get: function get() {
                  return this._bitmapData !== null ? this._bitmapData.height * this.scaleY : 0;
              },
              set: function set(h) {
                  if (this._bitmapData !== null && this._bitmapData.height > 0) {
                      this.scaleY = h / this._bitmapData.height;
                  }
              }
          }
      ]);
      return Bitmap;
  }(DisplayObject);
  /**
   * BitmapData Polyfill class
   * @author Jim Chen
   */ var BitmapData = /*#__PURE__*/ function() {
      function BitmapData(width, height, transparent, fillColor, id) {
          if (transparent === void 0) transparent = true;
          if (fillColor === void 0) fillColor = 0xffffffff;
          if (id === void 0) id = Runtime.generateId('obj-bmp-data');
          this._locked = false;
          this._id = id;
          this._rect = new Rectangle(0, 0, width, height);
          this._transparent = transparent;
          this._fillColor = fillColor;
          this._dirtyArea = new DirtyArea();
          this._fill();
          // Register this
          Runtime.registerObject(this);
      }
      var _proto = BitmapData.prototype;
      _proto._fill = function _fill() {
          this._byteArray = [];
          for(var i = 0; i < this._rect.width * this._rect.height; i++){
              this._byteArray.push(this._fillColor);
          }
      };
      _proto._updateBox = function _updateBox(changeRect) {
          if (changeRect === void 0) changeRect = null;
          if (this._dirtyArea.isEmpty()) {
              // Don't update anything if nothing was changed
              return;
          }
          if (this._locked) {
              // Don't send updates if this is locked
              return;
          }
          var change = changeRect === null ? this._dirtyArea.asRect() : changeRect;
          // Make sure we're not out-of-bounds
          if (!this._rect.containsRect(change)) {
              __trace('BitmapData._updateBox box ' + change.toString() + ' out of bonunds ' + this._rect.toString(), 'err');
              throw new Error('Rectangle provided was not within image bounds.');
          }
          // Extract the values
          var region = [];
          for(var i = 0; i < change.height; i++){
              for(var j = 0; j < change.width; j++){
                  region.push(this._byteArray[(change.y + i) * this._rect.width + change.x + j]);
              }
          }
          this._methodCall('updateBox', {
              'box': change.serialize(),
              'values': region
          });
          this._dirtyArea.reset();
      };
      _proto._methodCall = function _methodCall(methodName, params) {
          __pchannel("Runtime:CallMethod", {
              "id": this._id,
              "method": methodName,
              "params": params
          });
      };
      _proto.draw = function draw(source, matrix, colorTransform, blendMode, clipRect, smoothing) {
          if (matrix === void 0) matrix = null;
          if (colorTransform === void 0) colorTransform = null;
          if (blendMode === void 0) blendMode = null;
          if (clipRect === void 0) clipRect = null;
          if (smoothing === void 0) smoothing = false;
          if (!_instanceof(source, BitmapData)) {
              __trace('Drawing non BitmapData is not supported!', 'err');
              return;
          }
          if (matrix !== null) {
              __trace('Matrix transforms not supported yet.', 'warn');
          }
          if (colorTransform !== null) {
              __trace('Color transforms not supported yet.', 'warn');
          }
          if (blendMode !== null && blendMode !== 'normal') {
              __trace('Blend mode [' + blendMode + '] not supported yet.', 'warn');
          }
          if (smoothing !== false) {
              __trace('Smoothign not supported!', 'warn');
          }
          this.lock();
          if (clipRect === null) {
              clipRect = new Rectangle(0, 0, source.width, source.height);
          }
          this.setPixels(clipRect, source.getPixels(clipRect));
          this.unlock();
      };
      _proto.getPixel = function getPixel(x, y) {
          return this.getPixel32(x, y) & 0x00ffffff;
      };
      _proto.getPixel32 = function getPixel32(x, y) {
          if (x >= this._rect.width || y >= this._rect.height || x < 0 || y < 0) {
              throw new Error('Coordinates out of bounds');
          }
          try {
              return this._transparent ? this._byteArray[y * this._rect.width + x] : (this._byteArray[y * this._rect.width + x] & 0x00ffffff) + 0xff000000;
          } catch (e) {
              return this._fillColor;
          }
      };
      _proto.getPixels = function getPixels(rect) {
          if (typeof rect === 'undefined' || rect === null) {
              throw new Error('Expected a region to acquire pixels.');
          }
          if (rect.width === 0 || rect.height === 0) {
              return new ByteArray();
          }
          var region = new ByteArray();
          for(var i = 0; i < rect.height; i++){
              this._byteArray.slice((rect.y + i) * this._rect.width + rect.x, (rect.y + i) * this._rect.width + rect.x + rect.width).forEach(function(v) {
                  region.push(v);
              });
          }
          return region;
      };
      _proto.setPixel = function setPixel(x, y, color) {
          // Force alpha channel to be full
          this.setPixel32(x, y, (color & 0x00ffffff) + 0xff000000);
      };
      _proto.setPixel32 = function setPixel32(x, y, color) {
          if (!this._transparent) {
              // Force alpha channel
              color = (color & 0x00ffffff) + 0xff000000;
          }
          this._byteArray[y * this._rect.width + x] = color;
          this._dirtyArea.expand(x, y);
          this._updateBox();
      };
      _proto.setPixels = function setPixels(rect, input) {
          if (rect.width === 0 || rect.height === 0) {
              return;
          }
          // Test if the input is correct length
          if (input.length !== rect.width * rect.height) {
              throw new Error('setPixels expected ' + rect.width * rect.height + ' pixels, but actually got ' + input.length);
          }
          if (!this._transparent) {
              input = input.map(function(color) {
                  return (color & 0x00ffffff) + 0xff000000;
              });
          }
          for(var i = 0; i < rect.width; i++){
              for(var j = 0; j < rect.height; j++){
                  this._byteArray[(rect.y + j) * this.width + (rect.x + i)] = input[j * rect.width + i];
                  this._dirtyArea.expand(i, j);
              }
          }
          this._updateBox();
      };
      _proto.getVector = function getVector(rect) {
          if (this._rect.equals(rect)) {
              return this._byteArray;
          }
          var vector = [];
          for(var j = rect.y; j < rect.y + rect.height; j++){
              for(var i = rect.x; i < rect.x + rect.width; i++){
                  vector.push(rect[j * this._rect.width + i]);
              }
          }
          return vector;
      };
      _proto.lock = function lock() {
          this._locked = true;
      };
      _proto.unlock = function unlock(changeRect) {
          if (changeRect === void 0) changeRect = null;
          this._locked = false;
          if (changeRect == null) {
              this._updateBox();
          } else {
              this._updateBox(changeRect);
          }
      };
      _proto.dispatchEvent = function dispatchEvent(_event, _data) {};
      _proto.getId = function getId() {
          return this._id;
      };
      _proto.serialize = function serialize() {
          return {
              'class': 'BitmapData',
              'width': this._rect.width,
              'height': this._rect.height,
              'fill': this._fillColor
          };
      };
      _proto.unload = function unload() {
          this._methodCall('unload', null);
      };
      _proto.clone = function clone() {
          var data = new BitmapData(this.width, this.height, this._transparent, this._fillColor);
          data._byteArray = this._byteArray.slice(0);
          data._updateBox(data._rect);
          return data;
      };
      _create_class(BitmapData, [
          {
              key: "height",
              get: function get() {
                  return this._rect.height;
              },
              set: function set(_height) {
                  __trace('BitmapData.height is read-only', 'warn');
              }
          },
          {
              key: "width",
              get: function get() {
                  return this._rect.width;
              },
              set: function set(_width) {
                  __trace('BitmapData.height is read-only', 'warn');
              }
          },
          {
              key: "rect",
              get: function get() {
                  return this._rect;
              },
              set: function set(_rect) {
                  __trace('BitmapData.rect is read-only', 'warn');
              }
          }
      ]);
      return BitmapData;
  }();

  /**
   * MotionManager Polyfill for AS3.
   * @author Jim Chen
   */ var MotionManager = /*#__PURE__*/ function() {
      function MotionManager(o, dur, independentTimer) {
          if (dur === void 0) dur = 1000;
          if (independentTimer === void 0) independentTimer = false;
          this._isRunning = false;
          this.oncomplete = null;
          if (typeof o === 'undefined' || o === null) {
              throw new Error('MotionManager must be bound to a DisplayObject.');
          }
          this._ttl = dur;
          this._dur = dur;
          this._parent = o;
          this._independentTimer = independentTimer;
          this._timeKeeper = new Runtime.TimeKeeper();
          var self = this;
          if (this._independentTimer) {
              this._timer = new Runtime.Timer(41, 0);
              this._timer.addEventListener('timer', function() {
                  self._onTimerEvent();
              });
              this._timer.start();
          } else {
              this._parent.addEventListener('enterFrame', function() {
                  self._onTimerEvent();
              });
          }
      }
      var _proto = MotionManager.prototype;
      /**
     * Private method invoked every time a timer event is fired
     */ _proto._onTimerEvent = function _onTimerEvent() {
          // Ignore timer events if this is not running
          if (!this._isRunning) {
              return;
          }
          // Ignore timer events if this has 0 duration (infinite)
          if (this._dur === 0) {
              return;
          }
          this._ttl -= this._timeKeeper.elapsed;
          this._timeKeeper.reset();
          if (this._ttl <= 0) {
              this.stop();
              if (typeof this.oncomplete === 'function') {
                  this.oncomplete();
              }
              this._parent.unload();
          }
      };
      _proto.reset = function reset() {
          this._ttl = this._dur;
          this._timeKeeper.reset();
      };
      _proto.play = function play() {
          if (this._isRunning) {
              return;
          }
          if (this._dur === 0 || this._ttl <= 0) {
              return;
          }
          this._isRunning = true;
          this._timeKeeper.reset();
          if (this._tween) {
              this._tween.play();
          }
      };
      _proto.stop = function stop() {
          if (!this._isRunning) {
              return;
          }
          this._isRunning = false;
          this._timeKeeper.reset();
          if (this._tween) {
              this._tween.stop();
          }
      };
      _proto.forecasting = function forecasting(_time) {
          __trace('MotionManager.forecasting always returns false', 'warn');
          return false;
      };
      _proto.setPlayTime = function setPlayTime(playtime) {
          this._ttl = this._dur - playtime;
          if (this._tween) {
              if (this._isRunning) {
                  this._tween.gotoAndPlay(playtime);
              } else {
                  this._tween.gotoAndStop(playtime);
              }
          }
      };
      _proto.motionSetToTween = function motionSetToTween(motion) {
          var tweens = [];
          for(var movingVars in motion){
              if (!motion.hasOwnProperty(movingVars)) {
                  continue;
              }
              var mProp = motion[movingVars];
              if (!mProp.hasOwnProperty("fromValue")) {
                  continue;
              }
              if (!mProp.hasOwnProperty("toValue")) {
                  mProp["toValue"] = mProp["fromValue"];
              }
              if (!mProp.hasOwnProperty("lifeTime")) {
                  mProp["lifeTime"] = this._dur;
              }
              var src = {}, dst = {};
              src[movingVars] = mProp["fromValue"];
              dst[movingVars] = mProp["toValue"];
              if (typeof mProp["easing"] === "string") {
                  mProp["easing"] = Tween.getEasingFuncByName(mProp["easing"]);
              }
              if (mProp.hasOwnProperty("startDelay")) {
                  tweens.push(Tween.delay(Tween.tween(this._parent, dst, src, mProp["lifeTime"], mProp["easing"]), mProp["startDelay"] / 1000));
              } else {
                  tweens.push(Tween.tween(this._parent, dst, src, mProp["lifeTime"], mProp["easing"]));
              }
          }
          return Tween.parallel.apply(Tween, tweens);
      };
      _proto.initTween = function initTween(motion, _repeat) {
          this._tween = this.motionSetToTween(motion);
      };
      _proto.initTweenGroup = function initTweenGroup(motionGroup, _lifeTime) {
          var tweens = [];
          for(var i = 0; i < motionGroup.length; i++){
              tweens.push(this.motionSetToTween(motionGroup[i]));
          }
          this._tween = Tween.serial.apply(Tween, tweens);
      };
      _proto.setCompleteListener = function setCompleteListener(listener) {
          this.oncomplete = listener;
      };
      _create_class(MotionManager, [
          {
              key: "dur",
              get: function get() {
                  return this._dur;
              },
              set: function set(dur) {
                  this._timeKeeper.reset();
                  this._ttl = dur;
                  this._dur = dur;
              }
          },
          {
              key: "running",
              get: function get() {
                  return this._isRunning;
              }
          }
      ]);
      return MotionManager;
  }();

  /**
   * Compliant CommentBitmap Polyfill For BiliScriptEngine
   */ var CommentBitmap = /*#__PURE__*/ function(Bitmap) {
      _inherits(CommentBitmap, Bitmap);
      function CommentBitmap(params) {
          var _this;
          _this = Bitmap.call(this, 'bitmapData' in params ? params['bitmapData'] : undefined) || this, _this._mM = new MotionManager(_this);
          _this.initStyle(params);
          Runtime.registerObject(_this);
          _this.bindParent(params);
          _this._mM.play();
          return _this;
      }
      var _proto = CommentBitmap.prototype;
      _proto.bindParent = function bindParent(params) {
          if (params.hasOwnProperty("parent")) {
              params["parent"].addChild(this);
          }
      };
      _proto.initStyle = function initStyle(style) {
          if (typeof style === 'undefined' || style === null) {
              style = {};
          }
          if ("lifeTime" in style) {
              this._mM.dur = style["lifeTime"] * 1000;
          }
      };
      _create_class(CommentBitmap, [
          {
              key: "motionManager",
              get: function get() {
                  return this._mM;
              },
              set: function set(_m) {
                  __trace("IComment.motionManager is read-only", "warn");
              }
          }
      ]);
      return CommentBitmap;
  }(Bitmap);
  function createBitmap$1(params) {
      return new CommentBitmap(params);
  }
  function createParticle$1(params) {
      __trace('Bitmap.createParticle not implemented', 'warn');
      return new CommentBitmap(params);
  }
  function createBitmapData$1(width, height, transparent, fillColor) {
      if (transparent === void 0) transparent = true;
      if (fillColor === void 0) fillColor = 0xffffffff;
      return new BitmapData(width, height, transparent, fillColor);
  }

  /**
   * Compliant CommentButton Polyfill For BiliScriptEngine
   */ var CommentButton = /*#__PURE__*/ function(UIComponent) {
      _inherits(CommentButton, UIComponent);
      function CommentButton(params) {
          var _this;
          _this = UIComponent.call(this) || this, _this._mM = new MotionManager(_this), _this._label = "";
          _this.setDefaults(params);
          _this.initStyle(params);
          Runtime.registerObject(_this);
          _this.bindParent(params);
          _this._mM.play();
          return _this;
      }
      var _proto = CommentButton.prototype;
      _proto.bindParent = function bindParent(params) {
          if (params.hasOwnProperty("parent")) {
              params["parent"].addChild(this);
          }
      };
      _proto.initStyle = function initStyle(style) {
          if (typeof style === 'undefined' || style === null) {
              style = {};
          }
          if ("lifeTime" in style) {
              this._mM.dur = style["lifeTime"] * 1000;
          } else {
              this._mM.dur = 4000;
          }
          if (style.hasOwnProperty("text")) {
              this._label = style["text"];
          }
          if (style.hasOwnProperty("motionGroup")) {
              this._mM.initTweenGroup(style["motionGroup"], this._mM.dur);
          } else if (style.hasOwnProperty("motion")) {
              this._mM.initTween(style["motion"], false);
          }
      };
      _proto.serialize = function serialize() {
          var serialized = UIComponent.prototype.serialize.call(this);
          serialized["class"] = "Button";
          serialized["text"] = this._label;
          return serialized;
      };
      _create_class(CommentButton, [
          {
              key: "motionManager",
              get: function get() {
                  return this._mM;
              },
              set: function set(_m) {
                  __trace("IComment.motionManager is read-only", "warn");
              }
          }
      ]);
      return CommentButton;
  }(UIComponent);
  function createButton(params) {
      return new CommentButton(params);
  }

  /**
   * Compliant CommentCanvas Polyfill For BiliScriptEngine
   */ var CommentCanvas = /*#__PURE__*/ function(Sprite) {
      _inherits(CommentCanvas, Sprite);
      function CommentCanvas(params) {
          var _this;
          _this = Sprite.call(this) || this, _this._mM = new MotionManager(_this);
          _this.setDefaults(params);
          _this.initStyle(params);
          Runtime.registerObject(_this);
          _this.bindParent(params);
          _this._mM.play();
          return _this;
      }
      var _proto = CommentCanvas.prototype;
      _proto.bindParent = function bindParent(params) {
          if (params.hasOwnProperty("parent")) {
              params["parent"].addChild(this);
          }
      };
      _proto.initStyle = function initStyle(style) {
          if (style["lifeTime"]) {
              this._mM.dur = style["lifeTime"] * 1000;
          }
          if (style.hasOwnProperty("motionGroup")) {
              this._mM.initTweenGroup(style["motionGroup"], this._mM.dur);
          } else if (style.hasOwnProperty("motion")) {
              this._mM.initTween(style["motion"], false);
          }
      };
      _create_class(CommentCanvas, [
          {
              key: "motionManager",
              get: function get() {
                  return this._mM;
              },
              set: function set(_m) {
                  __trace("IComment.motionManager is read-only", "warn");
              }
          }
      ]);
      return CommentCanvas;
  }(Sprite);
  function createCanvas(params) {
      return new CommentCanvas(params);
  }

  /**
   * Compliant CommentField Polyfill For BiliScriptEngine
   */ var CommentField = /*#__PURE__*/ function(TextField) {
      _inherits(CommentField, TextField);
      function CommentField(text, params) {
          if (params === void 0) params = {};
          var _this;
          _this = TextField.call(this, text, 0xffffff) || this, _this._mM = new MotionManager(_this);
          _this.setDefaults(params);
          _this.initStyle(params);
          Runtime.registerObject(_this);
          _this.bindParent(params);
          _this._mM.play();
          return _this;
      }
      var _proto = CommentField.prototype;
      _proto.bindParent = function bindParent(params) {
          if (params.hasOwnProperty("parent")) {
              params["parent"].addChild(this);
          }
      };
      _proto.initStyle = function initStyle(style) {
          if (typeof style === 'undefined' || style === null) {
              style = {};
          }
          if ("lifeTime" in style) {
              this._mM.dur = style["lifeTime"] * 1000;
          }
          if ("fontsize" in style) {
              this.getTextFormat().size = style["fontsize"];
          }
          if ("font" in style) {
              this.getTextFormat().font = style["font"];
          }
          if ("color" in style) {
              this.getTextFormat().color = style["color"];
          }
          if ("bold" in style) {
              this.getTextFormat().bold = style["bold"];
          }
          if (style.hasOwnProperty("motionGroup")) {
              this._mM.initTweenGroup(style["motionGroup"], this._mM.dur);
          } else if (style.hasOwnProperty("motion")) {
              this._mM.initTween(style["motion"], false);
          }
      };
      _create_class(CommentField, [
          {
              key: "fontsize",
              get: function get() {
                  return this.getTextFormat().fontsize;
              },
              set: function set(size) {
                  var tf = this.getTextFormat();
                  tf.size = size;
                  this.setTextFormat(tf);
              }
          },
          {
              key: "font",
              get: function get() {
                  return this.getTextFormat().font;
              },
              set: function set(fontname) {
                  var tf = this.getTextFormat();
                  tf.font = fontname;
                  this.setTextFormat(tf);
              }
          },
          {
              key: "align",
              get: function get() {
                  return this.getTextFormat().align;
              },
              set: function set(a) {
                  var tf = this.getTextFormat();
                  tf.align = a;
                  this.setTextFormat(tf);
              }
          },
          {
              key: "bold",
              get: function get() {
                  return this.getTextFormat().bold;
              },
              set: function set(b) {
                  var tf = this.getTextFormat();
                  tf.bold = b;
                  this.setTextFormat(tf);
              }
          },
          {
              key: "motionManager",
              get: function get() {
                  return this._mM;
              },
              set: function set(_m) {
                  __trace("IComment.motionManager is read-only", "warn");
              }
          }
      ]);
      return CommentField;
  }(TextField);
  function createComment(text, params) {
      return new CommentField(text, params);
  }
  function createTextField() {
      return new CommentField("", {});
  }

  /**
   * Compliant CommentShape Polyfill For BiliScriptEngine
   */ var CommentShape = /*#__PURE__*/ function(Shape) {
      _inherits(CommentShape, Shape);
      function CommentShape(params) {
          var _this;
          _this = Shape.call(this) || this, _this._mM = new MotionManager(_this);
          _this.setDefaults(params);
          _this.initStyle(params);
          Runtime.registerObject(_this);
          _this.bindParent(params);
          _this._mM.play();
          return _this;
      }
      var _proto = CommentShape.prototype;
      _proto.bindParent = function bindParent(params) {
          if (params.hasOwnProperty("parent")) {
              params["parent"].addChild(this);
          }
      };
      _proto.initStyle = function initStyle(style) {
          if (typeof style === 'undefined' || style === null) {
              style = {};
          }
          if (style["lifeTime"]) {
              this._mM.dur = style["lifeTime"] * 1000;
          }
          if (style.hasOwnProperty("motionGroup")) {
              this._mM.initTweenGroup(style["motionGroup"], this._mM.dur);
          } else if (style.hasOwnProperty("motion")) {
              this._mM.initTween(style["motion"], false);
          }
      };
      _create_class(CommentShape, [
          {
              key: "motionManager",
              get: function get() {
                  return this._mM;
              },
              set: function set(_m) {
                  __trace("IComment.motionManager is read-only", "warn");
              }
          }
      ]);
      return CommentShape;
  }(Shape);
  function createShape(params) {
      return new CommentShape(params);
  }

  function toString() {
      return "[display Display]";
  }

  var DisplayModule = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Bitmap: Bitmap,
    BitmapData: BitmapData,
    BlendMode: BlendMode,
    ByteArray: ByteArray,
    ColorTransform: ColorTransform,
    CommentBitmap: CommentBitmap,
    DisplayObject: DisplayObject,
    Filter: Filter,
    Graphics: Graphics,
    Matrix: Matrix,
    Matrix3D: Matrix3D,
    MotionManager: MotionManager,
    PerspectiveProjection: PerspectiveProjection,
    Point: Point,
    Rectangle: Rectangle,
    RootSprite: RootSprite,
    Shape: Shape,
    Sprite: Sprite,
    TextField: TextField,
    Transform: Transform,
    UIComponent: UIComponent,
    Vector3D: Vector3D,
    createBevelFilter: createBevelFilter,
    createBitmap: createBitmap$1,
    createBitmapData: createBitmapData$1,
    createBlurFilter: createBlurFilter,
    createButton: createButton,
    createCanvas: createCanvas,
    createColorMatrixFilter: createColorMatrixFilter,
    createColorTransform: createColorTransform,
    createComment: createComment,
    createConvolutionFilter: createConvolutionFilter,
    createDisplacementMapFilter: createDisplacementMapFilter,
    createDropShadowFilter: createDropShadowFilter,
    createGlowFilter: createGlowFilter,
    createGradientBevelFilter: createGradientBevelFilter,
    createGradientBox: createGradientBox,
    createGradientGlowFilter: createGradientGlowFilter,
    createMatrix: createMatrix,
    createMatrix3D: createMatrix3D,
    createParticle: createParticle$1,
    createPoint: createPoint,
    createShape: createShape,
    createTextField: createTextField,
    createTextFormat: createTextFormat,
    createVector3D: createVector3D,
    projectVector: projectVector,
    projectVectors: projectVectors,
    toIntVector: toIntVector,
    toNumberVector: toNumberVector,
    toString: toString
  });

  /**
   * LibBitmap "library" built to be loaded by BSE.
   * This is auto loaded ever since a certain version so we actually don't care if we
   * throw this into the global namespace (as Bitmap, see ../Display.ts)
   */ function createBitmap(params) {
      return createBitmap$1(params);
  }
  function createParticle(params) {
      return createParticle$1(params);
  }
  function createBitmapData(width, height, transparent, fillColor) {
      if (transparent === void 0) transparent = true;
      if (fillColor === void 0) fillColor = 0xffffffff;
      return createBitmapData$1(width, height, transparent, fillColor);
  }
  function createRectangle(x, y, width, height) {
      return new Rectangle(x, y, width, height);
  }

  var LibBitmap = /*#__PURE__*/Object.freeze({
    __proto__: null,
    createBitmap: createBitmap,
    createBitmapData: createBitmapData,
    createParticle: createParticle,
    createRectangle: createRectangle
  });

  var _width = 0;
  var _height = 0;
  var _fullScreenWidth = 0;
  var _fullScreenHeight = 0;
  var _frameRate = 24;
  setRoot(new RootSprite());
  var Display = createModule(DisplayModule, {
      'root': {
          get: function get() {
              return getRoot();
          },
          set: function set(_value) {
              __trace("Display.root is read-only", "warn");
          }
      },
      'loaderInfo': {
          get: function get() {
              return {};
          },
          set: function set(_value) {
              __trace("Display.loaderInfo is disabled", "warn");
          }
      },
      'stage': {
          get: function get() {
              return getRoot();
          },
          set: function set(_value) {
              __trace("Display.stage is read-only", "warn");
          }
      },
      'version': {
          get: function get() {
              return "CCLDisplay/1.0 HTML5/* (bilibili, like BSE, like flash, AS3 compatible) KagerouEngine/v1";
          },
          set: function set(_value) {
              __trace("Display.version is read-only", "warn");
          }
      },
      'width': {
          get: function get() {
              return _width;
          },
          set: function set(_value) {
              __trace("Display.width is read-only", "warn");
          }
      },
      'height': {
          get: function get() {
              return _height;
          },
          set: function set(_value) {
              __trace("Display.height is read-only", "warn");
          }
      },
      'fullScreenWidth': {
          get: function get() {
              return _fullScreenWidth;
          },
          set: function set(_value) {
              __trace("Display.fullScreenWidth is read-only", "warn");
          }
      },
      'fullScreenHeight': {
          get: function get() {
              return _fullScreenHeight;
          },
          set: function set(_value) {
              __trace("Display.fullScreenHeight is read-only", "warn");
          }
      },
      'frameRate': {
          get: function get() {
              return _frameRate;
          },
          set: function set(value) {
              _frameRate = value;
              __pchannel("Display:SetFrameRate", value);
          }
      }
  });
  /** Update Listeners **/ __schannel("Update:DimensionUpdate", function(payload) {
      _width = payload["stageWidth"];
      _height = payload["stageHeight"];
      if (payload.hasOwnProperty("screenWidth") && payload.hasOwnProperty("screenHeight")) {
          _fullScreenWidth = payload["screenWidth"];
          _fullScreenHeight = payload["screenHeight"];
      }
  });
  exportGlobal('Display', Display);
  exportGlobal('$', Display);
  exportGlobal('Bitmap', createModule(LibBitmap));

})(Runtime, Tween);
