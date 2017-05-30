/**
 * Comment Provider
 * Provides functionality to send or receive danmaku
 * @license MIT
 * @author Jim Chen
**/

var CommentProvider = (function () {

    function CommentProvider () {
        this._started = false;
        this._destroyed = false;
        this._staticSources = {};
        this._dynamicSources = {};
        this._parsers = {}
        this._targets = [];
    }

    CommentProvider.SOURCE_JSON = 'JSON';
    CommentProvider.SOURCE_XML = 'XML';
    CommentProvider.SOURCE_TEXT = 'TEXT';

    /**
     * Provider for HTTP content. This returns a promise that resolves to TEXT.
     *
     * @param {string} method - HTTP method to use
     * @param {string} url - Base URL
     * @param {string} responseType - type of response expected.
     * @param {Object} args - Arguments for query string. Note: This is only used when
     *               method is POST or PUT
     * @param {any} body - Text body content. If not provided will omit a body
     * @return {Promise} that resolves or rejects based on the success or failure
     *         of the request
     **/
    CommentProvider.BaseHttpProvider = function (method, url, responseType, args, body) {
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
            xhr.responseType = typeof responseType === "string" ?
                responseType : "";

            if (typeof body !== 'undefined') {
                xhr.send(body);
            } else {
                xhr.send();
            }
        });
    };

    /**
     * Provider for JSON content. This returns a promise that resolves to JSON.
     *
     * @param {string} method - HTTP method to use
     * @param {string} url - Base URL
     * @param {Object} args - Arguments for query string. Note: This is only used when
     *               method is POST or PUT
     * @param {any} body - Text body content. If not provided will omit a body
     * @return {Promise} that resolves or rejects based on the success or failure
     *         of the request
     **/
    CommentProvider.JSONProvider = function (method, url, args, body) {
        return CommentProvider.BaseHttpProvider(
            method, url, "json", args, body).then(function (response) {
            return response;
        });
    };

    /**
     * Provider for XML content. This returns a promise that resolves to Document.
     *
     * @param {string} method - HTTP method to use
     * @param {string} url - Base URL
     * @param {Object} args - Arguments for query string. Note: This is only used when
     *               method is POST or PUT
     * @param {any} body - Text body content. If not provided will omit a body
     * @return {Promise} that resolves or rejects based on the success or failure
     *         of the request
     **/
    CommentProvider.XMLProvider = function (method, url, args, body) {
        return CommentProvider.BaseHttpProvider(
            method, url, "document", args, body).then(function (response) {
            return response;
        });
    };

    /**
     * Provider for text content. This returns a promise that resolves to Text.
     *
     * @param {string} method - HTTP method to use
     * @param {string} url - Base URL
     * @param {Object} args - Arguments for query string. Note: This is only used when
     *               method is POST or PUT
     * @param {any} body - Text body content. If not provided will omit a body
     * @return {Promise} that resolves or rejects based on the success or failure
     *         of the request
     **/
    CommentProvider.TextProvider = function (method, url, args, body) {
        return CommentProvider.BaseHttpProvider(
            method, url, "text", args, body).then(function (response) {
            return response;
        });
    };

    /**
     * Attaches a static source to the corresponding type.
     * NOTE: Multiple static sources will race to determine the initial comment
     *       list so it is imperative that they all parse to the SAME content.
     *
     * @param {Provider} source - Promise that resolves to one of the supported types
     * @param {Type} type - Type that the provider resolves to
     * @return {CommentProvider} this
     **/
    CommentProvider.prototype.addStaticSource = function (source, type) {
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
    };

    /**
     * Attaches a dynamic source to the corresponding type
     * NOTE: Multiple dynamic sources will collectively provide comment data.
     *
     * @param {DynamicProvider} source - Listenable that resolves to one of the supported types
     * @param {Type} type - Type that the provider resolves to
     * @return {CommentProvider} this
     **/
    CommentProvider.prototype.addDynamicSource = function (source, type) {
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
    };

    /**
     * Attaches a target comment manager so that we can stream comments to it
     *
     * @param {CommentManager} commentManager - Comment Manager instance to attach to
     * @return {CommentProvider} this
     **/
    CommentProvider.prototype.addTarget = function (commentManager) {
        if (this._destroyed) {
            throw new Error(
                'Comment provider has been destroyed, '
                +'cannot attach more targets.');
        }
        if (!(commentManager instanceof CommentManager)) {
            throw new Error(
                'Expected the target to be an instance of CommentManager.');
        }
        this._targets.push(commentManager);
        return this;
    };

    /**
     * Adds a parser for an incoming data type. If multiple parsers are added,
     * parsers added later take precedence.
     *
     * @param {CommentParser} parser - Parser spec compliant parser
     * @param {Type} type - Type that the provider resolves to
     * @return {CommentProvider} this
     **/
    CommentProvider.prototype.addParser = function (parser, type) {
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
    };

    CommentProvider.prototype.applyParsersOne = function (data, type) {
        return new Promise(function (resolve, reject) {
            if (!(type in this._parsers)) {
                reject(new Error('No parsers defined for "' + type + '"'));
                return;
            }
            for (var i = 0; i < this._parsers[type].length; i++) {
                var output = null;
                try {
                    output = this._parsers[type][i].parseOne(data);
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
        }.bind(this));
    };

    CommentProvider.prototype.applyParsersList = function (data, type) {
        return new Promise(function (resolve, reject) {
            if (!(type in this._parsers)) {
                reject(new Error('No parsers defined for "' + type + '"'));
                return;
            }
            for (var i = 0; i < this._parsers[type].length; i++) {
                var output = null;
                try {
                    output = this._parsers[type][i].parseMany(data);
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
        }.bind(this));
    };

    /**
     * (Re)loads static comments
     *
     * @return {Promise} that is resolved when the static sources have been
     *         loaded
     */
    CommentProvider.prototype.load = function () {
        if (this._destroyed) {
            throw new Error('Cannot load sources on a destroyed provider.');
        }
        var promises = [];
        // TODO: This race logic needs to be rethought to provide redundancy
        for (var type in this._staticSources) {
            promises.push(Promises.any(this._staticSources[type])
                .then(function (data) {
                    return this.applyParsersList(data, type);
                }.bind(this)));
        }
        if (promises.length === 0) {
            // No static loaders
            return Promise.resolve([]);
        }
        return Promises.any(promises).then(function (commentList) {
            for (var i = 0; i < this._targets.length; i++) {
                this._targets[i].load(commentList);
            }
            return Promise.resolve(commentList);
        }.bind(this));
    };

    /**
     * Commit the changes and boot up the provider
     *
     * @return {Promise} that is resolved when all the static sources are loaded
     *         and all the dynamic sources are hooked up
     **/
    CommentProvider.prototype.start = function () {
        if (this._destroyed) {
            throw new Error('Cannot start a provider that has been destroyed.');
        }
        this._started = true;
        return this.load().then(function (commentList) {
            // Bind the dynamic sources
            for (var type in this._dynamicSources) {
                this._dynamicSources[type].forEach(function (source) {
                    source.addEventListener('receive', function (data) {
                        for (var i = 0; i < this._targets.length; i++) {
                            this._targets[i].send(
                                this.applyParserOne(data, type));
                        }
                    }.bind(this));
                }.bind(this));
            }
            return Promise.resolve(commentList);
        }.bind(this));
    };

    /**
     * Send out comments to both dynamic sources and POST targets.
     *
     * @param commentData - commentData to be sent to the server. Object.
     * @param requireAll - Do we require that all servers to accept the comment
     *                     for the promise to resolve. Defaults to true. If
     *                     false, the returned promise will resolve as long as a
     *                     single target accepts.
     * @return Promise that is resolved when the server accepts or rejects the
     *         comment. Dynamic sources will decide based on their promise while
     *         POST targets are considered accepted if they return a successful
     *         HTTP response code.
     **/
    CommentProvider.prototype.send = function (commentData, requireAll) {
        throw new Error('Not implemented');
    };

    /**
     * Stop providing dynamic comments to the targets
     *
     * @return Promise that is resolved when all bindings between dynamic
     *         sources have been successfully unloaded.
     **/
    CommentProvider.prototype.destroy = function () {
        if (this._destroyed) {
            return Promise.resolve();
        }
        // TODO: implement debinding for sources
        this._destroyed = true;
        return Promise.resolve();
    };

    return CommentProvider;
})();
