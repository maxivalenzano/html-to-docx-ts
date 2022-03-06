import { fragment } from 'xmlbuilder2';
import isVNode from 'virtual-dom/vnode/is-vnode';
import namespaces from '../namespaces';
import { buildList } from './buildList';
import { buildImage } from './buildImage';
import { colorlessColors, verticalAlignValues } from '../constants';
import { vNodeHasChildren } from '../utils/vnode';
import { buildParagraph } from './buildParagraph';
import { fixupColorCode } from './fixupColorCode';
import { buildTableCellProperties } from './buildTableCellProperties';
import { cssBorderParser } from './cssBorderParser';
import DocxDocument from 'docx-document';

export function buildTableCell(
  vNode: VirtualDOM.VNode,
  attributes,
  rowSpanMap,
  columnIndex,
  docxDocumentInstance: DocxDocument
) {
  const tableCellFragment = fragment({ namespaceAlias: { w: namespaces.w } }).ele('@w', 'tc');

  const modifiedAttributes = { ...attributes };
  if (isVNode(vNode) && vNode.properties) {
    if (vNode.properties.rowSpan) {
      rowSpanMap.set(columnIndex.index, { rowSpan: vNode.properties.rowSpan - 1, colSpan: 0 });
      modifiedAttributes.rowSpan = 'restart';
    } else {
      const previousSpanObject = rowSpanMap.get(columnIndex.index);
      rowSpanMap.set(
        columnIndex.index,
        // eslint-disable-next-line prefer-object-spread
        Object.assign({}, previousSpanObject, {
          rowSpan: 0,
          colSpan: (previousSpanObject && previousSpanObject.colSpan) || 0,
        })
      );
    }
    if (
      vNode.properties.colSpan ||
      (vNode.properties.style && vNode.properties.style['column-span'])
    ) {
      modifiedAttributes.colSpan =
        vNode.properties.colSpan ||
        (vNode.properties.style && vNode.properties.style['column-span']);
      const previousSpanObject = rowSpanMap.get(columnIndex.index);
      rowSpanMap.set(
        columnIndex.index,
        // eslint-disable-next-line prefer-object-spread
        Object.assign({}, previousSpanObject, {
          colSpan: parseInt(modifiedAttributes.colSpan) || 0,
        })
      );
      columnIndex.index += parseInt(modifiedAttributes.colSpan) - 1;
    }
    if (vNode.properties.style) {
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
      fixupTableCellBorder(vNode, modifiedAttributes);
    }
  }
  const tableCellPropertiesFragment = buildTableCellProperties(modifiedAttributes);
  tableCellFragment.import(tableCellPropertiesFragment);
  if (vNodeHasChildren(vNode)) {
    for (let index = 0; index < vNode.children.length; index++) {
      const childVNode = vNode.children[index];
      if (isVNode(childVNode) && childVNode.tagName === 'img') {
        const imageFragment = buildImage(
          docxDocumentInstance,
          childVNode,
          modifiedAttributes.maximumWidth
        );
        if (imageFragment) {
          tableCellFragment.import(imageFragment);
        }
      } else if (isVNode(childVNode) && childVNode.tagName === 'figure') {
        if (vNodeHasChildren(childVNode)) {
          // eslint-disable-next-line no-plusplus
          for (let iteratorIndex = 0; iteratorIndex < childVNode.children.length; iteratorIndex++) {
            const grandChildVNode = childVNode.children[iteratorIndex];
            if ((grandChildVNode as any).tagName === 'img') {
              const imageFragment = buildImage(
                docxDocumentInstance,
                grandChildVNode,
                modifiedAttributes.maximumWidth
              );
              if (imageFragment) {
                tableCellFragment.import(imageFragment);
              }
            }
          }
        }
      } else if (isVNode(childVNode) && ['ul', 'ol'].includes(childVNode.tagName)) {
        // render list in table
        if (vNodeHasChildren(childVNode)) {
          buildList(childVNode, docxDocumentInstance, tableCellFragment);
        }
      } else {
        const paragraphFragment = buildParagraph(
          childVNode,
          modifiedAttributes,
          docxDocumentInstance
        );
        tableCellFragment.import(paragraphFragment);
      }
    }
  } else {
    // TODO: Figure out why building with buildParagraph() isn't working
    const paragraphFragment = fragment({ namespaceAlias: { w: namespaces.w } })
      .ele('@w', 'p')
      .up();
    tableCellFragment.import(paragraphFragment);
  }
  tableCellFragment.up();

  return tableCellFragment;
}

export const fixupTableCellBorder = (vNode: VirtualDOM.VNode, attributes) => {
  if (Object.prototype.hasOwnProperty.call(vNode.properties.style, 'border')) {
    if (vNode.properties.style.border === 'none' || vNode.properties.style.border === 0) {
      attributes.tableCellBorder = {};
    } else {
      // eslint-disable-next-line no-use-before-define
      const [borderSize, borderStroke, borderColor] = cssBorderParser(
        vNode.properties.style.border
      );

      attributes.tableCellBorder = {
        top: borderSize,
        left: borderSize,
        bottom: borderSize,
        right: borderSize,
        color: borderColor,
        stroke: borderStroke,
      };
    }
  }
  if (vNode.properties.style['border-top'] && vNode.properties.style['border-top'] === '0') {
    attributes.tableCellBorder = {
      ...attributes.tableCellBorder,
      top: 0,
    };
  } else if (vNode.properties.style['border-top'] && vNode.properties.style['border-top'] !== '0') {
    // eslint-disable-next-line no-use-before-define
    const [borderSize, borderStroke, borderColor] = cssBorderParser(
      vNode.properties.style['border-top']
    );
    attributes.tableCellBorder = {
      ...attributes.tableCellBorder,
      top: borderSize,
      color: borderColor,
      stroke: borderStroke,
    };
  }
  if (vNode.properties.style['border-left'] && vNode.properties.style['border-left'] === '0') {
    attributes.tableCellBorder = {
      ...attributes.tableCellBorder,
      left: 0,
    };
  } else if (
    vNode.properties.style['border-left'] &&
    vNode.properties.style['border-left'] !== '0'
  ) {
    // eslint-disable-next-line no-use-before-define
    const [borderSize, borderStroke, borderColor] = cssBorderParser(
      vNode.properties.style['border-left']
    );
    attributes.tableCellBorder = {
      ...attributes.tableCellBorder,
      left: borderSize,
      color: borderColor,
      stroke: borderStroke,
    };
  }
  if (vNode.properties.style['border-bottom'] && vNode.properties.style['border-bottom'] === '0') {
    attributes.tableCellBorder = {
      ...attributes.tableCellBorder,
      bottom: 0,
    };
  } else if (
    vNode.properties.style['border-bottom'] &&
    vNode.properties.style['border-bottom'] !== '0'
  ) {
    // eslint-disable-next-line no-use-before-define
    const [borderSize, borderStroke, borderColor] = cssBorderParser(
      vNode.properties.style['border-bottom']
    );
    attributes.tableCellBorder = {
      ...attributes.tableCellBorder,
      bottom: borderSize,
      color: borderColor,
      stroke: borderStroke,
    };
  }
  if (vNode.properties.style['border-right'] && vNode.properties.style['border-right'] === '0') {
    attributes.tableCellBorder = {
      ...attributes.tableCellBorder,
      right: 0,
    };
  } else if (
    vNode.properties.style['border-right'] &&
    vNode.properties.style['border-right'] !== '0'
  ) {
    // eslint-disable-next-line no-use-before-define
    const [borderSize, borderStroke, borderColor] = cssBorderParser(
      vNode.properties.style['border-right']
    );
    attributes.tableCellBorder = {
      ...attributes.tableCellBorder,
      right: borderSize,
      color: borderColor,
      stroke: borderStroke,
    };
  }
};
