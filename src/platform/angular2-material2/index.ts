import { NgModule, ModuleWithProviders } from '@angular/core';
import { MdButtonModule } from '@angular2-material/button';
import { MdCheckboxModule } from '@angular2-material/checkbox';
import { MdRadioModule } from '@angular2-material/radio';
import { MdSlideToggleModule } from '@angular2-material/slide-toggle';
import { MdSidenavModule } from '@angular2-material/sidenav';
import { MdListModule } from '@angular2-material/list';
import { MdGridListModule } from '@angular2-material/grid-list';
import { MdCardModule } from '@angular2-material/card';
import { MdIconModule } from '@angular2-material/icon';
import { MdProgressCircleModule } from '@angular2-material/progress-circle';
import { MdProgressBarModule } from '@angular2-material/progress-bar';
import { MdInputModule } from '@angular2-material/input';
import { MdTabsModule } from '@angular2-material/tabs';
import { MdToolbarModule } from '@angular2-material/toolbar';
import { MdTooltipModule } from '@angular2-material/tooltip';
import {
  MdLiveAnnouncer,
  MdRippleModule,
  RtlModule,
  PortalModule,
  OverlayModule
} from '@angular2-material/core';
import { MdMenuModule } from '@angular2-material/menu';


const MATERIAL_MODULES = [
  MdButtonModule,
  MdCardModule,
  MdCheckboxModule,
  MdGridListModule,
  MdIconModule,
  MdInputModule,
  MdListModule,
  MdMenuModule,
  MdProgressBarModule,
  MdProgressCircleModule,
  MdRadioModule,
  MdRippleModule,
  MdSidenavModule,
  MdSlideToggleModule,
  MdTabsModule,
  MdToolbarModule,
  MdTooltipModule,
  OverlayModule,
  PortalModule,
  RtlModule,
];

@NgModule({
  imports: [
    MdButtonModule.forRoot(),
    MdCardModule.forRoot(),
    MdCheckboxModule.forRoot(),
    MdGridListModule.forRoot(),
    MdInputModule.forRoot(),
    MdListModule.forRoot(),
    MdProgressBarModule.forRoot(),
    MdProgressCircleModule.forRoot(),
    MdRippleModule.forRoot(),
    MdSidenavModule.forRoot(),
    MdTabsModule.forRoot(),
    MdToolbarModule.forRoot(),
    PortalModule.forRoot(),
    RtlModule.forRoot(),

    // These modules include providers.
    MdIconModule.forRoot(),
    MdMenuModule.forRoot(),
    MdRadioModule.forRoot(),
    MdSlideToggleModule.forRoot(),
    MdTooltipModule.forRoot(),
    OverlayModule.forRoot(),
  ],
  exports: MATERIAL_MODULES,
  providers: [MdLiveAnnouncer]
})
export class MaterialRootModule { }


@NgModule({
  imports: MATERIAL_MODULES,
  exports: MATERIAL_MODULES,
})
export class MaterialModule {
  static forRoot(): ModuleWithProviders {
    return {ngModule: MaterialRootModule};
  }
}
