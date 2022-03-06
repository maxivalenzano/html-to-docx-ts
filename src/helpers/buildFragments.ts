import { defaultFont } from '../constants';
import { fragment } from 'xmlbuilder2';
import namespaces from '../namespaces';

const buildBold = () =>
  fragment({ namespaceAlias: { w: namespaces.w } })
    .ele('@w', 'b')
    .up();

const buildItalics = () =>
  fragment({ namespaceAlias: { w: namespaces.w } })
    .ele('@w', 'i')
    .up();

const buildUnderline = (type = 'single') =>
  fragment({ namespaceAlias: { w: namespaces.w } })
    .ele('@w', 'u')
    .att('@w', 'val', type)
    .up();

export const buildRunFontFragment = (fontName: string = defaultFont) =>
  fragment({ namespaceAlias: { w: namespaces.w } })
    .ele('@w', 'rFonts')
    .att('@w', 'ascii', fontName)
    .att('@w', 'hAnsi', fontName)
    .up();

export const buildRunStyleFragment = (type = 'Hyperlink') =>
  fragment({ namespaceAlias: { w: namespaces.w } })
    .ele('@w', 'rStyle')
    .att('@w', 'val', type)
    .up();

export const buildTableRowHeight = (tableRowHeight: string) =>
  fragment({ namespaceAlias: { w: namespaces.w } })
    .ele('@w', 'trHeight')
    .att('@w', 'val', tableRowHeight)
    .att('@w', 'hRule', 'atLeast')
    .up();

export const buildColor = (colorCode: string) =>
  fragment({ namespaceAlias: { w: namespaces.w } })
    .ele('@w', 'color')
    .att('@w', 'val', colorCode)
    .up();

export const buildFontSize = (fontSize: number) =>
  fragment({ namespaceAlias: { w: namespaces.w } })
    .ele('@w', 'sz')
    .att('@w', 'val', fontSize.toString())
    .up();

export const buildHighlight = (color = 'yellow') =>
  fragment({ namespaceAlias: { w: namespaces.w } })
    .ele('@w', 'highlight')
    .att('@w', 'val', color)
    .up();

export const buildVertAlign = (type = 'baseline') =>
  fragment({ namespaceAlias: { w: namespaces.w } })
    .ele('@w', 'vertAlign')
    .att('@w', 'val', type)
    .up();

export const buildStrike = () =>
  fragment({ namespaceAlias: { w: namespaces.w } })
    .ele('@w', 'strike')
    .att('@w', 'val', 'true')
    .up();

export const buildNumberingProperties = (levelId, numberingId) =>
  fragment({ namespaceAlias: { w: namespaces.w } })
    .ele('@w', 'numPr')
    .ele('@w', 'ilvl')
    .att('@w', 'val', String(levelId))
    .up()
    .ele('@w', 'numId')
    .att('@w', 'val', String(numberingId))
    .up()
    .up();

const buildNumberingInstances = () =>
  fragment({ namespaceAlias: { w: namespaces.w } })
    .ele('@w', 'num')
    .ele('@w', 'abstractNumId')
    .up()
    .up();

export const buildSpacing = (lineSpacing, beforeSpacing, afterSpacing) => {
  const spacingFragment = fragment({ namespaceAlias: { w: namespaces.w } }).ele('@w', 'spacing');

  if (lineSpacing) {
    spacingFragment.att('@w', 'line', lineSpacing);
  }
  if (beforeSpacing) {
    spacingFragment.att('@w', 'before', beforeSpacing);
  }
  if (afterSpacing) {
    spacingFragment.att('@w', 'after', afterSpacing);
  }

  spacingFragment.att('@w', 'lineRule', 'exact').up();

  return spacingFragment;
};

export const buildIndentation = ({ left, right }) => {
  const indentationFragment = fragment({
    namespaceAlias: { w: namespaces.w },
  }).ele('@w', 'ind');

  if (left) {
    indentationFragment.att('@w', 'left', left);
  }
  if (right) {
    indentationFragment.att('@w', 'right', right);
  }

  indentationFragment.up();

  return indentationFragment;
};

export const buildPStyle = (style = 'Normal') =>
  fragment({ namespaceAlias: { w: namespaces.w } })
    .ele('@w', 'pStyle')
    .att('@w', 'val', style)
    .up();

export const buildHorizontalAlignment = (horizontalAlignment) => {
  if (horizontalAlignment === 'justify') {
    horizontalAlignment = 'both';
  }
  return fragment({ namespaceAlias: { w: namespaces.w } })
    .ele('@w', 'jc')
    .att('@w', 'val', horizontalAlignment)
    .up();
};

export { buildBold, buildItalics, buildUnderline, buildNumberingInstances };
