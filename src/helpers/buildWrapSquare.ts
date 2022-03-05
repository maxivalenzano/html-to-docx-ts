import { fragment } from 'xmlbuilder2';
import namespaces from '../namespaces';

export function buildWrapSquare() {
  return fragment({ namespaceAlias: { wp: namespaces.wp } })
    .ele('@wp', 'wrapSquare')
    .att('wrapText', 'bothSides')
    .att('distB', '228600')
    .att('distT', '228600')
    .att('distL', '228600')
    .att('distR', '228600')
    .up();
}
