import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MaterialModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng2-mock-component';
import { AppState } from './app.service';
import { UserService } from './user/user.service';
import { FakeUserService } from 'app/user/testing/fake-user.service';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        MockComponent({selector: 'online', inputs: ['detailed']}),
      ],
      imports: [
        MaterialModule,
        RouterTestingModule
      ],
      providers: [
        AppState,
        {provide: UserService, useClass: FakeUserService}
      ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
