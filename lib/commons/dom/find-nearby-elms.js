import getNodeGrid from './get-node-grid';
import { memoize } from '../../core/utils';

export default function findNearbyElms(vNode, margin = 0) {
  const grid = getNodeGrid(vNode);
  if (!grid?.cells?.length) {
    return []; // Elements not in the grid don't have ._grid
  }
  const rect = vNode.boundingClientRect;
  const selfIsFixed = hasFixedPosition(vNode);
  const gridPosition = grid.getGridPositionOfRect(rect, margin);

  // use a Set to avoid the cost of scanning the neighbor list for
  // duplicates every time a node is added (nodes typically span
  // multiple grid cells)
  const neighbors = new Set();
  grid.loopGridPosition(gridPosition, vNeighbors => {
    for (const vNeighbor of vNeighbors) {
      if (
        vNeighbor &&
        vNeighbor !== vNode &&
        !neighbors.has(vNeighbor) &&
        selfIsFixed === hasFixedPosition(vNeighbor)
      ) {
        neighbors.add(vNeighbor);
      }
    }
  });

  return Array.from(neighbors);
}

const hasFixedPosition = memoize(vNode => {
  if (!vNode) {
    return false;
  }
  if (vNode.getComputedStylePropertyValue('position') === 'fixed') {
    return true;
  }
  return hasFixedPosition(vNode.parent);
});
