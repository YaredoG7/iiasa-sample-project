import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { OverviewPageComponent } from './overview-page/overview-page.component';
import { CsvDocumentsRoutingModule } from './csv-documents-routing.module';
import { DataVizComponent } from './data-viz/data-viz.component';
import { RouterModule } from '@angular/router';
import { ChunkSizePipe } from 'src/app/shared/pipes/chunk-size.pipe';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    MatChipsModule,
    CsvDocumentsRoutingModule
  ],
  declarations: [OverviewPageComponent, DataVizComponent, ChunkSizePipe],
  exports: [CsvDocumentsRoutingModule]
})
export class CsvDocumentsModule { }
