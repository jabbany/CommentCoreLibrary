"use strict";
var BinArray;
(function (BinArray) {
    function bsearch(arr, what, how) {
        if (!Array.isArray(arr)) {
            throw new Error('Bsearch can only be run on arrays');
        }
        if (arr.length === 0) {
            return 0;
        }
        if (how(what, arr[0]) < 0) {
            return 0;
        }
        if (how(what, arr[arr.length - 1]) >= 0) {
            return arr.length;
        }
        var low = 0;
        var i = 0;
        var count = 0;
        var high = arr.length - 1;
        while (low <= high) {
            i = Math.floor((high + low + 1) / 2);
            count++;
            if (how(what, arr[i - 1]) >= 0 && how(what, arr[i]) < 0) {
                return i;
            }
            else if (how(what, arr[i - 1]) < 0) {
                high = i - 1;
            }
            else if (how(what, arr[i]) >= 0) {
                low = i;
            }
            else {
                throw new Error('Program Error. ' +
                    'Inconsistent comparator or unsorted array!');
            }
            if (count > 1500) {
                throw new Error('Iteration depth exceeded. ' +
                    'Inconsistent comparator or astronomical dataset!');
            }
        }
        return -1;
    }
    BinArray.bsearch = bsearch;
    function binsert(arr, what, how) {
        var index = bsearch(arr, what, how);
        arr.splice(index, 0, what);
        return index;
    }
    BinArray.binsert = binsert;
})(BinArray = exports.BinArray || (exports.BinArray = {}));
