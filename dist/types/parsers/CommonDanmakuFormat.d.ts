/**
 * CommonDanmakuFormat Parser
 * Example parser for parsing comments that the CCL can accept directly.
 * @license MIT
 * @author Jim Chen
 **/
import type { ICommentData } from '../core/Core';
export declare class JSONParser {
    parseOne(comment: any): ICommentData;
    parseMany(comments: Array<any>): Array<ICommentData>;
}
export declare class XMLParser {
    parseOne(comment: Element): ICommentData;
    parseMany(commentsElem: Element | Document): Array<ICommentData>;
}
