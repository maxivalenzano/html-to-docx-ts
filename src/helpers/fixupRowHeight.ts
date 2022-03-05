import { pixelRegex, pointRegex, pointToTWIP, pixelToTWIP } from '../utils/unit-conversion';

// eslint-disable-next-line consistent-return
export function fixupRowHeight(rowHeightString) {
  if (pointRegex.test(rowHeightString)) {
    const matchedParts = rowHeightString.match(pointRegex);
    // convert point to half point
    return pointToTWIP(matchedParts[1]);
  } else if (pixelRegex.test(rowHeightString)) {
    const matchedParts = rowHeightString.match(pixelRegex);
    // convert pixels to half point
    return pixelToTWIP(matchedParts[1]);
  }
}
