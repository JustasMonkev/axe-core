import cache from '../base/cache';

/**
 * Determine whether an id is unique within a document, shadow root, or
 * other root node.
 *
 * This replaces calling `root.querySelectorAll('#' + id)` for every
 * element, which scans the entire root each time. Instead the ids of the
 * root are counted once per run and reused for every lookup.
 * @private
 * @param {DocumentFragment|Document} root - The root node
 * @param {String} id - The id to look up
 * @return {Boolean}
 */
export default function isUniqueId(root, id) {
  const idCountsByRoot = cache.get('idCountsByRoot', () => new WeakMap());

  let idCounts = idCountsByRoot.get(root);
  if (!idCounts) {
    idCounts = new Map();
    // matches the previous querySelectorAll('#id') behavior in that
    // it does not match the root itself, only its (shadow-inclusive)
    // descendants within the same tree
    const elmsWithId = root.querySelectorAll('[id]');
    for (let i = 0; i < elmsWithId.length; i++) {
      const elmId = elmsWithId[i].getAttribute('id');
      idCounts.set(elmId, (idCounts.get(elmId) || 0) + 1);
    }
    idCountsByRoot.set(root, idCounts);
  }

  return idCounts.get(id) === 1;
}
