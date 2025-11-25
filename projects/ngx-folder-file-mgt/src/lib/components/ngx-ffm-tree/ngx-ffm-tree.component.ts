import { Component, input, model, OnInit, effect, SimpleChanges, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxFlatData, NgxDataFlatNode, CheckedIds } from '../ngx-folder-file-mgt.type';
import { ViewTree, ViewTreeNode, DEFAULT_VIEW_TREE_NODE } from './ngx-ffm-tree.type';
import { NgxFolderFileMgtService } from '../ngx-folder-file-mgt.service';
import { NgxFfmIconComponent } from '../ngx-ffm-icon/ngx-ffm-icon.component';

@Component({
  selector: 'ngx-ffm-tree',
  imports: [CommonModule, NgxFfmIconComponent],
  templateUrl: './ngx-ffm-tree.component.html',
  styleUrl: './ngx-ffm-tree.component.scss',
})
export class NgxFfmTreeComponent implements OnInit {
  // 接收扁平数据
  public ngxData = model<NgxFlatData>([]);
  public checkedIds = model<CheckedIds>([]);
  public ngxDebug = input<boolean>();

  // 视图渲染用的扁平结构（带层级信息）
  public viewTree: ViewTree = [];
  // 缓存节点映射表（优化查找性能）
  private nodeMap = new Map<string, ViewTreeNode>();

  constructor(private ngxFolderFileMgtService: NgxFolderFileMgtService) {}

  ngOnInit(): void {
    this.viewTree = this.convertToViewTree(this.ngxData());
    this.buildNodeMap();
  }

  // 构建节点ID映射表
  private buildNodeMap(): void {
    this.nodeMap.clear();
    this.viewTree.forEach((node) => this.nodeMap.set(node.id, node));
  }

  // 点击文件节点
  public clickFile(node: ViewTreeNode) {
    this.viewTree.map((item) => (item.selected = node.id === item.id));
    if (this.checkedIds().length === 1 && this.checkedIds()[0] === node.id) {
      return;
    }
    this.checkedIds.set([node.id]);
  }

  // 点击文件夹节点（切换展开状态）
  public clickFolder(node: ViewTreeNode) {
    // 更新视图节点状态
    node.expanded = !node.expanded;

    // 更新数据源（确保父组件能收到变化通知）
    const updatedData = this.ngxData().map((item) =>
      item.id === node.id ? { ...item, expanded: node.expanded } : item
    );
    this.ngxData.set(updatedData);
  }

  // 转换扁平数据为带层级信息的视图数据
  private convertToViewTree(flatData: NgxFlatData): ViewTree {
    // 1. 预处理：记录每个节点的子节点存在状态
    const hasChildrenMap = new Map<string, boolean>();
    flatData.forEach((node) => {
      if (node.parentId && node.parentId !== 'root') {
        hasChildrenMap.set(node.parentId, true);
      }
    });

    // 2. 计算节点深度
    const nodeDepthMap = new Map<string, number>();
    const getDepth = (nodeId: string): number => {
      if (nodeDepthMap.has(nodeId)) {
        return nodeDepthMap.get(nodeId)!;
      }
      const node = flatData.find((n) => n.id === nodeId);
      if (!node || !node.parentId || node.parentId === 'root') {
        // 根节点深度为1（匹配测试预期）
        nodeDepthMap.set(nodeId, 1);
        return 1;
      }
      const depth = getDepth(node.parentId) + 1;
      nodeDepthMap.set(nodeId, depth);
      return depth;
    };

    // 3. 转换节点并处理类型修正
    const viewNodes = flatData.map((node) => {
      // 修正：有子节点的file类型转为folder
      const hasChildren = hasChildrenMap.get(node.id) || false;
      const type = hasChildren && node.type === 'file' ? 'folder' : node.type;
      const parentNode = flatData.find((n) => n.id === node.parentId);

      return {
        ...DEFAULT_VIEW_TREE_NODE,
        ...node,
        type,
        depth: getDepth(node.id),
        expanded: node.expanded ?? parentNode?.expanded ?? DEFAULT_VIEW_TREE_NODE.expanded, // 用默认值
        selected: this.checkedIds().includes(node.id),
      };
    });

    // 4. 保持原始顺序（移除可能导致错乱的排序）
    return viewNodes;
  }

  // 检查节点是否可见（父节点展开时可见）
  public isNodeVisible(node: ViewTreeNode): boolean {
    if (node.depth === 1) return true; // 根节点（depth=1）始终可见
    const parent = this.nodeMap.get(node.parentId);
    return parent?.expanded ?? false;
  }
}
