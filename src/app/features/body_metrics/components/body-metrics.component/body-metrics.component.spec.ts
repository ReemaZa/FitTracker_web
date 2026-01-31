import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyMetricsComponent } from './body-metrics.component';

describe('BodyMetricsComponent', () => {
  let component: BodyMetricsComponent;
  let fixture: ComponentFixture<BodyMetricsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BodyMetricsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BodyMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
