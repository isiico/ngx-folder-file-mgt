import { Component, effect, input, OnInit } from '@angular/core';
import { NgxErrorInfo } from '../ngx-folder-file-mgt.type';
import { NgxFolderFileMgtService } from '../ngx-folder-file-mgt.service';
import { ErrorType } from '../ngx-folder-file-mgt.type';
import { NgxFfmIconComponent } from '../ngx-ffm-icon/ngx-ffm-icon.component';

@Component({
  selector: 'ngx-ffm-error-info',
  imports: [NgxFfmIconComponent],
  templateUrl: './ngx-ffm-error-info.component.html',
  styleUrl: './ngx-ffm-error-info.component.scss',
})
export class NgxFfmErrorInfoComponent implements OnInit {
  // 接收错误类型输入（主组件传递）
  public readonly ngxErrorInfo = input<NgxErrorInfo>();
  // 接受是否debug
  public readonly ngxDebug = input<boolean>();

  public errorType = ErrorType;

  constructor(private folderService: NgxFolderFileMgtService) {}
  ngOnInit(): void {
    this.consoleError();
  }

  private consoleError(): void {
    if (this?.ngxErrorInfo()?.type) {
      const errorType = this.ngxErrorInfo()?.type;
      const debug = this.ngxDebug() as boolean;
      if (debug) {
        let errorMsg = '';
        const modelNames = this.ngxErrorInfo()?.modelNames;
        const modelName = modelNames?.[0];
        switch (errorType) {
          case ErrorType.EMPTY:
            errorMsg = `您传入的 ${modelName} 为空数组，建议传入有效的 ${modelName}`;
            break;
          case ErrorType.DATANONE:
            errorMsg = 'ngxData和ngxTreeData均未传入值，请传入ngxData或者ngxTreeData';
            break;
          case ErrorType.DATANOTONLY:
            errorMsg = 'ngxData和ngxTreeData都传入了值，请删掉一个只保留一个，建议保留ngxData';
            break;
          case ErrorType.IDREPEAT:
            const ids = this.ngxErrorInfo()?.ids;
            errorMsg = `您传入的 ${modelName} 里包含了以下重复id： ${ids?.join()}，id不能重复，请修改后重新传`;
            break;
          case ErrorType.UNKNOWN:
            errorMsg = '未知原因引起的错误，请检查传入的数据';
            break;
        }
        this.folderService.consoleError(errorMsg, debug);
      }
    }
  }
}
