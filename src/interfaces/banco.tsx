export interface Banco {
    activoBanco:             number;
    creadoPor:               number;
    fechaEliminacion:        Date|null;
    nombreBanco:             string;
    estadoBanco:             number;
    fechaUltimaModificacion: Date;
    fechaCreacion:           Date;
    bancoID:                 number;
}