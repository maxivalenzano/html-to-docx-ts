import { fragment } from 'xmlbuilder2';
import namespaces from '../namespaces';

export function buildTableGridCol(gridWidth) {
  return fragment({ namespaceAlias: { w: namespaces.w } })
    .ele('@w', 'gridCol')
    .att('@w', 'w', String(gridWidth));
}
