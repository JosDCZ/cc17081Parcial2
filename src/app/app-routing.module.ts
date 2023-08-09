import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkeletonComponent } from './layout/skeleton/skeleton.component';
import { Error404Component } from '@shared/error404/error404.component';

const routes: Routes = [
  { path: '', redirectTo: '/Home', pathMatch: 'full' },
  {
    path: ``,
    component: SkeletonComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('@app/salida/salida.module').then((m) => m.SalidaModule),
      },
    ],
  },
  { path: 'Error', component: Error404Component, title: 'Error 404' },
  { path: '**', redirectTo: 'Error' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
