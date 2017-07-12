import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { OfflineMeditationComponent } from './offline-meditation.component';
import { Component, OnInit, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MeditationService } from '../../meditation/meditation.service';
import { FakeMeditationService } from '../../meditation/testing/fake-meditation.service';
import { MaterialModule } from '../../shared/material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  template: `
    <offline-meditation></offline-meditation>`
})
class TestHostComponent implements OnInit {
  public ngOnInit() {
    // todo: add output hook from offline-meditation
  }
}

describe('OfflineMeditationComponent', () => {
  let testHost: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let el: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        OfflineMeditationComponent,
        TestHostComponent,
      ],
      imports: [
        MaterialModule,
        NoopAnimationsModule,
        FormsModule,
      ],
      providers: [
        {provide: MeditationService, useClass: FakeMeditationService},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    testHost = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.debugElement.query(By.css('offline-meditation'));
  });

  it('should be created', () => {
    expect(el).toBeTruthy();
  });
});
