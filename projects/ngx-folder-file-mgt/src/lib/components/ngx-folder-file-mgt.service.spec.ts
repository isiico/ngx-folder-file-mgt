import { TestBed } from '@angular/core/testing';

import { NgxFolderFileMgtService } from './ngx-folder-file-mgt.service';

describe('NgxFolderFileMgtService', () => {
  let service: NgxFolderFileMgtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxFolderFileMgtService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
