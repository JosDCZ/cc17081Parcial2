import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  IMunicipio,
  ISalida,
  IVehiculo,
  IVenta,
} from '../interface/datos.interface';
import { BehaviorSubject, Observable, map } from 'rxjs';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { ISalidaExcelTabla, ITablaSalida } from '../interface/excel.interface';
import { format } from 'date-fns';
import {PdfMakeWrapper,Table,Txt} from 'pdfmake-wrapper';

@Injectable({
  providedIn: 'root',
})
export class SalidaService {
  private baseUrl: string = environment.baseUrl;

  private _salidas: BehaviorSubject<ISalida[]> = new BehaviorSubject<ISalida[]>(
    []
  );

  public salidas$ = this._salidas.asObservable();

  constructor(private http: HttpClient) {}

  public actualizarSalidas(nuevasSalidas: ISalida[]): void {
    this._salidas.next(nuevasSalidas);
  }

  getListar(): Observable<ISalida[]> {
    return this.http
      .get(`${this.baseUrl}/salida`)
      .pipe(map((resp: any) => resp as ISalida[]));
  }

  getVentas(): Observable<IVenta[]> {
    return this.http
      .get(`${this.baseUrl}/venta`)
      .pipe(map((resp: any) => resp as IVenta[]));
  }

  getVehiculo(): Observable<IVehiculo[]> {
    return this.http
      .get(`${this.baseUrl}/vehiculo`)
      .pipe(map((resp: any) => resp as IVehiculo[]));
  }

  getMunicipio(): Observable<IMunicipio[]> {
    return this.http
      .get(`${this.baseUrl}/municipio`)
      .pipe(map((resp: any) => resp as IMunicipio[]));
  }

  getVentasById(id: string): Observable<IVenta> {
    if (id != '') {
      return this.http
        .get(`${this.baseUrl}/venta/${id}`)
        .pipe(map((resp: any) => resp as IVenta));
    } else {
      return this.http
        .get(`${this.baseUrl}/venta/`)
        .pipe(map((resp: any) => resp as IVenta));
    }
  }

  getVehiculoById(id: string): Observable<IVehiculo> {
    if (id != '') {
      return this.http
        .get(`${this.baseUrl}/vehiculo/${id}`)
        .pipe(map((resp: any) => resp as IVehiculo));
    } else {
      return this.http
        .get(`${this.baseUrl}/vehiculo/`)
        .pipe(map((resp: any) => resp as IVehiculo));
    }
  }

  getMunicipioById(id: string): Observable<IMunicipio> {
    if (id != '') {
      return this.http
        .get(`${this.baseUrl}/municipio/${id}`)
        .pipe(map((resp: any) => resp as IMunicipio));
    } else {
      return this.http
        .get(`${this.baseUrl}/municipio/`)
        .pipe(map((resp: any) => resp as IMunicipio));
    }
  }

  guardar(salida: ISalida): any {
    return this.http.post(`${this.baseUrl}/salida`, salida);
  }

  modificar(salida: ISalida): any {
    return this.http.put(`${this.baseUrl}/salida/${salida.id}`, salida);
  }

  borrar(dat: ISalida): Observable<ISalida> {
    return this.http.delete<ISalida>(`${this.baseUrl}/salida/${dat.id}`);
  }

  getSalidaExportExcel(): Observable<ISalidaExcelTabla> {
    return this.http.get<ISalida[]>(`${this.baseUrl}/salida`).pipe(
      map((resp: ISalida[]) => {
        const dataExcel: ISalidaExcelTabla = {
          tablasalida: this.getSalidaTabla(resp),
        };
        return dataExcel;
      })
    );
  }

  private getSalidaTabla(response: ISalida[]): ITablaSalida[] {
    return response.map((item: ISalida) => ({
      id: `${item.id}`,
      venta: `No. ${item.venta.id} ${format(
        new Date(item.venta.fechaVenta),
        'dd/MM/yyyy'
      )}`,
      vehiculo: `${item.vehiculo.marca} / ${item.vehiculo.modelo} - ${
        item.vehiculo.placa
      } [${format(new Date(item.vehiculo.anio), 'yyyy')}]`,
      municipio: `${item.municipio.nombre} (${item.municipio.zona.nombre})`,
    }));
  }

  mensajesToast(
    icono: SweetAlertIcon = 'info',
    title: string = 'Registrado con éxito!'
  ) {
    Swal.fire({
      icon: icono,
      title: title,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
  }

  async generarPdfMake(titulo:string,data:ISalida[]){
    const pdf = new PdfMakeWrapper();
    pdf.header(new Txt(`${titulo}`).alignment('right').italics().margin(10).end);
    pdf.add(new Txt(`REPORTE DE SALIDAS`).color('#926c5f').fontSize(18).bold().alignment('center').end);
    pdf.add(new Txt('').margin(15).end);
    pdf.add(new Txt('').margin(15).end);
    pdf.add(new Txt('SALIDAS:').margin(15).bold().decoration('underline').end);
    pdf.add(new Txt('').margin(15).end);
    pdf.add(new Table(
      [['','Venta','Vehiculo','Municipio']]).alignment('left').widths([20,150,270,280]).fontSize(12).italics().bold().layout('lightHorizontalLines').end);
      for(let x of data){
        pdf.add(new Table([
          ['','','',''],['',`N. ${x.venta.id} - ${format(
            new Date(x.venta.fechaVenta),
            'dd/MM/yyyy'
          )}`,`${x.vehiculo.marca}/${x.vehiculo.modelo} [${format(new Date(x.vehiculo.anio), 'yyyy')}]`,`${x.municipio.nombre} (${x.municipio.zona.nombre})`]
        ]).widths([20,150,270,280]).fontSize(10).layout('lightHorizontalLines').end);
      }
    pdf.add(new Txt('').margin(20).end);
    pdf.add(new Txt('F._______________').alignment('right').end);
    pdf.footer(new Txt(''+new Date()).alignment('left').italics().margin(10).end);
    pdf.pageOrientation("landscape");
    pdf.create().open();
  }

}
