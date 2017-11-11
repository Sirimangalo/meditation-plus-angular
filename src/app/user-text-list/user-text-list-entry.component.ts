import {
  Component,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';

@Component({
  selector: 'user-text-list-entry',
  templateUrl: './user-text-list-entry.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: [
    './user-text-list-entry.component.styl'
  ]
})
export class UserTextListEntryComponent {
  @Input() public user;
  @Input() public date;
  @Input() public text;
  @Input() public timeAgo = true;
}
