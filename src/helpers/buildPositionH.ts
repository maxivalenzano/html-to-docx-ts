import { fragment } from 'xmlbuilder2';
import namespaces from '../namespaces';

export function buildPositionH() {
  return fragment({ namespaceAlias: { wp: namespaces.wp } })
    .ele('@wp', 'positionH')
    .att('relativeFrom', 'column')
    .ele('@wp', 'posOffset')
    .txt('19050')
    .up()
    .up();
}
