/**
 * Comment Provider
 * Provides functionality to send or receive danmaku
 * @license MIT
 * @author Jim Chen
**/
import { CommentManager } from './CommentManager';
/**
 * Parser that turns source data into comment data
 */
export interface CommentParser {
    parseOne(data: any): any;
    parseMany(data: any): Array<any>;
}
/**
 * Source that dispatches 'receive' events with incoming comment data
 */
export interface DynamicSource {
    addEventListener(event: string, listener: Function): void;
}
export declare class CommentProvider {
    static SOURCE_JSON: string;
    static SOURCE_XML: string;
    static SOURCE_TEXT: string;
    private _started;
    private _destroyed;
    private _staticSources;
    private _dynamicSources;
    private _parsers;
    private _targets;
    /**
     * Provider for HTTP content. This returns a promise that resolves to TEXT.
     *
     * @param {string} method - HTTP method to use
     * @param {string} url - Base URL
     * @param {string} responseType - type of response expected.
     * @param {Object} args - Arguments for query string. Note: This is only used when
     *         method is POST or PUT
     * @param {any} body - Text body content. If not provided will omit a body
     * @return {Promise} that resolves or rejects based on the success or failure
     *         of the request
     **/
    static BaseHttpProvider(method: string, url: string, responseType?: string, args?: Object, body?: any): Promise<any>;
    /**
     * Provider for JSON content. This returns a promise that resolves to JSON.
     *
     * @param {string} method - HTTP method to use
     * @param {string} url - Base URL
     * @param {Object} args - Arguments for query string. Note: This is only used when
     *         method is POST or PUT
     * @param {any} body - Text body content. If not provided will omit a body
     * @return {Promise} that resolves or rejects based on the success or failure
     *         of the request
     **/
    static JSONProvider(method: string, url: string, args?: Object, body?: any): Promise<any>;
    /**
     * Provider for XML content. This returns a promise that resolves to Document.
     *
     * @param {string} method - HTTP method to use
     * @param {string} url - Base URL
     * @param {Object} args - Arguments for query string. Note: This is only used when
     *         method is POST or PUT
     * @param {any} body - Text body content. If not provided will omit a body
     * @return {Promise} that resolves or rejects based on the success or failure
     *         of the request
     **/
    static XMLProvider(method: string, url: string, args?: Object, body?: any): Promise<any>;
    /**
     * Provider for text content. This returns a promise that resolves to Text.
     *
     * @param {string} method - HTTP method to use
     * @param {string} url - Base URL
     * @param {Object} args - Arguments for query string. Note: This is only used when
     *         method is POST or PUT
     * @param {any} body - Text body content. If not provided will omit a body
     * @return {Promise} that resolves or rejects based on the success or failure
     *     of the request
     **/
    static TextProvider(method: string, url: string, args?: Object, body?: any): Promise<any>;
    /**
     * Attaches a static source to the corresponding type.
     * NOTE: Multiple static sources will race to determine the initial comment
     *     list so it is imperative that they all parse to the SAME content.
     *
     * @param {Provider} source - Promise that resolves to one of the supported types
     * @param {Type} type - Type that the provider resolves to
     * @return {CommentProvider} this
     **/
    addStaticSource(source: Promise<any>, type: string): CommentProvider;
    /**
     * Attaches a dynamic source to the corresponding type
     * NOTE: Multiple dynamic sources will collectively provide comment data.
     *
     * @param {DynamicProvider} source - Listenable that resolves to one of the supported types
     * @param {Type} type - Type that the provider resolves to
     * @return {CommentProvider} this
     **/
    addDynamicSource(source: DynamicSource, type: string): CommentProvider;
    /**
     * Attaches a target comment manager so that we can stream comments to it
     *
     * @param {CommentManager} commentManager - Comment Manager instance to attach to
     * @return {CommentProvider} this
     **/
    addTarget(commentManager: CommentManager): CommentProvider;
    /**
     * Adds a parser for an incoming data type. If multiple parsers are added,
     * parsers added later take precedence.
     *
     * @param {CommentParser} parser - Parser spec compliant parser
     * @param {Type} type - Type that the provider resolves to
     * @return {CommentProvider} this
     **/
    addParser(parser: CommentParser, type: string): CommentProvider;
    applyParsersOne(data: any, type: string): Promise<any>;
    applyParsersList(data: any, type: string): Promise<Array<any>>;
    /**
     * (Re)loads static comments
     *
     * @return {Promise} that is resolved when the static sources have been
     *     loaded
     */
    load(): Promise<Array<any>>;
    /**
     * Commit the changes and boot up the provider
     *
     * @return {Promise} that is resolved when all the static sources are loaded
     *     and all the dynamic sources are hooked up
     **/
    start(): Promise<Array<any>>;
    /**
     * Send out comments to both dynamic sources and POST targets.
     *
     * @param commentData - commentData to be sent to the server. Object.
     * @param requireAll - Do we require that all servers to accept the comment
     *           for the promise to resolve. Defaults to true. If
     *           false, the returned promise will resolve as long as a
     *           single target accepts.
     * @return Promise that is resolved when the server accepts or rejects the
     *     comment. Dynamic sources will decide based on their promise while
     *     POST targets are considered accepted if they return a successful
     *     HTTP response code.
     **/
    send(commentData: any, requireAll?: boolean): Promise<any>;
    /**
     * Stop providing dynamic comments to the targets
     *
     * @return Promise that is resolved when all bindings between dynamic
     *     sources have been successfully unloaded.
     **/
    destroy(): Promise<void>;
}
