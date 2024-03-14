export interface DriversResponse {
    "0":           Chofer[];
    transaccionID: number;
}

export interface Chofer {
    vehiculoID:                 number;
    estadoChofer:               number;
    activoChofer:               number;
    EnviadoABaseDeDatosCentral?: number;
    fechaSincronizacion:        Date|null;
    fechaEliminacion:           Date|null;
    creadoPor:                  number;
    nombreChofer:               string;
    fechaUltimaModificacion:    Date;
    fechaCreacion:              Date;
    choferID:                   number;
}