import * as React from 'react';
import { PrettyJson } from '../../utils/pretty-json';
import { input } from './input';

type Position = { x: number; y: number };
type Tree = { height: number; position: Position };
type TreeWithScore = { tree: Tree; score: number };

export const puzzle08 = () => {
  const rows: Tree[][] = input.split('\n').map((rowString, rowIndex) =>
    rowString.split('').map((treeHeight, colIndex) => ({
      height: Number(treeHeight),
      position: {
        x: colIndex,
        y: rowIndex
      }
    }))
  );

  const northTrees = (startAt: Position): Tree[] =>
    rows
      .filter((_, index) => index < startAt.y)
      .map(row => row[startAt.x])
      .reverse();

  const eastTrees = (startAt: Position): Tree[] =>
    rows
      .filter((_, index) => index === startAt.y)
      .flatMap(row => row.filter((_, index) => index > startAt.x));

  const southTrees = (startAt: Position): Tree[] =>
    rows.filter((_, index) => index > startAt.y).map(row => row[startAt.x]);

  const westTrees = (startAt: Position): Tree[] =>
    rows
      .filter((_, index) => index === startAt.y)
      .flatMap(row => row.filter((_, index) => index < startAt.x))
      .reverse();

  const allTreesLowerThan = (lowerThan: Tree, compareTrees: Tree[]) =>
    compareTrees.every(compareTree => compareTree.height < lowerThan.height);

  const treeVisibleFromAnyEdge = (position: Position): boolean => {
    const tree = rows[position.y][position.x];
    return (
      allTreesLowerThan(tree, northTrees(position)) ||
      allTreesLowerThan(tree, eastTrees(position)) ||
      allTreesLowerThan(tree, southTrees(position)) ||
      allTreesLowerThan(tree, westTrees(position))
    );
  };

  const viewDistance = (fromTree: Tree, distantTrees: Tree[]): number => {
    const firstHigherIndex = distantTrees.findIndex(tree => tree.height >= fromTree.height);
    return firstHigherIndex === -1 ? distantTrees.length : firstHigherIndex + 1;
  };

  const treesWithScores: TreeWithScore[] = rows.flatMap(row =>
    row.map(tree => ({
      tree,
      score:
        viewDistance(tree, northTrees(tree.position)) *
        viewDistance(tree, eastTrees(tree.position)) *
        viewDistance(tree, southTrees(tree.position)) *
        viewDistance(tree, westTrees(tree.position))
    }))
  );

  const visibleTreesFromEdges = rows.flatMap((row, rowIndex) =>
    row.filter((_, colIndex) => treeVisibleFromAnyEdge({ x: colIndex, y: rowIndex }))
  );

  return {
    challenge1: (
      <>
        Count of visible trees: {visibleTreesFromEdges.length}
        <br />
        <br />
        <PrettyJson data={visibleTreesFromEdges} />
      </>
    ),
    challenge2: (
      <>
        Highest view distance score: {Math.max(...treesWithScores.map(({ score }) => score))}
        <br />
        <br />
        <PrettyJson data={treesWithScores} />
      </>
    )
  };
};
