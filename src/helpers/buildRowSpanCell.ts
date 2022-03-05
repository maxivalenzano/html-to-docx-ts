import { fragment } from 'xmlbuilder2';
import namespaces from '../namespaces';
import { buildTableCellProperties } from './buildTableCellProperties';

export function buildRowSpanCell(rowSpanMap, columnIndex, attributes) {
  const rowSpanCellFragments = [];
  let spanObject = rowSpanMap.get(columnIndex.index);
  while (spanObject && spanObject.rowSpan) {
    const rowSpanCellFragment = fragment({ namespaceAlias: { w: namespaces.w } }).ele('@w', 'tc');

    const tableCellPropertiesFragment = buildTableCellProperties({
      ...attributes,
      rowSpan: 'continue',
      colSpan: spanObject.colSpan ? spanObject.colSpan : 0,
    });
    rowSpanCellFragment.import(tableCellPropertiesFragment);

    const paragraphFragment = fragment({ namespaceAlias: { w: namespaces.w } })
      .ele('@w', 'p')
      .up();
    rowSpanCellFragment.import(paragraphFragment);
    rowSpanCellFragment.up();

    rowSpanCellFragments.push(rowSpanCellFragment);

    if (spanObject.rowSpan - 1 === 0) {
      rowSpanMap.delete(columnIndex.index);
    } else {
      rowSpanMap.set(columnIndex.index, {
        rowSpan: spanObject.rowSpan - 1,
        colSpan: spanObject.colSpan || 0,
      });
    }
    columnIndex.index += spanObject.colSpan || 1;
    spanObject = rowSpanMap.get(columnIndex.index);
  }

  return rowSpanCellFragments;
}
