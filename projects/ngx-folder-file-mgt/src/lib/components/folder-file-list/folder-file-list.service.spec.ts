import { TestBed } from '@angular/core/testing';

import { FolderFileListService } from './folder-file-list.service';

describe('NgxFolderFileMgtService', () => {
  let service: FolderFileListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FolderFileListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
