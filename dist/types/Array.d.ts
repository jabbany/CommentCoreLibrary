/**
 * Binary Search Stubs for JS Arrays
 * @license MIT
 * @author Jim Chen
 */
/**
 * Comparator for binary search. Returns positive value if a > b, negative if
 * a < b and 0 if they are equal
 */
export type Comparator<T, U> = (a: T, b: U) => number;
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
export declare function bsearch<T, U>(arr: Array<U>, what: T, how: Comparator<T, U>): number;
/**
 * Insert an element into its position in the array signified by bsearch
 *
 * @param arr - array to insert into
 * @param what - element to insert
 * @param how - comparator (see bsearch)
 * @return index that the element was inserted to.
 **/
export declare function binsert<T>(arr: Array<T>, what: T, how: Comparator<T, T>): number;
