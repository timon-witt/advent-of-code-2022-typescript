import * as React from 'react';
import { groupBy } from '../../utils/array';
import { PrettyJson } from '../../utils/pretty-json';
import { input } from './input';

export const puzzle06 = () => {
  const inputCharacters = input.split('');

  const charactersUnique = (characters: string[]) =>
    groupBy(characters, c => c).size === characters.length;

  const findNonRepeatingCharacters = (count: number) => {
    const startIndex = inputCharacters.findIndex((_, index) =>
      charactersUnique(inputCharacters.slice(index, index + count))
    );
    const firstIndexAfterNonRepeatingCharacters = startIndex + count;
    const endIndex = firstIndexAfterNonRepeatingCharacters - 1;

    return {
      startIndex,
      endIndex,
      firstIndexAfterNonRepeatingCharacters,
      characters: input.slice(startIndex, firstIndexAfterNonRepeatingCharacters)
    };
  };

  return {
    challenge1: (
      <>
        <PrettyJson data={findNonRepeatingCharacters(4)} />
        <br />
        <br />
        <pre style={{ display: 'flex', flexWrap: 'wrap' }}>
          {inputCharacters.map((char, index) => (
            <div
              style={{
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                margin: '5px'
              }}
            >
              <div>{index}</div>
              <div>{char}</div>
            </div>
          ))}
        </pre>
      </>
    ),
    challenge2: (
      <>
        <PrettyJson data={findNonRepeatingCharacters(14)} />
        <br />
        <br />
        <pre style={{ display: 'flex', flexWrap: 'wrap' }}>
          {inputCharacters.map((char, index) => (
            <div
              style={{
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                margin: '5px'
              }}
            >
              <div>{index}</div>
              <div>{char}</div>
            </div>
          ))}
        </pre>
      </>
    )
  };
};
