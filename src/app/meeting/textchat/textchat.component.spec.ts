import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextchatComponent } from './textchat.component';

describe('TextchatComponent', () => {
  let component: TextchatComponent;
  let fixture: ComponentFixture<TextchatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextchatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
