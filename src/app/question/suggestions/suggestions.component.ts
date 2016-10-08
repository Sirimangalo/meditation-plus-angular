import { Component, Input } from '@angular/core';
import { QuestionService } from '../question.service';


@Component({
  selector: 'question-suggestions',
  template: require('./suggestions.component.html'),
  styles: [
    require('./suggestions.component.css')
  ]
})
export class QuestionSuggestionsComponent {
  @Input() currentSearch: string;

  suggestions: Object[];
  activated: boolean = true;
  loading: boolean = false;

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
