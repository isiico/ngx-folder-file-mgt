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
  public title = 'ddd';
  public ngxData = signal<NgxData> ([
    {
      id: '1',
      name: 'ddd',
      type: 'folder',
      parentId: 'root',
    },
    {
      id: '2',
      name: 'ddds',
      type: 'folder',
      parentId: '1',
    },
  ]);
  public ngxTreeData:NgxTreeData = [
    {
      id: '1',
      name: '文件夹1',
      type: 'folder',
      children: [
        {
          id: '1-1',
          name: '文件1-1',
          type: 'file',
          children: [],
        },
      ],
    },
    {
      id: '2',
      name: '文件2',
      type: 'file',
      children: [],
    },
  ];

  public checkedIds:CheckedIds = [];

  constructor() {
  }

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }
}
