export interface VehiculoResponse {
    "0":           Vehiculo[];
    transaccionID: number;
}

export interface Vehiculo {
    estadoVehiculo:             number;
    empresaID:                  number;
    fechaSincronizacion:        null;
    numeroEconomico:            string;
    fechaEliminacion:           null;
    activoVehiculo:             number|boolean; 
    fechaCreacion:              Date;
    placa:                      string;
    codigoQR:                   string|null;
    creadoPor:                  number;
    capacidad:                  string;
    fechaUltimaModificacion:    Date;
    tipoUnidad:                 string;
    EnviadoABaseDeDatosCentral?: number;
    vehiculoID:                 number;
}
