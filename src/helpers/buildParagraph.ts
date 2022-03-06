import { Identation } from './types';
import { fragment } from 'xmlbuilder2';
import isVNode from 'virtual-dom/vnode/is-vnode';
import namespaces from '../namespaces';
import { colorlessColors, verticalAlignValues } from '../constants';
import { vNodeHasChildren } from '../utils/vnode';
import { computeImageDimensions } from './computeImageDimensions';
import { buildRun } from './buildRun';
import { buildRunOrRuns } from './buildRunOrRuns';
import { buildRunOrHyperLink } from './buildRunOrHyperLink';
import { buildParagraphProperties } from './buildParagraphProperties';
import { fixupLineHeight } from './fixupLineHeight';
import { fixupMargin } from './fixupMargin';
import { fixupFontSize } from './fixupFontSize';
import { fixupColorCode } from './fixupColorCode';
import DocxDocument from 'docx-document';

type NumberingAttributes = {
  levelId: any;
  numberingId: any;
};

export type ParagraphAttributes = {
  color?: string;
  backgroundColor?: string;
  verticalAlign?: any;
  textAlign?: any;
  strong?: any;
  fontSize?: any;
  lineHeight?: any;
  indentation?: any;
  display?: any;
  highlightColor?: any;
  font?: string;
  paragraphStyle?: string;
  numbering?: NumberingAttributes;
};

export function buildParagraph(
  vNode: VirtualDOM.VNode | VirtualDOM.VTree,
  attributes: ParagraphAttributes,
  docxDocumentInstance: DocxDocument
) {
  const paragraphFragment = fragment({ namespaceAlias: { w: namespaces.w } }).ele('@w', 'p');
  const modifiedAttributes = { ...attributes };
  if (isVNode(vNode) && vNode.properties && vNode.properties.style) {
    if (vNode.properties.style.color && !colorlessColors.includes(vNode.properties.style.color)) {
      modifiedAttributes.color = fixupColorCode(vNode.properties.style.color);
    }
    if (
      vNode.properties.style['background-color'] &&
      !colorlessColors.includes(vNode.properties.style['background-color'])
    ) {
      modifiedAttributes.backgroundColor = fixupColorCode(
        vNode.properties.style['background-color']
      );
    }
    if (
      vNode.properties.style['vertical-align'] &&
      verticalAlignValues.includes(vNode.properties.style['vertical-align'])
    ) {
      modifiedAttributes.verticalAlign = vNode.properties.style['vertical-align'];
    }
    if (
      vNode.properties.style['text-align'] &&
      ['left', 'right', 'center', 'justify'].includes(vNode.properties.style['text-align'])
    ) {
      modifiedAttributes.textAlign = vNode.properties.style['text-align'];
    }
    // FIXME: remove bold check when other font weights are handled.
    if (vNode.properties.style['font-weight'] && vNode.properties.style['font-weight'] === 'bold') {
      modifiedAttributes.strong = vNode.properties.style['font-weight'];
    }
    if (vNode.properties.style['font-size']) {
      modifiedAttributes.fontSize = fixupFontSize(vNode.properties.style['font-size']);
    }
    if (vNode.properties.style['line-height']) {
      modifiedAttributes.lineHeight = fixupLineHeight(
        vNode.properties.style['line-height'],
        vNode.properties.style['font-size']
          ? fixupFontSize(vNode.properties.style['font-size'])
          : null
      );
    }
    if (vNode.properties.style['margin-left'] || vNode.properties.style['margin-right']) {
      const leftMargin = fixupMargin(vNode.properties.style['margin-left']);
      const rightMargin = fixupMargin(vNode.properties.style['margin-right']);
      const indentation: Identation = {};
      if (leftMargin) {
        indentation.left = leftMargin;
      }
      if (rightMargin) {
        indentation.right = rightMargin;
      }
      if (leftMargin || rightMargin) {
        modifiedAttributes.indentation = indentation;
      }
    }
    if (vNode.properties.style.display) {
      modifiedAttributes.display = vNode.properties.style.display;
    }
  }
  if (isVNode(vNode) && vNode.tagName === 'blockquote') {
    modifiedAttributes.indentation = { left: 284 };
    modifiedAttributes.textAlign = 'justify';
  } else if (isVNode(vNode) && vNode.tagName === 'code') {
    modifiedAttributes.highlightColor = 'lightGray';
  } else if (isVNode(vNode) && vNode.tagName === 'pre') {
    modifiedAttributes.font = 'Courier';
  }
  const paragraphPropertiesFragment = buildParagraphProperties(modifiedAttributes);
  paragraphFragment.import(paragraphPropertiesFragment);
  if (isVNode(vNode) && vNodeHasChildren(vNode)) {
    if (
      [
        'span',
        'strong',
        'b',
        'em',
        'i',
        'u',
        'ins',
        'strike',
        'del',
        's',
        'sub',
        'sup',
        'mark',
        'a',
        'code',
        'pre',
      ].includes(vNode.tagName)
    ) {
      const runOrHyperlinkFragments = buildRunOrHyperLink(
        vNode,
        modifiedAttributes,
        docxDocumentInstance
      );
      if (Array.isArray(runOrHyperlinkFragments)) {
        for (
          let iteratorIndex = 0;
          iteratorIndex < runOrHyperlinkFragments.length;
          iteratorIndex++
        ) {
          const runOrHyperlinkFragment = runOrHyperlinkFragments[iteratorIndex];

          paragraphFragment.import(runOrHyperlinkFragment);
        }
      } else {
        paragraphFragment.import(runOrHyperlinkFragments);
      }
    } else if (vNode.tagName === 'blockquote') {
      const runFragment = buildRun(vNode, attributes);
      paragraphFragment.import(runFragment);
    } else {
      for (let index = 0; index < vNode.children.length; index++) {
        const childVNode = vNode.children[index];
        const runOrHyperlinkFragments = buildRunOrHyperLink(
          childVNode,
          modifiedAttributes,
          docxDocumentInstance
        );
        if (Array.isArray(runOrHyperlinkFragments)) {
          for (
            let iteratorIndex = 0;
            iteratorIndex < runOrHyperlinkFragments.length;
            iteratorIndex++
          ) {
            const runOrHyperlinkFragment = runOrHyperlinkFragments[iteratorIndex];

            paragraphFragment.import(runOrHyperlinkFragment);
          }
        } else {
          paragraphFragment.import(runOrHyperlinkFragments);
        }
      }
    }
  } else {
    // In case paragraphs has to be rendered where vText is present. Eg. table-cell
    // Or in case the vNode is something like img
    if (isVNode(vNode) && vNode.tagName === 'img') {
      computeImageDimensions(vNode, modifiedAttributes);
    }
    const runFragments = buildRunOrRuns(vNode, modifiedAttributes);
    if (Array.isArray(runFragments)) {
      for (let index = 0; index < runFragments.length; index++) {
        const runFragment = runFragments[index];

        paragraphFragment.import(runFragment);
      }
    } else {
      paragraphFragment.import(runFragments);
    }
  }
  paragraphFragment.up();

  return paragraphFragment;
}
