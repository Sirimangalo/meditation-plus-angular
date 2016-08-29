import {
  inject,
  async,
  fakeAsync,
  tick,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import { provide } from '@angular/core';
import { NotFoundComponent } from './not-found.component';
import { AppState } from '../app.service';

describe('not-found component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotFoundComponent],
      providers: [
        AppState
      ],
      imports: []
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents();
  }));

  it('should init', async(() => {
    let fixture = TestBed.createComponent(NotFoundComponent);
    fixture.detectChanges();
    let compiled = fixture.debugElement.nativeElement;

    expect(
      compiled.querySelector('md-card-title').innerHTML
    ).toContain('Page has not been found');
  }));
});
