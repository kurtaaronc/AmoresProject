import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePaymentDateComponent } from './update-payment-date.component';

describe('UpdatePaymentDateComponent', () => {
  let component: UpdatePaymentDateComponent;
  let fixture: ComponentFixture<UpdatePaymentDateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdatePaymentDateComponent]
    });
    fixture = TestBed.createComponent(UpdatePaymentDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
