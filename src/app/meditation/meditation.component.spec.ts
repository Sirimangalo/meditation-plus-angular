import {
  inject,
  async,
  fakeAsync,
  tick,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import { MeditationComponent } from './meditation.component';
import { MeditationService } from './meditation.service';
import { UserService } from '../user/user.service';
import { MeditationModule } from './';
import { TestHelper } from '../shared';
import { ENV_PROVIDERS } from '../environment';
import { Router } from '@angular/router';
import { AppModule } from '../';

describe('Meditation Component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MeditationModule, AppModule],
      providers: [{
        provide: MeditationService,
        useValue: {
          getRecent: () => TestHelper.fakeResponse([{
            _id: '123'
          }, {
            _id: '124'
          }]),
          getSocket: () => TestHelper.noRespose()
        }
      },
      {
        provide: Router,
        useValue: {
          // Note that the params and method name must match something that exists in AuthHttp
          navigate: (url: string) => {
            return null;
          }
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
    let fixture = TestBed.createComponent(MeditationComponent);
    fixture.detectChanges();
    let compiled = fixture.debugElement.nativeElement;

    expect(
      compiled.querySelectorAll('md-list-item').length
    ).toBe(2);
  });

  it('should not accept invalid meditation', () => {
    let fixture = TestBed.createComponent(MeditationComponent);
    fixture.detectChanges();
    let compiled = fixture.debugElement.nativeElement;

    expect(
      compiled.querySelector('button[type="submit"]').disabled
    ).toBe(true);
  });
});
