import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from 'src/app/shared/layout/layout.component';
import { RasterOverviewComponent } from './overview-page/overview-page.component';
import { RasterDataVizComponent } from './raster-data-viz/raster-data-viz.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: RasterOverviewComponent },
      { path: 'view/:id', component: RasterDataVizComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RasterDataRoutingModule { }
