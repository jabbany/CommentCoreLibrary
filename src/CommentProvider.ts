/**
 * Comment Provider
 * Provides functionality to send or receive danmaku
 * @license MIT
 * @author Jim Chen
**/
import type { ICommentData } from './core/Core';
import * as Promises from './Promises';

/**
 * Parser that turns source data into comment data
 */
export interface CommentParser {
  /**
   * Returns null if the data cannot be parsed
   */
  parseOne(data:any):ICommentData | null;
  /**
   * Returns null if the data cannot be parsed
   */
  parseMany(data:any):Array<ICommentData> | null;
}

/**
 * Target that comments are streamed to (e.g. a CommentManager)
 */
export interface CommentTarget {
  load(timeline:Array<ICommentData>):void;
  send(data:ICommentData | Array<ICommentData>):void;
}

/**
 * Source that dispatches 'receive' events with incoming comment data
 */
export interface DynamicSource {
  addEventListener(event:string, listener:Function):void;
}

export class CommentProvider {
  public static SOURCE_JSON:string = 'JSON';
  public static SOURCE_XML:string = 'XML';
  public static SOURCE_TEXT:string = 'TEXT';

  private _started:boolean = false;
  private _destroyed:boolean = false;
  private _staticSources:{[type:string]:Array<Promise<any>>} = {};
  private _dynamicSources:{[type:string]:Array<DynamicSource>} = {};
  private _parsers:{[type:string]:Array<CommentParser>} = {};
  private _targets:Array<CommentTarget> = [];

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
  public static BaseHttpProvider(method:string, url:string,
    responseType?:string, args?:{[key:string]:any}, body?:any):Promise<any> {

    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      var uri = url;
      if (args && (method === 'POST' || method === 'PUT')) {
        uri += '?';
        var argsArray = [];
        for (var key in args) {
          if (args.hasOwnProperty(key)) {
            argsArray.push(encodeURIComponent(key) +
              '=' + encodeURIComponent(args[key]));
          }
        }
        uri += argsArray.join('&');
      }

      xhr.onload = function () {
        if (this.status >= 200 && this.status < 300) {
          resolve(this.response);
        } else {
          reject(new Error(this.status + " " + this.statusText));
        }
      };

      xhr.onerror = function () {
        reject(new Error(this.status + " " + this.statusText));
      };

      xhr.open(method, uri);

      // Limit the response type based on input
      xhr.responseType = <XMLHttpRequestResponseType> (
        typeof responseType === "string" ? responseType : "");

      if (typeof body !== 'undefined') {
        xhr.send(body);
      } else {
        xhr.send();
      }
    });
  }

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
  public static JSONProvider(method:string, url:string, args?:Object,
    body?:any):Promise<any> {

    return CommentProvider.BaseHttpProvider(
      method, url, "json", args, body).then(function (response) {
      return response;
    });
  }

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
  public static XMLProvider(method:string, url:string, args?:Object,
    body?:any):Promise<any> {

    return CommentProvider.BaseHttpProvider(
      method, url, "document", args, body).then(function (response) {
      return response;
    });
  }

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
  public static TextProvider(method:string, url:string, args?:Object,
    body?:any):Promise<any> {

    return CommentProvider.BaseHttpProvider(
      method, url, "text", args, body).then(function (response) {
      return response;
    });
  }

  /**
   * Attaches a static source to the corresponding type.
   * NOTE: Multiple static sources will race to determine the initial comment
   *     list so it is imperative that they all parse to the SAME content.
   *
   * @param {Provider} source - Promise that resolves to one of the supported types
   * @param {Type} type - Type that the provider resolves to
   * @return {CommentProvider} this
   **/
  public addStaticSource(source:Promise<any>, type:string):CommentProvider {
    if (this._destroyed) {
      throw new Error(
        'Comment provider has been destroyed, ' +
        'cannot attach more sources.');
    }
    if (!(type in this._staticSources)) {
      this._staticSources[type] = [];
    }
    this._staticSources[type].push(source);
    return this;
  }

  /**
   * Attaches a dynamic source to the corresponding type
   * NOTE: Multiple dynamic sources will collectively provide comment data.
   *
   * @param {DynamicProvider} source - Listenable that resolves to one of the supported types
   * @param {Type} type - Type that the provider resolves to
   * @return {CommentProvider} this
   **/
  public addDynamicSource(source:DynamicSource, type:string):CommentProvider {
    if (this._destroyed) {
      throw new Error(
        'Comment provider has been destroyed, ' +
        'cannot attach more sources.');
    }
    if (!(type in this._dynamicSources)) {
      this._dynamicSources[type] = [];
    }
    this._dynamicSources[type].push(source);
    return this;
  }

  /**
   * Attaches a target comment manager so that we can stream comments to it
   *
   * @param {CommentTarget} commentManager - Comment Manager instance (or any
   *         object with load and send methods) to attach to
   * @return {CommentProvider} this
   **/
  public addTarget(commentManager:CommentTarget):CommentProvider {
    if (this._destroyed) {
      throw new Error(
        'Comment provider has been destroyed, '
        +'cannot attach more targets.');
    }
    if (commentManager == null || typeof commentManager.load !== 'function' ||
      typeof commentManager.send !== 'function') {

      throw new Error(
        'Expected the target to be a CommentManager (with load and send).');
    }
    this._targets.push(commentManager);
    return this;
  }

  /**
   * Adds a parser for an incoming data type. If multiple parsers are added,
   * parsers added later take precedence.
   *
   * @param {CommentParser} parser - Parser spec compliant parser
   * @param {Type} type - Type that the provider resolves to
   * @return {CommentProvider} this
   **/
  public addParser(parser:CommentParser, type:string):CommentProvider {
    if (this._destroyed) {
      throw new Error(
        'Comment provider has been destroyed, ' +
        'cannot attach more parsers.');
    }
    if (!(type in this._parsers)) {
      this._parsers[type] = [];
    }
    this._parsers[type].unshift(parser);
    return this;
  }

  public applyParsersOne(data:any, type:string):Promise<ICommentData> {
    var parsers = this._parsers;
    return new Promise<ICommentData>(function (resolve, reject) {
      if (!(type in parsers)) {
        reject(new Error('No parsers defined for "' + type + '"'));
        return;
      }
      for (var i = 0; i < parsers[type].length; i++) {
        var output:ICommentData | null = null;
        try {
          output = parsers[type][i].parseOne(data);
        } catch (e) {
          // TODO: log this failure
          console.error(e);
        }
        if (output !== null) {
          resolve(output);
          return;
        }
      }
      reject(new Error("Ran out of parsers for they target type"));
    });
  }

  public applyParsersList(data:any, type:string):Promise<Array<ICommentData>> {
    var parsers = this._parsers;
    return new Promise<Array<ICommentData>>(function (resolve, reject) {
      if (!(type in parsers)) {
        reject(new Error('No parsers defined for "' + type + '"'));
        return;
      }
      for (var i = 0; i < parsers[type].length; i++) {
        var output:Array<ICommentData> | null = null;
        try {
          output = parsers[type][i].parseMany(data);
        } catch (e) {
          // TODO: log this failure
          console.error(e);
        }
        if (output !== null) {
          resolve(output);
          return;
        }
      }
      reject(new Error("Ran out of parsers for the target type"));
    });
  }

  /**
   * (Re)loads static comments
   *
   * @return {Promise} that is resolved when the static sources have been
   *     loaded
   */
  public load():Promise<Array<ICommentData>> {
    if (this._destroyed) {
      throw new Error('Cannot load sources on a destroyed provider.');
    }
    var provider = this;
    var promises:Array<Promise<Array<ICommentData>>> = [];
    // TODO: This race logic needs to be rethought to provide redundancy
    for (var type in this._staticSources) {
      promises.push(Promises.any(this._staticSources[type])
        .then(function (data) {
          return provider.applyParsersList(data, type);
        }));
    }
    if (promises.length === 0) {
      // No static loaders
      return Promise.resolve([]);
    }
    return Promises.any(promises).then(function (commentList) {
      for (var i = 0; i < provider._targets.length; i++) {
        provider._targets[i].load(commentList);
      }
      return Promise.resolve(commentList);
    });
  }

  /**
   * Commit the changes and boot up the provider
   *
   * @return {Promise} that is resolved when all the static sources are loaded
   *     and all the dynamic sources are hooked up
   **/
  public start():Promise<Array<ICommentData>> {
    if (this._destroyed) {
      throw new Error('Cannot start a provider that has been destroyed.');
    }
    this._started = true;
    var provider = this;
    return this.load().then(function (commentList) {
      // Bind the dynamic sources
      for (var type in provider._dynamicSources) {
        provider._dynamicSources[type].forEach(function (source) {
          source.addEventListener('receive', function (data:any) {
            provider.applyParsersOne(data, type).then(function (comment) {
              for (var i = 0; i < provider._targets.length; i++) {
                provider._targets[i].send(comment);
              }
            });
          });
        });
      }
      return Promise.resolve(commentList);
    });
  }

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
  public send(commentData:any, requireAll?:boolean):Promise<any> {
    throw new Error('Not implemented');
  }

  /**
   * Stop providing dynamic comments to the targets
   *
   * @return Promise that is resolved when all bindings between dynamic
   *     sources have been successfully unloaded.
   **/
  public destroy():Promise<void> {
    if (this._destroyed) {
      return Promise.resolve();
    }
    // TODO: implement debinding for sources
    this._destroyed = true;
    return Promise.resolve();
  }
}
