import { fragment } from 'xmlbuilder2';
import namespaces from '../namespaces';
import { buildStretch } from './buildStretch';
import { buildSrcRectFragment } from './buildSrcRectFragment';
import { buildBinaryLargeImageOrPicture } from './buildBinaryLargeImageOrPicture';

export function buildBinaryLargeImageOrPictureFill(relationshipId) {
  const binaryLargeImageOrPictureFillFragment = fragment({
    namespaceAlias: { pic: namespaces.pic },
  }).ele('@pic', 'blipFill');
  const binaryLargeImageOrPictureFragment = buildBinaryLargeImageOrPicture(relationshipId);
  binaryLargeImageOrPictureFillFragment.import(binaryLargeImageOrPictureFragment);
  const srcRectFragment = buildSrcRectFragment();
  binaryLargeImageOrPictureFillFragment.import(srcRectFragment);
  const stretchFragment = buildStretch();
  binaryLargeImageOrPictureFillFragment.import(stretchFragment);

  binaryLargeImageOrPictureFillFragment.up();

  return binaryLargeImageOrPictureFillFragment;
}
