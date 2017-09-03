import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OnlineComponent } from './online.component';
import { MaterialModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { AvatarDirective } from '../profile/avatar.directive';
import { FormsModule } from '@angular/forms';
import { MeditatedRecentlyDirective } from '../profile/meditated-recently.directive';
import { FlagComponent } from '../profile/flag/flag.component';
import { UserService } from '../user/user.service';
import { FakeUserService } from '../user/testing/fake-user.service';

describe('OnlineComponent', () => {
  let component: OnlineComponent;
  let fixture: ComponentFixture<OnlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        FormsModule,
        RouterTestingModule
      ],
      declarations: [
        OnlineComponent,
        AvatarDirective,
        FlagComponent,
        MeditatedRecentlyDirective
      ],
      providers: [
        {provide: UserService, useClass: FakeUserService}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
