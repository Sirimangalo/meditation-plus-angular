import { Component, Input, OnChanges } from '@angular/core';
import { QuestionService } from '../question.service';


@Component({
  selector: 'question-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: [
    './suggestions.component.styl'
  ]
})
export class QuestionSuggestionsComponent implements OnChanges {
  @Input() currentSearch: string;

  suggestions;
  activated = true;
  loading = false;

  constructor(
    public questionService: QuestionService,
  ) {
  }

  ngOnChanges() {
    this.loadSuggestions();
  }

  loadSuggestions() {
    if (!this.activated || this.loading || !this.currentSearch || this.currentSearch.length < 3) {
      return;
    }

    this.loading = true;
    this.questionService.findSuggestions(this.currentSearch)
      .subscribe((data) => {
        this.loading = false;
        this.suggestions = data.json();
      }, (err) => {
        console.error(err);
      });
  }
}
