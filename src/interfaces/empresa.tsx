export interface EmpresaResponse {
    "0":           Empresa[];
    transaccionID: number;
}

export interface Empresa {
    creadoPor:                  number;
    estadoEmpresa:              number|string;
    activoEmpresa:              number|string;
    fechaCreacion:              Date;
    direccionFiscal:            Date|null;
    logoEmpresa:                Blob|null;
    fechaEliminacion:           number;
    folioInicialVale:           string;
    fechaUltimaModificacion:    Date|null;
    serieVale:                  string;
    EnviadoABaseDeDatosCentral: number;
    contacto:                   string|null;
    codigoPostal:               string|null;
    nombreEmpresa:              string;
    fechaSincronizacion:        number;
    empresaID:                  number;
}