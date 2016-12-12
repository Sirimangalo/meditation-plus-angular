import { NgModule }  from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { WikiComponent } from './wiki.component';
import { WikiFormComponent } from './wiki-form.component';
import { SafePipe } from './safe.pipe';

@NgModule({
  imports: [
    RouterModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    WikiComponent,
    WikiFormComponent,
    SafePipe
  ],
  exports: [
    WikiComponent,
    WikiFormComponent
  ]
})
export class WikiModule { }
