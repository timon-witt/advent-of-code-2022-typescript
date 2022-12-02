import { Tuple } from './array';

export type Ordering = 'asc' | 'desc';
export type Comparable = string | number | boolean | Date;
type ComparisonResult = 1 | -1 | 0;

const defaultOrdering: Ordering = 'asc';

/**
 * Sort by single or multiple values with the specified ordering.
 * The sort is not stable, as it uses javascript's built in sort function.
 * The default ordering is ascending.
 *
 * For simplicity, the function can only work with tuples, even if sorted by just a single value.
 *
 * Most simple:
 * ```
 *  sortBy(['b', 'a'], v => [v])
 * ```
 *
 * With custom ordering:
 * ```
 *  sortBy(['a', 'b'], v => [v], ['desc'])
 * ```
 *
 * Multiple values and varying ordering:
 * ```
 *  sortBy(
 *    [{v1: 'a', v2: 10}, {v1: 'b', v2: 20}],
 *    v => [v.v1, v.v2],
 *    ['asc', 'desc']
 *  )
 * ```
 */
export const sortBy = <E, N extends number, T extends Tuple<Comparable, N>>(
  array: E[],
  f: (element: E) => T,
  orders?: Tuple<Ordering, N>
) => {
  return array.sort((a, b) => {
    const tupleA = f(a);
    const tupleB = f(b);

    return (
      tupleA
        .map((valueA, index) => {
          const valueB = tupleB[index]!; // Type safety is hard here, hence the type cast. We just expect that all tuples have equal length.
          const ordering: Ordering = orders?.[index] || defaultOrdering;
          return compare(valueA, valueB, ordering);
        })
        .find(v => v !== 0) || 0
    );
  });
};

const compare = <V extends Comparable>(a: V, b: V, ordering: Ordering): ComparisonResult => {
  if (typeof a === 'string' && typeof b === 'string') {
    switch (ordering) {
      case 'asc':
        return a.localeCompare(b) as ComparisonResult;
      case 'desc':
        return b.localeCompare(a) as ComparisonResult;
    }
  } else {
    switch (ordering) {
      case 'asc':
        return a < b ? -1 : a > b ? 1 : 0;
      case 'desc':
        return a < b ? 1 : a > b ? -1 : 0;
    }
  }
};
