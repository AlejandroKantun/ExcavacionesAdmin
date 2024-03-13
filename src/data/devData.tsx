import React from 'react'
const query= "insert into materiales values(1,'Arena natural',date('now') ,NULL, NULL, NULL, 1, 1, 0,1);";
const queryUsuarios="insert into usuarios values(1,'Codyexpert','$2y$10$roX30/LLBKRA5.YGmbvrauS9KolmCOyltE6HkK3jsrMT2.kpQUmxy',null,null, null, 0,'Administrador',1,'TEST APP',date('now'),null,null,null,1,1,1);";
const queryInsertEmpresas="insert into empresas values(1,'OSPOVER', NULL, NULL, NULL, 'A', '1', NULL, date('now'), NULL, 1, 1, 0, 0,1,1);"
const queryInsertBancos="INSERT INTO bancos (nombreBanco, fechaCreacion, fechaUltimaModificacion, fechaEliminacion, creadoPor, activoBanco, estadoBanco) VALUES 'Banco A', '2023-01-01', '2023-01-01', NULL, 1, 1, 1),'Banco B', '2023-01-02', '2023-01-02', NULL, 2, 1, 1),'Banco C', '2023-01-03', '2023-01-03', NULL, 3, 1, 1);"
const queryInsertBancosEmpresas="INSERT INTO bancosempresas (bancoID, empresaID) VALUES (1, 1),(2, 1),(3, 1);"
const queryMateriales="INSERT INTO materiales (nombreMaterial, fechaCreacion, fechaUltimaModificacion, fechaEliminacion, fechaSincronizacion, activoMaterial, estadoMaterial, EnviadoABaseDeDatosCentral, creadoPor) VALUES  ('Material A', '2023-01-01', '2023-01-01', NULL, NULL, 1, 1, 0, 1), ('Material B', '2023-01-02', '2023-01-02', NULL, NULL, 1, 1, 0, 2), ('Material C', '2023-01-03', '2023-01-03', NULL, NULL, 1, 1, 0, 3);"
const queryInsertClients="INSERT INTO clientes (nombreCliente, direccionFiscal, codigoPostal, contacto, fechaCreacion, fechaUltimaModificacion, fechaEliminacion, fechaSincronizacion, activoCliente, estadoCliente, creadoPor, empresaID, EnviadoABaseDeDatosCentral) VALUES  ('Cliente A', '123 Main St', '12345', 'John Doe', '2023-01-01', '2023-01-01', NULL, NULL, 1, 1, 1, 1, 0), ('Cliente B', '456 Elm St', '54321', 'Jane Smith', '2023-01-02', '2023-01-02', NULL, NULL, 1, 1, 2, 2, 0), ('Cliente C', '789 Oak St', '67890', 'Michael Johnson', '2023-01-03', '2023-01-03', NULL, NULL, 1, 1, 3, 3, 0); "
const queryInsertDestinations="INSERT INTO destinos (nombreDestino, direccionDestino, codigoPostal, fechaCreacion, fechaUltimaModificacion, fechaEliminacion, fechaSincronizacion, activoDestino, estadoDestino, creadoPor, clienteID, EnviadoABaseDeDatosCentral) VALUES  ('Destino A', '123 Main St', '12345', '2023-01-01', '2023-01-01', NULL, NULL, 1, 1, 1, 1, 0), ('Destino B', '456 Elm St', '54321', '2023-01-02', '2023-01-02', NULL, NULL, 1, 1, 2, 2, 0), ('Destino C', '789 Oak St', '67890', '2023-01-03', '2023-01-03', NULL, NULL, 1, 1, 3, 3, 0); "
const queryInsertVehicles="INSERT INTO vehiculos (tipoUnidad, placa, capacidad, numeroEconomico, codigoQR, fechaCreacion, fechaUltimaModificacion, fechaEliminacion, fechaSincronizacion, activoVehiculo, estadoVehiculo, empresaID, creadoPor, EnviadoABaseDeDatosCentral) VALUES  ('Tipo A', 'ABC123', '10 tons', '12345', NULL, '2023-01-01', '2023-01-01', NULL, NULL, 1, 1, 1, 1, 0), ('Tipo B', 'DEF456', '5 tons', '54321', NULL, '2023-01-02', '2023-01-02', NULL, NULL, 1, 1, 2, 2, 0), ('Tipo C', 'GHI789', '8 tons', '98765', NULL, '2023-01-03', '2023-01-03', NULL, NULL, 1, 1, 3, 3, 0);"
const queryInsertDrivers="INSERT INTO choferes (nombreChofer, fechaCreacion, fechaUltimaModificacion, fechaEliminacion, fechaSincronizacion, activoChofer, estadoChofer, vehiculoID, creadoPor, EnviadoABaseDeDatosCentral) VALUES  ('Chofer A', '2023-01-01', '2023-01-01', NULL, NULL, 1, 1, 1, 1, 0), ('Chofer B', '2023-01-02', '2023-01-02', NULL, NULL, 1, 1, 2, 2, 0), ('Chofer C', '2023-01-03', '2023-01-03', NULL, NULL, 1, 1, 3, 3, 0);"
const queryInsertTickets1="INSERT INTO vales (bancoID, serie, folio, folioDigital, folioFisico, fechaVale, tipoUnidad, placa, numeroEconomico, numeroValeTriturador, observaciones, fechaCreacion, activoVale, estadoVale, clienteID, destinoID, vehiculoID, empresaID, creadoPor) VALUES  (1,'S004', 'F004', 'FD004', 'FF004', '2024-03-05 13:00:00', 'Tipo D', 'JKL012', '004', 'NV004', 'Observaciones 4', '2024-03-05 13:00:00', 1, 1, 4, 4, 4, 1, 1), (1,'S005', 'F005', 'FD005', 'FF005', '2024-03-05 14:00:00', 'Tipo E', 'MNO345', '005', 'NV005', 'Observaciones 5', '2024-03-05 14:00:00', 1, 1, 5, 5, 5, 1, 1), (1,'S006', 'F006', 'FD006', 'FF006', '2024-03-05 15:00:00', 'Tipo F', 'PQR678', '006', 'NV006', 'Observaciones 6', '2024-03-05 15:00:00', 1, 1, 6, 6, 6, 1, 1), (1,'S007', 'F007', 'FD007', 'FF007', '2024-03-05 16:00:00', 'Tipo G', 'STU901', '007', 'NV007', 'Observaciones 7', '2024-03-05 16:00:00', 1, 1, 7, 7, 7, 1, 1), (1,'S008', 'F008', 'FD008', 'FF008', '2024-03-05 17:00:00', 'Tipo H', 'VWX234', '008', 'NV008', 'Observaciones 8', '2024-03-05 17:00:00', 1, 1, 8, 8, 8, 1, 1), (1,'S009', 'F009', 'FD009', 'FF009', '2024-03-05 18:00:00', 'Tipo I', 'YZA567', '009', 'NV009', 'Observaciones 9', '2024-03-05 18:00:00', 1, 1, 9, 9, 9, 1, 1), (1,'S010', 'F010', 'FD010', 'FF010', '2024-03-05 19:00:00', 'Tipo J', 'BCD890', '010', 'NV010', 'Observaciones 10', '2024-03-05 19:00:00', 1, 1, 10, 10, 10, 1, 1), (1,'S011', 'F011', 'FD011', 'FF011', '2024-03-05 20:00:00', 'Tipo K', 'EFG123', '011', 'NV011', 'Observaciones 11', '2024-03-05 20:00:00', 1, 1, 11, 11, 11, 1, 1), (1, 'S012', 'F012', 'FD012', 'FF012', '2024-03-05 21:00:00', 'Tipo L', 'HIJ456', '012', 'NV012', 'Observaciones 12', '2024-03-05 21:00:00', 1, 1, 12, 12, 12, 1, 1), (1, 'S013', 'F013', 'FD013', 'FF013', '2024-03-05 22:00:00', 'Tipo M', 'KLM789', '013', 'NV013', 'Observaciones 13', '2024-03-05 22:00:00', 1, 1, 13, 13, 13, 1, 1);"
const queryInsertTickets="INSERT INTO vales (bancoID, serie, folio, folioDigital, folioFisico, fechaVale, tipoUnidad, placa, numeroEconomico, numeroValeTriturador, observaciones, fechaCreacion, activoVale, estadoVale, clienteID, destinoID, vehiculoID, empresaID, creadoPor)VALUES (1, 'S001', 'F001', 'FD001', 'FF001', '2024-03-05 10:00:00', 'Tipo A', 'ABC123', '001', 'NV001', 'Observaciones 1', '2024-03-05 10:00:00', 1, 1, 1, 1, 1, 1, 1),(1, 'S002', 'F002', 'FD002', 'FF002', '2024-03-05 11:00:00', 'Tipo B', 'DEF456', '002', 'NV002', 'Observaciones 2', '2024-03-05 11:00:00', 1, 1, 2, 2, 2, 1, 1),(1, 'S003', 'F003', 'FD003', 'FF003', '2024-03-05 12:00:00', 'Tipo C', 'GHI789', '003', 'NV003', 'Observaciones 3', '2024-03-05 12:00:00', 1, 1, 3, 3, 3, 1, 1);"

const queryInsertTicketsMaterials="INSERT INTO valesmateriales (materialNombre, cantidadm3, valeID, materialID, EnviadoABaseDeDatosCentral) VALUES  ('Material A', 10.5, 1, 1, 0), ('Material B', 15.2, 2, 2, 0), ('Material C', 20.0, 3, 3, 0);"
//INSERT INTO valesmateriales (materialNombre, cantidadm3, valeID, materialID, EnviadoABaseDeDatosCentral) VALUES  ('Material B', 10.5, 1, 2, 0)
//insert into usuarios (usuario,contrasena,tipo_user,fechacreacion)values('Usuario5','$2y$10$roX30/LLBKRA5.YGmbvrauS9KolmCOyltE6HkK3jsrMT2.kpQUmxy','Administrador',date('now'))


export const devData = () => {
  return (
    <div>devData</div>
  )
}

/**
 * 
 * INSERT INTO empresas (nombreEmpresa, direccionFiscal, codigoPostal, contacto, serieVale, folioInicialVale, logoEmpresa, fechaCreacion, activoEmpresa, estadoEmpresa, EnviadoABaseDeDatosCentral, creadoPor)
VALUES 
('Empresa A', '123 Main St', '12345', 'John Doe', 'S001', 'F001', 'logo1.jpg', '2024-03-05 10:00:00', 1, 1, 0, NULL),
('Empresa B', '456 Elm St', '54321', 'Jane Smith', 'S002', 'F002', 'logo2.jpg', '2024-03-05 11:00:00', 1, 1, 0, NULL),
('Empresa C', '789 Oak St', '67890', 'Alice Johnson', 'S003', 'F003', 'logo3.jpg', '2024-03-05 12:00:00', 1, 1, 0, NULL);

 * 


insert into empresas values(5,'Otro', NULL, NULL, NULL, 'A', '1', NULL, date('now'), NULL, 1, 1, 0, 0,1,1)

INSERT INTO clientes (nombreCliente, direccionFiscal, codigoPostal, contacto, fechaCreacion, fechaUltimaModificacion, fechaEliminacion, fechaSincronizacion, activoCliente, estadoCliente, creadoPor, empresaID, EnviadoABaseDeDatosCentral) VALUES  ('Cliente A', '123 Main St', '12345', 'John Doe', '2023-01-01', '2023-01-01', NULL, NULL, 1, 1, 1, 1, 0)
 
INSERT INTO destinos (nombreDestino, direccionDestino, codigoPostal, fechaCreacion, fechaUltimaModificacion, fechaEliminacion, fechaSincronizacion, activoDestino, estadoDestino, creadoPor, clienteID, EnviadoABaseDeDatosCentral) VALUES  ('Otro', '123 Main St', '12345', '2023-01-01', '2023-01-01', NULL, NULL, 1, 1, 1, 1, 0)

INSERT INTO vehiculos (tipoUnidad, placa, capacidad, numeroEconomico, codigoQR, fechaCreacion, fechaUltimaModificacion, fechaEliminacion, fechaSincronizacion, activoVehiculo, estadoVehiculo, empresaID, creadoPor, EnviadoABaseDeDatosCentral) VALUES  ('Tipo A', 'ABC123', '10 tons', '12345', NULL, '2023-01-01', '2023-01-01', NULL, NULL, 1, 1, 1, 1, 0)
*/
