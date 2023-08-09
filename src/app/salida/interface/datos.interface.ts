export interface ISalida {
  id?:        number;
  empleado?:  any[];
  venta:     IVenta;
  vehiculo:  IVehiculo;
  municipio: IMunicipio;
}

export interface IMunicipio {
  id:     number;
  nombre: string;
  zona:   IZona;
}

export interface IZona {
  id:     number;
  nombre: string;
}

export interface IVehiculo {
  id:     number;
  modelo: string;
  placa:  string;
  marca:  string;
  anio:   string;
  tipo:   boolean;
}

export interface IVenta {
  id:         number;
  fechaVenta: Date;
}
