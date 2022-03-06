import { fragment } from 'xmlbuilder2';
import namespaces from '../namespaces';

export function buildDrawingObjectNonVisualProperties(pictureId: string, pictureName: string) {
  return fragment({ namespaceAlias: { wp: namespaces.wp } })
    .ele('@wp', 'docPr')
    .att('id', pictureId)
    .att('name', pictureName)
    .up();
}
