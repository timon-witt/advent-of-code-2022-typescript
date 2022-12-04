import * as React from 'react';
import { Tuple } from '../../utils/array';
import { PrettyJson } from '../../utils/pretty-json';
import { input } from './input';

type SectionId = number;
type SectionRange = {
  from: SectionId;
  to: SectionId;
};
type PairOfElves = {
  sectionRanges: Tuple<SectionRange, 2>;
};

/**
 * @param input e.g. "11-73"
 */
const sectionRangeFromInput = (input: string): SectionRange => {
  const split = input.split('-').map(n => Number(n)) as Tuple<number, 2>;
  return {
    from: split[0],
    to: split[1]
  };
};

/**
 * @param input e.g. "11-73,29-73"
 */
const pairOfElvesFromInput = (input: string): PairOfElves => ({
  sectionRanges: input.split(',').map(sectionRangeFromInput) as Tuple<SectionRange, 2>
});

const sectionRangeCoveringAnother = (a: SectionRange, b: SectionRange): boolean =>
  a.from <= b.from && a.to >= b.to;

const sectionRangesIntersect = (a: SectionRange, b: SectionRange): boolean =>
  a.from <= b.to && b.from <= a.to;

const coveringSectionRangesExist = (ranges: SectionRange[]): boolean =>
  ranges.some((a, indexA) => {
    const rest = ranges.filter((_, indexB) => indexB !== indexA);
    return rest.some(b => sectionRangeCoveringAnother(a, b));
  });

const intersectingSectionRangesExist = (ranges: SectionRange[]): boolean =>
  ranges.some((a, indexA) => {
    const rest = ranges.filter((_, indexB) => indexB !== indexA);
    return rest.some(b => sectionRangesIntersect(a, b));
  });

const pairsOfElves = input.split('\n').map(pairOfElvesFromInput);

const challenge01Aggregated = pairsOfElves.map(pairOfElves => {
  return {
    pairOfElves,
    covering: coveringSectionRangesExist(pairOfElves.sectionRanges)
  };
});

const challenge02Aggregated = pairsOfElves.map(pairOfElves => {
  return {
    pairOfElves,
    intersecting: intersectingSectionRangesExist(pairOfElves.sectionRanges)
  };
});

export const jsxPuzzle04_01 = (
  <div>
    Count of pairs of elves with covering section ranges:{' '}
    {challenge01Aggregated.filter(c => c.covering).length}
    <br />
    <br />
    <PrettyJson data={challenge01Aggregated} />
  </div>
);

export const jsxPuzzle04_02 = (
  <div>
    Count of pairs of elves with intersecting section ranges:{' '}
    {challenge02Aggregated.filter(c => c.intersecting).length}
    <br />
    <br />
    <PrettyJson data={challenge02Aggregated} />
  </div>
);
