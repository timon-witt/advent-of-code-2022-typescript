import * as React from 'react';
import { inputMoves } from './input';
import produce from 'immer';
import { PrettyJson } from '../../utils/pretty-json';

type Crate = string;
type Stack = {
  crates: Crate[];
};

type Move = {
  quantity: number;
  from: number;
  to: number;
};

export const puzzle05 = () => {
  const initialStacks: Stack[] = [
    { crates: ['S', 'L', 'F', 'Z', 'D', 'B', 'R', 'H'] },
    { crates: ['R', 'Z', 'M', 'B', 'T'] },
    { crates: ['S', 'N', 'H', 'C', 'L', 'Z'] },
    { crates: ['J', 'F', 'C', 'S'] },
    { crates: ['B', 'Z', 'R', 'W', 'H', 'G', 'P'] },
    { crates: ['T', 'M', 'N', 'D', 'G', 'Z', 'J', 'V'] },
    { crates: ['Q', 'P', 'S', 'F', 'W', 'N', 'L', 'G'] },
    { crates: ['R', 'Z', 'M'] },
    { crates: ['T', 'R', 'V', 'G', 'L', 'C', 'M'] }
  ].map(s => ({ ...s, crates: [...s.crates].reverse() })); // reverse crates because its easier to copy them via multi cursor this way

  const parseMoveFromInput = (input: string): Move => {
    const groups = /^move (?<quantity>\d+) from (?<from>\d+) to (?<to>\d+)$/.exec(input)?.groups!;
    return {
      quantity: Number(groups.quantity),
      from: Number(groups.from) - 1, // -1 to match index
      to: Number(groups.to) - 1 // -1 to match index
    };
  };

  const moveCratesReversed = (stacks: Stack[], move: Move): Stack[] =>
    produce(stacks, stacks => {
      const fromStack = stacks[move.from];
      const toStack = stacks[move.to];
      toStack.crates.push(...fromStack.crates.splice(-1 * move.quantity).reverse());
    });

  const moveCratesInOrder = (stacks: Stack[], move: Move): Stack[] =>
    produce(stacks, stacks => {
      const fromStack = stacks[move.from];
      const toStack = stacks[move.to];
      toStack.crates.push(...fromStack.crates.splice(-1 * move.quantity)); // <-- only difference is the missing reverse here
    });

  const moves = inputMoves.split('\n').map(parseMoveFromInput);

  const challenge01Aggregated = () => {
    const finalStacks = moves.reduce<Stack[]>(moveCratesReversed, initialStacks);
    const topCrates = finalStacks.map(s => s.crates.slice(-1)).join('');
    return { topCrates, finalStacks };
  };

  const challenge02Aggregated = () => {
    const finalStacks = moves.reduce<Stack[]>(moveCratesInOrder, initialStacks);
    const topCrates = finalStacks.map(s => s.crates.slice(-1)).join('');
    return { topCrates, finalStacks };
  };

  return {
    challenge1: (
      <div>
        <PrettyJson data={challenge01Aggregated()} />
      </div>
    ),
    challenge2: (
      <div>
        <PrettyJson data={challenge02Aggregated()} />
      </div>
    )
  };
};
