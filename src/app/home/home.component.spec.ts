import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { MaterialModule } from '../shared/material.module';
import { WebsocketService } from '../shared/websocket.service';
import { FakeWebsocketService } from '../shared/testing/fake-websocket.service';
import { UserService } from '../user/user.service';
import { FakeUserService } from '../user/testing/fake-user.service';
import { FakeMessageService } from '../message/testing/fake-message.service';
import { MessageService } from '../message/message.service';
import { QuestionService } from '../question/question.service';
import { FakeQuestionService } from '../question/testing/fake-question.service';
import { MockComponent } from 'ng2-mock-component';
import { AppState } from '../app.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        RouterTestingModule
      ],
      declarations: [
        HomeComponent,
        MockComponent({selector: 'meditation'}),
        MockComponent({selector: 'message'}),
        MockComponent({selector: 'question'}),
      ],

      providers: [
        AppState,
        {provide: QuestionService, useClass: FakeQuestionService},
        {provide: UserService, useClass: FakeUserService},
        {provide: MessageService, useClass: FakeMessageService},
        {provide: WebsocketService, useClass: FakeWebsocketService}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
