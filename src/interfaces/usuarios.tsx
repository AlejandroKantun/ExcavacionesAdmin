export interface Usuario {
    creadoPor:               number;
    estadoUsuario:           number;
    activoUsuario:           number;
    fechaSincronizacion:     Date|null;
    fechaEliminacion:        Date|null;
    fechaUltimaModificacion: Date|null;
    appUniqueID:             string;
    contrasena:              string;
    bancoID:                 number;
    Tipo_user:               string;
    registradoEnApp:         number;
    nombreUsuario:           string|null;
    fechaGeneracionAuthKey:  Date|null;
    AuthKey:                 string|null;
    fechaCreacion:           Date;
    usuario:                 string;
    usuarioID:               number;
}