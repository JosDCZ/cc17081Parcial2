import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalidaRoutingModule } from './salida-routing.module';
import { ListarComponent } from './pages/listar/listar.component';
import { TablaComponent } from './pages/tabla/tabla.component';
import { ModalComponent } from './pages/modal/modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { GraficaComponent } from './pages/grafica/grafica.component';
import { NgChartsModule } from 'ng2-charts';



@NgModule({
  declarations: [
    ListarComponent,
    TablaComponent,
    ModalComponent,
    GraficaComponent
  ],
  imports: [
    CommonModule,
    SalidaRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule,
    NgSelectModule,
    NgChartsModule // para los graficos
  ]
})
export class SalidaModule { }
