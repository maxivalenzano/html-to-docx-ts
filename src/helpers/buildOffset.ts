import { fragment } from 'xmlbuilder2';
import namespaces from '../namespaces';

export function buildOffset() {
  return fragment({ namespaceAlias: { a: namespaces.a } })
    .ele('@a', 'off')
    .att('x', '0')
    .att('y', '0')
    .up();
}
