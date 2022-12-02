import * as React from 'react';
import { input } from './input';
import { sortBy } from '../../utils/sort';
import { take, sum } from '../../utils/array';

const caloriesPerElve = (): number[] =>
  input.split('\n\n').map(f => sum(f.split('\n').map(c => Number(c))));

const sortedCaloriesPerElve = sortBy(caloriesPerElve(), e => [e], ['desc']);

export const jsxPuzzle01_02 = (
  <div>
    {sortedCaloriesPerElve[0]}
    <br />
    {sortedCaloriesPerElve[1]}
    <br />
    {sortedCaloriesPerElve[2]}
    <br />
    sum:
    <br />
    {sum(take(sortedCaloriesPerElve, 3))}
  </div>
);
