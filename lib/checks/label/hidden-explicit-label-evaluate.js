import { getRootNode, isVisibleToScreenReaders } from '../../commons/dom';
import findExplicitLabels from '../../commons/dom/find-explicit-labels';
import { accessibleTextVirtual } from '../../commons/text';

function hiddenExplicitLabelEvaluate(node, options, virtualNode) {
  if (virtualNode.hasAttr('id')) {
    if (!virtualNode.actualNode) {
      return undefined;
    }

    const root = getRootNode(node);
    const label = findExplicitLabels(root, node.getAttribute('id'))[0];

    if (label && !isVisibleToScreenReaders(label)) {
      let name;
      try {
        name = accessibleTextVirtual(virtualNode).trim();
      } catch {
        return undefined;
      }

      const isNameEmpty = name === '';
      return isNameEmpty;
    }
  }
  return false;
}

export default hiddenExplicitLabelEvaluate;
