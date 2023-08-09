import { SalidaService } from './../../services/salida.service';
import { Component, Input, OnInit } from '@angular/core';
import { ISalida } from '../../interface/datos.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.scss'],
})
export class TablaComponent implements OnInit {
  @Input() salidas!: ISalida[];
  @Input() queryString!: string;
  p: any;

  constructor(private salidaService: SalidaService) {}

  ngOnInit(): void {}

  eliminar(salida: ISalida) {
    Swal.fire({
      title: '¿Estás seguro de eliminar el registro?',
      showDenyButton: true,
      confirmButtonColor: '#424649',
      denyButtonColor: '#c9303f',
      //showCancelButton: true,
      confirmButtonText: 'Si',
      denyButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.salidaService.borrar(salida).subscribe(() => {
          this.salidaService.getListar().subscribe((updatedList: ISalida[]) => {
            this.salidaService.actualizarSalidas(updatedList); // Emite el evento con los datos actualizados al servicio compartido
            this.salidaService.mensajesToast('success', 'Acción Realizada!');
          });
        });
      } else if (result.isDenied) {
        this.salidaService.mensajesToast('info', 'Acción Cancelada!');
      }
    });
  }
}
