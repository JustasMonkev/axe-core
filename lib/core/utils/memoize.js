// FYI: memoize does not always play nice with esbuild
// and sometimes is built out of order.
// See: https://github.com/evanw/esbuild/issues/1433
//
// To get around this, you may need to import this
// file directly in the file you want to memoize.
//
// For example:
// import memoize from '../../core/utils/memoize';
// vs
// import memoize from '../../core/utils';

/**
 * Memoize a function.
 *
 * The cache is a chain of Maps keyed on the arguments (`fn.length` deep),
 * giving constant time lookups. This replaces the previous memoizee-based
 * implementation whose default cache did a linear scan of all cached keys
 * on every call, making memoized functions that are called for every node
 * (visibility checks, selector generation, etc.) scale quadratically with
 * the size of the page.
 * @method memoize
 * @memberof axe.utils
 * @param {Function} fn Function to memoize
 * @return {Function}
 */
// TODO: es-modules._memoziedFns
axe._memoizedFns = [];

// distinguishes "no cached value" from a cached undefined result
const noValue = Symbol('no cached value');

function memoizeImplementation(fn) {
  // mirror memoizee, which keys the cache on the function's declared
  // number of arguments (extra arguments passed in are ignored)
  const argCount = isNaN(fn.length) ? 1 : fn.length;
  let cacheRoot = new Map();

  function getCacheValue(args) {
    let map = cacheRoot;
    for (let i = 0; i < argCount - 1; i++) {
      map = map.get(args[i]);
      if (!map) {
        return noValue;
      }
    }
    return map.has(args[argCount - 1]) ? map.get(args[argCount - 1]) : noValue;
  }

  function setCacheValue(args, value) {
    let map = cacheRoot;
    for (let i = 0; i < argCount - 1; i++) {
      let nextMap = map.get(args[i]);
      if (!nextMap) {
        nextMap = new Map();
        map.set(args[i], nextMap);
      }
      map = nextMap;
    }
    map.set(args[argCount - 1], value);
  }

  const memoized = function memoized(...args) {
    const cached = getCacheValue(args);
    if (cached !== noValue) {
      return cached;
    }

    const value = fn.apply(this, args);
    setCacheValue(args, value);
    return value;
  };

  memoized.clear = () => {
    cacheRoot = new Map();
  };

  // keep track of each function that is memoized so it can be cleared at
  // the end of a run. each memoized function has its own cache, so there is
  // no method to clear all memoized caches. instead, we have to clear each
  // individual memoized function ourselves.
  axe._memoizedFns.push(memoized);
  return memoized;
}

export default memoizeImplementation;
