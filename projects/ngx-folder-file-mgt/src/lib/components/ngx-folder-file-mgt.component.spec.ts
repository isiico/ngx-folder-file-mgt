import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxFolderFileMgtComponent } from './ngx-folder-file-mgt.component';

describe('NgxFolderFileMgtComponent', () => {
  let component: NgxFolderFileMgtComponent;
  let fixture: ComponentFixture<NgxFolderFileMgtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxFolderFileMgtComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxFolderFileMgtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
