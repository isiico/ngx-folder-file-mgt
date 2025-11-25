import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxFolderFileMgtComponent } from './ngx-folder-file-mgt.component';
import { By } from '@angular/platform-browser';
import { NgxData, ErrorType } from './ngx-folder-file-mgt.type';
import { DebugElement } from '@angular/core';
import { NgxFolderFileMgtService } from './ngx-folder-file-mgt.service';

describe('NgxFolderFileMgtComponent', () => {
  let component: NgxFolderFileMgtComponent;
  let fixture: ComponentFixture<NgxFolderFileMgtComponent>;
  let debugElement: DebugElement;
  let mockService: jasmine.SpyObj<NgxFolderFileMgtService>;

  beforeEach(async () => {
    // 创建模拟服务
    const serviceSpy = jasmine.createSpyObj('NgxFolderFileMgtService', [
      'validateData',
      'convertFlatToTree',
      'consoleError', // 新增：添加 consoleError 模拟
    ]);

    await TestBed.configureTestingModule({
      imports: [NgxFolderFileMgtComponent],
      providers: [{ provide: NgxFolderFileMgtService, useValue: serviceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxFolderFileMgtComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    mockService = TestBed.inject(NgxFolderFileMgtService) as jasmine.SpyObj<NgxFolderFileMgtService>;
  });

  // ------------------------------
  // UI 渲染逻辑测试（核心）
  // ------------------------------
  it('当有错误时（ngxErrorInfo.type ≠ null），渲染错误组件，不渲染树形组件', () => {
    // 设置模拟服务的返回值
    mockService.validateData.and.returnValue({
      type: ErrorType.DATANONE,
      ids: [],
      modelNames: [],
    });

    // 通过输入属性设置数据（触发变更检测）
    component.ngxData.set(null);
    component.ngxTreeData.set(null);
    fixture.detectChanges();

    // 验证错误组件渲染
    const errorElement = debugElement.query(By.css('ngx-ffm-error-info'));
    expect(errorElement).toBeTruthy();

    // 验证树形组件不渲染
    const treeElement = debugElement.query(By.css('ngx-ffm-tree'));
    expect(treeElement).toBeNull();
  });

  it('当无错误且树形数据存在时，渲染树形组件，不渲染错误组件', () => {
    // 设置模拟服务的返回值（无错误）
    mockService.validateData.and.returnValue({
      type: null,
      ids: [],
      modelNames: [],
    });

    // 模拟数据
    const ngxdata: NgxData = [
      {
        id: '1',
        name: '文档',
        type: 'folder',
        parentId: 'root',
      },
    ];

    // 通过输入属性设置数据（触发变更检测）
    component.ngxData.set(ngxdata);
    fixture.detectChanges();

    // 验证错误组件不渲染
    const errorElement = debugElement.query(By.css('ngx-ffm-error-info'));
    expect(errorElement).toBeNull();

    // 验证树形组件渲染
    const treeElement = debugElement.query(By.css('ngx-ffm-tree'));
    expect(treeElement).toBeTruthy();

    // 验证树形数据已正确设置
    expect(component.ngxFFmTreeData()).toEqual([
      {
        id: '1',
        name: '文档',
        type: 'folder',
        parentId: 'root',
      },
    ]);
  });
});
