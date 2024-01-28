import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';

const appRoutes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'csv',
    loadChildren: () => import('./features/csv_documents/csv-documents.module').then(m => m.CsvDocumentsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'raster',
    loadChildren: () => import('./features/raster_data/raster-data.module').then(m => m.RasterDataModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'monthly-raster',
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: 'auth',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
