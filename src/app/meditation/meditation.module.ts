import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared';
import { MeditationComponent } from './meditation.component';
import { MeditationListEntryComponent } from './list-entry/meditation-list-entry.component';
import { MeditationChartComponent } from './chart/meditation-chart.component';
import { EmojiModule } from '../emoji';
import { ProfileModule } from '../profile';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    SharedModule,
    ProfileModule,
    FormsModule,
    RouterModule,
    EmojiModule,
    ChartsModule
  ],
  declarations: [
    MeditationComponent,
    MeditationListEntryComponent,
    MeditationChartComponent
  ],
  exports: [
    MeditationComponent,
    MeditationListEntryComponent,
    MeditationChartComponent
  ]
})
export class MeditationModule { }
