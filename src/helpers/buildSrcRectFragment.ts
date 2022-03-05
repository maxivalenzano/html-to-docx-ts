import { fragment } from 'xmlbuilder2';
import namespaces from '../namespaces';

export function buildSrcRectFragment() {
  return fragment({ namespaceAlias: { a: namespaces.a } })
    .ele('@a', 'srcRect')
    .att('b', '0')
    .att('l', '0')
    .att('r', '0')
    .att('t', '0')
    .up();
}
