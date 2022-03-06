import { fragment } from 'xmlbuilder2';
import isVNode from 'virtual-dom/vnode/is-vnode';
import isVText from 'virtual-dom/vnode/is-vtext';
import namespaces from '../namespaces';
import { buildLineBreak } from './buildLineBreak';
import { buildDrawing } from './buildDrawing';
import { buildTextElement } from './buildTextElement';
import { buildTextFormatting } from './buildTextFormatting';
import { buildRunProperties, RunAttributes } from './buildRunProperties';
import VText from 'virtual-dom/vnode/vtext';

export function buildRun(vNode: VirtualDOM.VNode | VirtualDOM.VTree, attributes: RunAttributes) {
  const runFragment = fragment({ namespaceAlias: { w: namespaces.w } }).ele('@w', 'r');
  const runPropertiesFragment = buildRunProperties(attributes);

  if (
    isVNode(vNode) &&
    [
      'span',
      'strong',
      'b',
      'em',
      'i',
      'u',
      'ins',
      'strike',
      'del',
      's',
      'sub',
      'sup',
      'mark',
      'blockquote',
      'code',
      'pre',
    ].includes(vNode.tagName)
  ) {
    const textArray = [];

    let vNodes: VirtualDOM.VNode[] | VirtualDOM.VTree[] | any[] = [vNode];
    while (vNodes.length) {
      const tempVNode = vNodes.shift();
      if (isVText(tempVNode)) {
        textArray.push(tempVNode.text);
      }
      if (
        isVNode(tempVNode) &&
        [
          'strong',
          'b',
          'em',
          'i',
          'u',
          'ins',
          'strike',
          'del',
          's',
          'sub',
          'sup',
          'mark',
          'code',
          'pre',
        ].includes(tempVNode.tagName)
      ) {
        const formattingFragment = buildTextFormatting(tempVNode);
        runPropertiesFragment.import(formattingFragment);
      }

      if (tempVNode.children && tempVNode.children.length) {
        vNodes = tempVNode.children.slice().concat(vNodes);
      }
    }
    if (textArray.length) {
      const combinedString = textArray.join('');
      // eslint-disable-next-line no-param-reassign
      vNode = new VText(combinedString);
    }
  }

  runFragment.import(runPropertiesFragment);
  if (isVText(vNode)) {
    const textFragment = buildTextElement(vNode.text);
    runFragment.import(textFragment);
  } else if (attributes && attributes.type === 'picture') {
    const { type, inlineOrAnchored, ...otherAttributes } = attributes;
    const imageFragment = buildDrawing(inlineOrAnchored, type, otherAttributes);
    runFragment.import(imageFragment);
  } else if (isVNode(vNode) && vNode.tagName === 'br') {
    const lineBreakFragment = buildLineBreak();
    runFragment.import(lineBreakFragment);
  }
  runFragment.up();

  return runFragment;
}
