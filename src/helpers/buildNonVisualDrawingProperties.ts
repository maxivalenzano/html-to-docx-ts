import { fragment } from 'xmlbuilder2';
import namespaces from '../namespaces';

export function buildNonVisualDrawingProperties(
  pictureId: string,
  pictureNameWithExtension: string,
  pictureDescription = ''
) {
  return fragment({ namespaceAlias: { pic: namespaces.pic } })
    .ele('@pic', 'cNvPr')
    .att('id', pictureId)
    .att('name', pictureNameWithExtension)
    .att('descr', pictureDescription)
    .up();
}
