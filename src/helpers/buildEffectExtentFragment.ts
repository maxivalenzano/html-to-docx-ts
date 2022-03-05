import { fragment } from 'xmlbuilder2';
import namespaces from '../namespaces';

export function buildEffectExtentFragment() {
  return fragment({ namespaceAlias: { wp: namespaces.wp } })
    .ele('@wp', 'effectExtent')
    .att('b', '0')
    .att('l', '0')
    .att('r', '0')
    .att('t', '0')
    .up();
}
