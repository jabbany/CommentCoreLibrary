/**
 * Binary Search Stubs for JS Arrays
 * @license MIT
 * @author Jim Chen
 */
var BinArray = (function () {

    var BinArray = {};

    /**
     * Performs binary search on the array
     * Note: The array MUST ALREADY BE SORTED. Some cases will fail but we don't
     * guarantee that we can catch all cases.
     * 
     * @param arr - array to search on
     * @param what - element to search for (may not be present)
     * @param how - function comparator (a, b). Returns positive value if a > b
     * @return index of the element (or index of the element if it were in the array)
     **/
    BinArray.bsearch = function (arr, what, how) {
        if (!Array.isArray(arr)) {
            throw new Error('Bsearch can only be run on arrays');
        }
        if (arr.length === 0) {
            return 0;
        }
        if (how(what,arr[0]) < 0) {
            return 0;
        }
        if (how(what,arr[arr.length - 1]) >= 0) {
            return arr.length;
        }
        var low = 0;
        var i = 0;
        var count = 0;
        var high = arr.length - 1;
        while (low <= high) {
            i = Math.floor((high + low + 1)/2);
            count++;
            if (how(what,arr[i-1]) >= 0 && how(what,arr[i]) < 0) {
                return i;
            } else if (how(what,arr[i-1]) < 0) {
                high = i-1;
            } else if (how(what,arr[i]) >= 0) {
                low = i;
            } else {
                throw new Error('Program Error. Inconsistent comparator or unsorted array!');
            }
            if (count > 1500) {
                throw new Error('Iteration depth exceeded. Inconsistent comparator or astronomical dataset!');
            }
        }
        return -1; 
    };

    /**
     * Insert an element into its position in the array signified by bsearch
     *
     * @param arr - array to insert into
     * @param what - element to insert
     * @param how - comparator (see bsearch)
     * @return index that the element was inserted to.
     **/
    BinArray.binsert = function (arr, what, how) {
        var index = BinArray.bsearch(arr,what,how);
        arr.splice(index,0,what);
        return index;
    };

    return BinArray;
})();
