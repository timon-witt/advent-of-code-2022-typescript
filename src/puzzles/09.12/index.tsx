import * as React from 'react';
import { last } from '../../utils/array';
import { PrettyJson } from '../../utils/pretty-json';
import { input } from './input';

type Position = {
  x: number;
  y: number;
};

enum Direction {
  Up = 'Up',
  Right = 'Right',
  Down = 'Down',
  Left = 'Left'
}

type Move = {
  direction: Direction;
  count: number;
};

type OneStepMove = {
  direction: Direction;
};

type DirectionInput = 'U' | 'R' | 'D' | 'L';

const parseDirection = (input: DirectionInput): Direction => {
  switch (input) {
    case 'U':
      return Direction.Up;
    case 'R':
      return Direction.Right;
    case 'D':
      return Direction.Down;
    case 'L':
      return Direction.Left;
  }
};

const movePositionByDirection = (position: Position, direction: Direction) => ({
  x:
    direction === Direction.Left
      ? position.x - 1
      : direction === Direction.Right
      ? position.x + 1
      : position.x,
  y:
    direction === Direction.Up
      ? position.y - 1
      : direction === Direction.Down
      ? position.y + 1
      : position.y
});

const draggedKnotPosition = (knot: Position, precedingKnot: Position): Position => {
  const xDiff = precedingKnot.x - knot.x;
  const yDiff = precedingKnot.y - knot.y;

  return {
    x:
      xDiff >= 2
        ? precedingKnot.x - 1
        : xDiff <= -2
        ? precedingKnot.x + 1
        : Math.abs(yDiff) >= 2
        ? precedingKnot.x
        : knot.x,
    y:
      yDiff >= 2
        ? precedingKnot.y - 1
        : yDiff <= -2
        ? precedingKnot.y + 1
        : Math.abs(xDiff) >= 2
        ? precedingKnot.y
        : knot.y
  };
};

const positionsEqual = (a: Position, b: Position) => a.x === b.x && a.y === b.y;

const moveToOneStepMoves = (move: Move): OneStepMove[] =>
  Array.from({ length: move.count }).map(() => ({ direction: move.direction }));

const startingPosition: Position = { x: 0, y: 0 };

export const puzzle09 = () => {
  const moves: Move[] = input
    .split('\n')
    .map(line => line.split(' '))
    .map(([direction, count]) => ({
      direction: parseDirection(direction as DirectionInput),
      count: Number(count)
    }));

  const simulateRope = (knotCount: number) => {
    const { visitedPositions } = moves
      .flatMap(moveToOneStepMoves)
      .reduce<{ visitedPositions: Position[]; knots: Position[] }>(
        ({ visitedPositions, knots }, { direction }) => {
          const [head, ...tail] = knots;
          const movedHead = movePositionByDirection(head, direction);
          const movedTail = tail.reduce(
            (precedingKnots, knot) => [
              ...precedingKnots,
              draggedKnotPosition(knot, last(precedingKnots) || movedHead)
            ],
            []
          );
          const lastKnot = last(movedTail)!;

          const visitedBefore = visitedPositions.some(visited => positionsEqual(visited, lastKnot));

          return {
            visitedPositions: visitedBefore ? visitedPositions : [...visitedPositions, lastKnot],
            knots: [movedHead, ...movedTail]
          };
        },
        {
          visitedPositions: [startingPosition],
          knots: Array.from({ length: knotCount }).map(() => startingPosition)
        }
      );

    return { visitedPositions };
  };

  const { visitedPositions: challenge1VisitedPositions } = simulateRope(2);
  const { visitedPositions: challenge2VisitedPositions } = simulateRope(10);

  return {
    challenge1: (
      <>
        Count of unique tail positions: {challenge1VisitedPositions.length}
        <br />
        <br />
        <PrettyJson data={challenge1VisitedPositions} />
      </>
    ),
    challenge2: (
      <>
        Count of unique last knot positions: {challenge2VisitedPositions.length}
        <br />
        <br />
        <PrettyJson data={challenge2VisitedPositions} />
      </>
    )
  };
};
