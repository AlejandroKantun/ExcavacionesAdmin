import { number } from 'yup';

export interface valessResponse {
    "0":           Vale[];
    transaccionID: number;
}
export interface Vale {
    vehiculoNombre:             string|null;
    destinoNombre:              string|null;
    empresaID:                  number;
    destinoID:                  number;
    clienteID:                  number;
    fechaEntradaVehiculo:       Date|null;
    estadoVale:                 number|string;
    activoVale:                 number|string;
    fechaEliminacion:           Date|null;
    fechaSincronizacion:        Date|null;
    fechaUltimaModificacion:    Date|null;
    fechaSalidaVehiculo:        Date|null;
    fechaVale:                  Date|null;
    firma:                      Blob|null;
    numeroEconomico:            string;
    tipoUnidad:                 string;
    creadoPor:                  number;
    fechaCreacion:              Date|null;
    EnviadoABaseDeDatosCentral?: number;
    valeID:                     number;
    folio:                      string;
    folioFisico:                string;
    clienteNombre:              string|null;
    serie:                      string;
    bancoID:                    number;
    numeroValeTriturador:       string;
    placa:                      string;
    choferNombre:               string|null;
    choferID:                   number|null;
    observaciones:              string;
    vehiculoID:                 number;
    folioDigital:               string;
    Importe?:                   number|null;
    formadepago?:               string|null;
    empresaNombre?:             string|null;
    observacionesEliminar?:     string|null;
    numeroTolva?:               string|null;
}