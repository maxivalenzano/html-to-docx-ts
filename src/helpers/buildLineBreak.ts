import { fragment } from 'xmlbuilder2';
import namespaces from '../namespaces';

export function buildLineBreak(type = 'textWrapping') {
  return fragment({ namespaceAlias: { w: namespaces.w } })
    .ele('@w', 'br')
    .att('@w', 'type', type)
    .up();
}
