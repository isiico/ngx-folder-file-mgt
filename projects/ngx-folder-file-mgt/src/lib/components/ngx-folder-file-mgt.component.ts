import { Component, effect, input, model, OnChanges, OnInit, signal, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NgxData,
  NgxOption,
  NgxTreeData,
  NgxErrorInfo,
  DEFAULT_NGX_OPTIONS,
  CheckedIds,
  NgxDataFlatNode,
  NgxFlatData,
} from './ngx-folder-file-mgt.type';
import { NgxFfmTreeComponent } from './ngx-ffm-tree/ngx-ffm-tree.component';
import { NgxFfmErrorInfoComponent } from './ngx-ffm-error-info/ngx-ffm-error-info.component';
import { NgxFolderFileMgtService } from './ngx-folder-file-mgt.service';

@Component({
  selector: 'ngx-folder-file-mgt',
  imports: [CommonModule, NgxFfmTreeComponent, NgxFfmErrorInfoComponent],
  templateUrl: './ngx-folder-file-mgt.component.html',
  styleUrl: './ngx-folder-file-mgt.scss',
  encapsulation: ViewEncapsulation.None,
})
export class NgxFolderFileMgtComponent implements OnInit {
  // ------------------------------
  // 输入属性
  // ------------------------------
  // 输入配置
  public readonly ngxOption = input<NgxOption>(DEFAULT_NGX_OPTIONS);
  // 输入数据（树形结构，model() 用于响应式更新）
  public ngxData = model<NgxData | null>(null);
  // 输入数据（扁平结构，model() 用于响应式更新）
  public ngxTreeData = model<NgxTreeData | null>(null);
  // 输入数据（当前选中的id）
  public checkedIds = model<CheckedIds>([]);

  // ------------------------------
  // 生成信息（根据输入生成的）
  // ------------------------------
  // 错误信息
  public ngxErrorInfo = signal<NgxErrorInfo>({ type: null, ids: [], modelNames: [] });
  // 输入ngx-ffm-tree组件的数据
  public ngxFFmTreeData = model<NgxFlatData>([]);

  // 新增：标记数据来源（是来自 ngxData 还是 ngxTreeData）
  private dataSource: 'ngxData' | 'ngxTreeData' | null = null;

  // 注入服务
  constructor(private folderService: NgxFolderFileMgtService) {
    effect(() => {
      console.log(this.ngxTreeData());
      console.log(this.checkedIds());
    });
  }

  ngOnInit(): void {
    // 初始化时执行一次数据转换
    this.checkErrors(); // 调用服务进行校验
    if (this.ngxErrorInfo().type === null) {
      this.initNgxFFmTreeData(); // 无错误时初始化ngxFFmTreeData
    }
    // 手动订阅ngxFFmTreeData的变化
    this.ngxFFmTreeData.subscribe((flatData) => {
      this.ngxFFmTreeDataToInputData(flatData);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  // ------------------------------
  // 核心逻辑（调用服务方法）
  // ------------------------------
  /** 调用服务校验数据，更新错误状态 */
  private checkErrors(): void {
    // 从信号中获取当前数据
    const currentFlatData = this.ngxData();
    const currentTreeData = this.ngxTreeData();

    // 调用服务的校验方法（核心：逻辑迁移到服务）
    const errorInfo = this.folderService.validateData(currentTreeData, currentFlatData);

    // 更新错误状态
    this.ngxErrorInfo.set(errorInfo);
  }

  /** 初始化ngxFFmTreeData数据（调用服务转换方法） */
  private initNgxFFmTreeData(): void {
    const currentTreeData = this.ngxTreeData();
    const currentFlatData = this.ngxData();
    const rootId = (this.ngxOption().rootId || DEFAULT_NGX_OPTIONS.rootId) as string; // 从配置获取根节点标识
    const debug = this.ngxOption().debug;

    if (currentTreeData?.length && currentTreeData.length > 0) {
      const flatData = this.folderService.convertTreeToFlat(currentTreeData, rootId, debug);
      this.ngxFFmTreeData.set(flatData);
      this.dataSource = 'ngxTreeData'; // 记录来源：用户传入的 ngxData
    } else if (currentFlatData?.length && currentFlatData.length > 0) {
      // 直接使用扁平数据
      this.ngxFFmTreeData.set(currentFlatData);
      this.dataSource = 'ngxData'; // 记录来源：用户传入的 ngxTreeData
    }
  }

  /** 将ngxFFmTreeData转成传入的数据 ngxData 或 ngxTreeData（调用服务转换方法） */
  private ngxFFmTreeDataToInputData(ngxFFmTreeData: NgxFlatData) {
    console.log(this.dataSource);
    switch (this.dataSource) {
      case 'ngxData':
        this.ngxData.set([...ngxFFmTreeData]);
        break;
      case 'ngxTreeData':
        const rootId = (this.ngxOption().rootId || DEFAULT_NGX_OPTIONS.rootId) as string; // 从配置获取根节点标识
        const treeDate = this.folderService.convertFlatToTree(ngxFFmTreeData, rootId);
        this.ngxTreeData.set([...treeDate]);
        break;
    }
  }
}
