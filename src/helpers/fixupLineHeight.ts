import { HIPToTWIP } from '../utils/unit-conversion';

// eslint-disable-next-line consistent-return
export function fixupLineHeight(lineHeight, fontSize) {
  // FIXME: If line height is anything other than a number
  // eslint-disable-next-line no-restricted-globals
  if (!isNaN(lineHeight)) {
    if (fontSize) {
      const actualLineHeight = +lineHeight * fontSize;

      return HIPToTWIP(actualLineHeight);
    } else {
      // 240 TWIP or 12 point is default line height
      return +lineHeight * 240;
    }
  } else {
    // 240 TWIP or 12 point is default line height
    return 240;
  }
}
