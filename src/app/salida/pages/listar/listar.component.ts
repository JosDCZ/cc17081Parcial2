import { ExcelService } from '@app/salida/services/excel.service';
import { ISalida } from '../../interface/datos.interface';
import { SalidaService } from './../../services/salida.service';
import { Component, OnInit } from '@angular/core';
import { ISalidaExcelTabla } from '@app/salida/interface/excel.interface';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss'],
})
export class ListarComponent implements OnInit {
  listSalida: ISalida[] = [];
  term: string = '';

  labels: string[] = [];
  dataGrafica: number[] = [];
  // Definir chartData con la misma estructura que labels y dataGrafica
  chartData: { data: number[]; label: string }[] = [];

  constructor(
    private salidaService: SalidaService,
    private excelService: ExcelService
  ) {}

  ngOnInit(): void {
    this.salidaService.getListar().subscribe((data) => {
      this.listSalida = data;

      this.graficar();
    });
    this.salidaService.salidas$.subscribe((data: ISalida[]) => {
      this.listSalida = data; // Actualiza los datos de la tabla con los datos recibidos del servicio compartido
      this.graficar();
    });
  }

  downloadExcel(): void {
    this.salidaService
      .getSalidaExportExcel()
      .subscribe((response: ISalidaExcelTabla) => {
        this.excelService.dowloadExcel(response);
      });
  }


  downloadPdf() {
    this.salidaService.generarPdfMake('PDFMAKE ---- ANGULAR',this.listSalida);
  }

  graficar() {
    this.labels = []; //No lo ocupo
    this.dataGrafica = []; //No lo ocupo
    this.chartData = [];
    let grupos: { [key: string]: ISalida[] } = {};
    // agrupar por tipos
    this.listSalida.forEach((sal) => {
      const llave = sal.municipio.zona.nombre;
      if (!grupos[llave]) {
        grupos[llave] = [];
      }
      grupos[llave].push(sal);
    });
    //No lo ocupo
    for (const key in grupos) {
      this.labels.push(key);
      this.dataGrafica.push(grupos[key].length);
    }

    // Llenar el array chartData con los datos agrupados
    this.chartData = this.labels.map((label, index) => ({
      data: [this.dataGrafica[index]], // Modificación aquí para que data sea un array
      label: label,
    }));
  }
}
