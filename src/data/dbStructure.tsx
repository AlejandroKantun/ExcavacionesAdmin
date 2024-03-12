import {
  enablePromise,
  openDatabase,
  SQLiteDatabase,
} from "react-native-sqlite-storage"
import { storeDBCreated } from './persistantData';

enablePromise(true)


enum QuerySentences{
    createUsersTB="CREATE TABLE IF NOT EXISTS usuarios ( usuarioID INTEGER PRIMARY KEY AUTOINCREMENT, usuario varchar(100) NOT NULL, contrasena varchar(450) NOT NULL, AuthKey varchar(100) NULL, fechaGeneracionAuthKey datetime DEFAULT NULL, nombreUsuario varchar(150) NULL, registradoEnApp bit not null default 0, Tipo_user varchar(20) NOT NULL, bancoID int not null default 1, appUniqueID varchar(100) null, fechaCreacion datetime not null, fechaUltimaModificacion datetime null, fechaEliminacion datetime null, fechaSincronizacion datetime null, activoUsuario bit NOT NULL DEFAULT 1, estadoUsuario bit NOT NULL DEFAULT 1, creadoPor int null, foreign key (creadoPor) references usuarios(usuarioID) ); ",
    createCompaniesTB="CREATE TABLE IF NOT EXISTS empresas( empresaID INTEGER PRIMARY KEY AUTOINCREMENT, nombreEmpresa varchar(100) NOT NULL, direccionFiscal varchar(355) NULL, codigoPostal varchar(10) NULL, contacto varchar(100) NULL, serieVale varchar(5) NULL, folioInicialVale varchar(10) NULL, logoEmpresa varchar(100) NULL, fechaCreacion datetime not null, fechaUltimaModificacion datetime null, fechaEliminacion datetime null, fechaSincronizacion datetime null, activoEmpresa bit NOT NULL DEFAULT 1, estadoEmpresa bit NOT NULL DEFAULT 1, EnviadoABaseDeDatosCentral bit NOT NULL DEFAULT 0, creadoPor int null, foreign key (creadoPor) references usuarios(usuarioID) );",
    createZones="create table bancos ( bancoID INTEGER PRIMARY KEY AUTOINCREMENT, nombreBanco varchar(50) not null, fechaCreacion datetime not null, fechaUltimaModificacion datetime null, fechaEliminacion datetime null, creadoPor int null,  activoBanco bit not null DEFAULT 1, estadoBanco bit not null DEFAULT 1, foreign key (creadoPor) references usuarios(usuarioID) );",
    createZonesCompanies="create table bancosempresas ( bancoEmpresaID INTEGER PRIMARY KEY AUTOINCREMENT, bancoID int not null, empresaID int not null,  foreign key (empresaID) references empresas(empresaID),  foreign key (bancoID) references bancos(bancoID) );",
    createMaterialsTB="CREATE TABLE IF NOT EXISTS materiales ( materialID INTEGER PRIMARY KEY AUTOINCREMENT, nombreMaterial varchar(100) NOT NULL, fechaCreacion datetime not null, fechaUltimaModificacion datetime null, fechaEliminacion datetime null, fechaSincronizacion datetime null, activoMaterial bit NOT NULL DEFAULT 1, estadoMaterial bit NOT NULL DEFAULT 1, EnviadoABaseDeDatosCentral bit NOT NULL DEFAULT 0, creadoPor int null, foreign key (creadoPor) references usuarios(usuarioID) );",
    createClientsTB="CREATE TABLE clientes ( clienteID INTEGER PRIMARY KEY AUTOINCREMENT, nombreCliente varchar(100) NOT NULL, direccionFiscal varchar(355) NULL, codigoPostal varchar(10) NULL, contacto varchar(100) NULL, fechaCreacion datetime not null, fechaUltimaModificacion datetime null, fechaEliminacion datetime null, fechaSincronizacion datetime null, activoCliente bit NOT NULL DEFAULT 1, estadoCliente bit NOT NULL DEFAULT 1, creadoPor int null,  empresaID int null, EnviadoABaseDeDatosCentral bit NOT NULL DEFAULT 0, foreign key (creadoPor) references usuarios(usuarioID), foreign key (empresaID) references empresas(empresaID) );",
    createDestinationsTB="CREATE TABLE destinos ( destinoID INTEGER PRIMARY KEY AUTOINCREMENT, nombreDestino varchar(100) NOT NULL, direccionDestino varchar(355) NULL, codigoPostal varchar(10) NULL, fechaCreacion datetime not null, fechaUltimaModificacion datetime null, fechaEliminacion datetime null, fechaSincronizacion datetime null, activoDestino bit NOT NULL DEFAULT 1, estadoDestino bit NOT NULL DEFAULT 1, creadoPor int null,  clienteID int null,  EnviadoABaseDeDatosCentral bit NOT NULL DEFAULT 0, foreign key (creadoPor) references usuarios(usuarioID), foreign key (clienteID) references clientes(clienteID)  );",
    createVehiclesTB="CREATE TABLE vehiculos ( vehiculoID INTEGER PRIMARY KEY AUTOINCREMENT, tipoUnidad varchar(100) NOT NULL, placa varchar(20) NOT NULL, capacidad varchar(50) NULL, numeroEconomico varchar(10) NULL, codigoQR varchar(100) null, fechaCreacion datetime not null, fechaUltimaModificacion datetime null, fechaEliminacion datetime null, fechaSincronizacion datetime null, activoVehiculo bit NOT NULL DEFAULT 1, estadoVehiculo bit NOT NULL DEFAULT 1, empresaID int null, creadoPor int null, EnviadoABaseDeDatosCentral bit NOT NULL DEFAULT 0, foreign key (empresaID) references empresas(empresaID), foreign key (creadoPor) references usuarios(usuarioID) );",
    createDriversTB="CREATE TABLE choferes ( choferID INTEGER PRIMARY KEY AUTOINCREMENT, nombreChofer varchar(100) NOT NULL, fechaCreacion datetime not null, fechaUltimaModificacion datetime null, fechaEliminacion datetime null, fechaSincronizacion datetime null, activoChofer bit NOT NULL DEFAULT 1, estadoChofer bit NOT NULL DEFAULT 1, vehiculoID int null,  creadoPor int null, EnviadoABaseDeDatosCentral bit NOT NULL DEFAULT 0, foreign key (vehiculoID) references vehiculos(vehiculoID), foreign key (creadoPor) references usuarios(usuarioID) );",
    createTicketsTB="CREATE TABLE vales ( valeID INTEGER PRIMARY KEY AUTOINCREMENT, bancoID int not null, serie varchar(5) not NULL, folio varchar(10) not NULL, folioDigital varchar(50) null, folioFisico varchar (20) null, fechaVale datetime not null, tipoUnidad varchar(100) NOT NULL, placa varchar(100) NOT NULL, numeroEconomico varchar(10) NULL, numeroValeTriturador varchar(10) NULL, observaciones text null, fechaEntradaVehiculo datetime null, fechaSalidaVehiculo datetime null, firma blob null, fechaCreacion datetime not null, fechaUltimaModificacion datetime null, fechaEliminacion datetime null, fechaSincronizacion datetime null, activoVale bit NOT NULL DEFAULT 1, estadoVale bit NOT NULL DEFAULT 1, clienteID int not null,      destinoID int not null,      vehiculoID int not null,     empresaID int not null,      choferID int null, choferNombre  varchar(100) null , clienteNombre varchar(100) null , destinoNombre varchar(100) null , vehiculoNombre varchar(100) null,           creadoPor int null,       EnviadoABaseDeDatosCentral bit NOT NULL DEFAULT 0, foreign key (clienteID) references clientes(clienteID), foreign key (destinoID) references destinos(destinoID), foreign key (vehiculoID) references vehiculos(vehiculoID), foreign key (empresaID) references empresas(empresaID), foreign key (choferID) references choferes(choferID), foreign key (creadoPor) references usuarios(usuarioID) );",
    createTicketsMaterialsTB="CREATE TABLE valesmateriales ( valeMaterialID INTEGER PRIMARY KEY AUTOINCREMENT, materialNombre varchar(100) null, cantidadm3 double not NULL, valeID int not null,         materialID int not null, EnviadoABaseDeDatosCentral bit NOT NULL DEFAULT 0, foreign key (valeID) references vales(valeID), foreign key (materialID) references materiales(materialID) );",
    createNotificationsTB="create table notificacionesaltas (notificacionID INTEGER PRIMARY KEY AUTOINCREMENT,tabla varchar(50) not null,valor varchar(100) not null,fechaCreacion datetime not null,fechaEliminacion datetime null,creadoPor int null, estatus bit not null default 0,foreign key (creadoPor) references usuarios(usuarioID));",
}


export const connectToDatabase = async () => {
  return openDatabase(
    { name: "UserDatabase", location: "default" },
    () => {},
    (error) => {
      console.error(error)
      throw Error("Could not connect to database")
    }
  )
}

export const db = connectToDatabase();

const createTables = async (query?:keyof typeof QuerySentences) =>
     {
        try {
          (await db).executeSql(QuerySentences['createUsersTB']);
          console.log('usuariosTB Created');
          (await db).executeSql(QuerySentences['createCompaniesTB']);
          console.log('createCompaniesTB Created');
          (await db).executeSql(QuerySentences['createZones']);
          console.log('createZones Created');
          (await db).executeSql(QuerySentences['createZonesCompanies']);
          console.log('createZonesCompanies Created');
          (await db).executeSql(QuerySentences['createMaterialsTB']);
          console.log('createMaterialsTB Created');
          (await db).executeSql(QuerySentences['createClientsTB']);
          console.log('createClientsTB Created');
          (await db).executeSql(QuerySentences['createDestinationsTB']);
          console.log('createDestinationsTB Created');
          (await db).executeSql(QuerySentences['createVehiclesTB']);
          console.log('createVehiclesTB Created');
          (await db).executeSql(QuerySentences['createDriversTB']);
          console.log('createDriversTB Created');
          (await db).executeSql(QuerySentences['createTicketsTB']);
          console.log('createTicketsTB Created');
          (await db).executeSql(QuerySentences['createTicketsMaterialsTB']);
          console.log('createTicketsMaterialsTB Created');
          (await db).executeSql(QuerySentences['createNotificationsTB']);
          console.log('createNotificationsTB Created');


          } catch (err) {
            console.log({err});
          }
      
    };
        

    /* Create tables */
export const createDatabaseStructure = () => {
    createTables().then(
            ()=>storeDBCreated()
    );
}





