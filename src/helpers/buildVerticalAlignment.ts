import { fragment } from 'xmlbuilder2';
import namespaces from '../namespaces';

export function buildVerticalAlignment(verticalAlignment) {
  if (verticalAlignment.toLowerCase() === 'middle') {
    verticalAlignment = 'center';
  }

  return fragment({ namespaceAlias: { w: namespaces.w } })
    .ele('@w', 'vAlign')
    .att('@w', 'val', verticalAlignment)
    .up();
}
