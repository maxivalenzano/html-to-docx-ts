import { fragment } from 'xmlbuilder2';
import namespaces from '../namespaces';

export function buildSimplePos() {
  return fragment({ namespaceAlias: { wp: namespaces.wp } })
    .ele('@wp', 'simplePos')
    .att('x', '0')
    .att('y', '0')
    .up();
}
