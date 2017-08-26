import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FakeMeditationService } from './testing/fake-meditation.service';
import { MeditationService } from './meditation.service';
import { UserService } from '../user/user.service';
import { FakeUserService } from '../user/testing/fake-user.service';
import { CommitmentService } from '../commitment/commitment.service';
import { FakeCommitmentService } from '../commitment/testing/fake-commitment.service';
import { FormsModule } from '@angular/forms';
import { MockComponent } from 'ng2-mock-component';
import { AvatarDirective } from '../profile/avatar.directive';
import { AppState } from '../app.service';
import { MeditationComponent } from './meditation.component';
import { addMatchers } from '../../testing/jasmine-matchers';
import { TestHelper } from '../../testing/test.helper';

describe('MeditationComponent', () => {
  let component: MeditationComponent;
  let fixture: ComponentFixture<MeditationComponent>;

  beforeEach(async(() => {
    addMatchers();
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        FormsModule,
        NoopAnimationsModule,
        RouterTestingModule
      ],
      declarations: [
        MeditationComponent,
        AvatarDirective,
        MockComponent({selector: 'meditation-chart'}),
        MockComponent({selector: 'meditation-list-entry', inputs: ['meditation']}),
      ],
      providers: [
        AppState,
        {provide: MeditationService, useClass: FakeMeditationService},
        {provide: CommitmentService, useClass: FakeCommitmentService},
        {provide: UserService, useClass: FakeUserService}
        ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeditationComponent);
    component = fixture.componentInstance;
    // remove polling subscription as it prevents component state to stabilize.
    const spy = spyOn(component, 'pollMeditations').and.returnValue(TestHelper.noResponse());
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    const compiled = fixture.debugElement.nativeElement;
  });

  it('should have disabled submit button', () => {
    // clear field that could have been read from localstorage from other tests
    component.walking = null;
    component.sitting = null;

    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;
    expect(
      compiled.querySelector('button[type="submit"]').disabled
    ).toBe(true);
  });

  it('should have 20 minute commitment', () => {
    const compiled = fixture.debugElement.nativeElement;
    const commitment = compiled.querySelector('.commitment');
    expect(commitment).toHaveText('20 minutes daily');
  });

  it('should finish all async in ngInit', (done) => {
    // this test caught the presence of polling in the component before stubbing pollMeditations()
    fixture.whenStable().then(() => {
      done();
    });
  });

  it('should send meditation time to service', (done) => {
    // have to wait until stable before setting input value inside form
    // https://stackoverflow.com/questions/43287454/angular2-unit-testing-does-not-update-inputs-ngmodel-when-used-inside-a-form
    fixture.whenStable().then(() => {
      const compiled = fixture.debugElement.nativeElement;
      const mockService =
        fixture.debugElement.injector.get<any>(MeditationService) as FakeMeditationService;
      const spy = spyOn(mockService, 'post').and.callThrough();

      const walking = compiled.querySelector('input[name="walking"]');
      TestHelper.setInputValue(walking, '10');

      const sitting = compiled.querySelector('input[name="sitting"]');
      TestHelper.setInputValue(sitting, '20');

      fixture.detectChanges();

      expect(
        compiled.querySelector('button[type="submit"]').disabled
      ).toBe(false);  // expect user can click submit button

      // simulate submit
      const form = compiled.querySelector('form');
      TestHelper.dispatchEvent(form, 'submit');

      // the service function is called with currentMessage
      expect(spy.calls.count()).toBe(1);
      expect(spy.calls.argsFor(0)).toEqual([10, 20]);
      done();
    });
  });
});
