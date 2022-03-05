import { fragment } from 'xmlbuilder2';
import namespaces from '../namespaces';
import { buildExtent } from './buildExtent';
import { buildEffectExtentFragment } from './buildEffectExtentFragment';
import { buildDrawingObjectNonVisualProperties } from './buildDrawingObjectNonVisualProperties';
import { buildGraphic } from './buildGraphic';
import { buildSimplePos } from './buildSimplePos';
import { buildPositionH } from './buildPositionH';
import { buildPositionV } from './buildPositionV';
import { buildWrapSquare } from './buildWrapSquare';

export function buildAnchoredDrawing(graphicType, attributes) {
  const anchoredDrawingFragment = fragment({ namespaceAlias: { wp: namespaces.wp } })
    .ele('@wp', 'anchor')
    .att('distB', '0')
    .att('distL', '0')
    .att('distR', '0')
    .att('distT', '0')
    .att('relativeHeight', '0')
    .att('behindDoc', 'false')
    .att('locked', 'true')
    .att('layoutInCell', 'true')
    .att('allowOverlap', 'false')
    .att('simplePos', 'false');
  // Even though simplePos isnt supported by Word 2007 simplePos is required.
  const simplePosFragment = buildSimplePos();
  anchoredDrawingFragment.import(simplePosFragment);
  const positionHFragment = buildPositionH();
  anchoredDrawingFragment.import(positionHFragment);
  const positionVFragment = buildPositionV();
  anchoredDrawingFragment.import(positionVFragment);
  const extentFragment = buildExtent({ width: attributes.width, height: attributes.height });
  anchoredDrawingFragment.import(extentFragment);
  const effectExtentFragment = buildEffectExtentFragment();
  anchoredDrawingFragment.import(effectExtentFragment);
  const wrapSquareFragment = buildWrapSquare();
  anchoredDrawingFragment.import(wrapSquareFragment);
  const drawingObjectNonVisualPropertiesFragment = buildDrawingObjectNonVisualProperties(
    attributes.id,
    attributes.fileNameWithExtension
  );
  anchoredDrawingFragment.import(drawingObjectNonVisualPropertiesFragment);
  const graphicFragment = buildGraphic(graphicType, attributes);
  anchoredDrawingFragment.import(graphicFragment);

  anchoredDrawingFragment.up();

  return anchoredDrawingFragment;
}
