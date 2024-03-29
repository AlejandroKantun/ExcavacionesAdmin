export interface DestinationsResponse {
    "0":           Destino[];
    transaccionID: number;
}

export interface Destino {
    EnviadoABaseDeDatosCentral?: number;
    clienteID:                  number;
    creadoPor:                  number;
    nombreDestino:              string;
    estadoDestino:              number|string;
    fechaSincronizacion:        Date|null;
    activoDestino:              number|string;
    fechaEliminacion:           Date|null;
    fechaUltimaModificacion:    Date;
    codigoPostal:               string;
    direccionDestino:           string;
    fechaCreacion:              Date;
    destinoID:                  number;
}