import { fragment } from 'xmlbuilder2';
import namespaces from '../namespaces';
import { buildAnchoredDrawing } from './buildAnchoredDrawing';
import { buildInlineDrawing } from './buildInlineDrawing';

export function buildDrawing(inlineOrAnchored = false, graphicType, attributes) {
  const drawingFragment = fragment({ namespaceAlias: { w: namespaces.w } }).ele('@w', 'drawing');
  const inlineOrAnchoredDrawingFragment = inlineOrAnchored
    ? buildInlineDrawing(graphicType, attributes)
    : buildAnchoredDrawing(graphicType, attributes);
  drawingFragment.import(inlineOrAnchoredDrawingFragment);
  drawingFragment.up();

  return drawingFragment;
}
