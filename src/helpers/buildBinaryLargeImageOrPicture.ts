import { fragment } from 'xmlbuilder2';
import namespaces from '../namespaces';

export function buildBinaryLargeImageOrPicture(relationshipId: string) {
  return (
    fragment({
      namespaceAlias: { a: namespaces.a, r: namespaces.r },
    })
      .ele('@a', 'a:blip')
      .att('@r', 'r:embed', `rId${relationshipId}`)
      // FIXME: possible values 'email', 'none', 'print', 'hqprint', 'screen'
      .att('cstate', 'print')
      .up()
  );
}
