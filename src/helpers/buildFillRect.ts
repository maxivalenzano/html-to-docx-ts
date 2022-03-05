import { fragment } from 'xmlbuilder2';
import namespaces from '../namespaces';

export function buildFillRect() {
  return fragment({ namespaceAlias: { a: namespaces.a } })
    .ele('@a', 'fillRect')
    .up();
}
