import { fragment } from 'xmlbuilder2';
import namespaces from '../namespaces';
import { vNodeHasChildren } from '../utils/vnode';
import { buildTableGridCol } from './buildTableGridCol';

export function buildTableGrid(vNode, attributes) {
  const tableGridFragment = fragment({ namespaceAlias: { w: namespaces.w } }).ele('@w', 'tblGrid');
  if (vNodeHasChildren(vNode)) {
    const gridColumns = vNode.children.filter((childVNode) => childVNode.tagName === 'col');
    const gridWidth = attributes.maximumWidth / gridColumns.length;

    for (let index = 0; index < gridColumns.length; index++) {
      const tableGridColFragment = buildTableGridCol(gridWidth);
      tableGridFragment.import(tableGridColFragment);
    }
  }
  tableGridFragment.up();

  return tableGridFragment;
}
