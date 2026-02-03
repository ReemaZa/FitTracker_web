import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppCommentThreadComponent } from './app-comment-thread.component';

describe('AppCommentThreadComponent', () => {
  let component: AppCommentThreadComponent;
  let fixture: ComponentFixture<AppCommentThreadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppCommentThreadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppCommentThreadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
