import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { WikiService } from '../wiki.service';

@Component({
  selector: 'new-form',
  templateUrl: './new-form.component.html',
  styleUrls: ['./new-form.component.styl']
})
export class WikiNewComponent implements OnInit {

  videoUrl: string;
  description: string;
  newTag: string;
  tags: string[] = [];
  tagsCtrl: FormControl;
  tagSuggestions: any[];

  loading: Boolean;
  success: Boolean;
  error: string;

  constructor(public wikiService: WikiService) {
    this.tagsCtrl = new FormControl();
    this.tagsCtrl.valueChanges
        .debounceTime(500)
        .startWith(null)
        .subscribe(name => {
          if (name && name.trim().length > 0) {
            this.wikiService
              .getTags(name)
              .map(res => res.json())
              .subscribe(res => this.tagSuggestions = res);
          } else {
            this.tagSuggestions = [];
          }
        });
  }

  addTag(): void {
    if (!this.newTag || this.newTag.trim().length < 3 || this.newTag.length > 35) {
      return;
    }

    this.tags.push(this.newTag);
    this.newTag = '';
  }

  removeTag(name): void {
    const i = this.tags.indexOf(name);

    if (i >= 0) {
      this.tags.splice(i, 1);
    }
  }

  clear(): void {
    this.error = '';
    this.loading = false;
    this.videoUrl = '';
    this.description = '';
    this.newTag = '';
    this.tags = [];
  }

  submit(): void {
    this.error = '';
    this.success = false;
    this.loading = true;

    this.wikiService.new(this.videoUrl, this.tags, this.description)
      .subscribe(
        () => {
          this.success = true;
          this.clear()
        },
        err => {
          this.loading = false;
          this.error = err.text();
        }
      );
  }

  ngOnInit() {
  }
}
