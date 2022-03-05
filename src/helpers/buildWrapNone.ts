import { fragment } from 'xmlbuilder2';
import namespaces from '../namespaces';

// FIXME: remove the cyclic dependency
// eslint-disable-next-line no-unused-vars
export function buildWrapNone() {
  return fragment({ namespaceAlias: { wp: namespaces.wp } })
    .ele('@wp', 'wrapNone')
    .up();
}
