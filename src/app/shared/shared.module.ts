import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkyPipe } from 'angular2-linky';
import { MaterialModule } from '../../platform/angular2-material2';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule.forRoot()
  ],
  declarations: [
    LinkyPipe
  ],
  exports: [
    CommonModule,
    MaterialModule,
    LinkyPipe
  ]
})
export class SharedModule { }
