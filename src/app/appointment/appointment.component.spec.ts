import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentComponent } from './appointment.component';
import { AppState } from '../app.service';
import { MaterialModule } from '../shared/material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from '../user/user.service';
import { FakeUserService } from '../user/testing/fake-user.service';
import { AppointmentService } from './appointment.service';
import { FakeAppointmentService } from './testing/fake-appointment.service';
import { AvatarDirective } from '../profile/avatar.directive';

describe('AppointmentComponent', () => {
  let component: AppointmentComponent;
  let fixture: ComponentFixture<AppointmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        RouterTestingModule,
      ],
      declarations: [
        AppointmentComponent,
        AvatarDirective
      ],
      providers: [
        AppState,
        {provide: UserService, useClass: FakeUserService},
        {provide: AppointmentService, useClass: FakeAppointmentService}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
