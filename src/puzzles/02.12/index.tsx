import * as React from 'react';

import { sum } from '../../utils/array';
import { input } from './input';
import { PrettyJson } from '../../utils/pretty-json';

type Shape = 'rock' | 'paper' | 'scissors';
type OpponentShapeEncrypted = 'A' | 'B' | 'C';
type OwnShapeEncrypted = 'X' | 'Y' | 'Z';
type WinningResultEncrypted = 'X' | 'Y' | 'Z';
type WinningResult = 'opponent-win' | 'self-win' | 'draw';

type Round = { opponentShape: Shape; ownShape: Shape };
type IncompleteRound = { opponentShape: Shape; goal: WinningResult };

const decryptOpponentShape = (opponentShape: OpponentShapeEncrypted): Shape => {
  switch (opponentShape) {
    case 'A':
      return 'rock';
    case 'B':
      return 'paper';
    case 'C':
      return 'scissors';
  }
};

const decryptOwnShape = (ownShape: OwnShapeEncrypted): Shape => {
  switch (ownShape) {
    case 'X':
      return 'rock';
    case 'Y':
      return 'paper';
    case 'Z':
      return 'scissors';
  }
};

const decryptGoalForRound = (winningResultEncrypted: WinningResultEncrypted): WinningResult => {
  switch (winningResultEncrypted) {
    case 'X':
      return 'opponent-win';
    case 'Y':
      return 'draw';
    case 'Z':
      return 'self-win';
  }
};

const pointsForShape = (shape: Shape): number => {
  switch (shape) {
    case 'rock':
      return 1;
    case 'paper':
      return 2;
    case 'scissors':
      return 3;
  }
};

const winnerFromRound = (round: Round): WinningResult => {
  switch (round.opponentShape) {
    case 'rock':
      return (() => {
        switch (round.ownShape) {
          case 'rock':
            return 'draw';
          case 'paper':
            return 'self-win';
          case 'scissors':
            return 'opponent-win';
        }
      })();

    case 'paper':
      return (() => {
        switch (round.ownShape) {
          case 'rock':
            return 'opponent-win';
          case 'paper':
            return 'draw';
          case 'scissors':
            return 'self-win';
        }
      })();

    case 'scissors':
      return (() => {
        switch (round.ownShape) {
          case 'rock':
            return 'self-win';
          case 'paper':
            return 'opponent-win';
          case 'scissors':
            return 'draw';
        }
      })();
  }
};

const ownPointsFromWinningResult = (winningResult: WinningResult): number => {
  switch (winningResult) {
    case 'draw':
      return 3;
    case 'opponent-win':
      return 0;
    case 'self-win':
      return 6;
  }
};

const ownPointsFromRound = (round: Round): number => {
  return pointsForShape(round.ownShape) + ownPointsFromWinningResult(winnerFromRound(round));
};

const ownShapeToAchieveGoal = (opponentShape: Shape, goal: WinningResult): Shape => {
  switch (opponentShape) {
    case 'rock':
      return (() => {
        switch (goal) {
          case 'opponent-win':
            return 'scissors';
          case 'draw':
            return 'rock';
          case 'self-win':
            return 'paper';
        }
      })();

    case 'paper':
      return (() => {
        switch (goal) {
          case 'opponent-win':
            return 'rock';
          case 'draw':
            return 'paper';
          case 'self-win':
            return 'scissors';
        }
      })();

    case 'scissors':
      return (() => {
        switch (goal) {
          case 'opponent-win':
            return 'paper';
          case 'draw':
            return 'scissors';
          case 'self-win':
            return 'rock';
        }
      })();
  }
};

const incompleteRoundToCompleteRound = (incompleteRound: IncompleteRound): Round => ({
  opponentShape: incompleteRound.opponentShape,
  ownShape: ownShapeToAchieveGoal(incompleteRound.opponentShape, incompleteRound.goal)
});

const roundsForFirstPuzzle: Round[] = input
  .split('\n')
  .map(s => s.split(' ') as [OpponentShapeEncrypted, OwnShapeEncrypted])
  .map(([opponentEncrypted, ownEncrypted]) => ({
    opponentShape: decryptOpponentShape(opponentEncrypted),
    ownShape: decryptOwnShape(ownEncrypted)
  }));

const incompleteRoundsForSecondPuzzle: IncompleteRound[] = input
  .split('\n')
  .map(s => s.split(' ') as [OpponentShapeEncrypted, WinningResultEncrypted])
  .map(([opponentEncrypted, winningResultEncrypted]) => ({
    opponentShape: decryptOpponentShape(opponentEncrypted),
    goal: decryptGoalForRound(winningResultEncrypted)
  }));

const ownPointsSumForFirstPuzzle = sum(roundsForFirstPuzzle.map(ownPointsFromRound));

const ownPointsForSecondPuzzle = sum(
  incompleteRoundsForSecondPuzzle.map(incompleteRoundToCompleteRound).map(ownPointsFromRound)
);

export const jsxPuzzle02_01 = (
  <div>
    sum of points: {ownPointsSumForFirstPuzzle}
    <br />
    <br />
    summary:
    <br />
    <PrettyJson
      data={roundsForFirstPuzzle.map(r => ({
        ...r,
        result: ownPointsFromRound(r)
      }))}
    />
  </div>
);

export const jsxPuzzle02_02 = (
  <div>
    sum of points: {ownPointsForSecondPuzzle}
    <br />
    <br />
    summary:
    <br />
    <div>
      <PrettyJson
        data={incompleteRoundsForSecondPuzzle.map(r => ({
          ...r,
          ownShape: ownShapeToAchieveGoal(r.opponentShape, r.goal)
        }))}
      />
    </div>
  </div>
);
