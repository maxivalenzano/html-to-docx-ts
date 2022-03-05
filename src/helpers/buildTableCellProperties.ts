import { fragment } from 'xmlbuilder2';
import namespaces from '../namespaces';
import { buildVerticalMerge } from './buildVerticalMerge';
import { buildGridSpanFragment } from './buildGridSpanFragment';
import { buildVerticalAlignment } from './buildVerticalAlignment';
import { buildShading } from './buildShading';
import { buildBorder } from './buildBorder';

export function buildTableCellProperties(attributes) {
  const tableCellPropertiesFragment = fragment({ namespaceAlias: { w: namespaces.w } }).ele(
    '@w',
    'tcPr'
  );
  if (attributes && attributes.constructor === Object) {
    Object.keys(attributes).forEach((key) => {
      switch (key) {
        case 'backgroundColor': {
          const shadingFragment = buildShading(attributes[key]);
          tableCellPropertiesFragment.import(shadingFragment);
          // eslint-disable-next-line no-param-reassign
          delete attributes.backgroundColor;
          break;
        }
        case 'verticalAlign': {
          const verticalAlignmentFragment = buildVerticalAlignment(attributes[key]);
          tableCellPropertiesFragment.import(verticalAlignmentFragment);
          // eslint-disable-next-line no-param-reassign
          delete attributes.verticalAlign;
          break;
        }
        case 'colSpan': {
          const gridSpanFragment = buildGridSpanFragment(attributes[key]);
          tableCellPropertiesFragment.import(gridSpanFragment);
          // eslint-disable-next-line no-param-reassign
          delete attributes.colSpan;
          break;
        }
        case 'tableCellBorder': {
          const tableCellBorderFragment = buildTableCellBorders(attributes[key]);
          tableCellPropertiesFragment.import(tableCellBorderFragment);
          // eslint-disable-next-line no-param-reassign
          delete attributes.tableCellBorder;
          break;
        }
        case 'rowSpan': {
          const verticalMergeFragment = buildVerticalMerge(attributes[key]);
          tableCellPropertiesFragment.import(verticalMergeFragment);

          delete attributes.rowSpan;
          break;
        }
      }
    });
  }
  tableCellPropertiesFragment.up();

  return tableCellPropertiesFragment;
}
export const buildTableCellBorders = (tableCellBorder) => {
  const tableCellBordersFragment = fragment({ namespaceAlias: { w: namespaces.w } }).ele(
    '@w',
    'tcBorders'
  );

  const { color, stroke, ...borders } = tableCellBorder;
  Object.keys(borders).forEach((border) => {
    if (tableCellBorder[border]) {
      const borderFragment = buildBorder(border, tableCellBorder[border], 0, color, stroke);
      tableCellBordersFragment.import(borderFragment);
    }
  });

  tableCellBordersFragment.up();

  return tableCellBordersFragment;
};
