import { fragment } from 'xmlbuilder2';
import namespaces from '../namespaces';

export type ExtentProps = {
  width: string;
  height: string;
};

export function buildExtents({ width, height }: ExtentProps) {
  return fragment({ namespaceAlias: { a: namespaces.a } })
    .ele('@a', 'ext')
    .att('cx', width)
    .att('cy', height)
    .up();
}
