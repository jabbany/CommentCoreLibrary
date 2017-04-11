var CommentUtils;
(function (CommentUtils) {
    var Matrix3D = (function () {
        function Matrix3D(array) {
            this._internalArray = null;
            if (!Array.isArray(array)) {
                throw new Error('Not an array. Cannot construct matrix.');
            }
            if (array.length != 16) {
                throw new Error('Illegal Dimensions. Matrix3D should be 4x4 matrix.');
            }
            this._internalArray = array;
        }
        Object.defineProperty(Matrix3D.prototype, "flatArray", {
            get: function () {
                return this._internalArray.slice(0);
            },
            set: function (array) {
                throw new Error('Not permitted. Matrices are immutable.');
            },
            enumerable: true,
            configurable: true
        });
        Matrix3D.prototype.isIdentity = function () {
            return this.equals(Matrix3D.identity());
        };
        Matrix3D.prototype.dot = function (matrix) {
            var a = this._internalArray.slice(0);
            var b = matrix._internalArray.slice(0);
            var res = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 4; j++) {
                    for (var k = 0; k < 4; k++) {
                        res[i * 4 + j] += a[i * 4 + k] * b[k * 4 + j];
                    }
                }
            }
            return new Matrix3D(res);
        };
        Matrix3D.prototype.equals = function (matrix) {
            for (var i = 0; i < 16; i++) {
                if (this._internalArray[i] !== matrix._internalArray[i]) {
                    return false;
                }
            }
            return true;
        };
        Matrix3D.prototype.toCss = function () {
            var matrix = this._internalArray.slice(0);
            for (var i = 0; i < matrix.length; i++) {
                if (Math.abs(matrix[i]) < 0.000001) {
                    matrix[i] = 0;
                }
            }
            return 'matrix3d(' + matrix.join(',') + ')';
        };
        return Matrix3D;
    }());
    Matrix3D.identity = function () {
        return new Matrix3D([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    };
    Matrix3D.createScaleMatrix = function (xscale, yscale, zscale) {
        return new Matrix3D([xscale, 0, 0, 0, 0, yscale, 0, 0, 0, 0, zscale, 0, 0, 0, 0, 1]);
    };
    Matrix3D.createRotationMatrix = function (xrot, yrot, zrot) {
        var DEG2RAD = Math.PI / 180;
        var yr = yrot * DEG2RAD;
        var zr = zrot * DEG2RAD;
        var COS = Math.cos;
        var SIN = Math.sin;
        var matrix = [
            COS(yr) * COS(zr), COS(yr) * SIN(zr), SIN(yr), 0,
            (-SIN(zr)), COS(zr), 0, 0,
            (-SIN(yr) * COS(zr)), (-SIN(yr) * SIN(zr)), COS(yr), 0,
            0, 0, 0, 1
        ];
        return new Matrix3D(matrix.map(function (v) { return Math.round(v * 1e10) * 1e-10; }));
    };
    CommentUtils.Matrix3D = Matrix3D;
})(CommentUtils || (CommentUtils = {}));
//# sourceMappingURL=CommentUtils.js.map