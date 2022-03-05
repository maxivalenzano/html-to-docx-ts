import { fragment } from 'xmlbuilder2';
import namespaces from '../namespaces';
import { buildBorder } from './buildBorder';
import { buildHorizontalAlignment } from './buildFragments';

export function buildTableProperties(attributes) {
  const tablePropertiesFragment = fragment({ namespaceAlias: { w: namespaces.w } }).ele(
    '@w',
    'tblPr'
  );

  if (attributes && attributes.constructor === Object) {
    Object.keys(attributes).forEach((key) => {
      switch (key) {
        case 'tableBorder': {
          const tableBordersFragment = buildTableBorders(attributes[key]);
          tablePropertiesFragment.import(tableBordersFragment);
          // eslint-disable-next-line no-param-reassign
          delete attributes.tableBorder;
          break;
        }
        case 'tableCellSpacing': {
          const tableCellSpacingFragment = buildTableCellSpacing(attributes[key]);
          tablePropertiesFragment.import(tableCellSpacingFragment);
          // eslint-disable-next-line no-param-reassign
          delete attributes.tableCellSpacing;
          break;
        }
        case 'width': {
          if (attributes[key]) {
            const tableWidthFragment = buildTableWidth(attributes[key]);
            tablePropertiesFragment.import(tableWidthFragment);
          }
          // eslint-disable-next-line no-param-reassign
          delete attributes.width;
          break;
        }
      }
    });
  }
  const tableCellMarginFragment = buildTableCellMargins(160);
  tablePropertiesFragment.import(tableCellMarginFragment);

  // by default, all tables are center aligned.
  const alignmentFragment = buildHorizontalAlignment('center');
  tablePropertiesFragment.import(alignmentFragment);

  tablePropertiesFragment.up();

  return tablePropertiesFragment;
}

export const buildTableBorders = (tableBorder) => {
  const tableBordersFragment = fragment({ namespaceAlias: { w: namespaces.w } }).ele(
    '@w',
    'tblBorders'
  );

  const { color, stroke, ...borders } = tableBorder;

  Object.keys(borders).forEach((border) => {
    if (borders[border]) {
      const borderFragment = buildBorder(border, borders[border], 0, color, stroke);
      tableBordersFragment.import(borderFragment);
    }
  });

  tableBordersFragment.up();

  return tableBordersFragment;
};

export const buildTableCellSpacing = (cellSpacing = 0) =>
  fragment({ namespaceAlias: { w: namespaces.w } })
    .ele('@w', 'tblCellSpacing')
    .att('@w', 'w', cellSpacing.toString())
    .att('@w', 'type', 'dxa')
    .up();

export const buildTableWidth = (tableWidth) =>
  fragment({ namespaceAlias: { w: namespaces.w } })
    .ele('@w', 'tblW')
    .att('@w', 'type', 'dxa')
    .att('@w', 'w', String(tableWidth))
    .up();

export const buildTableCellMargins = (margin) => {
  const tableCellMarFragment = fragment({ namespaceAlias: { w: namespaces.w } }).ele(
    '@w',
    'tblCellMar'
  );

  ['top', 'bottom'].forEach((side) => {
    const marginFragment = buildCellMargin(side, margin / 2);
    tableCellMarFragment.import(marginFragment);
  });
  ['left', 'right'].forEach((side) => {
    const marginFragment = buildCellMargin(side, margin);
    tableCellMarFragment.import(marginFragment);
  });

  return tableCellMarFragment;
};
const buildCellMargin = (side, margin) =>
  fragment({ namespaceAlias: { w: namespaces.w } })
    .ele('@w', side)
    .att('@w', 'type', 'dxa')
    .att('@w', 'w', String(margin))
    .up();
