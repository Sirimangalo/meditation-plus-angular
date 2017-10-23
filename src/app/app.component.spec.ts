import { MaterialModule } from './shared/material.module';
import { TestBed, async } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng2-mock-component';
import { AppState } from './app.service';
import { UserService } from './user/user.service';
import { FakeUserService } from 'app/user/testing/fake-user.service';
import { AppointmentService } from './appointment/appointment.service';
import { FakeAppointmentService } from './appointment/testing/fake-appointment.service';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        MockComponent({selector: 'online', inputs: ['detailed']}),
      ],
      imports: [
        MaterialModule,
        NoopAnimationsModule,
        RouterTestingModule
      ],
      providers: [
        AppState,
        {provide: UserService, useClass: FakeUserService},
        {provide: AppointmentService, useClass: FakeAppointmentService}
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
