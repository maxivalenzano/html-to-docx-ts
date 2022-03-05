import { pixelRegex, pointRegex, pointToHIP, pixelToHIP } from '../utils/unit-conversion';

// eslint-disable-next-line consistent-return

export function fixupFontSize(fontSizeString) {
  if (pointRegex.test(fontSizeString)) {
    const matchedParts = fontSizeString.match(pointRegex);
    // convert point to half point
    return pointToHIP(matchedParts[1]);
  } else if (pixelRegex.test(fontSizeString)) {
    const matchedParts = fontSizeString.match(pixelRegex);
    // convert pixels to half point
    return pixelToHIP(matchedParts[1]);
  }
}
