import { fragment } from 'xmlbuilder2';
import namespaces from '../namespaces';

export function buildExtents({ width, height }) {
  return fragment({ namespaceAlias: { a: namespaces.a } })
    .ele('@a', 'ext')
    .att('cx', width)
    .att('cy', height)
    .up();
}
