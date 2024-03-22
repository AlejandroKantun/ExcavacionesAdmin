export interface UsuarioResponse {
    "0":           Usuario[];
    transaccionID: number;
}

export interface Usuario {
    usuarioID:               number;
    usuario:                 string;
    contrasena:              string;
    AuthKey:                 string;
    fechaGeneracionAuthKey:  Date|null;
    nombreUsuario:           string;
    registradoEnApp:         boolean;
    Tipo_user:               string;
    access_token:            string;
    bancoID:                 number;
    appUniqueID:             string;
    fechaCreacion:           string;
    fechaUltimaModificacion: Date|null;
    fechaEliminacion:        Date|null;
    fechaSincronizacion:     Date|null;
    creadoPor:               Date|null;
    activoUsuario:           boolean;
    estadoUsuario:           boolean;
    grant_type:              string;
    client_id:               string;
    client_secret:           string;
    username:                string;
    password:                string;
    scope:                   string;
}