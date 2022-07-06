/**
 * Some Utility Classes
 *
 * @author Jim Chen
 * @license MIT License
 * @description Useful utility classes
 */
module CommentUtils {
  export class Matrix3D {
    private _internalArray:Array<number> = null;

    public static identity:Function = function ():Matrix3D {
      return new Matrix3D([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    };

    public static createScaleMatrix:Function = function (xscale:number, yscale:number, zscale:number):Matrix3D {
      return new Matrix3D([xscale, 0, 0, 0, 0, yscale, 0, 0, 0, 0, zscale, 0, 0, 0, 0, 1]);
    };

    /**
     * Create a 3d rotation matrix from degrees of rotation specified
     * This uses eulerAngles as the orientation
     *
     * @param {number} xrot Rotate along x-axis
     * @param {number} yrot Rotate along y-axis
     * @param {number} zrot Rotate along z-axis
     * @return {Matrix3D} Rotation matrix
     */
    public static createRotationMatrix:Function = function (xrot:number, yrot:number, zrot:number):Matrix3D {
      const COS = Math.cos;
      const SIN = Math.sin;
      const DEG2RAD = Math.PI/180;

      var xr = xrot * DEG2RAD;
      var yr = yrot * DEG2RAD;
      var zr = zrot * DEG2RAD;

      var matrix = [
        COS(yr) * COS(zr)                               , COS(yr) * SIN(zr)                               , - SIN(yr)         , 0,
        SIN(xr) * SIN(yr) * COS(zr) - COS(xr) * SIN(zr) , SIN(xr) * SIN(yr) * SIN(zr) + COS(xr) * COS(zr) , SIN(xr) * COS(yr) , 0,
        COS(xr) * SIN(yr) * COS(zr) + SIN(xr) * SIN(zr) , COS(xr) * SIN(yr) * SIN(zr) - SIN(xr) * COS(zr) , COS(xr) * COS(yr) , 0,
        0                                               , 0                                               , 0                 , 1
      ];
      return new Matrix3D(matrix);
    };

    /**
     * Constructs a Matrix3D (4x4 matrix)
     * @constructor
     * @param {Array<number>} input array ofs 16 elements corresponding to rows of the matrix
     */
    constructor(array:Array<number>) {
      if (!Array.isArray(array)) {
        throw new Error('Not an array. Cannot construct matrix.');
      }
      if (array.length != 16) {
        throw new Error('Illegal Dimensions. Matrix3D should be 4x4 matrix.');
      }
      this._internalArray = array;
    }

    get flatArray():Array<number> {
      return this._internalArray.slice(0);
    }

    set flatArray(_array:Array<number>) {
      throw new Error('Not permitted. Matrices are immutable.');
    }

    /**
     * Check equality to identity matrix
     * @returns {boolean} indicates whether this is the identity matrix
     */
    public isIdentity():boolean {
      return this.equals(Matrix3D.identity());
    }

    /**
     * Computes dot product of two Matrix3D objects
     * @param {Matrix3D} input matrix b to compute dot product on
     * @returns {Matrix3D} dot product
     */
    public dot(matrix:Matrix3D):Matrix3D {
      var a = this._internalArray.slice(0);
      var b = matrix._internalArray.slice(0);
      var res:Array<number> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
          for (var k = 0; k < 4; k++) {
            res[i * 4 + j] += a[i * 4 + k] * b[k * 4 + j];
          }
        }
      }
      return new Matrix3D(res);
    }

    /**
     * Check to see if two matrices are the same
     * @param {Matrix3D} input matrix b to compare to
     * @returns {boolean} indicator of whether two matrices are the same
     */
    public equals(matrix:Matrix3D):boolean {
      for (var i = 0; i < 16; i++) {
        if (this._internalArray[i] !== matrix._internalArray[i]) {
          return false;
        }
      }
      return true;
    }

    /**
     * Writes the matrix out to CSS compatible format
     * @returns {string} representation of matrix
     */
    public toCss():string {
      var matrix = this._internalArray.slice(0);
      for (var i = 0; i < matrix.length;i++) {
        if (Math.abs(matrix[i]) < 0.000001) {
          matrix[i] = 0;
        }
      }
      return 'matrix3d(' + matrix.join(',') + ')';
    }
  }
}
