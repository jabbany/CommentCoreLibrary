var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Display;
(function (Display) {
    var Point = (function () {
        function Point(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
        }
        Object.defineProperty(Point.prototype, "length", {
            get: function () {
                return Math.sqrt(this.x * this.x + this.y * this.y);
            },
            set: function (l) {
                __trace('Point.length is read-only', 'err');
            },
            enumerable: true,
            configurable: true
        });
        Point.prototype.add = function (p) {
            return new Point(p.x + this.x, p.y + this.y);
        };
        Point.prototype.subtract = function (p) {
            return new Point(this.x - p.x, this.y - p.y);
        };
        Point.interpolate = function (a, b, f) {
            return new Point((b.x - a.x) * f + a.x, (b.y - a.y) * f + a.y);
        };
        Point.prototype.offset = function (dx, dy) {
            this.x += dx;
            this.y += dy;
        };
        Point.prototype.normalize = function (thickness) {
            var ratio = thickness / this.length;
            this.x *= ratio;
            this.y *= ratio;
        };
        Point.polar = function (r, theta) {
            return new Point(r * Math.cos(theta), r * Math.sin(theta));
        };
        Point.prototype.setTo = function (x, y) {
            this.x = x;
            this.y = y;
        };
        Point.prototype.equals = function (p) {
            if (p.x === this.x && p.y === this.y) {
                return true;
            }
            return false;
        };
        Point.prototype.toString = function () {
            return '(x=' + this.x + ', y=' + this.y + ')';
        };
        Point.prototype.clone = function () {
            return new Point(this.x, this.y);
        };
        return Point;
    }());
    Display.Point = Point;
    var Matrix = (function () {
        function Matrix(a, b, c, d, tx, ty) {
            if (a === void 0) { a = 1; }
            if (b === void 0) { b = 0; }
            if (c === void 0) { c = 0; }
            if (d === void 0) { d = 1; }
            if (tx === void 0) { tx = 0; }
            if (ty === void 0) { ty = 0; }
            this._data = [a, c, tx, b, d, ty, 0, 0, 1];
        }
        Matrix.prototype.dotProduct = function (o) {
            if (o.length < 9) {
                throw new Error('Matrix dot product expects a 3x3 Matrix');
            }
            var res = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 3; j++) {
                    for (var k = 0; k < 3; k++) {
                        res[i * 3 + j] += this._data[i * 3 + k] * o[k * 3 + j];
                    }
                }
            }
            return res;
        };
        Matrix.prototype.setTo = function (a, b, c, d, tx, ty) {
            if (a === void 0) { a = 1; }
            if (b === void 0) { b = 0; }
            if (c === void 0) { c = 0; }
            if (d === void 0) { d = 1; }
            if (tx === void 0) { tx = 0; }
            if (ty === void 0) { ty = 0; }
            this._data = [a, c, tx, b, d, ty, 0, 0, 1];
        };
        Matrix.prototype.translate = function (tX, tY) {
            this._data[2] += tX;
            this._data[5] += tY;
        };
        Matrix.prototype.rotate = function (q) {
            this._data = this.dotProduct([
                Math.cos(q), -Math.sin(q), 0,
                Math.sin(q), Math.cos(q), 0,
                0, 0, 1
            ]);
        };
        Matrix.prototype.scale = function (sx, sy) {
            this._data = this.dotProduct([
                sx, 0, 0,
                0, sy, 0,
                0, 0, 1
            ]);
        };
        Matrix.prototype.identity = function () {
            this.setTo(1, 0, 0, 1, 0, 0);
        };
        Matrix.prototype.createGradientBox = function (width, height, rotation, tX, tY) {
            this.createBox(width, height, rotation, tX, tY);
        };
        Matrix.prototype.createBox = function (sX, sY, q, tX, tY) {
            this.identity();
            this.rotate(q);
            this.scale(sX, sY);
            this.translate(tX, tY);
        };
        Matrix.prototype.clone = function () {
            var a = this._data[0], b = this._data[3], c = this._data[1], d = this._data[4], tx = this._data[2], ty = this._data[5];
            return new Matrix(a, b, c, d, tx, ty);
        };
        Matrix.prototype.serialize = function () {
            return this._data;
        };
        return Matrix;
    }());
    Display.Matrix = Matrix;
    var Matrix3D = (function () {
        function Matrix3D(iv) {
            if (iv === void 0) { iv = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]; }
            if (iv.length === 16) {
                this._data = iv;
            }
            else if (iv.length === 0) {
                this.identity();
            }
            else {
                __trace('Matrix3D initialization vector invalid', 'warn');
                this.identity();
            }
        }
        Matrix3D.prototype.dotProduct = function (a, b) {
            if (a.length !== 16 || b.length !== 16) {
                throw new Error('Matrix3D dot product expects a 4xr Matrix3D');
            }
            var res = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 4; j++) {
                    for (var k = 0; k < 4; k++) {
                        res[i * 4 + j] += a[i * 4 + k] * b[k * 4 + j];
                    }
                }
            }
            return res;
        };
        Matrix3D.prototype.rotationMatrix = function (angle, axis) {
            var sT = Math.sin(angle), cT = Math.cos(angle);
            return [
                cT + axis.x * axis.x * (1 - cT), axis.x * axis.y * (1 - cT) - axis.z * sT, axis.x * axis.z * (1 - cT) + axis.y * sT, 0,
                axis.x * axis.y * (1 - cT) + axis.z * sT, cT + axis.y * axis.y * (1 - cT), axis.y * axis.z * (1 - cT) - axis.x * sT, 0,
                axis.z * axis.x * (1 - cT) - axis.y * sT, axis.z * axis.y * (1 - cT) + axis.x * sT, cT + axis.z * axis.z * (1 - cT), 0,
                0, 0, 0, 1
            ];
        };
        Matrix3D.prototype.identity = function () {
            this._data = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        };
        Matrix3D.prototype.append = function (lhs) {
            this._data = this.dotProduct(lhs._data, this._data);
        };
        Matrix3D.prototype.appendRotation = function (degrees, axis, pivotPoint) {
            if (pivotPoint === void 0) { pivotPoint = null; }
            if (pivotPoint !== null) {
                this.appendTranslation(pivotPoint.x, pivotPoint.y, pivotPoint.z);
            }
            this._data = this.dotProduct(this.rotationMatrix(degrees * Math.PI / 180, axis), this._data);
            if (pivotPoint !== null) {
                this.appendTranslation(-pivotPoint.x, -pivotPoint.y, -pivotPoint.z);
            }
        };
        Matrix3D.prototype.appendTranslation = function (x, y, z) {
            this._data = this.dotProduct([
                1, 0, 0, x,
                0, 1, 0, y,
                0, 0, 1, z,
                0, 0, 0, 1
            ], this._data);
        };
        Matrix3D.prototype.appendScale = function (sX, sY, sZ) {
            if (sX === void 0) { sX = 1; }
            if (sY === void 0) { sY = 1; }
            if (sZ === void 0) { sZ = 1; }
            this._data = this.dotProduct([
                sX, 0, 0, 0,
                0, sY, 0, 0,
                0, 0, sZ, 0,
                0, 0, 0, 1
            ], this._data);
        };
        Matrix3D.prototype.prepend = function (rhs) {
            this._data = this.dotProduct(this._data, rhs._data);
        };
        Matrix3D.prototype.prependRotation = function (degrees, axis, pivotPoint) {
            if (pivotPoint === void 0) { pivotPoint = null; }
            if (pivotPoint !== null) {
                this.prependTranslation(pivotPoint.x, pivotPoint.y, pivotPoint.z);
            }
            this._data = this.dotProduct(this._data, this.rotationMatrix(degrees * Math.PI / 180, axis));
            if (pivotPoint !== null) {
                this.prependTranslation(-pivotPoint.x, -pivotPoint.y, -pivotPoint.z);
            }
        };
        Matrix3D.prototype.prependTranslation = function (x, y, z) {
            this._data = this.dotProduct(this._data, [
                1, 0, 0, x,
                0, 1, 0, y,
                0, 0, 1, z,
                0, 0, 0, 1
            ]);
        };
        Matrix3D.prototype.prependScale = function (sX, sY, sZ) {
            this._data = this.dotProduct(this._data, [
                sX, 0, 0, 0,
                0, sY, 0, 0,
                0, 0, sZ, 0,
                0, 0, 0, 1
            ]);
        };
        Matrix3D.prototype.transformVector = function (v) {
            var rx = this._data[0] * v.x + this._data[1] * v.y +
                this._data[2] * v.z + this._data[3] * v.w;
            var ry = this._data[4] * v.x + this._data[5] * v.y +
                this._data[6] * v.z + this._data[7] * v.w;
            var rz = this._data[8] * v.x + this._data[9] * v.y +
                this._data[10] * v.z + this._data[11] * v.w;
            var rw = this._data[12] * v.x + this._data[13] * v.y +
                this._data[14] * v.z + this._data[15] * v.w;
            return new Vector3D(rx, ry, rz, rw);
        };
        Matrix3D.prototype.transformVectors = function (vin, vout) {
            if (vin.length % 3 !== 0) {
                __trace('Matrix3D.transformVectors expects input size to be multiple of 3.', 'err');
                return;
            }
            for (var i = 0; i < vin.length / 3; i++) {
                var x = vin[i * 3], y = vin[i * 3 + 1], z = vin[i * 3 + 2];
                var rx = this._data[0] * x + this._data[1] * y + this._data[2] * z;
                var ry = this._data[4] * x + this._data[5] * y + this._data[6] * z;
                var rz = this._data[8] * x + this._data[9] * y + this._data[10] * z;
                vout.push(rx, ry, rz);
            }
        };
        Matrix3D.prototype.transpose = function () {
            this._data = [
                this._data[0], this._data[4], this._data[8], this._data[12],
                this._data[1], this._data[5], this._data[9], this._data[13],
                this._data[2], this._data[6], this._data[10], this._data[14],
                this._data[3], this._data[7], this._data[11], this._data[15]
            ];
        };
        Matrix3D.prototype.clone = function () {
            return new Matrix3D(this._data);
        };
        Matrix3D.prototype.serialize = function () {
            return this._data;
        };
        return Matrix3D;
    }());
    Display.Matrix3D = Matrix3D;
    var Vector3D = (function () {
        function Vector3D(x, y, z, w) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (z === void 0) { z = 0; }
            if (w === void 0) { w = 0; }
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }
        Vector3D.prototype.toString = function () {
            return '(x=' + this.x + ', y=' + this.y + ', z=' + this.z + ', w=' + this.w + ')';
        };
        Vector3D.X_AXIS = new Vector3D(1, 0, 0);
        Vector3D.Y_AXIS = new Vector3D(0, 1, 0);
        Vector3D.Z_AXIS = new Vector3D(0, 0, 1);
        return Vector3D;
    }());
    Display.Vector3D = Vector3D;
    function createMatrix(a, b, c, d, tx, ty) {
        return new Matrix(a, b, c, d, tx, ty);
    }
    Display.createMatrix = createMatrix;
    function createMatrix3D(iv) {
        return new Matrix3D(iv);
    }
    Display.createMatrix3D = createMatrix3D;
    function createGradientBox(width, height, rotation, tX, tY) {
        var m = new Matrix();
        m.createGradientBox(width / 1638.4, height / 1638.4, rotation, tX + width / 2, tY + height / 2);
        return m;
    }
    Display.createGradientBox = createGradientBox;
    function createVector3D(x, y, z, w) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (z === void 0) { z = 0; }
        if (w === void 0) { w = 0; }
        return new Vector3D(x, y, z, w);
    }
    Display.createVector3D = createVector3D;
    function projectVector(matrix, vector) {
        return matrix.transformVector(vector);
    }
    Display.projectVector = projectVector;
    function projectVectors(matrix, verts, projectedVerts, uvts) {
        while (projectedVerts.length > 0) {
            projectedVerts.pop();
        }
        if (verts.length % 3 !== 0) {
            __trace('Display.projectVectors input vertex Vector must be a multiple of 3.', 'err');
            return;
        }
        var transformed = [];
        matrix.transformVectors(verts, transformed);
        for (var i = 0; i < transformed.length / 3; i++) {
            var x = transformed[i * 3], y = transformed[i * 3 + 1];
            projectedVerts.push(x, y);
        }
    }
    Display.projectVectors = projectVectors;
    function createPoint(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        return new Point(x, y);
    }
    Display.createPoint = createPoint;
    function toIntVector(array) {
        Object.defineProperty(array, 'as3Type', {
            get: function () {
                return 'Vector<int>';
            },
            set: function (value) {
                __trace('as3Type should not be set.', 'warn');
            }
        });
        return array.map(Math.floor);
    }
    Display.toIntVector = toIntVector;
    function toNumberVector(array) {
        Object.defineProperty(array, 'as3Type', {
            get: function () {
                return 'Vector<number>';
            },
            set: function (value) {
                __trace('as3Type should not be set.', 'warn');
            }
        });
        return array;
    }
    Display.toNumberVector = toNumberVector;
})(Display || (Display = {}));
var Display;
(function (Display) {
    var ColorTransform = (function () {
        function ColorTransform(redMultiplier, greenMultiplier, blueMultiplier, alphaMultiplier, redOffset, greenOffset, blueOffset, alphaOffset) {
            if (redMultiplier === void 0) { redMultiplier = 1; }
            if (greenMultiplier === void 0) { greenMultiplier = 1; }
            if (blueMultiplier === void 0) { blueMultiplier = 1; }
            if (alphaMultiplier === void 0) { alphaMultiplier = 1; }
            if (redOffset === void 0) { redOffset = 0; }
            if (greenOffset === void 0) { greenOffset = 0; }
            if (blueOffset === void 0) { blueOffset = 0; }
            if (alphaOffset === void 0) { alphaOffset = 0; }
            this.redMultiplier = redMultiplier;
            this.greenMultiplier = greenMultiplier;
            this.blueMultiplier = blueMultiplier;
            this.alphaMultiplier = alphaMultiplier;
            this.redOffset = redOffset;
            this.greenOffset = greenOffset;
            this.blueOffset = blueOffset;
            this.alphaOffset = alphaOffset;
        }
        Object.defineProperty(ColorTransform.prototype, "color", {
            get: function () {
                return this.redOffset << 16 | this.greenOffset << 8 | this.blueOffset;
            },
            set: function (color) {
                this.redOffset = ((color >> 16) & 0xFF);
                this.greenOffset = ((color >> 8) & 0xFF);
                this.blueOffset = color & 0xFF;
                this.redMultiplier = 0;
                this.greenMultiplier = 0;
                this.blueMultiplier = 0;
            },
            enumerable: true,
            configurable: true
        });
        ColorTransform.prototype.concat = function (second) {
            this.redMultiplier *= second.redMultiplier;
            this.greenMultiplier *= second.greenMultiplier;
            this.blueMultiplier *= second.blueMultiplier;
            this.alphaMultiplier *= second.alphaMultiplier;
            this.redOffset += second.redOffset;
            this.greenOffset += second.greenOffset;
            this.blueOffset += second.blueOffset;
            this.alphaOffset += second.alphaOffset;
        };
        ColorTransform.prototype.serialize = function () {
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
        return ColorTransform;
    }());
    Display.ColorTransform = ColorTransform;
    function createColorTransform(redMultiplier, greenMultiplier, blueMultiplier, alphaMultiplier, redOffset, greenOffset, blueOffset, alphaOffset) {
        if (redMultiplier === void 0) { redMultiplier = 1; }
        if (greenMultiplier === void 0) { greenMultiplier = 1; }
        if (blueMultiplier === void 0) { blueMultiplier = 1; }
        if (alphaMultiplier === void 0) { alphaMultiplier = 1; }
        if (redOffset === void 0) { redOffset = 0; }
        if (greenOffset === void 0) { greenOffset = 0; }
        if (blueOffset === void 0) { blueOffset = 0; }
        if (alphaOffset === void 0) { alphaOffset = 0; }
        return new ColorTransform(redMultiplier, greenMultiplier, blueMultiplier, alphaMultiplier, redOffset, greenOffset, blueOffset, alphaOffset);
    }
    Display.createColorTransform = createColorTransform;
})(Display || (Display = {}));
var Display;
(function (Display) {
    var PerspectiveProjection = (function () {
        function PerspectiveProjection(t) {
            if (t === void 0) { t = null; }
            this.fieldOfView = 55;
            this.projectionCenter = new Display.Point(0, 0);
            this.focalLength = 0;
            if (t !== null) {
                this.projectionCenter = new Display.Point(t.width / 2, t.height / 2);
                this.fieldOfView = 55;
                this.focalLength = t.width / 2 / Math.tan(this.fieldOfView / 2);
            }
        }
        PerspectiveProjection.prototype.toMatrix3D = function () {
            return new Display.Matrix3D();
        };
        PerspectiveProjection.prototype.clone = function () {
            var proj = new PerspectiveProjection();
            proj.fieldOfView = this.fieldOfView;
            proj.projectionCenter = this.projectionCenter;
            proj.focalLength = this.focalLength;
            return proj;
        };
        return PerspectiveProjection;
    }());
    Display.PerspectiveProjection = PerspectiveProjection;
    var Transform = (function () {
        function Transform(parent) {
            this._matrix = new Display.Matrix();
            this._matrix3d = null;
            this._parent = parent;
            this._perspectiveProjection = new PerspectiveProjection(parent);
            this._colorTransform = new Display.ColorTransform();
        }
        Object.defineProperty(Transform.prototype, "parent", {
            get: function () {
                return this._parent;
            },
            set: function (p) {
                this._parent = p;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Transform.prototype, "perspectiveProjection", {
            get: function () {
                return this._perspectiveProjection;
            },
            set: function (projection) {
                this._perspectiveProjection = projection;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Transform.prototype, "matrix3D", {
            get: function () {
                return this._matrix3d;
            },
            set: function (m) {
                if (m === null) {
                    if (this._matrix3d === null) {
                        return;
                    }
                    this._matrix3d = null;
                    this._matrix = new Display.Matrix();
                }
                else {
                    this._matrix = null;
                    this._matrix3d = m;
                }
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Transform.prototype, "matrix", {
            get: function () {
                return this._matrix;
            },
            set: function (m) {
                if (m === null) {
                    if (this._matrix === null) {
                        return;
                    }
                    this._matrix = null;
                    this._matrix3d = new Display.Matrix3D();
                }
                else {
                    this._matrix3d = null;
                    this._matrix = m;
                }
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Transform.prototype.box3d = function (sX, sY, sZ, rotX, rotY, rotZ, tX, tY, tZ) {
            if (sX === void 0) { sX = 1; }
            if (sY === void 0) { sY = 1; }
            if (sZ === void 0) { sZ = 1; }
            if (rotX === void 0) { rotX = 0; }
            if (rotY === void 0) { rotY = 0; }
            if (rotZ === void 0) { rotZ = 0; }
            if (tX === void 0) { tX = 0; }
            if (tY === void 0) { tY = 0; }
            if (tZ === void 0) { tZ = 0; }
            if (this._matrix !== null || this._matrix3d === null) {
                this._matrix = null;
                this._matrix3d = new Display.Matrix3D();
            }
            this._matrix3d.identity();
            this._matrix3d.appendRotation(rotX, Display.Vector3D.X_AXIS);
            this._matrix3d.appendRotation(rotY, Display.Vector3D.Y_AXIS);
            this._matrix3d.appendRotation(rotZ, Display.Vector3D.Z_AXIS);
            this._matrix3d.appendScale(sX, sY, sZ);
            this._matrix3d.appendTranslation(tX, tY, tZ);
        };
        Transform.prototype.box = function (sX, sY, rot, tX, tY) {
            if (sX === void 0) { sX = 1; }
            if (sY === void 0) { sY = 1; }
            if (rot === void 0) { rot = 0; }
            if (tX === void 0) { tX = 0; }
            if (tY === void 0) { tY = 0; }
            if (this._matrix) {
                this._matrix.createBox(sX, sY, rot, tX, tY);
            }
            else {
                this.box3d(sX, sY, 1, 0, 0, rot, tX, tY, 0);
            }
        };
        Transform.prototype.update = function () {
            if (this._parent === null) {
                return;
            }
            this._parent.transform = this;
        };
        Transform.prototype.getRelativeMatrix3D = function (relativeTo) {
            __trace('Transform.getRelativeMatrix3D not implemented', 'warn');
            return new Display.Matrix3D();
        };
        Transform.prototype.getMatrix = function () {
            if (this._matrix) {
                return this._matrix;
            }
            else {
                return this._matrix3d;
            }
        };
        Transform.prototype.getMatrixType = function () {
            return this._matrix ? '2d' : '3d';
        };
        Transform.prototype.clone = function () {
            var t = new Transform(null);
            t._matrix = this._matrix;
            t._matrix3d = this._matrix3d;
            return t;
        };
        Transform.prototype.serialize = function () {
            return {
                'mode': this.getMatrixType(),
                'matrix': this.getMatrix().serialize()
            };
        };
        return Transform;
    }());
    Display.Transform = Transform;
})(Display || (Display = {}));
var Display;
(function (Display) {
    var Filter = (function () {
        function Filter() {
        }
        Filter.prototype.serialize = function () {
            return {
                'class': 'Filter',
                'type': 'nullfilter'
            };
        };
        return Filter;
    }());
    Display.Filter = Filter;
    var BlurFilter = (function (_super) {
        __extends(BlurFilter, _super);
        function BlurFilter(blurX, blurY) {
            if (blurX === void 0) { blurX = 4.0; }
            if (blurY === void 0) { blurY = 4.0; }
            var _this = _super.call(this) || this;
            _this._blurX = blurX;
            _this._blurY = blurY;
            return _this;
        }
        BlurFilter.prototype.serialize = function () {
            var s = _super.prototype.serialize.call(this);
            s['type'] = 'blur';
            s['params'] = {
                'blurX': this._blurX,
                'blurY': this._blurY
            };
            return s;
        };
        return BlurFilter;
    }(Filter));
    var GlowFilter = (function (_super) {
        __extends(GlowFilter, _super);
        function GlowFilter(color, alpha, blurX, blurY, strength, quality, inner, knockout) {
            if (color === void 0) { color = 16711680; }
            if (alpha === void 0) { alpha = 1.0; }
            if (blurX === void 0) { blurX = 6.0; }
            if (blurY === void 0) { blurY = 6.0; }
            if (strength === void 0) { strength = 2; }
            if (quality === void 0) { quality = null; }
            if (inner === void 0) { inner = false; }
            if (knockout === void 0) { knockout = false; }
            var _this = _super.call(this) || this;
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
        GlowFilter.prototype.serialize = function () {
            var s = _super.prototype.serialize.call(this);
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
    }(Filter));
    var DropShadowFilter = (function (_super) {
        __extends(DropShadowFilter, _super);
        function DropShadowFilter(distance, angle, color, alpha, blurX, blurY, strength, quality) {
            if (distance === void 0) { distance = 4.0; }
            if (angle === void 0) { angle = 45; }
            if (color === void 0) { color = 0; }
            if (alpha === void 0) { alpha = 1; }
            if (blurX === void 0) { blurX = 4.0; }
            if (blurY === void 0) { blurY = 4.0; }
            if (strength === void 0) { strength = 1.0; }
            if (quality === void 0) { quality = 1; }
            var _this = _super.call(this) || this;
            _this._color = color;
            _this._alpha = alpha;
            _this._blurX = blurX;
            _this._blurY = blurY;
            _this._strength = strength;
            _this._quality = quality;
            _this._inner = false;
            _this._knockout = false;
            _this._distance = distance;
            _this._angle = angle;
            return _this;
        }
        DropShadowFilter.prototype.serialize = function () {
            var s = _super.prototype.serialize.call(this);
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
    }(Filter));
    var ConvolutionFilter = (function (_super) {
        __extends(ConvolutionFilter, _super);
        function ConvolutionFilter(matrixX, matrixY, matrix, divisor, bias, preserveAlpha, clamp, color, alpha) {
            if (matrixX === void 0) { matrixX = 0; }
            if (matrixY === void 0) { matrixY = 0; }
            if (matrix === void 0) { matrix = null; }
            if (divisor === void 0) { divisor = 1.0; }
            if (bias === void 0) { bias = 0.0; }
            if (preserveAlpha === void 0) { preserveAlpha = true; }
            if (clamp === void 0) { clamp = true; }
            if (color === void 0) { color = 0; }
            if (alpha === void 0) { alpha = 0.0; }
            return _super.call(this) || this;
        }
        ;
        ConvolutionFilter.prototype.serialize = function () {
            var s = _super.prototype.serialize.call(this);
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
    }(Filter));
    function createDropShadowFilter(distance, angle, color, alpha, blurX, blurY, strength, quality) {
        if (distance === void 0) { distance = 4.0; }
        if (angle === void 0) { angle = 45; }
        if (color === void 0) { color = 0; }
        if (alpha === void 0) { alpha = 1; }
        if (blurX === void 0) { blurX = 4.0; }
        if (blurY === void 0) { blurY = 4.0; }
        if (strength === void 0) { strength = 1.0; }
        if (quality === void 0) { quality = 1; }
        return new DropShadowFilter(distance, angle, color, alpha, blurX, blurY, strength, quality);
    }
    Display.createDropShadowFilter = createDropShadowFilter;
    function createGlowFilter(color, alpha, blurX, blurY, strength, quality, inner, knockout) {
        if (color === void 0) { color = 16711680; }
        if (alpha === void 0) { alpha = 1.0; }
        if (blurX === void 0) { blurX = 6.0; }
        if (blurY === void 0) { blurY = 6.0; }
        if (strength === void 0) { strength = 2; }
        if (quality === void 0) { quality = null; }
        if (inner === void 0) { inner = false; }
        if (knockout === void 0) { knockout = false; }
        return new GlowFilter(color, alpha, blurX, blurY, strength, quality, inner, knockout);
    }
    Display.createGlowFilter = createGlowFilter;
    function createBlurFilter(blurX, blurY, strength) {
        if (blurX === void 0) { blurX = 6.0; }
        if (blurY === void 0) { blurY = 6.0; }
        if (strength === void 0) { strength = 2; }
        return new BlurFilter(blurX, blurY);
    }
    Display.createBlurFilter = createBlurFilter;
    function createBevelFilter() {
        throw new Error('Display.createBevelFilter not implemented');
    }
    Display.createBevelFilter = createBevelFilter;
    function createConvolutionFilter(matrixX, matrixY, matrix, divisor, bias, preserveAlpha, clamp, color, alpha) {
        if (matrixX === void 0) { matrixX = 0; }
        if (matrixY === void 0) { matrixY = 0; }
        if (matrix === void 0) { matrix = null; }
        if (divisor === void 0) { divisor = 1.0; }
        if (bias === void 0) { bias = 0.0; }
        if (preserveAlpha === void 0) { preserveAlpha = true; }
        if (clamp === void 0) { clamp = true; }
        if (color === void 0) { color = 0; }
        if (alpha === void 0) { alpha = 0.0; }
        return new ConvolutionFilter(matrixX, matrixY, matrix, divisor, bias, preserveAlpha, clamp, color, alpha);
    }
    Display.createConvolutionFilter = createConvolutionFilter;
    function createDisplacementMapFilter() {
        throw new Error('Display.createDisplacementMapFilter not implemented');
    }
    Display.createDisplacementMapFilter = createDisplacementMapFilter;
    function createGradientBevelFilter() {
        throw new Error('Display.createGradientBevelFilter not implemented');
    }
    Display.createGradientBevelFilter = createGradientBevelFilter;
    function createGradientGlowFilter() {
        throw new Error('Display.createGradientGlowFilter not implemented');
    }
    Display.createGradientGlowFilter = createGradientGlowFilter;
    function createColorMatrixFilter() {
        throw new Error('Display.createColorMatrixFilter not implemented');
    }
    Display.createColorMatrixFilter = createColorMatrixFilter;
})(Display || (Display = {}));
var Display;
(function (Display) {
    var BlendMode = (function () {
        function BlendMode() {
        }
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
        return BlendMode;
    }());
    Display.BlendMode = BlendMode;
    var Rectangle = (function () {
        function Rectangle(x, y, width, height) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            this._x = x;
            this._y = y;
            this._width = width;
            this._height = height;
        }
        Object.defineProperty(Rectangle.prototype, "x", {
            get: function () {
                return this._x;
            },
            set: function (v) {
                if (v !== null) {
                    this._x = v;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "y", {
            get: function () {
                return this._y;
            },
            set: function (v) {
                if (v !== null) {
                    this._y = v;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "width", {
            get: function () {
                return this._width;
            },
            set: function (v) {
                if (v !== null) {
                    this._width = v;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "height", {
            get: function () {
                return this._height;
            },
            set: function (v) {
                if (v !== null) {
                    this._height = v;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "left", {
            get: function () {
                return this._x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "right", {
            get: function () {
                return this._x + this._width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "top", {
            get: function () {
                return this._y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "bottom", {
            get: function () {
                return this._y + this._height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "size", {
            get: function () {
                return Display.createPoint(this._width, this._height);
            },
            enumerable: true,
            configurable: true
        });
        Rectangle.prototype.contains = function (x, y) {
            return x >= this.left &&
                y >= this.top &&
                x <= this.right &&
                y <= this.bottom;
        };
        Rectangle.prototype.containsPoint = function (p) {
            return this.contains(p.x, p.y);
        };
        Rectangle.prototype.containsRect = function (r) {
            return this.contains(r.left, r.top) && this.contains(r.right, r.bottom);
        };
        Rectangle.prototype.copyFrom = function (source) {
            this._x = source._x;
            this._y = source._y;
            this._width = source._width;
            this._height = source._height;
        };
        Rectangle.prototype.equals = function (other) {
            return this._x === other._x &&
                this._y === other._y &&
                this._width === other._width &&
                this._height === other._height;
        };
        Rectangle.prototype.inflate = function (dx, dy) {
            if (dx === void 0) { dx = 0; }
            if (dy === void 0) { dy = 0; }
            this._x -= dx;
            this._width += 2 * dx;
            this._y -= dy;
            this._height += 2 * dy;
        };
        Rectangle.prototype.inflatePoint = function (p) {
            this.inflate(p.x, p.y);
        };
        Rectangle.prototype.isEmpty = function () {
            return this._width <= 0 || this.height <= 0;
        };
        Rectangle.prototype.setTo = function (x, y, width, height) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            this._x = x;
            this._y = y;
            this._width = width;
            this._height = height;
        };
        Rectangle.prototype.offset = function (x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this._x += x;
            this._y += y;
        };
        Rectangle.prototype.offsetPoint = function (p) {
            this.offset(p.x, p.y);
        };
        Rectangle.prototype.setEmpty = function () {
            this.setTo(0, 0, 0, 0);
        };
        Rectangle.prototype.unionCoord = function (x, y) {
            var dx = x - this._x;
            var dy = y - this._y;
            if (dx >= 0) {
                this._width = Math.max(this._width, dx);
            }
            else {
                this._x += dx;
                this._width -= dx;
            }
            if (dy >= 0) {
                this._height = Math.max(this._height, dy);
            }
            else {
                this._y += dy;
                this._height -= dy;
            }
        };
        Rectangle.prototype.unionPoint = function (p) {
            this.unionCoord(p.x, p.y);
        };
        Rectangle.prototype.union = function (r) {
            var n = this.clone();
            n.unionCoord(r.left, r.top);
            n.unionCoord(r.right, r.bottom);
            return n;
        };
        Rectangle.prototype.toString = function () {
            return "(x=" + this._x + ", y=" + this._y + ", width=" + this._width +
                ", height=" + this._height + ")";
        };
        Rectangle.prototype.clone = function () {
            return new Rectangle(this._x, this._y, this._width, this._height);
        };
        Rectangle.prototype.serialize = function () {
            return {
                x: this._x,
                y: this._y,
                width: this._width,
                height: this._height
            };
        };
        return Rectangle;
    }());
    Display.Rectangle = Rectangle;
    var DisplayObject = (function () {
        function DisplayObject(id) {
            if (id === void 0) { id = Runtime.generateId(); }
            this._alpha = 1;
            this._anchor = new Display.Point();
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
            this._transform = new Display.Transform(this);
            this._hasSetDefaults = false;
            this._id = id;
            this._visible = true;
        }
        DisplayObject.prototype.setDefaults = function (defaults) {
            if (defaults === void 0) { defaults = {}; }
            if (this._hasSetDefaults) {
                __trace("DisplayObject.setDefaults called more than once.", "warn");
                return;
            }
            this._hasSetDefaults = true;
            try {
                if (defaults.hasOwnProperty("motion")) {
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
                }
                else if (defaults.hasOwnProperty("motionGroup") &&
                    defaults["motionGroup"] && defaults["motionGroup"].length > 0) {
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
            }
            catch (e) {
            }
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
        DisplayObject.prototype.eventToggle = function (eventName, mode) {
            if (mode === void 0) { mode = "enable"; }
            if (DisplayObject.SANDBOX_EVENTS.indexOf(eventName) > -1) {
                return;
            }
            __pchannel("Runtime:ManageEvent", {
                "id": this._id,
                "name": eventName,
                "mode": mode
            });
        };
        DisplayObject.prototype.propertyUpdate = function (propertyName, updatedValue) {
            __pchannel("Runtime:UpdateProperty", {
                "id": this._id,
                "name": propertyName,
                "value": updatedValue
            });
        };
        DisplayObject.prototype.methodCall = function (methodName, params) {
            __pchannel("Runtime:CallMethod", {
                "id": this._id,
                "method": methodName,
                "params": params
            });
        };
        Object.defineProperty(DisplayObject.prototype, "alpha", {
            get: function () {
                return this._alpha;
            },
            set: function (value) {
                this._alpha = value;
                this.propertyUpdate("alpha", value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "anchor", {
            get: function () {
                return this._anchor;
            },
            set: function (p) {
                this._anchor = p;
                this.propertyUpdate("x", p.x);
                this.propertyUpdate("y", p.y);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "boundingBox", {
            get: function () {
                return this._boundingBox;
            },
            set: function (r) {
                this._boundingBox = r;
                this.propertyUpdate("boundingBox", r.serialize());
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "cacheAsBitmap", {
            get: function () {
                return false;
            },
            set: function (value) {
                __trace("DisplayObject.cacheAsBitmap is not supported", "warn");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "filters", {
            get: function () {
                return this._filters;
            },
            set: function (filters) {
                this._filters = filters ? filters : [];
                var serializedFilters = [];
                for (var i = 0; i < this._filters.length; i++) {
                    if (!this.filters[i]) {
                        continue;
                    }
                    serializedFilters.push(this._filters[i].serialize());
                }
                this.propertyUpdate("filters", serializedFilters);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "root", {
            get: function () {
                return Display.root;
            },
            set: function (s) {
                __trace("DisplayObject.root is read-only.", "warn");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "stage", {
            get: function () {
                return Display.root;
            },
            set: function (s) {
                __trace("DisplayObject.stage is read-only.", "warn");
            },
            enumerable: true,
            configurable: true
        });
        DisplayObject.prototype._updateBox = function (mode) {
            if (mode === void 0) { mode = this._transform.getMatrixType(); }
            if (mode === "3d") {
                this._transform.box3d(this._scaleX, this._scaleY, this._scaleZ, this._rotationX, this._rotationY, this._rotationZ, 0, 0, this._z);
            }
            else {
                this._transform.box(this._scaleX, this._scaleY, this._rotationZ * Math.PI / 180);
            }
            this.transform = this._transform;
        };
        Object.defineProperty(DisplayObject.prototype, "rotationX", {
            get: function () {
                return this._rotationX;
            },
            set: function (x) {
                this._rotationX = x;
                this._updateBox("3d");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "rotationY", {
            get: function () {
                return this._rotationY;
            },
            set: function (y) {
                this._rotationY = y;
                this._updateBox("3d");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "rotationZ", {
            get: function () {
                return this._rotationZ;
            },
            set: function (z) {
                this._rotationZ = z;
                this._updateBox();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "rotation", {
            get: function () {
                return this._rotationZ;
            },
            set: function (r) {
                this._rotationZ = r;
                this._updateBox();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "scaleX", {
            get: function () {
                return this._scaleX;
            },
            set: function (val) {
                this._scaleX = val;
                this._updateBox();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "scaleY", {
            get: function () {
                return this._scaleY;
            },
            set: function (val) {
                this._scaleY = val;
                this._updateBox();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "scaleZ", {
            get: function () {
                return this._scaleZ;
            },
            set: function (val) {
                this._scaleZ = val;
                this._updateBox("3d");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "x", {
            get: function () {
                return this._anchor.x;
            },
            set: function (val) {
                this._anchor.x = val;
                this.propertyUpdate("x", val);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "y", {
            get: function () {
                return this._anchor.y;
            },
            set: function (val) {
                this._anchor.y = val;
                this.propertyUpdate("y", val);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "z", {
            get: function () {
                return this._z;
            },
            set: function (val) {
                this._z = val;
                this._updateBox("3d");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "width", {
            get: function () {
                return this._boundingBox.width;
            },
            set: function (w) {
                this._boundingBox.width = w;
                this.propertyUpdate('width', w);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "height", {
            get: function () {
                return this._boundingBox.height;
            },
            set: function (h) {
                this._boundingBox.height = h;
                this.propertyUpdate('height', h);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "visible", {
            get: function () {
                return this._visible;
            },
            set: function (visible) {
                this._visible = visible;
                this.propertyUpdate('visible', visible);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "blendMode", {
            get: function () {
                return this._blendMode;
            },
            set: function (blendMode) {
                this._blendMode = blendMode;
                this.propertyUpdate('blendMode', blendMode);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "transform", {
            get: function () {
                return this._transform;
            },
            set: function (t) {
                this._transform = t;
                if (this._transform.parent !== this) {
                    this._transform.parent = this;
                }
                this.propertyUpdate('transform', this._transform.serialize());
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "name", {
            get: function () {
                return this._name;
            },
            set: function (name) {
                this._name = name;
                this.propertyUpdate('name', name);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "loaderInfo", {
            get: function () {
                __trace("DisplayObject.loaderInfo is not supported", "warn");
                return {};
            },
            set: function (name) {
                __trace("DisplayObject.loaderInfo is read-only", "warn");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "parent", {
            get: function () {
                return this._parent !== null ? this._parent : Display.root;
            },
            set: function (p) {
                __trace("DisplayObject.parent is read-only", "warn");
            },
            enumerable: true,
            configurable: true
        });
        DisplayObject.prototype.dispatchEvent = function (event, data) {
            if (this._listeners.hasOwnProperty(event)) {
                if (this._listeners[event] !== null) {
                    for (var i = 0; i < this._listeners[event].length; i++) {
                        try {
                            this._listeners[event][i](data);
                        }
                        catch (e) {
                            if (e.hasOwnProperty('stack')) {
                                __trace(e.stack.toString(), 'err');
                            }
                            else {
                                __trace(e.toString(), 'err');
                            }
                        }
                    }
                }
            }
        };
        DisplayObject.prototype.addEventListener = function (event, listener) {
            if (!this._listeners.hasOwnProperty(event)) {
                this._listeners[event] = [];
            }
            this._listeners[event].push(listener);
            if (this._listeners[event].length === 1) {
                this.eventToggle(event, 'enable');
            }
        };
        DisplayObject.prototype.removeEventListener = function (event, listener) {
            if (!this._listeners.hasOwnProperty(event) ||
                this._listeners[event].length === 0) {
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
        Object.defineProperty(DisplayObject.prototype, "numChildren", {
            get: function () {
                return this._children.length;
            },
            enumerable: true,
            configurable: true
        });
        DisplayObject.prototype.addChild = function (o) {
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
        DisplayObject.prototype.removeChild = function (o) {
            var index = this._children.indexOf(o);
            if (index >= 0) {
                this.removeChildAt(index);
            }
        };
        DisplayObject.prototype.getChildAt = function (index) {
            if (index < 0 || index > this._children.length) {
                throw new RangeError('No child at index ' + index);
            }
            return this._children[index];
        };
        DisplayObject.prototype.getChildIndex = function (o) {
            return this._children.indexOf(o);
        };
        DisplayObject.prototype.removeChildAt = function (index) {
            var o = this.getChildAt(index);
            this._children.splice(index, 1);
            o._parent = null;
            this.methodCall('removeChild', o._id);
        };
        DisplayObject.prototype.removeChildren = function (begin, end) {
            if (end === void 0) { end = this._children.length; }
            var removed = this._children.splice(begin, end - begin);
            var ids = [];
            for (var i = 0; i < removed.length; i++) {
                removed[i]._parent = null;
                ids.push(removed[i]._id);
            }
            this.methodCall('removeChildren', ids);
        };
        DisplayObject.prototype.contains = function (child) {
            if (child === this) {
                return true;
            }
            if (this._children.indexOf(child) >= 0) {
                return true;
            }
            for (var i = 0; i < this._children.length; i++) {
                if (this._children[i].contains(child)) {
                    return true;
                }
            }
            return false;
        };
        DisplayObject.prototype.remove = function () {
            if (this._parent !== null) {
                this._parent.removeChild(this);
            }
            else {
                this.root.removeChild(this);
            }
        };
        DisplayObject.prototype.toString = function () {
            return '[' + (this._name.length > 0 ? this._name : 'displayObject') +
                ' DisplayObject]@' + this._id;
        };
        DisplayObject.prototype.clone = function () {
            var alternate = new DisplayObject();
            alternate._transform = this._transform.clone();
            alternate._transform.parent = alternate;
            alternate._boundingBox = this._boundingBox.clone();
            alternate._anchor = this._anchor.clone();
            alternate._alpha = this._alpha;
            return alternate;
        };
        DisplayObject.prototype.hasOwnProperty = function (prop) {
            if (prop === 'clone') {
                return true;
            }
            else {
                return Object.prototype.hasOwnProperty.call(this, prop);
            }
        };
        DisplayObject.prototype.serialize = function () {
            this._hasSetDefaults = true;
            var filters = [];
            for (var i = 0; i < this._filters.length; i++) {
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
        DisplayObject.prototype.unload = function () {
            this._visible = false;
            this.remove();
            this.methodCall('unload', null);
        };
        DisplayObject.prototype.getId = function () {
            return this._id;
        };
        DisplayObject.SANDBOX_EVENTS = ["enterFrame"];
        return DisplayObject;
    }());
    Display.DisplayObject = DisplayObject;
})(Display || (Display = {}));
var Display;
(function (Display) {
    var Graphics = (function () {
        function Graphics(parent) {
            this._lineWidth = 1;
            if (typeof parent === 'undefined' || parent === null) {
                throw new Error('Cannot initialize a display not bound to an element.');
            }
            this._parent = parent;
        }
        Graphics.prototype._evaluateBoundingBox = function (x, y) {
            this._parent.boundingBox.unionCoord(x + this._lineWidth / 2, y + this._lineWidth / 2);
        };
        Graphics.prototype._callDrawMethod = function (method, params) {
            __pchannel('Runtime:CallMethod', {
                'id': this._parent.getId(),
                'context': 'graphics',
                'method': method,
                'params': params
            });
        };
        Graphics.prototype.lineTo = function (x, y) {
            this._evaluateBoundingBox(x, y);
            this._callDrawMethod('lineTo', [x, y]);
        };
        Graphics.prototype.moveTo = function (x, y) {
            this._evaluateBoundingBox(x, y);
            this._callDrawMethod('moveTo', [x, y]);
        };
        Graphics.prototype.curveTo = function (cx, cy, ax, ay) {
            this._evaluateBoundingBox(ax, ay);
            this._evaluateBoundingBox(cx, cy);
            this._callDrawMethod('curveTo', [cx, cy, ax, ay]);
        };
        Graphics.prototype.cubicCurveTo = function (cax, cay, cbx, cby, ax, ay) {
            this._evaluateBoundingBox(cax, cay);
            this._evaluateBoundingBox(cbx, cby);
            this._evaluateBoundingBox(ax, ay);
            this._callDrawMethod('cubicCurveTo', [cax, cay, cbx, cby, ax, ay]);
        };
        Graphics.prototype.lineStyle = function (thickness, color, alpha, hinting, scale, caps, joints, miter) {
            if (color === void 0) { color = 0; }
            if (alpha === void 0) { alpha = 1.0; }
            if (hinting === void 0) { hinting = false; }
            if (scale === void 0) { scale = 'normal'; }
            if (caps === void 0) { caps = 'none'; }
            if (joints === void 0) { joints = 'round'; }
            if (miter === void 0) { miter = 3; }
            this._lineWidth = thickness;
            this._callDrawMethod('lineStyle', [thickness, color, alpha, caps, joints, miter]);
        };
        Graphics.prototype.drawRect = function (x, y, w, h) {
            this._evaluateBoundingBox(x, y);
            this._evaluateBoundingBox(x + w, y + h);
            this._callDrawMethod('drawRect', [x, y, w, h]);
        };
        Graphics.prototype.drawCircle = function (x, y, r) {
            this._evaluateBoundingBox(x - r, y - r);
            this._evaluateBoundingBox(x + r, y + r);
            this._callDrawMethod('drawCircle', [x, y, r]);
        };
        Graphics.prototype.drawEllipse = function (cx, cy, w, h) {
            this._evaluateBoundingBox(cx - w / 2, cy - h / 2);
            this._evaluateBoundingBox(cx + w / 2, cy + h / 2);
            this._callDrawMethod('drawEllipse', [cx + w / 2, cy + h / 2, w / 2, h / 2]);
        };
        Graphics.prototype.drawRoundRect = function (x, y, w, h, elw, elh) {
            this._evaluateBoundingBox(x, y);
            this._evaluateBoundingBox(x + w, y + h);
            this._callDrawMethod('drawRoundRect', [x, y, w, h, elw, elh]);
        };
        Graphics.prototype.drawPath = function (commands, data, winding) {
            if (winding === void 0) { winding = "evenOdd"; }
            this._callDrawMethod('drawPath', [commands, data, winding]);
        };
        Graphics.prototype.beginFill = function (color, alpha) {
            if (alpha === void 0) { alpha = 1.0; }
            this._callDrawMethod('beginFill', [color, alpha]);
        };
        Graphics.prototype.beginGradientFill = function (fillType, colors, alphas, ratios, matrix, spreadMethod, interpolationMethod, focalPointRatio) {
            if (matrix === void 0) { matrix = null; }
            if (spreadMethod === void 0) { spreadMethod = 'pad'; }
            if (interpolationMethod === void 0) { interpolationMethod = 'rgb'; }
            if (focalPointRatio === void 0) { focalPointRatio = 0; }
            __trace('Graphics.beginGradientFill still needs work.', 'warn');
            if (fillType !== 'linear' && fillType !== 'radial') {
                __trace('Graphics.beginGradientFill unsupported fill type : ' +
                    fillType, 'warn');
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
        Graphics.prototype.beginShaderFill = function (shader, matrix) {
            __trace('Graphics.beginShaderFill not supported.', 'warn');
        };
        Graphics.prototype.endFill = function () {
            this._callDrawMethod('endFill', []);
        };
        Graphics.prototype.drawTriangles = function (verts, indices, uvtData, culling) {
            if (indices === void 0) { indices = null; }
            if (uvtData === void 0) { uvtData = null; }
            if (culling === void 0) { culling = 'none'; }
            if (indices === null) {
                indices = [];
                for (var i = 0; i < verts.length; i += 2) {
                    indices.push(i / 2);
                }
            }
            else {
                indices = indices.slice(0);
            }
            if (indices.length % 3 !== 0) {
                __trace('Graphics.drawTriangles malformed indices count. ' +
                    'Must be multiple of 3.', 'err');
                return;
            }
            if (culling !== 'none') {
                for (var i = 0; i < indices.length / 3; i++) {
                    var ux = verts[2 * indices[i * 3 + 1]] - verts[2 * indices[i * 3]], uy = verts[2 * indices[i * 3 + 1] + 1] - verts[2 * indices[i * 3] + 1], vx = verts[2 * indices[i * 3 + 2]] - verts[2 * indices[i * 3 + 1]], vy = verts[2 * indices[i * 3 + 2] + 1] - verts[2 * indices[i * 3 + 1] + 1];
                    var zcomp = ux * vy - vx * uy;
                    if (zcomp < 0 && culling === 'positive' ||
                        zcomp > 0 && culling === 'negative') {
                        indices.splice(i * 3, 3);
                        i--;
                    }
                }
            }
            for (var i = 0; i < indices.length; i++) {
                this._evaluateBoundingBox(verts[2 * indices[i]], verts[2 * indices[i] + 1]);
            }
            this._callDrawMethod('drawTriangles', [verts, indices, culling]);
        };
        Graphics.prototype.clear = function () {
            this._parent.boundingBox.setEmpty();
            this._callDrawMethod('clear', []);
        };
        return Graphics;
    }());
    Display.Graphics = Graphics;
})(Display || (Display = {}));
var Display;
(function (Display) {
    var Sprite = (function (_super) {
        __extends(Sprite, _super);
        function Sprite(id) {
            var _this = _super.call(this, id) || this;
            _this._mouseEnabled = true;
            _this._mousePosition = new Display.Point(0, 0);
            _this._useHandCursor = false;
            _this._graphics = new Display.Graphics(_this);
            return _this;
        }
        Object.defineProperty(Sprite.prototype, "graphics", {
            get: function () {
                return this._graphics;
            },
            set: function (g) {
                __trace('Sprite.graphics is read-only.', 'warn');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite.prototype, "mouseEnabled", {
            get: function () {
                return this._mouseEnabled;
            },
            set: function (enabled) {
                this._mouseEnabled = enabled;
                this.propertyUpdate('mouseEnabled', enabled);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite.prototype, "useHandCursor", {
            get: function () {
                return this._useHandCursor;
            },
            set: function (use) {
                this._useHandCursor = use;
                this.propertyUpdate('useHandCursor', use);
            },
            enumerable: true,
            configurable: true
        });
        Sprite.prototype.serialize = function () {
            var serialized = _super.prototype.serialize.call(this);
            serialized['class'] = 'Sprite';
            return serialized;
        };
        return Sprite;
    }(Display.DisplayObject));
    Display.Sprite = Sprite;
    var RootSprite = (function (_super) {
        __extends(RootSprite, _super);
        function RootSprite() {
            return _super.call(this, '__root') || this;
        }
        Object.defineProperty(RootSprite.prototype, "parent", {
            get: function () {
                __trace('SecurityError: No access above root sprite.', 'err');
                return null;
            },
            enumerable: true,
            configurable: true
        });
        return RootSprite;
    }(Sprite));
    Display.RootSprite = RootSprite;
    var UIComponent = (function (_super) {
        __extends(UIComponent, _super);
        function UIComponent(id) {
            var _this = _super.call(this, id) || this;
            _this._styles = {};
            return _this;
        }
        UIComponent.prototype.clearStyle = function (style) {
            delete this._styles[style];
        };
        UIComponent.prototype.getStyle = function (style) {
            return this._styles[style];
        };
        UIComponent.prototype.setStyle = function (styleProp, value) {
            __trace("UIComponent.setStyle not implemented", "warn");
            this._styles[styleProp] = value;
        };
        UIComponent.prototype.setFocus = function () {
            this.methodCall("setFocus", null);
        };
        UIComponent.prototype.setSize = function (width, height) {
            this.width = width;
            this.height = height;
        };
        UIComponent.prototype.move = function (x, y) {
            this.x = x;
            this.y = y;
        };
        return UIComponent;
    }(Sprite));
    Display.UIComponent = UIComponent;
})(Display || (Display = {}));
var Display;
(function (Display) {
    var DirtyArea = (function () {
        function DirtyArea() {
            this._xBegin = null;
            this._yBegin = null;
            this._xEnd = null;
            this._yEnd = null;
        }
        DirtyArea.prototype.expand = function (x, y) {
            this._xBegin = this._xBegin === null ? x : Math.min(this._xBegin, x);
            this._xEnd = this._xEnd === null ? x : Math.max(this._xEnd, x);
            this._yBegin = this._yBegin === null ? y : Math.min(this._yBegin, y);
            this._yEnd = this._xEnd === null ? y : Math.max(this._yEnd, y);
        };
        DirtyArea.prototype.asRect = function () {
            if (this.isEmpty()) {
                return new Display.Rectangle(0, 0, 0, 0);
            }
            return new Display.Rectangle(this._xBegin, this._yBegin, this._xEnd - this._xBegin, this._yEnd - this._yBegin);
        };
        DirtyArea.prototype.isEmpty = function () {
            return this._xBegin === null || this._yBegin === null ||
                this._xEnd === null || this._yEnd === null;
        };
        DirtyArea.prototype.reset = function () {
            this._xBegin = null;
            this._xEnd = null;
            this._yBegin = null;
            this._yEnd = null;
        };
        return DirtyArea;
    }());
    var Bitmap = (function (_super) {
        __extends(Bitmap, _super);
        function Bitmap() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Bitmap;
    }(Display.DisplayObject));
    Display.Bitmap = Bitmap;
    var ByteArray = (function (_super) {
        __extends(ByteArray, _super);
        function ByteArray() {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            var _this = _super.apply(this, params) || this;
            _this._readPosition = 0;
            return _this;
        }
        Object.defineProperty(ByteArray.prototype, "bytesAvailable", {
            get: function () {
                return this.length - this._readPosition;
            },
            set: function (n) {
                __trace('ByteArray.bytesAvailable is read-only', 'warn');
            },
            enumerable: true,
            configurable: true
        });
        ByteArray.prototype.clear = function () {
            this.length = 0;
            this._readPosition = 0;
        };
        ByteArray.prototype.compress = function (algorithm) {
            if (algorithm === void 0) { algorithm = 'zlib'; }
            __trace('ByteArray.compress not implemented', 'warn');
        };
        ByteArray.prototype.uncompress = function (algorithm) {
            if (algorithm === void 0) { algorithm = 'zlib'; }
            __trace('ByteArray.uncompress not implemented', 'warn');
        };
        ByteArray.prototype.deflate = function () {
            __trace('ByteArray.deflate not implemented', 'warn');
        };
        ByteArray.prototype.inflate = function () {
            __trace('ByteArray.inflate not implemented', 'warn');
        };
        ByteArray.prototype.readUTFBytes = function (length) {
            var subArray = this.slice(this._readPosition, length);
            this._readPosition += Math.min(length, this.length - this._readPosition);
            var str = '';
            subArray.forEach(function (cc) {
                str += String.fromCharCode(cc);
            });
            return str;
        };
        ByteArray.prototype.writeUTFBytes = function (value) {
            for (var i = 0; i < value.length; i++) {
                Array.prototype.push.apply(this, [value.charCodeAt(i)]);
            }
        };
        return ByteArray;
    }(Array));
    Display.ByteArray = ByteArray;
    var BitmapData = (function () {
        function BitmapData(width, height, transparent, fillColor, id) {
            if (transparent === void 0) { transparent = true; }
            if (fillColor === void 0) { fillColor = 0xffffffff; }
            if (id === void 0) { id = Runtime.generateId(); }
            this._locked = false;
            this._id = id;
            this._rect = new Display.Rectangle(0, 0, width, height);
            this._transparent = transparent;
            this._fillColor = fillColor;
            this._fill();
        }
        BitmapData.prototype._fill = function () {
            this._byteArray = [];
            for (var i = 0; i < this._rect.width * this._rect.height; i++) {
                this._byteArray.push(this._fillColor);
            }
        };
        BitmapData.prototype._updateBox = function (changeRect) {
            if (changeRect === void 0) { changeRect = null; }
            if (this._dirtyArea.isEmpty()) {
                return;
            }
            if (this._locked) {
                return;
            }
            var change = changeRect === null ? this._dirtyArea.asRect() :
                changeRect;
            if (!this._rect.containsRect(change)) {
                __trace('BitmapData._updateBox box ' + change.toString() +
                    ' out of bonunds ' + this._rect.toString(), 'err');
                throw new Error('Rectangle provided was not within image bounds.');
            }
            var region = [];
            for (var i = 0; i < change.height; i++) {
                for (var j = 0; j < change.width; j++) {
                    region.push(this._byteArray[(change.y + i) * this._rect.width +
                        change.x + j]);
                }
            }
            this._call('updateBox', {
                'box': change.serialize(),
                'values': region
            });
        };
        BitmapData.prototype._call = function (method, args) {
            __pchannel('Runtime:CallMethod', {
                'id': this.getId(),
                'name': name,
                'value': args,
            });
        };
        Object.defineProperty(BitmapData.prototype, "height", {
            get: function () {
                return this._rect.height;
            },
            set: function (height) {
                __trace('BitmapData.height is read-only', 'warn');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BitmapData.prototype, "width", {
            get: function () {
                return this._rect.width;
            },
            set: function (width) {
                __trace('BitmapData.height is read-only', 'warn');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BitmapData.prototype, "rect", {
            get: function () {
                return this._rect;
            },
            set: function (rect) {
                __trace('BitmapData.rect is read-only', 'warn');
            },
            enumerable: true,
            configurable: true
        });
        BitmapData.prototype.getPixel = function (x, y) {
            return this.getPixel32(x, y) & 0x00ffffff;
        };
        BitmapData.prototype.getPixel32 = function (x, y) {
            if (x >= this._rect.width || y >= this._rect.height ||
                x < 0 || y < 0) {
                throw new Error('Coordinates out of bounds');
            }
            try {
                return this._transparent ? this._byteArray[y * this._rect.width + x] :
                    this._byteArray[y * this._rect.width + x] + 0xff000000;
            }
            catch (e) {
                return this._fillColor;
            }
        };
        BitmapData.prototype.getPixels = function (rect) {
            if (typeof rect === 'undefined' || rect === null) {
                throw new Error('Expected a region to acquire pixels.');
            }
            if (rect.width === 0 || rect.height === 0) {
                return new ByteArray();
            }
            var region = new ByteArray();
            for (var i = 0; i < rect.height; i++) {
                Array.prototype.push.apply(region, this._byteArray.slice((rect.y + i) * this._rect.width + rect.x, (rect.y + i) * this._rect.width + rect.x + rect.width));
            }
            return region;
        };
        BitmapData.prototype.setPixel = function (x, y, color) {
            this.setPixel32(x, y, color);
        };
        BitmapData.prototype.setPixel32 = function (x, y, color) {
            if (!this._transparent) {
                color = color & 0x00ffffff;
            }
            else {
                color = color & 0xffffffff;
            }
            this._byteArray[y * this._rect.width + x] = color;
            this._dirtyArea.expand(x, y);
        };
        BitmapData.prototype.setPixels = function (rect, input) {
            if (rect.width === 0 || rect.height === 0) {
                return;
            }
            if (input.length !== rect.width * rect.height) {
                throw new Error('setPixels expected ' + (rect.width * rect.height) +
                    ' pixels, but actually got ' + input.length);
            }
            for (var i = 0; i < rect.width; i++) {
                for (var j = 0; j < rect.height; j++) {
                    this._byteArray[(rect.y + j) * this.width + (rect.x + i)] =
                        input[j * rect.width + i];
                    this._dirtyArea.expand(i, j);
                }
            }
        };
        BitmapData.prototype.lock = function () {
            this._locked = true;
        };
        BitmapData.prototype.unlock = function (changeRect) {
            if (changeRect === void 0) { changeRect = null; }
            this._locked = false;
            if (changeRect == null) {
                this._updateBox();
            }
            else {
                this._updateBox(changeRect);
            }
        };
        BitmapData.prototype.getId = function () {
            return this._id;
        };
        BitmapData.prototype.serialize = function () {
            return {
                'class': 'BitmapData'
            };
        };
        return BitmapData;
    }());
    Display.BitmapData = BitmapData;
})(Display || (Display = {}));
var Display;
(function (Display) {
    var MotionManager = (function () {
        function MotionManager(o, dur, independentTimer) {
            if (dur === void 0) { dur = 1000; }
            if (independentTimer === void 0) { independentTimer = false; }
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
                this._timer.addEventListener('timer', function () {
                    self._onTimerEvent();
                });
                this._timer.start();
            }
            else {
                this._parent.addEventListener('enterFrame', function () {
                    self._onTimerEvent();
                });
            }
        }
        Object.defineProperty(MotionManager.prototype, "dur", {
            get: function () {
                return this._dur;
            },
            set: function (dur) {
                this._timeKeeper.reset();
                this._ttl = dur;
                this._dur = dur;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MotionManager.prototype, "running", {
            get: function () {
                return this._isRunning;
            },
            enumerable: true,
            configurable: true
        });
        MotionManager.prototype._onTimerEvent = function () {
            if (!this._isRunning) {
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
        MotionManager.prototype.reset = function () {
            this._ttl = this._dur;
            this._timeKeeper.reset();
        };
        MotionManager.prototype.play = function () {
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
        MotionManager.prototype.stop = function () {
            if (!this._isRunning) {
                return;
            }
            this._isRunning = false;
            this._timeKeeper.reset();
            if (this._tween) {
                this._tween.stop();
            }
        };
        MotionManager.prototype.forecasting = function (time) {
            __trace('MotionManager.forecasting always returns false', 'warn');
            return false;
        };
        MotionManager.prototype.setPlayTime = function (playtime) {
            this._ttl = this._dur - playtime;
            if (this._tween) {
                if (this._isRunning) {
                    this._tween.gotoAndPlay(playtime);
                }
                else {
                    this._tween.gotoAndStop(playtime);
                }
            }
        };
        MotionManager.prototype.motionSetToTween = function (motion) {
            var tweens = [];
            for (var movingVars in motion) {
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
                }
                else {
                    tweens.push(Tween.tween(this._parent, dst, src, mProp["lifeTime"], mProp["easing"]));
                }
            }
            return Tween.parallel.apply(Tween, tweens);
        };
        MotionManager.prototype.initTween = function (motion, repeat) {
            this._tween = this.motionSetToTween(motion);
        };
        MotionManager.prototype.initTweenGroup = function (motionGroup, lifeTime) {
            var tweens = [];
            for (var i = 0; i < motionGroup.length; i++) {
                tweens.push(this.motionSetToTween(motionGroup[i]));
            }
            this._tween = Tween.serial.apply(Tween, tweens);
        };
        MotionManager.prototype.setCompleteListener = function (listener) {
            this.oncomplete = listener;
        };
        return MotionManager;
    }());
    Display.MotionManager = MotionManager;
})(Display || (Display = {}));
var Display;
(function (Display) {
    var CommentBitmap = (function (_super) {
        __extends(CommentBitmap, _super);
        function CommentBitmap(params) {
            var _this = _super.call(this) || this;
            _this._mM = new Display.MotionManager(_this);
            _this.initStyle(params);
            Runtime.registerObject(_this);
            _this.bindParent(params);
            _this._mM.play();
            return _this;
        }
        Object.defineProperty(CommentBitmap.prototype, "motionManager", {
            get: function () {
                return this._mM;
            },
            set: function (m) {
                __trace("IComment.motionManager is read-only", "warn");
            },
            enumerable: true,
            configurable: true
        });
        CommentBitmap.prototype.bindParent = function (params) {
            if (params.hasOwnProperty("parent")) {
                params["parent"].addChild(this);
            }
        };
        CommentBitmap.prototype.initStyle = function (style) {
        };
        return CommentBitmap;
    }(Display.Bitmap));
    Display.CommentBitmap = CommentBitmap;
    function createBitmap(params) {
        return new CommentBitmap(params);
    }
    Display.createBitmap = createBitmap;
    function createParticle(params) {
        __trace('Bitmap.createParticle not implemented', 'warn');
        return new CommentBitmap(params);
    }
    Display.createParticle = createParticle;
    function createBitmapData(width, height, transparent, fillColor) {
        if (transparent === void 0) { transparent = true; }
        if (fillColor === void 0) { fillColor = 0xffffffff; }
        return new Display.BitmapData(width, height, transparent, fillColor);
    }
    Display.createBitmapData = createBitmapData;
})(Display || (Display = {}));
var Bitmap;
(function (Bitmap) {
    function createBitmap(params) {
        return Display.createBitmap(params);
    }
    Bitmap.createBitmap = createBitmap;
    function createParticle(params) {
        return Display.createParticle(params);
    }
    Bitmap.createParticle = createParticle;
    function createBitmapData(width, height, transparent, fillColor) {
        if (transparent === void 0) { transparent = true; }
        if (fillColor === void 0) { fillColor = 0xffffffff; }
        return Display.createBitmapData(width, height, transparent, fillColor);
    }
    Bitmap.createBitmapData = createBitmapData;
    function createRectangle(x, y, width, height) {
        return new Display.Rectangle(x, y, width, height);
    }
    Bitmap.createRectangle = createRectangle;
})(Bitmap || (Bitmap = {}));
var Display;
(function (Display) {
    var CommentButton = (function (_super) {
        __extends(CommentButton, _super);
        function CommentButton(params) {
            var _this = _super.call(this) || this;
            _this._mM = new Display.MotionManager(_this);
            _this._label = "";
            _this.setDefaults(params);
            _this.initStyle(params);
            Runtime.registerObject(_this);
            _this.bindParent(params);
            _this._mM.play();
            return _this;
        }
        Object.defineProperty(CommentButton.prototype, "motionManager", {
            get: function () {
                return this._mM;
            },
            set: function (m) {
                __trace("IComment.motionManager is read-only", "warn");
            },
            enumerable: true,
            configurable: true
        });
        CommentButton.prototype.bindParent = function (params) {
            if (params.hasOwnProperty("parent")) {
                params["parent"].addChild(this);
            }
        };
        CommentButton.prototype.initStyle = function (style) {
            if (typeof style === 'undefined' || style === null) {
                style = {};
            }
            if ("lifeTime" in style) {
                this._mM.dur = style["lifeTime"] * 1000;
            }
            else {
                this._mM.dur = 4000;
            }
            if (style.hasOwnProperty("text")) {
                this._label = style["text"];
            }
            if (style.hasOwnProperty("motionGroup")) {
                this._mM.initTweenGroup(style["motionGroup"], this._mM.dur);
            }
            else if (style.hasOwnProperty("motion")) {
                this._mM.initTween(style["motion"], false);
            }
        };
        CommentButton.prototype.serialize = function () {
            var serialized = _super.prototype.serialize.call(this);
            serialized["class"] = "Button";
            serialized["text"] = this._label;
            return serialized;
        };
        return CommentButton;
    }(Display.UIComponent));
    function createButton(params) {
        return new CommentButton(params);
    }
    Display.createButton = createButton;
})(Display || (Display = {}));
var Display;
(function (Display) {
    var CommentCanvas = (function (_super) {
        __extends(CommentCanvas, _super);
        function CommentCanvas(params) {
            var _this = _super.call(this) || this;
            _this._mM = new Display.MotionManager(_this);
            _this.setDefaults(params);
            _this.initStyle(params);
            Runtime.registerObject(_this);
            _this.bindParent(params);
            _this._mM.play();
            return _this;
        }
        Object.defineProperty(CommentCanvas.prototype, "motionManager", {
            get: function () {
                return this._mM;
            },
            set: function (m) {
                __trace("IComment.motionManager is read-only", "warn");
            },
            enumerable: true,
            configurable: true
        });
        CommentCanvas.prototype.bindParent = function (params) {
            if (params.hasOwnProperty("parent")) {
                params["parent"].addChild(this);
            }
        };
        CommentCanvas.prototype.initStyle = function (style) {
            if (style["lifeTime"]) {
                this._mM.dur = style["lifeTime"] * 1000;
            }
            if (style.hasOwnProperty("motionGroup")) {
                this._mM.initTweenGroup(style["motionGroup"], this._mM.dur);
            }
            else if (style.hasOwnProperty("motion")) {
                this._mM.initTween(style["motion"], false);
            }
        };
        return CommentCanvas;
    }(Display.Sprite));
    function createCanvas(params) {
        return new CommentCanvas(params);
    }
    Display.createCanvas = createCanvas;
})(Display || (Display = {}));
var Display;
(function (Display) {
    var Shape = (function (_super) {
        __extends(Shape, _super);
        function Shape() {
            var _this = _super.call(this) || this;
            _this._graphics = new Display.Graphics(_this);
            return _this;
        }
        Object.defineProperty(Shape.prototype, "graphics", {
            get: function () {
                return this._graphics;
            },
            enumerable: true,
            configurable: true
        });
        Shape.prototype.serialize = function () {
            var serialized = _super.prototype.serialize.call(this);
            serialized['class'] = 'Shape';
            return serialized;
        };
        return Shape;
    }(Display.DisplayObject));
    Display.Shape = Shape;
})(Display || (Display = {}));
var Display;
(function (Display) {
    var CommentShape = (function (_super) {
        __extends(CommentShape, _super);
        function CommentShape(params) {
            var _this = _super.call(this) || this;
            _this._mM = new Display.MotionManager(_this);
            _this.setDefaults(params);
            _this.initStyle(params);
            Runtime.registerObject(_this);
            _this.bindParent(params);
            _this._mM.play();
            return _this;
        }
        Object.defineProperty(CommentShape.prototype, "motionManager", {
            get: function () {
                return this._mM;
            },
            set: function (m) {
                __trace("IComment.motionManager is read-only", "warn");
            },
            enumerable: true,
            configurable: true
        });
        CommentShape.prototype.bindParent = function (params) {
            if (params.hasOwnProperty("parent")) {
                params["parent"].addChild(this);
            }
        };
        CommentShape.prototype.initStyle = function (style) {
            if (typeof style === 'undefined' || style === null) {
                style = {};
            }
            if (style["lifeTime"]) {
                this._mM.dur = style["lifeTime"] * 1000;
            }
            if (style.hasOwnProperty("motionGroup")) {
                this._mM.initTweenGroup(style["motionGroup"], this._mM.dur);
            }
            else if (style.hasOwnProperty("motion")) {
                this._mM.initTween(style["motion"], false);
            }
        };
        return CommentShape;
    }(Display.Shape));
    function createShape(params) {
        return new CommentShape(params);
    }
    Display.createShape = createShape;
})(Display || (Display = {}));
var Display;
(function (Display) {
    var TextFormat = (function () {
        function TextFormat(font, size, color, bold, italic, underline, url, target, align, leftMargin, rightMargin, indent, leading) {
            if (font === void 0) { font = "SimHei"; }
            if (size === void 0) { size = 25; }
            if (color === void 0) { color = 0xFFFFFF; }
            if (bold === void 0) { bold = false; }
            if (italic === void 0) { italic = false; }
            if (underline === void 0) { underline = false; }
            if (url === void 0) { url = ""; }
            if (target === void 0) { target = ""; }
            if (align === void 0) { align = "left"; }
            if (leftMargin === void 0) { leftMargin = 0; }
            if (rightMargin === void 0) { rightMargin = 0; }
            if (indent === void 0) { indent = 0; }
            if (leading === void 0) { leading = 0; }
            this.font = font;
            this.size = size;
            this.color = color;
            this.bold = bold;
            this.italic = italic;
            this.underline = underline;
        }
        TextFormat.prototype.serialize = function () {
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
    }());
    var TextField = (function (_super) {
        __extends(TextField, _super);
        function TextField(text, color) {
            if (text === void 0) { text = ""; }
            if (color === void 0) { color = 0; }
            var _this = _super.call(this) || this;
            _this._background = false;
            _this._backgroundColor = 0xffffff;
            _this._border = false;
            _this._borderColor = 0;
            _this._text = text;
            _this._textFormat = new TextFormat();
            _this._textFormat.color = color;
            _this.boundingBox.width = _this.textWidth;
            _this.boundingBox.height = _this.textHeight;
            return _this;
        }
        Object.defineProperty(TextField.prototype, "text", {
            get: function () {
                return this._text;
            },
            set: function (t) {
                this._text = t;
                this.boundingBox.width = this.textWidth;
                this.boundingBox.height = this.textHeight;
                this.propertyUpdate("text", this._text);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "length", {
            get: function () {
                return this.text.length;
            },
            set: function (l) {
                __trace("TextField.length is read-only.", "warn");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "htmlText", {
            get: function () {
                return this.text;
            },
            set: function (text) {
                __trace("TextField.htmlText is restricted due to security policy.", "warn");
                this.text = text.replace(/<\/?[^>]+(>|$)/g, '');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "textWidth", {
            get: function () {
                return this._text.length * this._textFormat.size;
            },
            set: function (w) {
                __trace("TextField.textWidth is read-only", "warn");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "textHeight", {
            get: function () {
                return this._textFormat.size;
            },
            set: function (h) {
                __trace("TextField.textHeight is read-only", "warn");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "color", {
            get: function () {
                return this._textFormat.color;
            },
            set: function (c) {
                this._textFormat.color = c;
                this.setTextFormat(this._textFormat);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "background", {
            get: function () {
                return this._background;
            },
            set: function (enabled) {
                this._background = enabled;
                this.propertyUpdate("background", enabled);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "backgroundColor", {
            get: function () {
                return this._backgroundColor;
            },
            set: function (color) {
                this._backgroundColor = color;
                this.propertyUpdate("backgroundColor", color);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "border", {
            get: function () {
                return this._border;
            },
            set: function (enabled) {
                this._border = enabled;
                this.propertyUpdate('border', enabled);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "borderColor", {
            get: function () {
                return this._borderColor;
            },
            set: function (color) {
                this._borderColor = color;
                this.propertyUpdate('borderColor', color);
            },
            enumerable: true,
            configurable: true
        });
        TextField.prototype.getTextFormat = function () {
            return this._textFormat;
        };
        TextField.prototype.setTextFormat = function (tf) {
            this._textFormat = tf;
            this.methodCall("setTextFormat", tf.serialize());
        };
        TextField.prototype.appendText = function (t) {
            this.text = this.text + t;
        };
        TextField.prototype.serialize = function () {
            var serialized = _super.prototype.serialize.call(this);
            serialized["class"] = "TextField";
            serialized["text"] = this._text;
            serialized["textFormat"] = this._textFormat.serialize();
            return serialized;
        };
        return TextField;
    }(Display.DisplayObject));
    Display.TextField = TextField;
    function createTextFormat() {
        return new TextFormat();
    }
    Display.createTextFormat = createTextFormat;
})(Display || (Display = {}));
var Display;
(function (Display) {
    var CommentField = (function (_super) {
        __extends(CommentField, _super);
        function CommentField(text, params) {
            if (params === void 0) { params = {}; }
            var _this = _super.call(this, text, 0xffffff) || this;
            _this._mM = new Display.MotionManager(_this);
            _this.setDefaults(params);
            _this.initStyle(params);
            Runtime.registerObject(_this);
            _this.bindParent(params);
            _this._mM.play();
            return _this;
        }
        Object.defineProperty(CommentField.prototype, "fontsize", {
            get: function () {
                return this.getTextFormat().fontsize;
            },
            set: function (size) {
                var tf = this.getTextFormat();
                tf.size = size;
                this.setTextFormat(tf);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CommentField.prototype, "font", {
            get: function () {
                return this.getTextFormat().font;
            },
            set: function (fontname) {
                var tf = this.getTextFormat();
                tf.font = fontname;
                this.setTextFormat(tf);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CommentField.prototype, "align", {
            get: function () {
                return this.getTextFormat().align;
            },
            set: function (a) {
                var tf = this.getTextFormat();
                tf.align = a;
                this.setTextFormat(tf);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CommentField.prototype, "bold", {
            get: function () {
                return this.getTextFormat().bold;
            },
            set: function (b) {
                var tf = this.getTextFormat();
                tf.bold = b;
                this.setTextFormat(tf);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CommentField.prototype, "motionManager", {
            get: function () {
                return this._mM;
            },
            set: function (m) {
                __trace("IComment.motionManager is read-only", "warn");
            },
            enumerable: true,
            configurable: true
        });
        CommentField.prototype.bindParent = function (params) {
            if (params.hasOwnProperty("parent")) {
                params["parent"].addChild(this);
            }
        };
        CommentField.prototype.initStyle = function (style) {
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
            }
            else if (style.hasOwnProperty("motion")) {
                this._mM.initTween(style["motion"], false);
            }
        };
        return CommentField;
    }(Display.TextField));
    function createComment(text, params) {
        return new CommentField(text, params);
    }
    Display.createComment = createComment;
    function createTextField() {
        return new CommentField("", {});
    }
    Display.createTextField = createTextField;
})(Display || (Display = {}));
var Display;
(function (Display) {
    var _root = new Display.RootSprite();
    var _width = 0;
    var _height = 0;
    var _fullScreenWidth = 0;
    var _fullScreenHeight = 0;
    var _frameRate = 24;
    Object.defineProperty(Display, 'root', {
        get: function () {
            return _root;
        },
        set: function (value) {
            __trace("Display.root is read-only", "warn");
        }
    });
    Object.defineProperty(Display, 'loaderInfo', {
        get: function () {
            return {};
        },
        set: function (value) {
            __trace("Display.loaderInfo is disabled", "warn");
        }
    });
    Object.defineProperty(Display, 'stage', {
        get: function () {
            return _root;
        },
        set: function (value) {
            __trace("Display.stage is read-only", "warn");
        }
    });
    Object.defineProperty(Display, 'version', {
        get: function () {
            return "CCLDisplay/1.0 HTML5/* (bilibili, like BSE, like flash, AS3 compatible) KagerouEngine/v1";
        },
        set: function (value) {
            __trace("Display.version is read-only", "warn");
        }
    });
    Object.defineProperty(Display, 'width', {
        get: function () {
            return _width;
        },
        set: function (value) {
            __trace("Display.width is read-only", "warn");
        }
    });
    Object.defineProperty(Display, 'height', {
        get: function () {
            return _height;
        },
        set: function (value) {
            __trace("Display.height is read-only", "warn");
        }
    });
    Object.defineProperty(Display, 'fullScreenWidth', {
        get: function () {
            return _fullScreenWidth;
        },
        set: function (value) {
            __trace("Display.fullScreenWidth is read-only", "warn");
        }
    });
    Object.defineProperty(Display, 'fullScreenHeight', {
        get: function () {
            return _fullScreenHeight;
        },
        set: function (value) {
            __trace("Display.fullScreenHeight is read-only", "warn");
        }
    });
    Object.defineProperty(Display, 'frameRate', {
        get: function () {
            return _frameRate;
        },
        set: function (value) {
            _frameRate = value;
            __pchannel("Display:SetFrameRate", value);
        }
    });
    function toString() {
        return "[display Display]";
    }
    Display.toString = toString;
    __schannel("Update:DimensionUpdate", function (payload) {
        _width = payload["stageWidth"];
        _height = payload["stageHeight"];
        if (payload.hasOwnProperty("screenWidth") && payload.hasOwnProperty("screenHeight")) {
            _fullScreenWidth = payload["screenWidth"];
            _fullScreenHeight = payload["screenHeight"];
        }
    });
})(Display || (Display = {}));
var $ = Display;
