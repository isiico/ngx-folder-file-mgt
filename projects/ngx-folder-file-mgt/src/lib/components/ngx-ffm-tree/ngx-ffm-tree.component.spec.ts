import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxFfmTreeComponent } from './ngx-ffm-tree.component';
import { NgxFlatData, CheckedIds, NgxTreeData } from '../ngx-folder-file-mgt.type';
import { ViewTree, DEFAULT_VIEW_TREE_NODE } from './ngx-ffm-tree.type';
import { NgxFolderFileMgtService } from '../ngx-folder-file-mgt.service';
import { NgxFolderFileMgtComponent } from '../ngx-folder-file-mgt.component';

describe('NgxFfmTreeComponent', () => {
  let treeComponent: NgxFfmTreeComponent;
  let treeFixture: ComponentFixture<NgxFfmTreeComponent>;
  let parentComponent: NgxFolderFileMgtComponent;
  let parentFixture: ComponentFixture<NgxFolderFileMgtComponent>;
  let service: NgxFolderFileMgtService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxFfmTreeComponent, NgxFolderFileMgtComponent],
      providers: [NgxFolderFileMgtService],
    }).compileComponents();

    service = TestBed.inject(NgxFolderFileMgtService);

    // 初始化父组件
    parentFixture = TestBed.createComponent(NgxFolderFileMgtComponent);
    parentComponent = parentFixture.componentInstance;
    parentFixture.detectChanges();

    // 初始化树形组件（不预设数据，不自动触发ngOnInit）
    treeFixture = TestBed.createComponent(NgxFfmTreeComponent);
    treeComponent = treeFixture.componentInstance;
    // 注意：此处不调用detectChanges()，避免提前触发ngOnInit
  });

  // 辅助方法：设置扁平数据并初始化
  const setFlatDataAndInit = (data: NgxFlatData) => {
    treeComponent.ngxData.set(data);
    treeComponent.ngOnInit();
    treeFixture.detectChanges();
  };

  // ------------------------------
  // 输入数据与转换逻辑测试
  // ------------------------------
  it('可以将NgxFlatData类型转换成ViewTree类型的数据', () => {
    const testData: NgxFlatData = [
      { id: '1', name: '文件夹1', type: 'folder', parentId: 'root' },
      { id: '1-1', name: '文件1-1', type: 'file', parentId: '1' },
      { id: '2', name: '文件2', type: 'file', parentId: 'root' },
    ];

    setFlatDataAndInit(testData);

    // 预期：depth根节点为1，子节点为2；顺序与输入一致；
    const expectedViewTree: ViewTree = [
      {
        ...DEFAULT_VIEW_TREE_NODE,
        id: '1',
        name: '文件夹1',
        type: 'folder',
        parentId: 'root',
        depth: 1,
      },
      {
        ...DEFAULT_VIEW_TREE_NODE,
        id: '1-1',
        name: '文件1-1',
        type: 'file',
        parentId: '1',
        depth: 2,
      },
      {
        ...DEFAULT_VIEW_TREE_NODE,
        id: '2',
        name: '文件2',
        type: 'file',
        parentId: 'root',
        depth: 1,
      },
    ];

    expect(treeComponent.viewTree).toEqual(expectedViewTree);
  });

  it('当输入的ngxData为空数组', () => {
    // 手动设置空数据并初始化
    setFlatDataAndInit([]);
    expect(treeComponent.viewTree).toEqual([]);
  });

  it('当输入的ngxData的type为file却有子节点则强制转成folder', () => {
    const testData: NgxFlatData = [
      {
        id: '1',
        name: '文件夹1',
        type: 'file',
        parentId: 'root',
      },
      {
        id: '1-1',
        name: '文件1-1',
        type: 'file',
        parentId: '1',
      },
      {
        id: '2',
        name: '文件2',
        type: 'file',
        parentId: 'root',
      },
    ];

    // 手动设置数据并初始化
    setFlatDataAndInit(testData);

    const expectedViewTree: ViewTree = [
      {
        ...DEFAULT_VIEW_TREE_NODE,
        id: '1',
        name: '文件夹1',
        type: 'folder',
        parentId: 'root',
        depth: 1,
      },
      {
        ...DEFAULT_VIEW_TREE_NODE,
        id: '1-1',
        name: '文件1-1',
        type: 'file',
        parentId: '1',
        depth: 2,
      },
      {
        ...DEFAULT_VIEW_TREE_NODE,
        id: '2',
        name: '文件2',
        type: 'file',
        parentId: 'root',
        depth: 1,
      },
    ];

    expect(treeComponent.viewTree).toEqual(expectedViewTree);
  });

  // ------------------------------
  // 交互行为测试
  // ------------------------------
  // 基础扁平模拟数据
  const baseMockFlatData: NgxFlatData = [
    { id: 'folder-1', name: '测试文件夹', type: 'folder', parentId: 'root', expanded: false },
    { id: 'file-1', name: '测试文件1', type: 'file', parentId: 'folder-1' },
    { id: 'file-2', name: '测试文件2', type: 'file', parentId: 'folder-1' },
  ];
  it('点击文件，应同步更新父组件的checkedIds为被点击文件的id', () => {
    // 手动设置基础数据并初始化
    setFlatDataAndInit(baseMockFlatData);

    // 关联父子组件checkedIds
    parentComponent.checkedIds.set([]);
    treeComponent.checkedIds = parentComponent.checkedIds;
    parentFixture.detectChanges();

    // 获取文件节点（此时viewTree已生成）
    const fileNode = treeComponent.viewTree.find((n) => n.id === 'file-1')!;

    // 模拟点击
    treeComponent.clickFile(fileNode);

    // 验证结果
    expect(treeComponent.checkedIds()).toEqual(['file-1']);
    expect(parentComponent.checkedIds()).toEqual(['file-1']);
  });

  it('点击已选中文件不应触发更新', () => {
    setFlatDataAndInit(baseMockFlatData);
    treeComponent.checkedIds.set(['file-1']);

    const fileNode = treeComponent.viewTree.find((n) => n.id === 'file-1')!;
    const setSpy = spyOn(treeComponent.checkedIds, 'set');

    treeComponent.clickFile(fileNode);

    // 验证set方法未被调用
    expect(setSpy).not.toHaveBeenCalled();
  });

  it('点击文件夹，当父组件数据源为NgxTreeData时，应更新ngxTreeData中对应节点的expanded', () => {
    // 父组件使用树形数据（转换为扁平后传递给子组件）
    const treeData: NgxTreeData = [
      {
        id: '1',
        name: '文件夹1',
        type: 'folder',
        expanded: false,
        children: [{ id: '1-1', name: '文件1-1', type: 'file', children: [] }],
      },
    ];
    // 父组件将树形数据转换为扁平数据
    parentComponent.ngxTreeData.set(treeData);
    parentComponent.ngOnInit();
    parentFixture.detectChanges();

    // 子组件关联数据
    treeComponent.ngxData = parentComponent.ngxFFmTreeData;
    treeComponent.ngOnInit();
    treeFixture.detectChanges();

    // 点击文件夹
    const folderNode = treeComponent.viewTree.find((n) => n.id === '1')!;
    expect(folderNode).toBeDefined();
    const initialExpanded = folderNode.expanded;

    // 模拟点击
    treeComponent.clickFolder(folderNode);
    treeFixture.detectChanges();
    parentFixture.detectChanges();

    // 验证父组件数据更新
    expect(treeComponent.viewTree.find((n) => n.id === '1')?.expanded).toBe(!initialExpanded);
    expect(parentComponent.ngxTreeData()!.find((n) => n.id === '1')?.expanded).toBe(!initialExpanded);
  });

  it('点击文件夹，当父组件数据源为NgxData时，应更新ngxData中对应节点的expanded', () => {
    parentComponent.ngxData.set(baseMockFlatData);
    parentComponent.ngOnInit();
    parentFixture.detectChanges();

    // 子组件手动关联数据并初始化
    treeComponent.ngxData = parentComponent.ngxFFmTreeData;
    treeComponent.ngOnInit(); // 手动初始化子组件viewTree
    treeFixture.detectChanges();

    // 获取文件夹节点
    const folderNode = treeComponent.viewTree.find((n) => n.id === 'file-1')!;
    expect(folderNode).toBeDefined();
    const initialExpanded = folderNode.expanded;

    // 模拟点击
    treeComponent.clickFolder(folderNode);
    treeFixture.detectChanges();
    parentFixture.detectChanges();

    // 验证结果
    expect(treeComponent.viewTree.find((n) => n.id === 'folder-1')?.expanded).toBe(!initialExpanded);
    expect(parentComponent.ngxData()!.find((n) => n.id === 'folder-1')?.expanded).toBe(!initialExpanded);
  });
});
