import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { QuestionSuggestionsComponent } from './suggestions.component';
import { QuestionService } from '../question.service';
import { FakeQuestionService } from '../testing/fake-question.service';
import { MockComponent } from '../../../testing/mock-component';
import { MaterialModule } from '@angular/material';
import { FormsModule } from '@angular/forms';

describe('SuggestionsComponent', () => {
  let component: QuestionSuggestionsComponent;
  let fixture: ComponentFixture<QuestionSuggestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        FormsModule,
      ],
      declarations: [
        QuestionSuggestionsComponent,
        MockComponent({selector: 'question-list-entry', inputs: ['question', 'isAdmin']}),
      ],
      providers: [
        {provide: QuestionService, useClass: FakeQuestionService},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionSuggestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
