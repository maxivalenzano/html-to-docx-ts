import { fragment } from 'xmlbuilder2';
import namespaces from '../namespaces';
import { buildGraphic } from './buildGraphic';
import { buildDrawingObjectNonVisualProperties } from './buildDrawingObjectNonVisualProperties';
import { buildEffectExtentFragment } from './buildEffectExtentFragment';
import { buildExtent } from './buildExtent';

export function buildInlineDrawing(graphicType, attributes) {
  const inlineDrawingFragment = fragment({ namespaceAlias: { wp: namespaces.wp } })
    .ele('@wp', 'wp:inline')
    .att('distB', '0')
    .att('distL', '0')
    .att('distR', '0')
    .att('distT', '0');

  const extentFragment = buildExtent({ width: attributes.width, height: attributes.height });
  inlineDrawingFragment.import(extentFragment);
  const effectExtentFragment = buildEffectExtentFragment();
  inlineDrawingFragment.import(effectExtentFragment);
  const drawingObjectNonVisualPropertiesFragment = buildDrawingObjectNonVisualProperties(
    attributes.id,
    attributes.fileNameWithExtension
  );
  inlineDrawingFragment.import(drawingObjectNonVisualPropertiesFragment);
  const graphicFragment = buildGraphic(graphicType, attributes);
  inlineDrawingFragment.import(graphicFragment);

  inlineDrawingFragment.up();

  return inlineDrawingFragment;
}
