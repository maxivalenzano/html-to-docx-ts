import { fragment } from 'xmlbuilder2';
import namespaces from '../namespaces';
import { buildPicture, PictureAttributes } from './buildPicture';

export function buildGraphicData(graphicType: string, attributes: PictureAttributes) {
  const graphicDataFragment = fragment({ namespaceAlias: { a: namespaces.a } })
    .ele('@a', 'graphicData')
    .att('uri', 'http://schemas.openxmlformats.org/drawingml/2006/picture');
  if (graphicType === 'picture') {
    const pictureFragment = buildPicture(attributes);
    graphicDataFragment.import(pictureFragment);
  }
  graphicDataFragment.up();

  return graphicDataFragment;
}
