import { fragment } from 'xmlbuilder2';
import namespaces from '../namespaces';

export function buildTextElement(text) {
  return fragment({ namespaceAlias: { w: namespaces.w } })
    .ele('@w', 't')
    .att('@xml', 'space', 'preserve')
    .txt(text)
    .up();
}
