import { Component, effect, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
// import { NgxFolderFileMgtComponent, NgxData } from 'ngx-folder-file-mgt';

// 本地导入
import { NgxFolderFileMgtComponent } from '../../../ngx-folder-file-mgt/src/lib/components/ngx-folder-file-mgt.component';
import { NgxTreeData, CheckedIds } from '../../../ngx-folder-file-mgt/src/lib/components/ngx-folder-file-mgt.type';
import { NgxData } from 'ngx-folder-file-mgt';

@Component({
  selector: 'app-root',
  imports: [NgxFolderFileMgtComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnChanges {
  public title = 'ngx-folder-file-mgt-test';
  // 扁平数据（NgxData）：模拟后端接口返回的结构化数据
  public ngxData = signal<NgxData>([
    // 一级文件夹：项目根目录
    {
      id: 'proj-root',
      name: '产品研发项目',
      type: 'folder',
      parentId: 'root',
      expanded: true, // 默认展开根目录
      createTime: '2024-01-15',
      creator: '张经理',
    },
    // 二级文件夹：需求文档
    {
      id: 'req-docs',
      name: '需求文档',
      type: 'folder',
      parentId: 'proj-root',
      expanded: false,
      createTime: '2024-01-16',
      creator: '李产品',
    },
    // 需求文档下的文件（通过文件名和 ext 区分类型）
    {
      id: 'req-main',
      name: '核心功能需求.docx',
      type: 'file',
      parentId: 'req-docs',
      size: '2.4MB',
      createTime: '2024-01-16',
      ext: 'docx', // 文件扩展名
    },
    {
      id: 'req-user',
      name: '用户画像分析.pdf',
      type: 'file',
      parentId: 'req-docs',
      size: '1.8MB',
      createTime: '2024-01-17',
      ext: 'pdf',
    },
    // 二级文件夹：设计资源
    {
      id: 'design-res',
      name: '设计资源',
      type: 'folder',
      parentId: 'proj-root',
      expanded: false,
      createTime: '2024-01-18',
      creator: '王设计',
    },
    // 设计资源下的子文件夹（三级）
    {
      id: 'design-ui',
      name: 'UI设计稿',
      type: 'folder',
      parentId: 'design-res',
      expanded: false,
      createTime: '2024-01-19',
    },
    // UI设计稿下的图片文件
    {
      id: 'ui-home',
      name: '首页原型.png',
      type: 'file',
      parentId: 'design-ui',
      size: '4.7MB',
      createTime: '2024-01-19',
      ext: 'png',
    },
    {
      id: 'ui-detail',
      name: '详情页设计.psd',
      type: 'file',
      parentId: 'design-ui',
      size: '12.3MB',
      createTime: '2024-01-20',
      ext: 'psd',
    },
    // 二级文件夹：开发代码
    {
      id: 'dev-code',
      name: '开发代码',
      type: 'folder',
      parentId: 'proj-root',
      expanded: true,
      createTime: '2024-01-22',
      creator: '赵开发',
    },
    // 开发代码下的文件
    {
      id: 'code-main',
      name: 'main.ts',
      type: 'file',
      parentId: 'dev-code',
      size: '3.1KB',
      createTime: '2024-01-22',
      ext: 'ts',
    },
    {
      id: 'code-api',
      name: 'api.service.ts',
      type: 'file',
      parentId: 'dev-code',
      size: '5.8KB',
      createTime: '2024-01-23',
      ext: 'ts',
    },
    // 一级文件：项目计划（直接在根目录）
    {
      id: 'proj-plan',
      name: '项目时间规划.xlsx',
      type: 'file',
      parentId: 'root',
      size: '845KB',
      createTime: '2024-01-14',
      ext: 'xlsx',
    },
  ]);

  // 树形数据（NgxTreeData）：模拟前端组装的嵌套结构
  public ngxTreeData: NgxTreeData = [
    {
      id: 'company-docs',
      name: '公司文档库',
      type: 'folder',
      expanded: true,
      children: [
        {
          id: 'dept-tech',
          name: '技术部',
          type: 'folder',
          expanded: false,
          children: [
            {
              id: 'tech-2023',
              name: '2023年技术总结.pptx',
              type: 'file',
              size: '7.2MB',
              ext: 'pptx',
              children: [],
            },
            {
              id: 'tech-frame',
              name: '架构设计图',
              type: 'folder',
              children: [
                {
                  id: 'frame-core',
                  name: '核心架构.png',
                  type: 'file',
                  size: '3.5MB',
                  ext: 'png',
                  children: [],
                },
              ],
            },
          ],
        },
        {
          id: 'dept-hr',
          name: '人力资源部',
          type: 'folder',
          expanded: false,
          children: [
            {
              id: 'hr-recruit',
              name: '2024招聘计划.docx',
              type: 'file',
              size: '1.2MB',
              ext: 'docx',
              children: [],
            },
          ],
        },
        {
          id: 'company-intro',
          name: '公司介绍视频.mp4',
          type: 'file',
          size: '128MB',
          ext: 'mp4',
          children: [],
        },
      ],
    },
  ];

  // 选中的ID（模拟用户操作结果）
  public checkedIds: CheckedIds = ['req-main'];
  public checkedIdsTree: CheckedIds = ['tech-2023'];

  constructor() {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }
}
