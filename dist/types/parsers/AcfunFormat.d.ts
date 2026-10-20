/**
 * AcFun Format Parser
 * Takes in JSON and parses it based on current documentation for AcFun comments
 * @license MIT License
 **/
export declare class JSONParser {
    private _logBadComments;
    private _logNotImplemented;
    constructor(params?: any);
    parseOne(comment: any): any;
    parseMany(comments: Array<any>): Array<any>;
}
export declare class TextParser {
    private _jsonParser;
    constructor(param?: any);
    parseOne(comment: string): any;
    parseMany(comment: string): Array<any>;
}
