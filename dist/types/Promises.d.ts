/**
 * Promises extra functionality
 * @license MIT
 * @author Jim Chen
 */
/**
 * Resolves as soon as any promise resolves in the order of the input array
 *
 * @param arr - array of promises
 * @return promise that resolves if any one promise resolves and rejects
 *     if otherwise
 **/
export declare function any<T>(promises: Array<Promise<T>> | T): Promise<T>;
