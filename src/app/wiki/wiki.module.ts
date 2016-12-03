import { NgModule }  from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared';
import { WikiComponent } from './wiki.component';

@NgModule({
  imports: [
    RouterModule,
    SharedModule
  ],
  declarations: [
    WikiComponent
  ],
  exports: [
    WikiComponent
  ]
})
export class WikiModule { }
