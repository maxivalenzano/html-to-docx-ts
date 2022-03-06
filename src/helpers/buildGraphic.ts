import { PictureAttributes } from './buildPicture';
import { fragment } from 'xmlbuilder2';
import namespaces from '../namespaces';
import { buildGraphicData } from './buildGraphicData';

export function buildGraphic(graphicType: string, attributes: PictureAttributes) {
  const graphicFragment = fragment({ namespaceAlias: { a: namespaces.a } }).ele('@a', 'graphic');
  // TODO: Handle drawing type
  const graphicDataFragment = buildGraphicData(graphicType, attributes);
  graphicFragment.import(graphicDataFragment);
  graphicFragment.up();

  return graphicFragment;
}
