import { fragment } from 'xmlbuilder2';
import namespaces from '../namespaces';

export function buildPresetGeometry() {
  return fragment({ namespaceAlias: { a: namespaces.a } })
    .ele('@a', 'prstGeom')
    .att('prst', 'rect')
    .up();
}
