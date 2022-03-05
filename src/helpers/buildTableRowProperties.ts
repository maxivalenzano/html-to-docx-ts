import { fragment } from 'xmlbuilder2';
import namespaces from '../namespaces';
import { buildTableRowHeight } from './buildFragments';

export function buildTableRowProperties(attributes) {
  const tableRowPropertiesFragment = fragment({ namespaceAlias: { w: namespaces.w } }).ele(
    '@w',
    'trPr'
  );
  if (attributes && attributes.constructor === Object) {
    Object.keys(attributes).forEach((key) => {
      switch (key) {
        case 'tableRowHeight': {
          const tableRowHeightFragment = buildTableRowHeight(attributes[key]);
          tableRowPropertiesFragment.import(tableRowHeightFragment);
          // eslint-disable-next-line no-param-reassign
          delete attributes.tableRowHeight;
          break;
        }
        case 'rowCantSplit': {
          if (attributes.rowCantSplit) {
            const cantSplitFragment = fragment({ namespaceAlias: { w: namespaces.w } })
              .ele('@w', 'cantSplit')
              .up();
            tableRowPropertiesFragment.import(cantSplitFragment);
            // eslint-disable-next-line no-param-reassign
            delete attributes.rowCantSplit;
          }
          break;
        }
      }
    });
  }
  tableRowPropertiesFragment.up();
  return tableRowPropertiesFragment;
}
