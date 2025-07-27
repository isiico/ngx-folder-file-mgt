import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxFfmErrorInfoComponent } from './ngx-ffm-error-info.component';

describe('NgxFfmErrorInfoComponent', () => {
  let component: NgxFfmErrorInfoComponent;
  let fixture: ComponentFixture<NgxFfmErrorInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxFfmErrorInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxFfmErrorInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
