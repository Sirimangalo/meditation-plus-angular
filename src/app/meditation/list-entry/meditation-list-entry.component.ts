import { Component, Input, Output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'meditation-list-entry',
  template: require('./meditation-list-entry.component.html'),
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    require('./meditation-list-entry.component.css')
  ]
})
export class MeditationListEntryComponent {
  @Input() meditation;
}
