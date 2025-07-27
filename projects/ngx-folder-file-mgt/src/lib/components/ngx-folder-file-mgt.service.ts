import { Injectable } from '@angular/core';
import {
  NgxTreeData,
  NgxFlatData,
  NgxErrorInfo,
  ErrorType,
  NgxDataFlatNode,
  NgxDataTreeNode,
  NgxOption,
  DEFAULT_NGX_OPTIONS,
} from './ngx-folder-file-mgt.type';
import { DEFAULT_VIEW_TREE_NODE } from './ngx-ffm-tree/ngx-ffm-tree.type';

@Injectable({
  providedIn: 'root',
})
export class NgxFolderFileMgtService {
  constructor() {}
  /**
   * 校验数据有效性（返回结构化错误信息）
   * @param treeData 树形数据
   * @param flatData 扁平数据
   * @param options 配置项
   * @returns 错误信息对象
   */
  validateData(treeData: NgxTreeData | null, flatData: NgxFlatData | null): NgxErrorInfo {
    // 重置错误信息
    const errorInfo: NgxErrorInfo = { type: null, ids: [], modelNames: [] };

    // 校验逻辑（按优先级判断）
    if (treeData === null && flatData === null) {
      errorInfo.type = ErrorType.DATANONE;
      errorInfo.modelNames = ['ngxData', 'ngxTreeData'];
    } else if (treeData !== null && flatData !== null) {
      errorInfo.type = ErrorType.DATANOTONLY;
      errorInfo.modelNames = ['ngxData', 'ngxTreeData'];
    } else if (treeData !== null && treeData?.length === 0) {
      errorInfo.type = ErrorType.EMPTY;
      errorInfo.modelNames = ['ngxData'];
    } else if (flatData !== null && flatData?.length === 0) {
      errorInfo.type = ErrorType.EMPTY;
      errorInfo.modelNames = ['ngxTreeData'];
    } else if (flatData?.length && flatData.length > 0) {
      // 扁平数据校验（ID重复检测）
      const { errorType, duplicateIds } = this.validateFlatData(flatData);
      if (errorType) {
        errorInfo.type = errorType;
        errorInfo.ids = duplicateIds;
        errorInfo.modelNames = ['ngxTreeData'];
      }
    } else if (treeData?.length && treeData.length > 0) {
      // 树形数据校验（ID重复检测）
      const { errorType, duplicateIds } = this.validateTreeData(treeData);
      if (errorType) {
        errorInfo.type = errorType;
        errorInfo.ids = duplicateIds;
        errorInfo.modelNames = ['ngxData'];
      }
    }

    return errorInfo;
  }

  /**
   * 校验扁平数据（ID重复检测）
   * @param flatData 扁平数据
   * @returns 错误类型和重复ID列表
   */
  private validateFlatData(flatData: NgxFlatData): { errorType: ErrorType | null; duplicateIds: string[] } {
    const idFrequencyMap = new Map<string, number>();
    const duplicateIds: string[] = [];

    flatData.forEach((item: NgxDataFlatNode) => {
      const id = item.id.toString(); // 统一为字符串避免类型问题
      const count = (idFrequencyMap.get(id) || 0) + 1;
      idFrequencyMap.set(id, count);
      if (count === 2) {
        duplicateIds.push(id); // 记录重复ID
      }
    });

    return {
      errorType: duplicateIds.length > 0 ? ErrorType.IDREPEAT : null,
      duplicateIds: duplicateIds.length > 0 ? duplicateIds : [],
    };
  }

  /**
   * 校验树形数据（ID重复检测）
   * @param treeData 树形数据
   * @returns 错误类型和重复ID列表
   */
  private validateTreeData(treeData: NgxTreeData): { errorType: ErrorType | null; duplicateIds: string[] } {
    const idFrequencyMap = new Map<string, number>();
    const duplicateIds: string[] = [];

    // 递归遍历树形结构，收集所有ID
    const traverse = (nodes: NgxDataTreeNode[]) => {
      nodes.forEach((node) => {
        const id = node.id.toString();
        const count = (idFrequencyMap.get(id) || 0) + 1;
        idFrequencyMap.set(id, count);
        if (count === 2) {
          duplicateIds.push(id); // 记录重复ID
        }

        // 递归处理子节点
        if (node.children && node.children.length > 0) {
          traverse(node.children);
        }
      });
    };

    traverse(treeData); // 启动遍历

    return {
      errorType: duplicateIds.length > 0 ? ErrorType.IDREPEAT : null,
      duplicateIds: duplicateIds.length > 0 ? duplicateIds : [],
    };
  }

  /**
   * 将扁平数据转换为树形结构
   * @param flatNodes 扁平节点数组
   * @param rootParentId 根节点的parentId标识
   * @param debug 是否调试模式（根据配置来）
   * @returns 树形结构数组
   */
  convertFlatToTree(flatNodes: NgxFlatData, rootParentId: string, debug: boolean = true): NgxTreeData {
    const nodeMap = new Map<string, NgxDataTreeNode>();

    // 步骤1：缓存节点并补充默认值
    flatNodes.forEach((node) => {
      // 创建树形节点，排除parentId属性
      nodeMap.set(node.id.toString(), {
        id: node.id,
        name: node.name,
        type: node.type,
        expanded: node.expanded || DEFAULT_VIEW_TREE_NODE.expanded,
        children: [],
        // 复制其他额外属性，但排除parentId
        ...Object.fromEntries(Object.entries(node).filter(([key]) => key !== 'parentId')),
      });
    });

    // 步骤2：构建树结构
    const tree: NgxTreeData = [];
    flatNodes.forEach((node) => {
      const currentNode = nodeMap.get(node.id.toString())!;
      const parentId = node.parentId.toString();

      // 情况1：当前节点是根节点
      if (parentId === rootParentId.toString()) {
        tree.push(currentNode);
        return;
      }

      // 情况2：当前节点有父节点
      const parentNode = nodeMap.get(parentId);
      if (parentNode) {
        if (parentNode.type !== 'folder') {
          this.consoleWarn(`节点 ${node.id} 的父节点 ${parentId} 类型非folder，已忽略`, debug);
          return;
        }
        parentNode.children.push(currentNode);
      } else {
        this.consoleWarn(`节点 ${node.id} 的父节点 ${parentId} 不存在，已加入根节点`, debug);
        tree.push(currentNode);
      }
    });

    return tree;
  }

  /**
   * 将树形数据转换为扁平数据
   * @param treeData 树形节点数组
   * @param rootParentId 根节点的parentId标识
   * @param debug 是否调试模式（根据配置来）
   * @returns 扁平结构数组
   */
  public convertTreeToFlat(treeData: NgxTreeData, rootParentId: string, debug: boolean = true): NgxFlatData {
    const flatData: NgxFlatData = [];

    // 递归遍历树形数据，转换为扁平结构
    const traverse = (nodes: NgxTreeData, parentId: string) => {
      for (const node of nodes) {
        // 转换为扁平节点（保留 id、name、type、parentId、expanded 等）
        const flatNode: NgxDataFlatNode = {
          id: node.id,
          name: node.name,
          type: node.type,
          expanded: node.expanded || DEFAULT_VIEW_TREE_NODE.expanded,
          parentId: parentId,
          // 复制其他额外属性，但排除parentId
          ...Object.fromEntries(Object.entries(node).filter(([key]) => key !== 'children')),
        };
        if (node.type === 'file' && node.children && node.children.length > 0) {
          flatNode.type = 'folder';
          this.consoleWarn(`节点 ${node.id} 有子节点但类型非folder，已忽略`, debug);
        }
        flatData.push(flatNode);

        // 递归处理子节点（父 id 为当前节点 id）
        if (node.children && node.children.length > 0) {
          traverse(node.children, node.id);
        }
      }
    };

    // 从根节点开始遍历（根节点的 parentId 为配置的 rootId）
    const rootId: string = rootParentId || (DEFAULT_NGX_OPTIONS.rootId as string);
    traverse(treeData, rootId);

    return flatData;
  }

  /**
   * 打印警告
   * @param content 警告的内容
   * @param debug 是否调试模式（根据配置来）
   */
  public consoleWarn(content: string, debug: boolean): void {
    if (debug) {
      console.warn(
        `⚠️%c[ngx-folder-file-mgt]%c警告：${content}`,
        // 第一个 %c 的样式（组件库名称样式）
        'color: #4285f4; font-weight: bold; background: #f0f7ff; padding: 1px 4px; border-radius: 2px;',
        // 第二个 %c 的样式（日志内容样式）
        'color: #333; margin-left: 4px;'
      );
    }
  }

  /**
   * 打印错误
   * @param content 错误的内容
   * @param debug 是否调试模式（根据配置来）
   */
  public consoleError(content: string, debug: boolean): void {
    if (debug) {
      console.error(
        `❌%c[ngx-folder-file-mgt]%c错误：${content}`,
        // 第一个 %c 的样式（组件库名称样式）
        'color: #900000ff; font-weight: bold; background: #f0f7ff; padding: 1px 4px; border-radius: 2px;',
        // 第二个 %c 的样式（日志内容样式）
        'color: #333; margin-left: 4px;'
      );
    }
  }
}
