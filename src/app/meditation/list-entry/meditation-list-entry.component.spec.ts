import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeditationListEntryComponent } from './meditation-list-entry.component';
import { Component, OnInit, DebugElement } from '@angular/core';
import { MaterialModule } from '@angular/material';
import { FlagComponent } from '../../profile/flag/flag.component';
import { AvatarDirective } from '../../profile/avatar.directive';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

@Component({
  template: `
    <meditation-list-entry [meditation]="meditation"></meditation-list-entry>`
})

class TestHostComponent implements OnInit {
  meditation: any;

  public ngOnInit() {
    this.meditation = {
      '_id': '2',
      'updatedAt': '2017-06-27T06:29:43.366Z',
      'sitting': 15,
      'walking': 15,
      'createdAt': '2017-06-27T03:25:17.033Z',
      'end': '2017-06-27T03:55:17.033Z',
      'user': {
        '_id': '33',
        'gravatarHash': '44hash',
        'name': 'Anthony',
        'country': 'US',
        'username': 'Anthony'
      },
      'numOfLikes': 6,
      '__v': 0,
      'walkingLeft': 0,
      'sittingLeft': 0,
      'status': 'done'
    };
  }
}

describe('MeditationListEntryComponent', () => {
  let testHost: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let el: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MeditationListEntryComponent,
        TestHostComponent,
        FlagComponent,
        AvatarDirective,
      ],
      imports: [
        MaterialModule,
        RouterTestingModule
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    testHost = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.debugElement.query(By.css('meditation-list-entry'));
  });

  it('should be created', () => {
    expect(el).toBeTruthy();
  });
});
