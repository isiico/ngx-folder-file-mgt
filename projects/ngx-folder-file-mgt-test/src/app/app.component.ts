import { Component } from '@angular/core';
import {NgxFolderFileMgtComponent} from 'ngx-folder-file-mgt';

@Component({
  selector: 'app-root',
  imports: [NgxFolderFileMgtComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'ngx-folder-file-mgt-test';
}
