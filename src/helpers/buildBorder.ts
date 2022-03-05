import { fragment } from 'xmlbuilder2';
import namespaces from '../namespaces';
import { fixupColorCode } from './fixupColorCode';

export function buildBorder(
  borderSide = 'top',
  borderSize = 0,
  borderSpacing = 0,
  borderColor = fixupColorCode('black'),
  borderStroke = 'single'
) {
  return fragment({ namespaceAlias: { w: namespaces.w } })
    .ele('@w', borderSide)
    .att('@w', 'val', borderStroke)
    .att('@w', 'sz', borderSize.toString())
    .att('@w', 'space', borderSpacing.toString())
    .att('@w', 'color', borderColor)
    .up();
}
