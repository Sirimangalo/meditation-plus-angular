import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageListEntryComponent } from './message-list-entry.component';
import { AvatarDirective } from '../../profile/avatar.directive';
import { RouterTestingModule } from '@angular/router/testing';
import { FlagComponent } from '../../profile/flag/flag.component';
import { MaterialModule } from '../../shared/material.module';
import { MeditatedRecentlyDirective } from '../../profile/meditated-recently.directive';
import { MomentModule } from 'angular2-moment';
import { MentionsPipe } from '../mentions.pipe';
import { EmojiModule } from '../../emoji';
import { LinkyModule } from 'angular-linky';
import { FakeMessageService } from '../testing/fake-message.service';
import { MessageService } from '../message.service';
import { By } from '@angular/platform-browser';
import { addMatchers } from '../../../testing/jasmine-matchers';
import { Component, OnInit, DebugElement } from '@angular/core';

@Component({
  template: `
    <message-list-entry [message]="message"></message-list-entry>`
})
class TestHostComponent implements OnInit {
  message: any;

  public ngOnInit() {
    this.message = {
      text: 'hello :grin:',
      user: {username: 'test-user', gravatarHash: 'user-gravatar'},
      country: 'us'
    };
  }
}


describe('MessageListEntryComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let testHost: TestHostComponent;
  let el: DebugElement;

  beforeEach(async(() => {
    addMatchers();
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        RouterTestingModule,
        MomentModule,
        LinkyModule,
        EmojiModule
      ],
      declarations: [
        MessageListEntryComponent,
        TestHostComponent,
        AvatarDirective,
        MeditatedRecentlyDirective,
        FlagComponent,
        MentionsPipe,
      ],
      providers: [
        {provide: MessageService, useClass: FakeMessageService},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    testHost = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.debugElement.query(By.css('message-list-entry'));
  });

  it('should be created', () => {
    expect(testHost).toBeTruthy();
  });
  it('should have emoji', () => {
    expect(el.nativeElement.querySelector('i').className).toBe('e1a-grin');
  });
  it('should have gravatar', () => {
    const img = el.nativeElement.querySelector('img');
    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toContain('user-gravatar');
    expect(img.getAttribute('ng-reflect-router-link')).toContain('test-user');
  });
  it('should have text', () => {
    const text = el.query(By.css('span.chat-text'));
    expect(text).toHaveText('hello');
  });
});

