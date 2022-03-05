import { fragment } from 'xmlbuilder2';
import namespaces from '../namespaces';

export function buildPositionV() {
  return fragment({ namespaceAlias: { wp: namespaces.wp } })
    .ele('@wp', 'positionV')
    .att('relativeFrom', 'paragraph')
    .ele('@wp', 'posOffset')
    .txt('19050')
    .up()
    .up();
}
