/**
 * Traverses a table in a given direction, passing the cell to the callback
 * @method traverse
 * @memberof axe.commons.table
 * @instance
 * @param  {Object|String} dir Step between visited cells {x: 1, y: 0}, 'left';
 * @param  {Object}   startPos    x/y coordinate: {x: 0, y: 0};
 * @param  {Array}    [tablegrid]  A matrix of the table obtained using axe.commons.table.toArray (OPTIONAL)
 * @param  {Function} callback Function to which each cell will be passed
 * @return {NodeElement}       If the callback returns true, the traversal will end and the cell will be returned
 */
function traverse(dir, startPos, tableGrid, callback) {
  if (Array.isArray(startPos)) {
    callback = tableGrid;
    tableGrid = startPos;
    startPos = { x: 0, y: 0 };
  }

  if (typeof dir === 'string') {
    switch (dir) {
      case 'left':
        dir = { x: -1, y: 0 };
        break;
      case 'up':
        dir = { x: 0, y: -1 };
        break;
      case 'right':
        dir = { x: 1, y: 0 };
        break;
      case 'down':
        dir = { x: 0, y: 1 };
        break;
    }
  }

  const cells = [];
  if (dir.x === 0 && dir.y === 0) {
    return cells;
  }

  let position = { x: startPos.x + dir.x, y: startPos.y + dir.y };
  while (tableGrid[position.y] && tableGrid[position.y][position.x]) {
    const cell = tableGrid[position.y][position.x];
    cells.push(cell);
    if (
      typeof callback === 'function' &&
      callback(cell, position, tableGrid) === true
    ) {
      break;
    }
    position = { x: position.x + dir.x, y: position.y + dir.y };
  }
  return cells;
}

export default traverse;
