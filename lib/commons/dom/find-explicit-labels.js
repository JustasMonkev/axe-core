import cache from '../../core/base/cache';

/**
 * Find all `label` elements in a root whose `for` attribute references the
 * given id.
 *
 * This replaces calling `root.querySelectorAll('label[for="' + id + '"]')`
 * for every labelable element, which scans the entire root each time.
 * Instead all labels of the root are collected once per run and grouped by
 * their `for` attribute.
 * @method findExplicitLabels
 * @memberof axe.commons.dom
 * @param {DocumentFragment|Document|Element} root - The root to search
 * @param {String} id - The id the label must reference (unescaped)
 * @return {Element[]} The label elements in document order
 */
export default function findExplicitLabels(root, id) {
  const labelMapsByRoot = cache.get('labelMapsByRoot', () => new WeakMap());

  let labelsByFor = labelMapsByRoot.get(root);
  if (!labelsByFor) {
    labelsByFor = new Map();
    const labels = root.querySelectorAll('label[for]');
    for (let i = 0; i < labels.length; i++) {
      const forId = labels[i].getAttribute('for');
      const group = labelsByFor.get(forId);
      if (group) {
        group.push(labels[i]);
      } else {
        labelsByFor.set(forId, [labels[i]]);
      }
    }
    labelMapsByRoot.set(root, labelsByFor);
  }

  return labelsByFor.get(id) ?? [];
}
