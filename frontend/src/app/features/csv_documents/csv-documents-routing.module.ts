import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OverviewPageComponent } from './overview-page/overview-page.component';
import { LayoutComponent } from 'src/app/shared/layout/layout.component';
import { DataVizComponent } from './data-viz/data-viz.component';


const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: OverviewPageComponent },
      { path: 'view/:id', component: DataVizComponent },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CsvDocumentsRoutingModule { }
