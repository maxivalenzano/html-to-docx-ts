export const vNodeHasChildren = (vNode: VirtualDOM.VNode) =>
  vNode && vNode.children && Array.isArray(vNode.children) && vNode.children.length;
