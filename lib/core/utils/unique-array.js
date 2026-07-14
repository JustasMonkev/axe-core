/**
 * Creates an array without duplicate values from 2 array inputs
 * @param {Array} arr1 First array
 * @param {Array} arr2 Second array
 * @return {Array}
 */
function uniqueArray(arr1, arr2) {
  // Set preserves insertion order, matching the previous
  // indexOf-based (but O(n²)) implementation
  return Array.from(new Set(arr1.concat(arr2)));
}

export default uniqueArray;
