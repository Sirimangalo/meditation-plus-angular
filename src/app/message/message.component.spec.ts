import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageComponent } from './message.component';
import { FakeMessageService } from './testing/fake-message.service';
import { MessageService } from './message.service';
import { UserService } from '../user/user.service';
import { FakeUserService } from '../user/testing/fake-user.service';
import { WebsocketService } from '../shared/websocket.service';
import { FakeWebsocketService } from '../shared/testing/fake-websocket.service';
import { MockComponent } from 'ng2-mock-component';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

import { MaterialModule } from '../shared/material.module';
import { TestHelper } from '../../testing/test.helper';
import * as moment from 'moment';

describe('MessageComponent', () => {
  let component: MessageComponent;
  let fixture: ComponentFixture<MessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        FormsModule,
        NoopAnimationsModule
      ],
      declarations: [
        MessageComponent,
        MockComponent({selector: 'emoji-select'}),
        MockComponent({selector: 'message-list-entry', inputs: ['message', 'admin', 'menuOpen']}),
      ],
      providers: [
        {provide: MessageService, useClass: FakeMessageService},
        {provide: WebsocketService, useClass: FakeWebsocketService},
        {provide: UserService, useClass: FakeUserService}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should have 3 messages', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(
      compiled.querySelectorAll('.message-row').length
    ).toBe(3);
  });

  it('should have disabled submit button', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(
      compiled.querySelector('button[type="submit"]').disabled
    ).toBe(true);
  });

  it('should send message to service', () => {
    const compiled = fixture.debugElement.nativeElement;

    const mockService =
      fixture.debugElement.injector.get<any>(MessageService) as FakeMessageService;
    const spy = spyOn(mockService, 'post').and.callThrough();

    component.currentMessage = '##HELLO_GOODBYE##';
    fixture.detectChanges(); // pass to view

    expect(
      compiled.querySelector('button[type="submit"]').disabled
    ).toBe(false);  // expect user can click submit button

    // simulate submit
    const form = compiled.querySelector('form');
    TestHelper.dispatchEvent(form, 'submit');

    // the service function is called with currentMessage
    expect(spy.calls.count()).toBe(1);
    expect(spy.calls.argsFor(0)).toEqual(['##HELLO_GOODBYE##']);

  });


  it('should process messageHandler call', (done) => {
    const lastMessage: any = {
      _id: '123',
      text: 'MyMessage 1',
      createdAt: '2017-06-11T02:33:06.780Z'
    };
    component.messages = [lastMessage];

    const msg2 = {
      _id: '124',
      text: 'MyMessage 2',
      createdAt: '2017-06-13T02:34:06.780Z',
    };

    const msg3 = {
      _id: '125',
      text: 'MyMessage 3',
      createdAt: '2017-06-15T02:34:06.780Z'
    };

    const msg4 = {
      _id: '125',
      text: 'MyMessage 4',
      createdAt: '2017-06-16T02:34:06.780Z',
    };

    const websocket_data: any = {
      current: msg4,
      previous: msg3
    };
    const mockService =
      fixture.debugElement.injector.get<any>(MessageService) as FakeMessageService;
    const serviceSpy = spyOn(mockService, 'synchronize').and.returnValue(TestHelper.fakeResponse([msg2, msg3]));

    component.messageHandler(websocket_data);

    TestHelper.advance(fixture).then(() => {
      // using By, can access custom tag directly
      expect(fixture.debugElement.queryAll(By.css('message-list-entry')).length).toBe(4);

      expect(serviceSpy.calls.count()).toBe(1);
      expect(serviceSpy.calls.argsFor(0)[0]).toBe(lastMessage.createdAt);
      expect(serviceSpy.calls.argsFor(0)[1]).toEqual(moment(websocket_data.previous.createdAt).toDate());

      expect(component.messages.length).toBe(4);

      // test that messages are sorted
      for (const entry of [1, 2, 3, 4]) {
        expect(component.messages[entry - 1].text).toEqual(`MyMessage ${entry}`);
      }
      done();
    });

  });

});
