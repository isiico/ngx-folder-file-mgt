import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxFfmIconComponent } from './ngx-ffm-icon.component';

describe('NgxFfmIconComponent', () => {
  let component: NgxFfmIconComponent;
  let fixture: ComponentFixture<NgxFfmIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxFfmIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxFfmIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
