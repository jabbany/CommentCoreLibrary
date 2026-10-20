/**
 * Bilibili Format Parser
 * Takes in an XMLDoc/LooseXMLDoc and parses that into a Generic Comment List
 * @license MIT License
 **/
export declare class XMLParser {
    private _attemptFix;
    private _logBadComments;
    constructor(params?: any);
    parseOne(elem: Element): any;
    parseMany(xmldoc: Element | Document): Array<any>;
}
export declare class TextParser {
    private _allowInsecureDomParsing;
    private _attemptEscaping;
    private _canSecureNativeParse;
    private _xmlParser;
    constructor(params?: any);
    parseOne(comment: string): any;
    parseMany(comment: string): Array<any>;
}
