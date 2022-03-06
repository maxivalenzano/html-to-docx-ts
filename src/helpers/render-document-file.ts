import { fragment } from 'xmlbuilder2';
import VText from 'virtual-dom/vnode/vtext';
import VNode from 'virtual-dom/vnode/vnode';
import isVNode from 'virtual-dom/vnode/is-vnode';
import isVText from 'virtual-dom/vnode/is-vtext';
import { default as HTMLToVDOM } from 'html-to-vdom';
import escape from 'escape-html';

import namespaces from '../namespaces';
import { vNodeHasChildren } from '../utils/vnode';
import { buildImage } from './buildImage';
import { buildList } from './buildList';
import { buildParagraph } from './buildParagraph';
import { buildTable } from './buildTable';
import { buildTextElement } from './buildTextElement';

const convertHTML = HTMLToVDOM({
  VNode,
  VText,
});

function findXMLEquivalent(docxDocumentInstance, vNode, xmlFragment) {
  if (
    vNode.tagName === 'div' &&
    (vNode.properties.attributes.class === 'page-break' ||
      (vNode.properties.style && vNode.properties.style['page-break-after']))
  ) {
    const paragraphFragment = fragment({ namespaceAlias: { w: namespaces.w } })
      .ele('@w', 'p')
      .ele('@w', 'r')
      .ele('@w', 'br')
      .att('@w', 'type', 'page')
      .up()
      .up()
      .up();

    xmlFragment.import(paragraphFragment);
    return;
  }

  switch (vNode.tagName) {
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6': {
      const headingFragment = buildParagraph(
        vNode,
        {
          paragraphStyle: `Heading${vNode.tagName[1]}`,
        },
        docxDocumentInstance
      );
      xmlFragment.import(headingFragment);
      return;
    }
    case 'span':
    case 'strong':
    case 'b':
    case 'em':
    case 'i':
    case 'u':
    case 'ins':
    case 'strike':
    case 'del':
    case 's':
    case 'sub':
    case 'sup':
    case 'mark':
    case 'p':
    case 'a':
    case 'blockquote':
    case 'code':
    case 'pre': {
      const paragraphFragment = buildParagraph(vNode, {}, docxDocumentInstance);
      xmlFragment.import(paragraphFragment);
      return;
    }
    case 'figure': {
      if (vNodeHasChildren(vNode)) {
        // eslint-disable-next-line no-plusplus
        for (let index = 0; index < vNode.children.length; index++) {
          const childVNode = vNode.children[index];
          if (childVNode.tagName === 'table') {
            const tableFragment = buildTable(
              childVNode,
              {
                maximumWidth: docxDocumentInstance.availableDocumentSpace,
                rowCantSplit: docxDocumentInstance.tableRowCantSplit,
              },
              docxDocumentInstance
            );
            xmlFragment.import(tableFragment);
            // Adding empty paragraph for space after table
            const emptyParagraphFragment = buildParagraph(null, {}, docxDocumentInstance);
            xmlFragment.import(emptyParagraphFragment);
          } else if (childVNode.tagName === 'img') {
            const imageFragment = buildImage(docxDocumentInstance, childVNode);
            if (imageFragment) {
              xmlFragment.import(imageFragment);
            }
          }
        }
      }
      return;
    }
    case 'table': {
      const tableFragment = buildTable(
        vNode,
        {
          maximumWidth: docxDocumentInstance.availableDocumentSpace,
          rowCantSplit: docxDocumentInstance.tableRowCantSplit,
        },
        docxDocumentInstance
      );
      xmlFragment.import(tableFragment);
      // Adding empty paragraph for space after table
      const emptyParagraphFragment = buildParagraph(null, {}, docxDocumentInstance);
      xmlFragment.import(emptyParagraphFragment);
      return;
    }
    case 'ol':
    case 'ul':
      buildList(vNode, docxDocumentInstance, xmlFragment);
      return;
    case 'img': {
      const imageFragment = buildImage(docxDocumentInstance, vNode);
      if (imageFragment) {
        xmlFragment.import(imageFragment);
      }
      return;
    }
    case 'br': {
      const linebreakFragment = buildParagraph(null, {}, docxDocumentInstance);
      xmlFragment.import(linebreakFragment);
      return;
    }
  }
  if (vNodeHasChildren(vNode)) {
    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < vNode.children.length; index++) {
      const childVNode = vNode.children[index];
      // eslint-disable-next-line no-use-before-define
      convertVTreeToXML(docxDocumentInstance, childVNode, xmlFragment);
    }
  }
}

// eslint-disable-next-line consistent-return
export function convertVTreeToXML(docxDocumentInstance, vTree, xmlFragment) {
  if (!vTree) {
    // eslint-disable-next-line no-useless-return
    return '';
  }
  if (Array.isArray(vTree) && vTree.length) {
    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < vTree.length; index++) {
      const vNode = vTree[index];
      convertVTreeToXML(docxDocumentInstance, vNode, xmlFragment);
    }
  } else if (isVNode(vTree)) {
    findXMLEquivalent(docxDocumentInstance, vTree, xmlFragment);
  } else if (isVText(vTree)) {
    xmlFragment = buildTextElement(escape(String(vTree.text)));
  }
  return xmlFragment;
}

function renderDocumentFile(docxDocumentInstance) {
  const vTree = convertHTML(docxDocumentInstance.htmlString);

  const xmlFragment = fragment({ namespaceAlias: { w: namespaces.w } });

  const populatedXmlFragment = convertVTreeToXML(docxDocumentInstance, vTree, xmlFragment);

  return populatedXmlFragment;
}

export default renderDocumentFile;
