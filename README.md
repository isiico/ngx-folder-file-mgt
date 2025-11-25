# 项目介绍

`ngx-folder-file-mgt` 是一个面向 Angular19 应用的文件夹与文件管理组件库，旨在提供类似 VS Code 的文件管理体验，同时针对网页交互逻辑进行优化。该组件支持文件 / 文件夹的树形结构展示、层级管理及各类操作，可无缝集成到各类需要文件管理功能的 Angular 应用中。

项目的初衷是满足我个人项目的需求，目前没找到完全合用的组件，所以自己开发一个并且发布给有同样需求的人用。

# 使用方法

编辑 angular.json 添加图标

```json
...
assets: [
	...
	{
		"glob": "**/*",
		"input": "node_modules/ngx-folder-file-mgt/assets",
		"output": "/assets/"
	}
]
...
```

把组件引进 module 或 component

```typescript
import { NgxFolderFileMgtComponent, NgxData } from 'ngx-folder-file-mgt';

@NgModule({
  ...
    imports: [
        ...
        NgxFolderFileMgtComponent,
    ],
})

export class AppModule {
    public ngxData:NgxData = [];
}
```

# 功能计划

我的组件库 ngx-folder-file-mgt 打算支持以下功能，用户可以配置：

基础列表（只显示文件层级，可以选中文件），

基础排序（可按文件名排序，置顶/取消置顶），

基础编辑（添加，删除，编辑文件名），

基础快捷键（快捷键：切换，选中/展开/折叠，移动），

排序快捷键（快捷键：按文件名排序，置顶/取消置顶），

编辑快捷键（快捷键：添加，删除，编辑），

拖拽排序，

拖拽删除
