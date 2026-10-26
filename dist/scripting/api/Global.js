/**
 * Global Key-Value Store
 * @description Key-value store in the global namespace
 */

var Global = new function () {
    var _store = {};

    this._set = function (key, val) {
        _store[key] = val;
    };

    this._get = function (key) {
        return _store[key];
    };

    this._ = function (key) {
        return this._get(key);
    };
};

var $G = Global;
