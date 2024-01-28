import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { RasterDataVizComponent } from './raster-data-viz/raster-data-viz.component';
import { RasterOverviewComponent } from './overview-page/overview-page.component';
import { RasterDataRoutingModule } from './raster-data-routing.module';

@NgModule({
    imports: [
        CommonModule,
        RasterDataRoutingModule,
        SharedModule
    ],
    declarations: [
        RasterOverviewComponent,
        RasterDataVizComponent
    ],
    exports: [RasterDataVizComponent]
})
export class RasterDataModule { }
