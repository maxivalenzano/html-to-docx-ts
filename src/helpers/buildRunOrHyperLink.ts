import { fragment } from 'xmlbuilder2';
import isVNode from 'virtual-dom/vnode/is-vnode';
import namespaces from '../namespaces';
import { hyperlinkType } from '../constants';
import { buildRunOrRuns } from './buildRunOrRuns';

export function buildRunOrHyperLink(vNode, attributes, docxDocumentInstance) {
  if (isVNode(vNode) && vNode.tagName === 'a') {
    const relationshipId = docxDocumentInstance.createDocumentRelationships(
      docxDocumentInstance.relationshipFilename,
      hyperlinkType,
      vNode.properties && vNode.properties.href ? vNode.properties.href : ''
    );
    const hyperlinkFragment = fragment({ namespaceAlias: { w: namespaces.w, r: namespaces.r } })
      .ele('@w', 'hyperlink')
      .att('@r', 'id', `rId${relationshipId}`);

    const modifiedAttributes = { ...attributes };
    modifiedAttributes.hyperlink = true;

    const runFragments = buildRunOrRuns(vNode.children[0], modifiedAttributes);
    if (Array.isArray(runFragments)) {
      for (let index = 0; index < runFragments.length; index++) {
        const runFragment = runFragments[index];

        hyperlinkFragment.import(runFragment);
      }
    } else {
      hyperlinkFragment.import(runFragments);
    }
    hyperlinkFragment.up();

    return hyperlinkFragment;
  }
  const runFragments = buildRunOrRuns(vNode, attributes);

  return runFragments;
}
