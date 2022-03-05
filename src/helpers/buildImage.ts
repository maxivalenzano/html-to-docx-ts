import sizeOf from 'image-size';
import { buildParagraph } from './buildParagraph';
import { imageType, internalRelationship } from '../constants';

// eslint-disable-next-line consistent-return, no-shadow

export function buildImage(docxDocumentInstance, vNode, maximumWidth = null) {
  let response = null;
  try {
    // libtidy encodes the image src
    response = docxDocumentInstance.createMediaFile(decodeURIComponent(vNode.properties.src));
  } catch (error) {
    // NOOP
  }
  if (response) {
    docxDocumentInstance.zip
      .folder('word')
      .folder('media')
      .file(response.fileNameWithExtension, Buffer.from(response.fileContent, 'base64'), {
        createFolders: false,
      });

    const documentRelsId = docxDocumentInstance.createDocumentRelationships(
      docxDocumentInstance.relationshipFilename,
      imageType,
      `media/${response.fileNameWithExtension}`,
      internalRelationship
    );

    const imageBuffer = Buffer.from(response.fileContent, 'base64');
    const imageProperties = sizeOf(imageBuffer);

    const imageFragment = buildParagraph(
      vNode,
      {
        type: 'picture',
        inlineOrAnchored: true,
        relationshipId: documentRelsId,
        ...response,
        maximumWidth: maximumWidth || docxDocumentInstance.availableDocumentSpace,
        originalWidth: imageProperties.width,
        originalHeight: imageProperties.height,
      },
      docxDocumentInstance
    );

    return imageFragment;
  }
}
