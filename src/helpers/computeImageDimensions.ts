import { pixelToEMU, pixelRegex, TWIPToEMU, percentageRegex } from '../utils/unit-conversion';

export function computeImageDimensions(vNode, attributes) {
  const { maximumWidth, originalWidth, originalHeight } = attributes;
  const aspectRatio = originalWidth / originalHeight;
  const maximumWidthInEMU = TWIPToEMU(maximumWidth);
  let originalWidthInEMU = pixelToEMU(originalWidth);
  let originalHeightInEMU = pixelToEMU(originalHeight);
  if (originalWidthInEMU > maximumWidthInEMU) {
    originalWidthInEMU = maximumWidthInEMU;
    originalHeightInEMU = Math.round(originalWidthInEMU / aspectRatio);
  }
  let modifiedHeight;
  let modifiedWidth;

  if (vNode.properties && vNode.properties.style) {
    if (vNode.properties.style.width) {
      if (vNode.properties.style.width !== 'auto') {
        if (pixelRegex.test(vNode.properties.style.width)) {
          modifiedWidth = pixelToEMU(vNode.properties.style.width.match(pixelRegex)[1]);
        } else if (percentageRegex.test(vNode.properties.style.width)) {
          const percentageValue = vNode.properties.style.width.match(percentageRegex)[1];

          modifiedWidth = Math.round((percentageValue / 100) * originalWidthInEMU);
        }
      } else {
        // eslint-disable-next-line no-lonely-if
        if (vNode.properties.style.height && vNode.properties.style.height === 'auto') {
          modifiedWidth = originalWidthInEMU;
          modifiedHeight = originalHeightInEMU;
        }
      }
    }
    if (vNode.properties.style.height) {
      if (vNode.properties.style.height !== 'auto') {
        if (pixelRegex.test(vNode.properties.style.height)) {
          modifiedHeight = pixelToEMU(vNode.properties.style.height.match(pixelRegex)[1]);
        } else if (percentageRegex.test(vNode.properties.style.height)) {
          const percentageValue = vNode.properties.style.width.match(percentageRegex)[1];

          modifiedHeight = Math.round((percentageValue / 100) * originalHeightInEMU);
          if (!modifiedWidth) {
            modifiedWidth = Math.round(modifiedHeight * aspectRatio);
          }
        }
      } else {
        // eslint-disable-next-line no-lonely-if
        if (modifiedWidth) {
          if (!modifiedHeight) {
            modifiedHeight = Math.round(modifiedWidth / aspectRatio);
          }
        } else {
          modifiedHeight = originalHeightInEMU;
          modifiedWidth = originalWidthInEMU;
        }
      }
    }
    if (modifiedWidth && !modifiedHeight) {
      modifiedHeight = Math.round(modifiedWidth / aspectRatio);
    } else if (modifiedHeight && !modifiedWidth) {
      modifiedWidth = Math.round(modifiedHeight * aspectRatio);
    }
  } else {
    modifiedWidth = originalWidthInEMU;
    modifiedHeight = originalHeightInEMU;
  }

  // eslint-disable-next-line no-param-reassign
  attributes.width = modifiedWidth;
  // eslint-disable-next-line no-param-reassign
  attributes.height = modifiedHeight;
}
