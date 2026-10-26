/**
 * AcFun Format Parser
 * Takes in JSON and parses it based on current documentation for AcFun comments
 * @license MIT License
 **/
import type { ICommentData } from '../core/Core';
/**
 * Comment as found in AcFun JSON (see docs/data-formats/acfun-json.md)
 */
export interface AcfunComment {
    /**
     * Comma separated: stime (s), color, mode, size, hash, date
     */
    c: string;
    /**
     * Comment text. For advanced comments (mode 7) this is a JSON encoded
     * AcfunAdvancedParams object
     */
    m: string;
}
/**
 * One step of movement of an advanced comment
 */
export interface AcfunMovement {
    /**
     * Duration (s)
     */
    l?: number;
    x?: number;
    y?: number;
    /**
     * Alpha
     */
    t?: number;
    /**
     * Color
     */
    c?: number;
    /**
     * Rotation around the x, y and z axes (deg)
     */
    rx?: number;
    e?: number;
    d?: number;
}
/**
 * Parameters of an advanced comment (mode 7)
 */
export interface AcfunAdvancedParams {
    /**
     * Text
     */
    n: string;
    /**
     * Alpha
     */
    a?: number;
    /**
     * Position (in 1/1000 of the stage size)
     */
    p?: {
        x: number;
        y: number;
    };
    /**
     * Anchor: 0-8 for top-left to bottom-right, row by row
     */
    c?: number;
    /**
     * Shadow
     */
    b?: boolean;
    /**
     * Duration (s)
     */
    l?: number;
    z?: Array<AcfunMovement>;
    /**
     * Font (f) and filters (l)
     */
    w?: {
        f?: string;
        l?: Array<any>;
    };
    /**
     * Rotation around the z axis (deg)
     */
    r?: number;
    /**
     * Rotation around the y axis (deg)
     */
    k?: number;
}
export declare class JSONParser {
    private _logBadComments;
    private _logNotImplemented;
    constructor(params?: any);
    parseOne(comment: AcfunComment): ICommentData;
    parseMany(comments: Array<AcfunComment>): Array<ICommentData>;
}
export declare class TextParser {
    private _jsonParser;
    constructor(param?: any);
    parseOne(comment: string): ICommentData;
    parseMany(comment: string): Array<ICommentData>;
}
