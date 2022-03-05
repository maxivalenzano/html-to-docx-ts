import { pixelRegex, pointRegex, pixelToEIP, pointToEIP } from '../utils/unit-conversion';
import { fixupColorCode } from './fixupColorCode';

export function cssBorderParser(borderString) {
  let [size, stroke, color] = borderString.split(' ');

  if (pointRegex.test(size)) {
    const matchedParts = size.match(pointRegex);
    // convert point to eighth of a point
    size = pointToEIP(matchedParts[1]);
  } else if (pixelRegex.test(size)) {
    const matchedParts = size.match(pixelRegex);
    // convert pixels to eighth of a point
    size = pixelToEIP(matchedParts[1]);
  }
  stroke = stroke && ['dashed', 'dotted', 'double'].includes(stroke) ? stroke : 'single';

  color = color && fixupColorCode(color).toUpperCase();

  return [size, stroke, color];
}
