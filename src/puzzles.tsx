import * as React from 'react';
import { useParams } from 'react-router';
import { paths } from './paths';
import { jsxPuzzle01_02 } from './puzzles/01.12';
import { jsxPuzzle02_01, jsxPuzzle02_02 } from './puzzles/02.12';
import { jsxPuzzle03_01, jsxPuzzle03_02 } from './puzzles/03.12';
import { jsxPuzzle04_01, jsxPuzzle04_02 } from './puzzles/04.12';
import { puzzle05 } from './puzzles/05.12';
import { puzzle06 } from './puzzles/06.12';
import { puzzle07 } from './puzzles/07.12';
import { puzzle08 } from './puzzles/08.12';
import { puzzle09 } from './puzzles/09.12';
import { sortBy } from './utils/sort';

type Puzzle = {
  day: number;
  number: number;
  render: () => JSX.Element;
};

const puzzles: Puzzle[] = [
  {
    day: 1,
    number: 2,
    render: () => jsxPuzzle01_02
  },
  {
    day: 2,
    number: 1,
    render: () => jsxPuzzle02_01
  },
  {
    day: 2,
    number: 2,
    render: () => jsxPuzzle02_02
  },
  {
    day: 3,
    number: 1,
    render: () => jsxPuzzle03_01
  },
  {
    day: 3,
    number: 2,
    render: () => jsxPuzzle03_02
  },
  {
    day: 4,
    number: 1,
    render: () => jsxPuzzle04_01
  },
  {
    day: 4,
    number: 2,
    render: () => jsxPuzzle04_02
  },
  {
    day: 5,
    number: 1,
    render: () => puzzle05().challenge1
  },
  {
    day: 5,
    number: 2,
    render: () => puzzle05().challenge2
  },
  {
    day: 6,
    number: 1,
    render: () => puzzle06().challenge1
  },
  {
    day: 6,
    number: 2,
    render: () => puzzle06().challenge2
  },
  {
    day: 7,
    number: 1,
    render: () => puzzle07().challenge1
  },
  {
    day: 7,
    number: 2,
    render: () => puzzle07().challenge2
  },
  {
    day: 8,
    number: 1,
    render: () => puzzle08().challenge1
  },
  {
    day: 8,
    number: 2,
    render: () => puzzle08().challenge2
  },
  {
    day: 9,
    number: 1,
    render: () => puzzle09().challenge1
  },
  {
    day: 9,
    number: 2,
    render: () => puzzle09().challenge2
  }
];

export const PuzzleOverview: React.FC = () => (
  <>
    <h1>Übersicht</h1>
    <ul>
      {sortBy(puzzles, p => [p.day, p.number]).map(puzzle => (
        <li>
          <a href={paths.puzzle(puzzle.day, puzzle.number)}>
            {puzzle.day}.12 – {puzzle.number}
          </a>
        </li>
      ))}
    </ul>
  </>
);

export const PuzzleRoute: React.FC = () => {
  const { day, number } = useParams();
  const puzzle = puzzles.find(p => p.day === Number(day) && p.number === Number(number));

  return (
    <>
      <a href="/">⬅ Zurück zur Übersicht</a>
      <br />
      <br />
      {puzzle?.render()}
    </>
  );
};
