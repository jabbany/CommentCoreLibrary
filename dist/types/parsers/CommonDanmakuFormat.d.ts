/**
 * CommonDanmakuFormat Parser
 * Example parser for parsing comments that the CCL can accept directly.
 * @license MIT
 * @author Jim Chen
 **/
export declare class JSONParser {
    parseOne(comment: any): any;
    parseMany(comments: Array<any>): Array<any>;
}
export declare class XMLParser {
    parseOne(comment: Element): any;
    parseMany(commentsElem: Element | Document): Array<any>;
}
