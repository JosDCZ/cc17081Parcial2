import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  IMunicipio,
  ISalida,
  IVehiculo,
  IVenta,
} from '../../interface/datos.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgSelectConfig } from '@ng-select/ng-select';
import { SalidaService } from '../../services/salida.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  @Input() salida!: ISalida;
  @Input() leyenda!: string;

  @Output() actualizarTabla: EventEmitter<ISalida[]> = new EventEmitter<
    ISalida[]
  >();

  formularioGeneral: FormGroup;
  formSubmitted: boolean = false;

  listVentas: IVenta[] = [];
  listVehiculos: IVehiculo[] = [];
  listMunicipios: IMunicipio[] = [];

  guardarSalida!: ISalida;
  editarSalida!: ISalida;
  venta!: IVenta;
  vehiculo!: IVehiculo;
  municipio!: IMunicipio;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private salidaService: SalidaService,
    private config: NgSelectConfig
  ) {
    this.formularioGeneral = this.iniciarFormulario();
  }

  ngOnInit(): void {
    if (this.leyenda == 'Editar') {
      this.formularioGeneral.controls['id'].setValue(this.salida.id);
      this.formularioGeneral.controls['venta'].patchValue(this.salida.venta.id);
      this.formularioGeneral.controls['vehiculo'].patchValue(
        this.salida.vehiculo.id
      );
      this.formularioGeneral.controls['municipio'].patchValue(
        this.salida.municipio.id
      );
    }
    this.cargarSelect();
  }

  cargarSelect() {
    this.salidaService.getVentas().subscribe((data) => {
      this.listVentas = data;
    });
    this.salidaService.getVehiculo().subscribe((data) => {
      this.listVehiculos = data;
    });
    this.salidaService.getMunicipio().subscribe((data) => {
      this.listMunicipios = data;
    });
  }

  private iniciarFormulario() {
    return this.fb.group({
      id: [''],
      venta: ['', Validators.required],
      vehiculo: ['', Validators.required],
      municipio: ['', Validators.required],
    });
  }

  guardar() {
    this.formSubmitted = true;
    if (this.formularioGeneral.valid) {
      if (this.salida?.id) {
        //Modificar
        this.editando();
      } else {
        //Guardar
        this.registrando();
      }
      this.modalService.dismissAll();
    } else {
      this.salidaService.mensajesToast(
        'warning',
        'Complete los que se indican!'
      );
    }
  }

  registrando() {
    const salida = this.formularioGeneral.value;

    combineLatest([
      this.salidaService.getVentasById(salida.venta),
      this.salidaService.getVehiculoById(salida.vehiculo),
      this.salidaService.getMunicipioById(salida.municipio),
    ]).subscribe(([ventaData, vehiculoData, municipioData]) => {
      this.venta = ventaData;
      this.vehiculo = vehiculoData;
      this.municipio = municipioData;

      this.guardarSalida = {
        venta: this.venta,
        vehiculo: this.vehiculo,
        municipio: this.municipio,
      };

      console.log('SALIDA AGREGADA', this.guardarSalida);

      this.salidaService.guardar(this.guardarSalida).subscribe((resp: any) => {
        this.salidaService.getListar().subscribe((updatedList: ISalida[]) => {
          this.salidaService.actualizarSalidas(updatedList); // Emite el evento con los datos actualizados al servicio compartido
          this.salidaService.mensajesToast('success', 'Registrado con éxito!');

          this.limpiarCampos();
        });
      });
    });
  }

  editando() {
    const salida = this.formularioGeneral.value;

    combineLatest([
      this.salidaService.getVentasById(salida.venta),
      this.salidaService.getVehiculoById(salida.vehiculo),
      this.salidaService.getMunicipioById(salida.municipio),
    ]).subscribe(([ventaData, vehiculoData, municipioData]) => {
      this.venta = ventaData;
      this.vehiculo = vehiculoData;
      this.municipio = municipioData;

      this.editarSalida = {
        id: salida.id,
        venta: this.venta,
        vehiculo: this.vehiculo,
        municipio: this.municipio,
      };

      console.log('SALIDA EDITADA', this.editarSalida);

      this.salidaService.modificar(this.editarSalida).subscribe((resp: any) => {
        this.salidaService.getListar().subscribe((updatedList: ISalida[]) => {
          this.salidaService.actualizarSalidas(updatedList); // Emite el evento con los datos actualizados al servicio compartido
          this.salidaService.mensajesToast('success', 'Editado con éxito!');
          this.limpiarCampos();
        });
      });
    });
  }

  limpiarCampos() {
    this.formularioGeneral.reset();
  }

  esCampoValido(campo: string) {
    const validarCampo = this.formularioGeneral.get(campo);
    return this.formSubmitted && !validarCampo?.valid && validarCampo?.touched
      ? 'is-invalid'
      : validarCampo?.touched
      ? 'is-valid'
      : '';
  }

  esCampoInvalido(nombreCampo: string): boolean {
    const campo = this.formularioGeneral.get(nombreCampo);
    return campo!.invalid && (campo?.touched || this.formSubmitted);
  }

  getClassOf() {
    if (this.leyenda == 'Editar') {
      return 'btn-warning btn-sm';
    } else {
      return 'btn-dark';
    }
  }
  getIconsOf() {
    if (this.leyenda == 'Editar') {
      return '<i class="bi bi-pencil-square"></i>';
    } else {
      return 'Agregar';
    }
  }

  openModal(content: any, salida: ISalida) {
    this.salida = salida;
    this.formSubmitted = false;
    if (this.leyenda != 'Editar') {
      this.limpiarCampos();
    }
    this.modalService.open(content, { centered: true });
  }
}
