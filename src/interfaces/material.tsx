export interface MaterialResponse {
    "0":           Material[];
    transaccionID: number;
}

export interface Material {
    materialID:              number;
    appID?:                  null | string;
    nombreMaterial:          string;
    fechaCreacion:           Date;
    fechaUltimaModificacion: Date|null;
    fechaEliminacion:        Date|null;
    fechaSincronizacion:     Date|null;
    creadoPor:               number | null;
    activoMaterial:          boolean;
    estadoMaterial:          boolean;
    EnviadoABaseDeDatosCentral?: number
}

export interface MaterialDB {
    creadoPor:                  number;
    estadoMaterial:             number;
    activoMaterial:             number;
    EnviadoABaseDeDatosCentral: number;
    fechaSincronizacion:        null;
    fechaEliminacion:           null;
    fechaUltimaModificacion:    null;
    fechaCreacion:              Date;
    nombreMaterial:             string;
    materialID:                 number;
}