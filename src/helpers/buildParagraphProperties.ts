import { fragment } from 'xmlbuilder2';
import namespaces from '../namespaces';
import { buildNumberingProperties } from './buildFragments';
import {
  buildHorizontalAlignment,
  buildPStyle,
  buildIndentation,
  buildSpacing,
} from './buildFragments';
import { buildParagraphBorder } from './buildParagraphBorder';
import { buildShading } from './buildShading';

export function buildParagraphProperties(attributes) {
  const paragraphPropertiesFragment = fragment({ namespaceAlias: { w: namespaces.w } }).ele(
    '@w',
    'pPr'
  );
  if (attributes && attributes.constructor === Object) {
    Object.keys(attributes).forEach((key) => {
      switch (key) {
        case 'numbering': {
          const { levelId, numberingId } = attributes[key];
          const numberingPropertiesFragment = buildNumberingProperties(levelId, numberingId);
          paragraphPropertiesFragment.import(numberingPropertiesFragment);
          // eslint-disable-next-line no-param-reassign
          delete attributes.numbering;
          break;
        }
        case 'textAlign': {
          const horizontalAlignmentFragment = buildHorizontalAlignment(attributes[key]);
          paragraphPropertiesFragment.import(horizontalAlignmentFragment);
          // eslint-disable-next-line no-param-reassign
          delete attributes.textAlign;
          break;
        }
        case 'backgroundColor':
          // Add shading to Paragraph Properties only if display is block
          // Essentially if background color needs to be across the row
          if (attributes.display === 'block') {
            const shadingFragment = buildShading(attributes[key]);
            paragraphPropertiesFragment.import(shadingFragment);
            // FIXME: Inner padding in case of shaded paragraphs.
            const paragraphBorderFragment = buildParagraphBorder();
            paragraphPropertiesFragment.import(paragraphBorderFragment);
            // eslint-disable-next-line no-param-reassign
            delete attributes.backgroundColor;
          }
          break;
        case 'paragraphStyle': {
          const pStyleFragment = buildPStyle(attributes.paragraphStyle);
          paragraphPropertiesFragment.import(pStyleFragment);
          delete attributes.paragraphStyle;
          break;
        }
        case 'indentation': {
          const indentationFragment = buildIndentation(attributes[key]);
          paragraphPropertiesFragment.import(indentationFragment);
          // eslint-disable-next-line no-param-reassign
          delete attributes.indentation;
          break;
        }
      }
    });

    const spacingFragment = buildSpacing(
      attributes.lineHeight,
      attributes.beforeSpacing,
      attributes.afterSpacing
    );
    // eslint-disable-next-line no-param-reassign
    delete attributes.lineHeight;
    // eslint-disable-next-line no-param-reassign
    delete attributes.beforeSpacing;
    // eslint-disable-next-line no-param-reassign
    delete attributes.afterSpacing;

    paragraphPropertiesFragment.import(spacingFragment);
  }
  paragraphPropertiesFragment.up();

  return paragraphPropertiesFragment;
}
