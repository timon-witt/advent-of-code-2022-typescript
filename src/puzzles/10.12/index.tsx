import * as React from 'react';
import { groupBy, joinJsx, last, NonEmptyArray, sum } from '../../utils/array';
import { PrettyJson } from '../../utils/pretty-json';
import { input } from '../10.12/input';

type Instruction = { name: 'noop' } | { name: 'addx'; count: number };
type InstructionName = Instruction['name'];
type Registry = { X: number };
type Pixel = '.' | '#';

const startRegistry: Registry = { X: 1 };

const parseInstruction = (line: string): Instruction => {
  const split = line.split(' ');
  const name = split[0] as InstructionName;

  switch (name) {
    case 'noop':
      return { name };
    case 'addx':
      return {
        name,
        count: Number(split[1])
      };
  }
};

const cyclesByInstruction = (options: {
  instruction: Instruction;
  registry: Registry;
}): Registry[] => {
  const { instruction, registry } = options;

  switch (instruction.name) {
    case 'noop':
      return [registry];
    case 'addx':
      return [registry, { ...registry, X: registry.X + instruction.count }];
  }
};

const cycleSignalStrength = (X: number, cycle: number) => X * cycle;

const spriteRowIndex = (cycle: number): number =>
  [40, 80, 120, 160, 200, 240].findIndex(n => cycle <= n);

export const puzzle10 = () => {
  const instructions = input.split('\n').map(parseInstruction);

  const { cycleCache } = instructions.reduce<{
    cycleCache: NonEmptyArray<Registry>;
  }>(
    ({ cycleCache }, instruction) => ({
      cycleCache: [
        ...cycleCache,
        ...cyclesByInstruction({ instruction, registry: last(cycleCache) })
      ]
    }),
    { cycleCache: [startRegistry] }
  );

  const challenge1SignalStrengthsToReport = [20, 60, 100, 140, 180, 220].map(cycle => ({
    cycle,
    signalStrength: cycleSignalStrength(cycleCache[cycle - 1].X, cycle)
  }));

  const challenge2Image: Pixel[][] = Array.from(
    groupBy(
      cycleCache.map<{ row: number; pixel: Pixel }>((registry, cycleIndex) => {
        const spriteIndices = [registry.X - 1, registry.X, registry.X + 1];
        const column = cycleIndex % 40;

        return {
          row: spriteRowIndex(cycleIndex + 1),
          pixel: spriteIndices.some(i => i === column) ? '#' : '.'
        };
      }),
      f => f.row
    ).values()
  ).map(row => row.map(({ pixel }) => pixel));

  return {
    challenge1: (
      <>
        Sum: {sum(challenge1SignalStrengthsToReport.map(c => c.signalStrength))}
        <br />
        <br />
        <PrettyJson data={challenge1SignalStrengthsToReport} />
      </>
    ),
    challenge2: (
      <>
        <pre>
          {joinJsx(
            challenge2Image,
            <>
              <br />
            </>
          )}
        </pre>
      </>
    )
  };
};
