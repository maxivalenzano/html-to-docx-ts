import { fragment } from 'xmlbuilder2';
import isVNode from 'virtual-dom/vnode/is-vnode';
import namespaces from '../namespaces';
import { vNodeHasChildren } from '../utils/vnode';
import { fixupRowHeight } from './fixupRowHeight';
import { buildTableCell, fixupTableCellBorder } from './buildTableCell';
import { buildRowSpanCell } from './buildRowSpanCell';
import { buildTableRowProperties } from './buildTableRowProperties';

export function buildTableRow(vNode, attributes, rowSpanMap, docxDocumentInstance) {
  const tableRowFragment = fragment({ namespaceAlias: { w: namespaces.w } }).ele('@w', 'tr');
  const modifiedAttributes = { ...attributes };
  if (isVNode(vNode) && vNode.properties) {
    // FIXME: find a better way to get row height from cell style
    if (
      (vNode.properties.style && vNode.properties.style.height) ||
      (vNode.children[0] &&
        isVNode(vNode.children[0]) &&
        vNode.children[0].properties.style &&
        vNode.children[0].properties.style.height)
    ) {
      modifiedAttributes.tableRowHeight = fixupRowHeight(
        (vNode.properties.style && vNode.properties.style.height) ||
          (vNode.children[0] &&
          isVNode(vNode.children[0]) &&
          vNode.children[0].properties.style &&
          vNode.children[0].properties.style.height
            ? vNode.children[0].properties.style.height
            : undefined)
      );
    }
    if (vNode.properties.style) {
      fixupTableCellBorder(vNode, modifiedAttributes);
    }
  }
  const tableRowPropertiesFragment = buildTableRowProperties(modifiedAttributes);
  tableRowFragment.import(tableRowPropertiesFragment);

  const columnIndex = { index: 0 };

  if (vNodeHasChildren(vNode)) {
    const tableColumns = vNode.children.filter((childVNode) =>
      ['td', 'th'].includes(childVNode.tagName)
    );
    const columnWidth = docxDocumentInstance.availableDocumentSpace / tableColumns.length;

    for (let index = 0; index < vNode.children.length; index++) {
      const childVNode = vNode.children[index];
      if (['td', 'th'].includes(childVNode.tagName)) {
        const rowSpanCellFragments = buildRowSpanCell(rowSpanMap, columnIndex, modifiedAttributes);
        if (Array.isArray(rowSpanCellFragments)) {
          for (
            let iteratorIndex = 0;
            iteratorIndex < rowSpanCellFragments.length;
            iteratorIndex++
          ) {
            const rowSpanCellFragment = rowSpanCellFragments[iteratorIndex];

            tableRowFragment.import(rowSpanCellFragment);
          }
        }
        const tableCellFragment = buildTableCell(
          childVNode,
          { ...modifiedAttributes, maximumWidth: columnWidth },
          rowSpanMap,
          columnIndex,
          docxDocumentInstance
        );
        columnIndex.index++;

        tableRowFragment.import(tableCellFragment);
      }
    }
  }
  if (columnIndex.index < rowSpanMap.size) {
    const rowSpanCellFragments = buildRowSpanCell(rowSpanMap, columnIndex, modifiedAttributes);
    if (Array.isArray(rowSpanCellFragments)) {
      for (let iteratorIndex = 0; iteratorIndex < rowSpanCellFragments.length; iteratorIndex++) {
        const rowSpanCellFragment = rowSpanCellFragments[iteratorIndex];

        tableRowFragment.import(rowSpanCellFragment);
      }
    }
  }
  tableRowFragment.up();

  return tableRowFragment;
}
