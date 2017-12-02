import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { UserService } from '../user/user.service';
import { FakeUserService } from '../user/testing/fake-user.service';
import { MockComponent } from 'ng2-mock-component';
import { MaterialModule } from '../shared/material.module';
import { AvatarDirective } from './avatar.directive';
import { RouterTestingModule } from '@angular/router/testing';
import { LinkyModule } from 'angular-linky';
import { FlagComponent } from './flag/flag.component';
import { AppState } from '../app.service';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        LinkyModule,
        RouterTestingModule,
      ],
      declarations: [
        ProfileComponent,
        AvatarDirective,
        FlagComponent,
        MockComponent({selector: 'offline-meditation'}),
        MockComponent({selector: 'badge', inputs: ['consecutiveDays']}),
        MockComponent({selector: 'profile-charts', inputs: ['data']})
      ],
      providers: [
        AppState,
        {provide: UserService, useClass: FakeUserService}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
