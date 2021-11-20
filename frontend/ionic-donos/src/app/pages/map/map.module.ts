import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { MapPage } from './map';
import { MapPageRoutingModule } from './map-routing.module';
import { ReportModal } from './report-modal/report-modal';
import { ReportDetailsModal } from './report-details-modal /report-details-modal';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    MapPageRoutingModule
  ],
  declarations: [
    MapPage,
    ReportModal,
    ReportDetailsModal
  ]
})
export class MapModule { }
