import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsBaseComponent } from './comments-base.component';

describe('CommentsBaseComponent', () => {
  let component: CommentsBaseComponent;
  let fixture: ComponentFixture<CommentsBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentsBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentsBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
