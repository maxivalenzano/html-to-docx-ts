import { fragment } from 'xmlbuilder2';
import namespaces from '../namespaces';

export function buildNonVisualPictureDrawingProperties() {
  return fragment({ namespaceAlias: { pic: namespaces.pic } })
    .ele('@pic', 'cNvPicPr')
    .up();
}
