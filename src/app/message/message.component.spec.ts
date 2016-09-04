import {
  inject,
  async,
  fakeAsync,
  tick,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import { MessageComponent } from './message.component';
import { MessageService } from './message.service';
import { UserService } from '../user/user.service';
import { MessageModule } from './';
import { TestHelper } from '../shared';
import { ENV_PROVIDERS } from '../environment';

describe('Message Component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MessageModule],
      providers: [{
        provide: MessageService,
        useValue: {
          getRecent: () => TestHelper.fakeResponse([{
            _id: '123',
            text: 'MyMessage'
          }, {
            _id: '124',
            text: 'Another Message'
          }]),
          getSocket: () => TestHelper.noRespose()
        }
      },
      {
        provide: UserService,
        useValue: {
          getProfile: () => TestHelper.fakeResponse({
            _id: '321'
          })
        }
      }]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents();
  }));

  it('should init', () => {
    let fixture = TestBed.createComponent(MessageComponent);
    fixture.detectChanges();
    let compiled = fixture.debugElement.nativeElement;

    expect(
      compiled.querySelectorAll('.message-row').length
    ).toBe(2);
  });

  it('should not accept invalid message', () => {
    let fixture = TestBed.createComponent(MessageComponent);
    fixture.detectChanges();
    let compiled = fixture.debugElement.nativeElement;

    expect(
      compiled.querySelector('button[type="submit"]').disabled
    ).toBe(true);
  });
});
