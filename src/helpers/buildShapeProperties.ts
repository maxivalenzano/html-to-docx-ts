import { fragment } from 'xmlbuilder2';
import namespaces from '../namespaces';
import { buildPresetGeometry } from './buildPresetGeometry';
import { buildGraphicFrameTransform } from './buildGraphicFrameTransform';

export function buildShapeProperties(attributes) {
  const shapeProperties = fragment({ namespaceAlias: { pic: namespaces.pic } }).ele('@pic', 'spPr');

  const graphicFrameTransformFragment = buildGraphicFrameTransform(attributes);
  shapeProperties.import(graphicFrameTransformFragment);
  const presetGeometryFragment = buildPresetGeometry();
  shapeProperties.import(presetGeometryFragment);

  shapeProperties.up();

  return shapeProperties;
}
