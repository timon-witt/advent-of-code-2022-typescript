/**
 * Type for a tuple of n elements.
 *
 * From https://stackoverflow.com/a/52490977/6419868
 */
export type Tuple<T, N extends number> = N extends N
  ? number extends N
    ? T[]
    : _TupleOf<T, N, []>
  : never;
type _TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N
  ? R
  : _TupleOf<T, N, [T, ...R]>;

/**
 * Type for an array that must have at least one element.
 */
export type NonEmptyArray<T> = [T, ...T[]];

/**
 * Extracts up to `count` elements from the input array.
 */
export function take<T>(inputArray: Array<T>, count: number, offset: number = 0): Array<T> {
  return inputArray.slice(offset, count + offset);
}

/**
 * Returns an array's very last element.
 * The return type is possibly undefined, except if the array is a NonEmptyArray.
 */
 export const last = <T extends unknown[]>(
  array: T
): T extends NonEmptyArray<infer E> ? E : T extends Array<infer E> ? E | undefined : never =>
  array[array.length - 1] as any;

export const sum = (array: number[]): number =>
  array.reduce<number>((result, curr) => result + curr, 0);

/**
 * Groups an array by a key.
 *
 * ```
 * groupBy(['one', 'two', 'three'], s => s.length)
 * => Map(3 -> ["one", "two"], 5 -> ["three"])
 * ```
 *
 * Inspired from: https://stackoverflow.com/a/47752730
 */
export const groupBy = <T, K>(
  array: T[],
  f: (element: T, index: number) => K
): Map<K, NonEmptyArray<T>> =>
  array.reduce((result, element, index) => {
    const key = f(element, index);
    return result.set(key, [...(result.get(key) || []), element]);
  }, new Map());
