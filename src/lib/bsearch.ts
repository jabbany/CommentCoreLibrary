/**
 * Comparator type
 * @param T type of list item to be compared
 * @param U type of reference object to compare against list items
 */
export type Comparator<T,U> = (target:U, current:T) => number;

/**
 * Performs binary search on the array
 * Note: The array MUST ALREADY BE SORTED.
 *
 * @param arr - array to search on
 * @param what - element to search for (may not be present)
 * @param how - function comparator (a, b). Returns positive value if a > b
 * @return index of the element (or index of the element if it were in the array)
 */
export function binarySearch<T,U>(arr:T[], what:U, how:Comparator<T,U>):number {
  if (!Array.isArray(arr)) {
    throw new Error('Input must be an array');
  }
  // Empty array or before first element
  if (arr.length === 0 || how(what, arr[0]) < 0) {
    return 0;
  }
  // After last element
  if (how(what, arr[arr.length - 1]) >= 0) {
      return arr.length;
  }
  var low = 0,
    high = arr.length - 1,
    i = 0,
    count = 0;
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
      throw new Error('Program Error:' +
        ' Inconsistent comparator or unsorted array?');
    }
    if (count > 1500) {
      throw new Error('Iteration depth exceeded:' +
        ' Inconsistent comparator or astronomical dataset!');
    }
  }
  return -1;
}

/**
 * Insert an element into its position in the array signified by bsearch
 *
 * @param arr - array to insert into
 * @param what - element to insert
 * @param how - comparator (see bsearch)
 * @return index that the element was inserted to.
 */
export function binaryInsert<T,U extends T>(arr:T[],
  what:U, how:Comparator<T,U>):number {

  const index = binarySearch(arr,what,how);
  arr.splice(index, 0, what);
  return index;
}
