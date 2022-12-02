import * as React from 'react';
import { useParams } from 'react-router';
import { paths } from './paths';
import { jsxPuzzle01_02 } from './puzzles/01.12';
import { jsxPuzzle02_01, jsxPuzzle02_02 } from './puzzles/02.12';
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