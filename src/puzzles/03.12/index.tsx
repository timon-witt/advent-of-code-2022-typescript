import * as React from 'react';
import { groupBy, sum, take } from '../../utils/array';
import { PrettyJson } from '../../utils/pretty-json';
import { input } from '../03.12/input';
import { Character, lowercaseCharacters, uppercaseCharacters } from './characters';

type Compartment = Character[];
type Rucksack = {
  input: string;
  characters: Character[];
  compartments: [Compartment, Compartment];
};

const rucksackFromInputLine = (inputLine: string): Rucksack => {
  const compartmentLength = inputLine.length / 2;
  const characters = inputLine.split('') as Character[];
  return {
    input: inputLine,
    characters,
    compartments: [
      take(characters, compartmentLength),
      take(characters, compartmentLength, compartmentLength)
    ]
  };
};

const rucksacks = input.split('\n').map(rucksackFromInputLine);

const characterInBothCompartments = (rucksack: Rucksack): Character =>
  rucksack.compartments[0].find(c => rucksack.compartments[1].includes(c))!; // <-- type cast because of puzzle description

const characterInAllRucksacks = (rucksacks: Rucksack[]): Character =>
  rucksacks[0].characters.find(c =>
    take(rucksacks, rucksacks.length - 1, 1).every(rucksack => rucksack.characters.includes(c))
  )!; // <-- type cast because of puzzle description

const characterPriority = (character: Character): number =>
  [...lowercaseCharacters, ...uppercaseCharacters].indexOf(character) + 1;

const challenge01Aggregated = rucksacks.map(rucksack => {
  const characterInBoth = characterInBothCompartments(rucksack);
  return {
    rucksack: rucksack.input,
    characterInBoth,
    priority: characterPriority(characterInBoth)
  };
});

const challenge02Aggregated = Array.from(
  groupBy(rucksacks, (_, index) => Math.ceil((index + 1) / 3)).values()
).map(rucksacks => {
  const characterInAll = characterInAllRucksacks(rucksacks);
  return {
    rucksacks: rucksacks.map(r => r.input),
    characterInAll,
    priority: characterPriority(characterInAll)
  };
});

export const jsxPuzzle03_01 = (
  <div>
    Sum of priorities: {sum(challenge01Aggregated.map(c => c.priority))}
    <br />
    <br />
    <PrettyJson data={challenge01Aggregated} />
  </div>
);

export const jsxPuzzle03_02 = (
  <div>
    Sum of priorities: {sum(challenge02Aggregated.map(c => c.priority))}
    <br />
    <br />
    <PrettyJson data={challenge02Aggregated} />
  </div>
);
