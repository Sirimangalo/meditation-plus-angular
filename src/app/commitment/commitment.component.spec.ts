import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommitmentComponent } from './commitment.component';
import { MaterialModule } from '../shared/material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { AvatarDirective } from '../profile/avatar.directive';
import { CommitmentService } from './commitment.service';
import { FakeCommitmentService } from './testing/fake-commitment.service';
import { UserService } from '../user/user.service';
import { FakeUserService } from '../user/testing/fake-user.service';
import { AppState } from '../app.service';

describe('CommitmentComponent', () => {
  let component: CommitmentComponent;
  let fixture: ComponentFixture<CommitmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MaterialModule
      ],
      declarations: [
        AvatarDirective,
        CommitmentComponent
      ],
      providers: [
        AppState,
        {provide: CommitmentService, useClass: FakeCommitmentService},
        {provide: UserService, useClass: FakeUserService},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
