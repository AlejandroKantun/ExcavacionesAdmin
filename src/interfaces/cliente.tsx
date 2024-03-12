export interface ClientsResponse {
    "0":           Cliente[];
    transaccionID: number;
}

export interface Cliente {
    creadoPor:                  number;
    estadoCliente:              number;
    activoCliente:              number;
    empresaID:                  number;
    fechaSincronizacion:        null;
    fechaEliminacion:           null;
    fechaUltimaModificacion:    Date;
    fechaCreacion:              Date;
    nombreCliente:              string;
    codigoPostal:               string;
    clienteID:                  number;
    direccionFiscal:            string;
    EnviadoABaseDeDatosCentral?: number;
    contacto:                   string;
}