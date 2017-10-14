import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppointmentComponent } from './appointment.component';
import { AppState } from '../app.service';
import { MaterialModule } from '../shared/material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from '../user/user.service';
import { FakeUserService } from '../user/testing/fake-user.service';
import { AppointmentService } from './appointment.service';
import { FakeAppointmentService } from './testing/fake-appointment.service';
import { SettingsService } from '../shared/settings.service';
import { FakeSettingsService } from '../shared/testing/fake-settings.service';
import { AvatarDirective } from '../profile/avatar.directive';
import * as moment from 'moment-timezone';
import { TestHelper } from '../../testing/test.helper';
import { FormatHourPipe } from './hour.pipe';

describe('AppointmentComponent', () => {
  let component: AppointmentComponent;
  let fixture: ComponentFixture<AppointmentComponent>;
  let mockAppointmentService: FakeAppointmentService;
  let mockUserService: FakeUserService;
  const mockUserId = '3';
  const currentYear = 2015, currentMonth = 5, currentDay = 3,
    currentHour = 10, currenMinute = 30;

  function mockCurrentUser(userId = mockUserId) {
    spyOn(mockUserService, 'getUserId').and.returnValue(userId);
  }

  function createMockAppointment(userId = null, timeOffset = 100) {
    const mockAppointment = {
      '_id': '111',
      'updatedAt': '2017-07-16T00:34:40.945Z',
      'createdAt': '2017-06-05T03:06:21.684Z',
      'weekDay': currentDay,
      'hour': currentHour * 100 + currenMinute + timeOffset, // hour is HHMM int format
      'user': {
        '_id': userId,
        'name': 'kelly',
        'username': 'kelly'
      }
    };
    return TestHelper.fakeResponse({hours: [mockAppointment.hour, '1300'], appointments: [mockAppointment]});
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        RouterTestingModule
      ],
      declarations: [
        AppointmentComponent,
        AvatarDirective,
        FormatHourPipe
      ],
      providers: [
        AppState,
        {provide: UserService, useClass: FakeUserService},
        {provide: AppointmentService, useClass: FakeAppointmentService},
        {provide: SettingsService, useClass: FakeSettingsService}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentComponent);
    component = fixture.componentInstance;

    mockAppointmentService = fixture.debugElement.injector.get<any>(AppointmentService);
    mockUserService = fixture.debugElement.injector.get<any>(UserService);
    fixture.detectChanges();  // call ngInit

  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

