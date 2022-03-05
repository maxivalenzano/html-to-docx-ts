import {
  buildBold,
  buildItalics,
  buildUnderline,
  buildStrike,
  buildVertAlign,
  buildHighlight,
  buildRunFontFragment,
} from './buildFragments';

// eslint-disable-next-line consistent-return

export function buildTextFormatting(vNode) {
  switch (vNode.tagName) {
    case 'strong':
    case 'b':
      return buildBold();
    case 'em':
    case 'i':
      return buildItalics();
    case 'ins':
    case 'u':
      return buildUnderline();
    case 'strike':
    case 'del':
    case 's':
      return buildStrike();
    case 'sub':
      return buildVertAlign('subscript');
    case 'sup':
      return buildVertAlign('superscript');
    case 'mark':
      return buildHighlight();
    case 'code':
      return buildHighlight('lightGray');
    case 'pre':
      return buildRunFontFragment('Courier');
  }
}
