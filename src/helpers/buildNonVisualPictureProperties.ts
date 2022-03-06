import { fragment } from 'xmlbuilder2';
import namespaces from '../namespaces';
import { buildNonVisualPictureDrawingProperties } from './buildNonVisualPictureDrawingProperties';
import { buildNonVisualDrawingProperties } from './buildNonVisualDrawingProperties';

export function buildNonVisualPictureProperties(
  pictureId: string,
  pictureNameWithExtension: string,
  pictureDescription: string
) {
  const nonVisualPicturePropertiesFragment = fragment({
    namespaceAlias: { pic: namespaces.pic },
  }).ele('@pic', 'nvPicPr');
  // TODO: Handle picture attributes
  const nonVisualDrawingPropertiesFragment = buildNonVisualDrawingProperties(
    pictureId,
    pictureNameWithExtension,
    pictureDescription
  );
  nonVisualPicturePropertiesFragment.import(nonVisualDrawingPropertiesFragment);
  const nonVisualPictureDrawingPropertiesFragment = buildNonVisualPictureDrawingProperties();
  nonVisualPicturePropertiesFragment.import(nonVisualPictureDrawingPropertiesFragment);
  nonVisualPicturePropertiesFragment.up();

  return nonVisualPicturePropertiesFragment;
}
