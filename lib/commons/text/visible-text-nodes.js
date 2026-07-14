import isVisibleOnScreen from '../dom/is-visible-on-screen';

/**
 * Returns an array of visible text virtual nodes
 *
 * @method visibleTextNodes
 * @memberof axe.commons.text
 * @instance
 * @param {VirtualNode} vNode
 * @return {VitrualNode[]}
 * @deprecated
 */
function visibleTextNodes(vNode, nodes = []) {
  const parentVisible = isVisibleOnScreen(vNode);
  vNode.children.forEach(child => {
    if (child.actualNode.nodeType === 3) {
      if (parentVisible) {
        nodes.push(child);
      }
    } else {
      visibleTextNodes(child, nodes);
    }
  });
  return nodes;
}

export default visibleTextNodes;
