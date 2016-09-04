import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmojiSelectComponent } from './emoji-select.component';
import { EmojiPipe } from './emoji.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    EmojiSelectComponent,
    EmojiPipe
  ],
  exports: [
    EmojiSelectComponent,
    EmojiPipe
  ]
})
export class EmojiModule { }
