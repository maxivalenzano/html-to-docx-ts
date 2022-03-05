import { fragment } from 'xmlbuilder2';
import namespaces from '../namespaces';
import { buildFillRect } from './buildFillRect';

export function buildStretch() {
  const stretchFragment = fragment({ namespaceAlias: { a: namespaces.a } }).ele('@a', 'stretch');

  const fillRectFragment = buildFillRect();
  stretchFragment.import(fillRectFragment);

  stretchFragment.up();

  return stretchFragment;
}
