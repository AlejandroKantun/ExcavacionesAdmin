export interface BancosEmpresasResponse {
    "0":           BancosEmpresas[];
    transaccionID: number;
}
export interface BancosEmpresas {
    empresaID:      number;
    bancoID:        number;
    bancoEmpresaID: number;
}