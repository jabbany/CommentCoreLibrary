/**
 * Bilibili Format Parser
 * Takes in an XMLDoc/LooseXMLDoc and parses that into a Generic Comment List
 * @license MIT License
 **/
import type { ICommentData } from '../core/Core';
export declare class XMLParser {
    private _attemptFix;
    private _logBadComments;
    constructor(params?: any);
    parseOne(elem: Element): ICommentData | null;
    parseMany(xmldoc: Element | Document): Array<ICommentData> | null;
}
export declare class TextParser {
    private _allowInsecureDomParsing;
    private _attemptEscaping;
    private _canSecureNativeParse;
    private _xmlParser;
    constructor(params?: any);
    parseOne(comment: string): ICommentData | null;
    parseMany(comment: string): Array<ICommentData> | null;
}
