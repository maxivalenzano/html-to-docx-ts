import { pixelRegex, pointRegex, pointToTWIP, pixelToTWIP } from '../utils/unit-conversion';

// eslint-disable-next-line consistent-return

export function fixupMargin(marginString) {
  if (pointRegex.test(marginString)) {
    const matchedParts = marginString.match(pointRegex);
    // convert point to half point
    return pointToTWIP(matchedParts[1]);
  } else if (pixelRegex.test(marginString)) {
    const matchedParts = marginString.match(pixelRegex);
    // convert pixels to half point
    return pixelToTWIP(matchedParts[1]);
  }
}
