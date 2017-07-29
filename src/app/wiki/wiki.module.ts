import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@angular/material';
import { WikiComponent } from './wiki.component';
import { WikiNewComponent } from './new-form/new-form.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  declarations: [
    WikiComponent,
    WikiNewComponent
  ],
  exports: [
    WikiComponent,
    WikiNewComponent
  ]
})
export class WikiModule { }
