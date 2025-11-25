/**
 * 配置项类型定义
 * 所有可能的配置项都在这里声明，保证类型约束
 */
export interface NgxOption {
  debug?: boolean; // 是否开启调试。默认为 true
  loading?: boolean; // 是否加载中。默认为 false
  rootId?: string; // 根节点的id，flat必传。默认为'root'
}

/**
 * 组件支持的数据类型
 * 使用联合类型支持平铺数组和树形数组两种格式
 */
export type NgxData = NgxFlatData;
export type NgxTreeData = NgxDataTreeNode[];
export type NgxFlatData = NgxDataFlatNode[];
export type CheckedIds = string[];

/**
 * 错误信息
 */
export interface NgxErrorInfo {
  type: ErrorType | null; // 错误类型（null表示无错误）
  ids: string[]; // 错误相关ID列表（如重复ID）
  modelNames: string[]; // 引发错误的model属性名如ngxData
}

/**
 * 配置项默认值
 * 与 NgxOption 类型严格对应，确保每个默认值都符合类型约束
 */
export const DEFAULT_NGX_OPTIONS: NgxOption = {
  debug: true,
  loading: false,
  rootId: 'root',
};

/**
 * 平铺结构数据节点
 * 继承自 ngxDataItem 以支持任意额外字段
 */
export interface NgxDataFlatNode {
  id: string; // 必须唯一，用于标识节点
  name: string; // 节点显示名称
  type: 'file' | 'folder'; // 节点类型，只能是文件或文件夹
  parentId: string; // 父节点ID，用于构建层级关系
  expanded?: boolean; // 设置节点是否展开(叶子节点无效)，默认为 true
  [key: string]: any; // 索引签名，允许任意额外字段
}

/**
 * 树形结构数据节点
 * 继承自 ngxDataItem 以支持任意额外字段
 */
export interface NgxDataTreeNode {
  id: string; // 必须唯一，用于标识节点
  name: string; // 节点显示名称
  type: 'file' | 'folder'; // 节点类型，只能是文件或文件夹
  children: NgxDataTreeNode[]; // 子节点数组，文件夹类型才有子节点
  expanded?: boolean; // 设置节点是否展开(叶子节点无效)，默认为 true
  [key: string]: any; // 索引签名，允许任意额外字段
}
/**
 * 错误类型
 */
export enum ErrorType {
  EMPTY = 'empty', // 数据为空（ngxData或ngxFlatData为空数组）
  DATANONE = 'dataNone', // ngxData和ngxFlatData均未传入
  DATANOTONLY = 'dataNotOnly', // 两者均传入（数据不唯一）
  IDREPEAT = 'idRepeat', // ngxFlatData中id重复
  UNKNOWN = 'unknown', // 未知错误
}
