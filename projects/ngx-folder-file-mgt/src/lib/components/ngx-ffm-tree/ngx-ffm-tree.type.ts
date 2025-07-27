export type ViewTree = ViewTreeNode[];

export interface ViewTreeNode {
  id: string; // 节点id，唯一，用于标识节点
  name: string; // 节点显示名称
  type: 'file' | 'folder'; // 节点类型，只能是文件或文件夹
  parentId: string; // 父节点ID
  [key: string]: any; // 索引签名，允许任意额外字段
  expanded: boolean; // 设置节点是否展开(叶子节点无效)，默认为 true
  selected: boolean; // 设置节点本身是否选中,默认为 false
  depth: number; // 层级深度（用于缩进）
  index: number; // 数组下标位置
}

export const DEFAULT_VIEW_TREE_NODE:ViewTreeNode = {
  id: '',
  name: '',
  type: 'file',
  parentId: 'root',
  expanded: true,
  selected: false,
  depth: 1,
  index: 0,
};
