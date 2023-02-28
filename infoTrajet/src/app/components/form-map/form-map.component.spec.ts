import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMapComponent } from './form-map.component';

describe('FormMapComponent', () => {
  let component: FormMapComponent;
  let fixture: ComponentFixture<FormMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
