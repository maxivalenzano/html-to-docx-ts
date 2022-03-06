import { fragment } from 'xmlbuilder2';
import namespaces from '../namespaces';
import {
  buildBold,
  buildItalics,
  buildUnderline,
  buildColor,
  buildFontSize,
  buildRunStyleFragment,
  buildHighlight,
  buildRunFontFragment,
} from './buildFragments';
import { buildShading } from './buildShading';

export type RunAttributes = {
  [x: string]: string | number | any;
  constructor?: any;
  fontSize?: number;
};

export function buildRunProperties(attributes: RunAttributes) {
  const runPropertiesFragment = fragment({ namespaceAlias: { w: namespaces.w } }).ele('@w', 'rPr');
  if (attributes && attributes.constructor === Object) {
    Object.keys(attributes).forEach((key) => {
      switch (key) {
        case 'strong':
          runPropertiesFragment.import(buildBold());
          break;
        case 'i':
          runPropertiesFragment.import(buildItalics());
          break;
        case 'u':
          runPropertiesFragment.import(buildUnderline());
          break;
        case 'color':
          runPropertiesFragment.import(buildColor(attributes[key]));
          break;
        case 'backgroundColor':
          runPropertiesFragment.import(buildShading(attributes[key]));
          break;
        case 'fontSize':
          runPropertiesFragment.import(buildFontSize(attributes[key]));
          break;
        case 'hyperlink':
          runPropertiesFragment.import(buildRunStyleFragment('Hyperlink'));
          break;
        case 'highlightColor':
          runPropertiesFragment.import(buildHighlight(attributes[key]));
          break;
        case 'font':
          runPropertiesFragment.import(buildRunFontFragment('Courier'));
          break;
      }
    });
  }
  runPropertiesFragment.up();

  return runPropertiesFragment;
}
