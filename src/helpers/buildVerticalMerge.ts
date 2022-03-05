import { fragment } from 'xmlbuilder2';
import namespaces from '../namespaces';

export function buildVerticalMerge(verticalMerge = 'continue') {
  return fragment({ namespaceAlias: { w: namespaces.w } })
    .ele('@w', 'vMerge')
    .att('@w', 'val', verticalMerge)
    .up();
}
