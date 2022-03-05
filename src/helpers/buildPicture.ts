import { fragment } from 'xmlbuilder2';
import namespaces from '../namespaces';
import { buildShapeProperties } from './buildShapeProperties';
import { buildBinaryLargeImageOrPictureFill } from './buildBinaryLargeImageOrPictureFill';
import { buildNonVisualPictureProperties } from './buildNonVisualPictureProperties';

export function buildPicture({
  id,
  fileNameWithExtension,
  description,
  relationshipId,
  width,
  height,
}) {
  const pictureFragment = fragment({ namespaceAlias: { pic: namespaces.pic } }).ele('@pic', 'pic');
  const nonVisualPicturePropertiesFragment = buildNonVisualPictureProperties(
    id,
    fileNameWithExtension,
    description
  );
  pictureFragment.import(nonVisualPicturePropertiesFragment);
  const binaryLargeImageOrPictureFill = buildBinaryLargeImageOrPictureFill(relationshipId);
  pictureFragment.import(binaryLargeImageOrPictureFill);
  const shapeProperties = buildShapeProperties({ width, height });
  pictureFragment.import(shapeProperties);
  pictureFragment.up();

  return pictureFragment;
}
