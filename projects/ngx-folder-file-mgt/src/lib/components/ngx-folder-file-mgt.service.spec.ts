import { TestBed } from '@angular/core/testing';

import { NgxFolderFileMgtService } from './ngx-folder-file-mgt.service';
import { NgxData, NgxFlatData, ErrorType, NgxDataFlatNode, NgxTreeData } from './ngx-folder-file-mgt.type';

describe('NgxFolderFileMgtService', () => {
  let service: NgxFolderFileMgtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxFolderFileMgtService);
  });

  // ------------------------------
  // validateData 测试（错误类型判断）
  // ------------------------------
  it('应返回 DATANONE 当树形和平铺数据均为null', () => {
    const result = service.validateData(null, null);
    expect(result.type).toBe(ErrorType.DATANONE);
    expect(result.ids).toEqual([]);
    expect(result.modelNames).toEqual(['ngxData', 'ngxTreeData']);
  });

  it('应返回 EMPTY 当树形为null，平铺为空数组', () => {
    const flatData: NgxFlatData = [];
    const result = service.validateData(null, flatData);
    expect(result.type).toBe(ErrorType.EMPTY);
    expect(result.ids).toEqual([]);
    expect(result.modelNames).toEqual(['ngxTreeData']);
  });

  it('应返回 EMPTY 当树形为空数组，平铺为null', () => {
    const treeData: NgxTreeData = [];
    const result = service.validateData(treeData, null);
    expect(result.type).toBe(ErrorType.EMPTY);
    expect(result.ids).toEqual([]);
    expect(result.modelNames).toEqual(['ngxData']);
  });

  it('应返回 DATANOTONLY 当树形和平铺数据均为空数组', () => {
    const treeData: NgxTreeData = [];
    const flatData: NgxFlatData = [];
    const result = service.validateData(treeData, flatData);
    expect(result.type).toBe(ErrorType.DATANOTONLY);
    expect(result.ids).toEqual([]);
    expect(result.modelNames).toEqual(['ngxData', 'ngxTreeData']);
  });

  it('应返回 DATANOTONLY 当树形有值且平铺数据为空数组', () => {
    const treeData: NgxTreeData = [{ id: '1', name: '根', type: 'folder', children: [] }];
    const flatData: NgxFlatData = [];
    const result = service.validateData(treeData, flatData);
    expect(result.type).toBe(ErrorType.DATANOTONLY);
    expect(result.ids).toEqual([]);
    expect(result.modelNames).toEqual(['ngxData', 'ngxTreeData']);
  });

  it('应返回 DATANOTONLY 当树形和平铺数据均非空', () => {
    const treeData: NgxTreeData = [{ id: '1', name: '根', type: 'folder', children: [] }];
    const flatData: NgxFlatData = [
      { id: '2', name: '文件', type: 'file', parentId: 'root' },
      { id: '2', name: '文件', type: 'file', parentId: 'root' },
    ];
    const result = service.validateData(treeData, flatData);
    expect(result.type).toBe(ErrorType.DATANOTONLY);
    expect(result.ids).toEqual([]);
    expect(result.modelNames).toEqual(['ngxData', 'ngxTreeData']);
  });

  it('应返回 IDREPEAT 当平铺数据存在重复ID', () => {
    const flatData: NgxFlatData = [
      { id: '1', name: '文件1', type: 'file', parentId: 'root' },
      { id: '1', name: '文件2', type: 'file', parentId: 'root' },
    ];
    const result = service.validateData(null, flatData);
    expect(result.type).toBe(ErrorType.IDREPEAT);
    expect(result.ids).toEqual(['1']);
    expect(result.modelNames).toEqual(['ngxTreeData']);
  });

  it('应返回 IDREPEAT 当树形数据存在重复ID', () => {
    const treeData: NgxTreeData = [
      { id: '1', name: '根', type: 'folder', children: [{ id: '1', name: '根', type: 'folder', children: [] }] },
    ];
    const result = service.validateData(treeData, null);
    expect(result.type).toBe(ErrorType.IDREPEAT);
    expect(result.ids).toEqual(['1']);
    expect(result.modelNames).toEqual(['ngxData']);
  });

  // ------------------------------
  // convertTreeToFlat 测试（扁平结构生成）
  // ------------------------------
  it('应将树形数据正确转换为扁平数据结构', () => {
    const treeData: NgxTreeData = [
      {
        id: '1',
        name: '文档1',
        type: 'folder',
        children: [
          {
            id: '2',
            name: '文档2',
            type: 'folder',
            children: [],
          },
        ],
      },
    ];
    const rootId = 'root';
    const flatData = service.convertTreeToFlat(treeData, rootId);

    expect(flatData).toEqual([
      { id: '1', name: '文档1', type: 'folder', parentId: 'root', expanded: true },
      { id: '2', name: '文档2', type: 'folder', parentId: '1', expanded: true },
    ]);
  });
  it('应将树形数据的type为file但却有子节点，则将type改为folder', () => {
    const treeData: NgxTreeData = [
      {
        id: '1',
        name: '文档1',
        type: 'file',
        children: [
          {
            id: '2',
            name: '文档2',
            type: 'folder',
            children: [],
          },
        ],
      },
    ];
    const rootId = 'root';
    const flatData = service.convertTreeToFlat(treeData, rootId);

    expect(flatData).toEqual([
      { id: '1', name: '文档1', type: 'folder', parentId: 'root', expanded: true },
      { id: '2', name: '文档2', type: 'folder', parentId: '1', expanded: true },
    ]);
  });

  // ------------------------------
  // convertFlatToTree 测试（树形结构生成）
  // ------------------------------
  it('应将扁平数据正确转换为树形结构', () => {
    const flatData: NgxFlatData = [
      { id: '1', name: '文档1', type: 'folder', parentId: 'root' },
      { id: '2', name: '文档2', type: 'folder', parentId: '1' },
    ];
    const rootId = 'root';
    const treeData = service.convertFlatToTree(flatData, rootId);

    expect(treeData).toEqual([
      {
        id: '1',
        name: '文档1',
        type: 'folder',
        expanded: true,
        children: [
          {
            id: '2',
            name: '文档2',
            type: 'folder',
            expanded: true,
            children: [],
          },
        ],
      },
    ]);
  });

  it('父节点不存在时应将节点加入根节点', () => {
    const flatData: NgxFlatData = [
      { id: '1', name: '文件1', type: 'file', parentId: 'non-existent' }, // 父节点不存在
    ];
    const rootId = 'root';
    const treeData = service.convertFlatToTree(flatData, rootId);

    expect(treeData).toEqual([
      {
        id: '1',
        name: '文件1',
        type: 'file',
        expanded: true,
        children: [],
      },
    ]);
  });
});
