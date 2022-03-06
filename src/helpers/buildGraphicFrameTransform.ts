import { fragment } from 'xmlbuilder2';
import namespaces from '../namespaces';
import { buildExtents, ExtentProps } from './buildExtents';
import { buildOffset } from './buildOffset';

export function buildGraphicFrameTransform(attributes: ExtentProps) {
  const graphicFrameTransformFragment = fragment({ namespaceAlias: { a: namespaces.a } }).ele(
    '@a',
    'xfrm'
  );

  const offsetFragment = buildOffset();
  graphicFrameTransformFragment.import(offsetFragment);
  const extentsFragment = buildExtents(attributes);
  graphicFrameTransformFragment.import(extentsFragment);

  graphicFrameTransformFragment.up();

  return graphicFrameTransformFragment;
}
