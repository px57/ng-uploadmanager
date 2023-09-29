import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentralUploadComponentComponent } from './central-upload-component.component';

describe('CentralUploadComponentComponent', () => {
  let component: CentralUploadComponentComponent;
  let fixture: ComponentFixture<CentralUploadComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CentralUploadComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CentralUploadComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
