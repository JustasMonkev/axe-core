/**
 * Creates an array without duplicate values from 2 array inputs
 * @param {Array} arr1 First array
 * @param {Array} arr2 Second array
 * @return {Array}
 */
function uniqueArray(arr1, arr2) {
  // insertion order is preserved, matching the previous indexOf-based
  // (but O(n²)) implementation. The Set is used only for lookups since
  // ie11 does not support constructing a Set from an iterable or
  // Array.from on a Set
  const seen = new Set();
  const result = [];
  arr1.concat(arr2).forEach(item => {
    if (!seen.has(item)) {
      seen.add(item);
      result.push(item);
    }
  });
  return result;
}

export default uniqueArray;
