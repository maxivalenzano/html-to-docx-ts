import { fragment } from 'xmlbuilder2';
import namespaces from '../namespaces';

export function buildGridSpanFragment(spanValue) {
  return fragment({ namespaceAlias: { w: namespaces.w } })
    .ele('@w', 'gridSpan')
    .att('@w', 'val', spanValue)
    .up();
}
