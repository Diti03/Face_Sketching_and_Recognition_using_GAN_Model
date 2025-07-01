import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacesketchComponent } from './facesketch.component';

describe('FacesketchComponent', () => {
  let component: FacesketchComponent;
  let fixture: ComponentFixture<FacesketchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FacesketchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FacesketchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
