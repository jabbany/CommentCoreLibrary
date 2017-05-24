/**
 * Binary Search Stubs for JS Arrays
 * @author Jim Chen
 * @license MIT
 */
export namespace BinArray {
  export type Comparator = (a:any, b:any) => number;
  /**
   * Performs binary search on the array
   * Note: The array MUST ALREADY BE SORTED. Some cases will fail but we don't
   * guarantee that we can catch all cases.
   *
   * @param {Array} arr - array to search on
   * @param {any} what - element to search for (may not be present)
   * @param {Comparator} how - function comparator (a, b). Returns positive value if a > b
   * @return {number} index of the element (or index of the element if it were in the array)
   **/
  export function bsearch (arr:Array<any>, what:any, how:Comparator):number {
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
          i = Math.floor((high + low + 1)/2);
          count++;
          if (how(what, arr[i-1]) >= 0 && how(what, arr[i]) < 0) {
              return i;
          } else if (how(what, arr[i-1]) < 0) {
              high = i-1;
          } else if (how(what, arr[i]) >= 0) {
              low = i;
          } else {
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

  /**
   * Insert an element into its position in the array signified by bsearch
   *
   * @param {Array} arr - array to insert into
   * @param {any} what - element to insert
   * @param {Comparator} how - comparator (see bsearch)
   * @return {number} index that the element was inserted to.
   **/
  export function binsert (arr:Array<any>, what:any, how:Comparator):number {
      var index = bsearch(arr, what, how);
      arr.splice(index,0,what);
      return index;
  }
}
