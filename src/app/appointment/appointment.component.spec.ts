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
import { FormatHourPipe } from './hour.pipe';

describe('AppointmentComponent', () => {
  let component: AppointmentComponent;
  let fixture: ComponentFixture<AppointmentComponent>;
  let mockAppointmentService: FakeAppointmentService;
  let mockUserService: FakeUserService;

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
    fixture = <ComponentFixture<AppointmentComponent>>TestBed.createComponent(AppointmentComponent);
    component = fixture.componentInstance;

    mockAppointmentService = fixture.debugElement.injector.get<any>(AppointmentService);
    mockUserService = fixture.debugElement.injector.get<any>(UserService);
    fixture.detectChanges();  // call ngInit

  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

