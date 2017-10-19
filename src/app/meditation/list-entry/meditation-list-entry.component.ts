import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'meditation-list-entry',
  templateUrl: './meditation-list-entry.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: [
    './meditation-list-entry.component.styl'
  ]
})
export class MeditationListEntryComponent {
  @Input() meditation;
}
