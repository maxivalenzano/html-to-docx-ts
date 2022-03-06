import { RunAttributes } from './buildRunProperties';
import isVNode from 'virtual-dom/vnode/is-vnode';
import { colorlessColors } from '../constants';
import { fixupColorCode } from './fixupColorCode';
import { fixupFontSize } from './fixupFontSize';
import { buildRun } from './buildRun';

export function buildRunOrRuns(vNode: VirtualDOM.VTree, attributes: RunAttributes) {
  if (isVNode(vNode) && vNode.tagName === 'span') {
    const runFragments = [];

    for (let index = 0; index < vNode.children.length; index++) {
      const childVNode = vNode.children[index];
      const modifiedAttributes: RunAttributes = { ...attributes };
      if (isVNode(vNode) && vNode.properties && vNode.properties.style) {
        if (
          vNode.properties.style.color &&
          !colorlessColors.includes(vNode.properties.style.color)
        ) {
          modifiedAttributes.color = fixupColorCode(vNode.properties.style.color);
        }
        if (
          vNode.properties.style['background-color'] &&
          !colorlessColors.includes(vNode.properties.style['background-color'])
        ) {
          modifiedAttributes.backgroundColor = fixupColorCode(
            vNode.properties.style['background-color']
          );
        }
        if (vNode.properties.style['font-size']) {
          modifiedAttributes.fontSize = fixupFontSize(vNode.properties.style['font-size']);
        }
      }
      runFragments.push(buildRun(childVNode, modifiedAttributes));
    }

    return runFragments;
  } else {
    const runFragment = buildRun(vNode, attributes);

    return runFragment;
  }
}
