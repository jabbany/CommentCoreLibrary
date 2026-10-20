/**
 * Some Utility Classes
 *
 * @author Jim Chen
 * @license MIT License
 * @description Useful utility classes
 */
export declare class Matrix3D {
    private _internalArray;
    static identity: Function;
    static createScaleMatrix: Function;
    /**
     * Create a 3d rotation matrix from degrees of rotation specified
     * This uses eulerAngles as the orientation
     *
     * @param {number} xrot Rotate along x-axis
     * @param {number} yrot Rotate along y-axis
     * @param {number} zrot Rotate along z-axis
     * @return {Matrix3D} Rotation matrix
     */
    static createRotationMatrix: Function;
    /**
     * Constructs a Matrix3D (4x4 matrix)
     * @constructor
     * @param {Array<number>} input array ofs 16 elements corresponding to rows of the matrix
     */
    constructor(array: Array<number>);
    get flatArray(): Array<number>;
    set flatArray(_array: Array<number>);
    /**
     * Check equality to identity matrix
     * @returns {boolean} indicates whether this is the identity matrix
     */
    isIdentity(): boolean;
    /**
     * Computes dot product of two Matrix3D objects
     * @param {Matrix3D} input matrix b to compute dot product on
     * @returns {Matrix3D} dot product
     */
    dot(matrix: Matrix3D): Matrix3D;
    /**
     * Check to see if two matrices are the same
     * @param {Matrix3D} input matrix b to compare to
     * @returns {boolean} indicator of whether two matrices are the same
     */
    equals(matrix: Matrix3D): boolean;
    /**
     * Writes the matrix out to CSS compatible format
     * @returns {string} representation of matrix
     */
    toCss(): string;
}
