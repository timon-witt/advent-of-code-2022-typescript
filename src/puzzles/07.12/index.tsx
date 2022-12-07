import * as React from 'react';
import { groupBy, sum } from '../../utils/array';
import { PrettyJson } from '../../utils/pretty-json';
import { sortBy } from '../../utils/sort';
import { input } from './input';

type Command = 'cd' | 'ls';

type Entity = File | Directory;

type File = {
  type: 'file';
  path: string;
  name: string;
  size: number;
};

type Directory = {
  type: 'directory';
  name: string;
  path: string;
};

const isFile = (entity: Entity): entity is File => entity.type === 'file';

export const puzzle07 = () => {
  const { allEntities } = input.split('\n').reduce<{
    expectOutputFromCommand: Command | undefined;
    currentPath: string;
    allEntities: Array<Entity>;
  }>(
    (result, currentLine) => {
      const { expectOutputFromCommand, currentPath, allEntities } = result;

      if (currentLine.startsWith('$')) {
        const split = currentLine.split(' ');
        const newCommand = split[1] as Command;

        switch (newCommand) {
          case 'cd':
            const arg = split[2];
            const newPath = arg.startsWith('/')
              ? arg
              : arg === '..'
              ? currentPath.split('/').slice(0, -1).join('/')
              : `${currentPath}${currentPath.endsWith('/') ? '' : '/'}${arg}`;

            return {
              expectOutputFromCommand: undefined,
              currentPath: newPath,
              allEntities
            };

          case 'ls':
            return {
              expectOutputFromCommand: 'ls',
              currentPath,
              allEntities
            };
        }
      } else {
        switch (expectOutputFromCommand) {
          case 'ls':
            const split = currentLine.split(' ');
            const sizeOrDir: 'dir' | number = split[0] === 'dir' ? 'dir' : Number(split[0]);
            const fileName = split[1];

            if (sizeOrDir === 'dir') {
              return {
                expectOutputFromCommand,
                currentPath,
                allEntities: [
                  ...allEntities,
                  { type: 'directory', path: currentPath, name: fileName }
                ]
              };
            } else {
              return {
                expectOutputFromCommand,
                currentPath,
                allEntities: [
                  ...allEntities,
                  { type: 'file', path: currentPath, name: fileName, size: sizeOrDir }
                ]
              };
            }

          default:
            throw `Not implemented reading command output for ${expectOutputFromCommand}`;
        }
      }
    },
    { expectOutputFromCommand: undefined, currentPath: '', allEntities: [] }
  );

  const allEntitiesByDirectory = Array.from(groupBy(allEntities, entity => entity.path));

  const allDirectoriesWithNestedSizes = allEntitiesByDirectory.map(([path]) => {
    const nestedFilesInDirectory = allEntitiesByDirectory
      .filter(([path2]) => path2.startsWith(path))
      .flatMap(([_, entities]) => entities.filter(isFile));

    const sizeOfNestedFiles = sum(nestedFilesInDirectory.map(f => f.size));
    return { path, sizeOfNestedFiles };
  });

  const directoriesWithAtMost100000 = allDirectoriesWithNestedSizes.filter(
    ({ sizeOfNestedFiles }) => sizeOfNestedFiles <= 100000
  );

  const missingSpace = (() => {
    const totalDiskSpace = 70000000;
    const necessarySpace = 30000000;
    const usedSpace = allDirectoriesWithNestedSizes.find(
      ({ path }) => path === '/'
    )!.sizeOfNestedFiles;
    const unusedSpace = totalDiskSpace - usedSpace;
    return necessarySpace - unusedSpace;
  })();

  const directoriesBiggerThanMissingSpace = allDirectoriesWithNestedSizes.filter(
    ({ sizeOfNestedFiles }) => sizeOfNestedFiles >= missingSpace
  );

  return {
    challenge1: (
      <>
        Size sum: {sum(directoriesWithAtMost100000.map(d => d.sizeOfNestedFiles))}
        <br />
        <br />
        Directories with at most 100.000:
        <PrettyJson data={directoriesWithAtMost100000} />
      </>
    ),
    challenge2: (
      <>
        Missing space: {missingSpace}
        <br />
        <br />
        Directories bigger or equal than missing space:
        <PrettyJson
          data={sortBy(directoriesBiggerThanMissingSpace, d => [d.sizeOfNestedFiles], ['asc'])}
        />
      </>
    )
  };
};
