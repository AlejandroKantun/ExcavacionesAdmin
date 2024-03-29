export interface BancoResponse {
    "0":           Banco[];
    transaccionID: number;
}
export interface Banco {
    activoBanco:             number|string;
    creadoPor:               number;
    fechaEliminacion:        Date|null;
    nombreBanco:             string;
    estadoBanco:             number|string;
    fechaUltimaModificacion: Date;
    fechaCreacion:           Date;
    bancoID:                 number;
}