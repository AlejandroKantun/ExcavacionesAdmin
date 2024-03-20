import axios from 'axios';
import { connectToDatabase } from '../data/dbStructure';
import { dateFormated } from '../data/dateFormated';
import { Vehiculo, VehiculoResponse } from '../interfaces/vehiculo';
import globalSettings from '../globalSettings';
import { MaterialResponse, Material } from '../interfaces/material';
import { Chofer, DriversResponse } from '../interfaces/chofer';
import { DestinationsResponse, Destino } from '../interfaces/destino';
import { Cliente, ClientsResponse } from '../interfaces/cliente';
import { Vale, valessResponse } from '../interfaces/vale';
import { Valematerial } from '../interfaces/valematerial';


export interface changePassResult{
    success:boolean,
    path:string
}
const db = connectToDatabase();

const sentToCentralDB=1;

export const ChangePassWordRequest =async (userId:string,newPass:string,token:string,deviceId:string)=>{
    let changePassResult={
        success:false,
        path:''
    }
    const encoded: string = Buffer.from(newPass, 'utf8').toString('base64');
    const date = dateFormated();

    const excavacionesDB = axios.create({
        baseURL:globalSettings.Api.prodEndPoint,
        params:{
            appUniqueID:'3',
            token:token,
        }
     });   

    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const bodyParameters = {
        usuarioID:userId,
        password:encoded,
        mensaje:'sincronizado desde app',
        fechaSincronizacion:date 
    };
    
    const response = await excavacionesDB.put('/setcodypass',
    bodyParameters,
    config
    )

    if (response.data.response=='Proceso finalizado'){
        console.log('Response proceso finalizado');
        const promise =   new Promise<changePassResult>(
            async (resolve, reject) => {
            (await db).transaction(
                            async(tx)=>{
                                await tx.executeSql("Update usuarios set contrasena = ? where usuarioID=?", [encoded,userId]).then(
                                    ()=>{
                                        changePassResult={
                                        success:true,
                                        path:'MainDrawerNavigator'
                                        }
                                        resolve(changePassResult);
                                    }
                                )
                                        
                        });
        });
        await promise.then((res)=>{
            return res
        })
        return changePassResult;

    }

    return changePassResult;

  
}

export const postSetCodyData=async (token:string,transactionID:string,table:string,numberState:string,msgResult:string)=>{
    const date = dateFormated();
    const excavacionesDB = axios.create({
        baseURL: globalSettings.Api.devEndPoint,
        params:{
            appUniqueID:'2',
            token:token,
        }
     });
     const config = {
        headers: { Authorization: `Bearer ${token}` }
    }; 
    const bodyParameters = {
        transaccionID: transactionID,
        tabla: table,
        estado: numberState,
        mensaje: msgResult,
        fechaSincronizacion:date
    };
    
    const response = await excavacionesDB.post('/setcodydata',
    bodyParameters,
    config
    )

    console.log('Notification to setcody: response: ' + JSON.stringify(response.data))
}

export const requestAndSaveVehicles =async (token:string,deviceId?:string)=>{
    let msgToReport=''

    const date = dateFormated();

    const excavacionesDB = axios.create({
        baseURL: globalSettings.Api.devEndPoint,
        params:{
            appUniqueID:'3',
            token:token,
        }
     });   

    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    const response = await excavacionesDB.get<VehiculoResponse>('/codyvehiculos',
    config
    )
    if (response.data.transaccionID){
            console.log(JSON.stringify(response.data))
        let vehiclesFromAPI:Vehiculo[]=response.data[0] as Vehiculo[]
        msgToReport=" Items received: " +vehiclesFromAPI.length; " - "
        if (vehiclesFromAPI.length>0){
            for (let i=0; i<vehiclesFromAPI.length; i++){
                console.log(i+' ITEM'+ JSON.stringify(vehiclesFromAPI[i]))
                try {
                    if  (!vehiclesFromAPI[i].fechaSincronizacion) { 
                        console.log('Insert')
                        let insertVehicleSentence= "INSERT INTO vehiculos ("+
                        "tipoUnidad, "+
                        "placa, "+
                        "capacidad, "+
                        "numeroEconomico, "+
                        "codigoQR, "+
                        "fechaCreacion, "+
                        "fechaEliminacion, "+
                        "fechaSincronizacion, "+
                        "activoVehiculo, "+
                        "estadoVehiculo, "+
                        "empresaID, "+
                        "creadoPor, "+ 
                        "EnviadoABaseDeDatosCentral, "+
                        "vehiculoID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)";
                        await (await db).transaction(
                            async(tx)=>{
                                tx.executeSql(insertVehicleSentence, [
                                    vehiclesFromAPI[i].tipoUnidad,
                                    vehiclesFromAPI[i].placa,
                                    vehiclesFromAPI[i].capacidad,
                                    vehiclesFromAPI[i].numeroEconomico,
                                    vehiclesFromAPI[i].codigoQR,
                                    vehiclesFromAPI[i].fechaCreacion,
                                    vehiclesFromAPI[i].fechaEliminacion,
                                    vehiclesFromAPI[i].fechaSincronizacion,
                                    vehiclesFromAPI[i].activoVehiculo,
                                    vehiclesFromAPI[i].estadoVehiculo,
                                    vehiclesFromAPI[i].empresaID,
                                    vehiclesFromAPI[i].creadoPor,
                                    sentToCentralDB,
                                    vehiclesFromAPI[i].vehiculoID
                                ],
                                (res)=>{
                                    msgToReport=msgToReport + ' - vehiculoID: '+ vehiclesFromAPI[i].vehiculoID +' transaction: INSERT SUCCESS, '
                                    console.log(+ ' - vehiculoID: '+ vehiclesFromAPI[i].vehiculoID +' transaction: INSERT SUCCESS, ' )

                                },
                                (error)=>{
                                    console.log('ERROR '+ ' - vehiculoID: '+ vehiclesFromAPI[i].vehiculoID +' transaction: INSERT FAIL , reason: '+JSON.stringify(error) )
                                    msgToReport=msgToReport + ' - vehiculoID: '+ vehiclesFromAPI[i].vehiculoID +' transaction: INSERT FAIL , reason: '+JSON.stringify(error)
                                }
                                );
                        });
                    }
                    else{
                        let updateVehicleSentence= "UPDATE vehiculos "+
                            " SET "+
                    " tipoUnidad = ?,"+
                    " placa = ?,"+
                    " capacidad = ?,"+
                    " numeroEconomico = ?,"+
                    " codigoQR = ?,"+
                    " fechaCreacion = ?,"+
                    " fechaEliminacion =?,"+
                    " fechaSincronizacion = ?,"+
                    " activoVehiculo = ?,"+
                    " estadoVehiculo = ?,"+
                    " empresaID = ?, "+
                    " creadoPor = ?" +
                    " WHERE vehiculoID = ?;";
                        
                        await (await db).transaction(
                            async(tx)=>{
                                tx.executeSql(updateVehicleSentence, [
                                    vehiclesFromAPI[i].tipoUnidad,
                                    vehiclesFromAPI[i].placa,
                                    vehiclesFromAPI[i].capacidad,
                                    vehiclesFromAPI[i].numeroEconomico,
                                    vehiclesFromAPI[i].codigoQR,
                                    vehiclesFromAPI[i].fechaCreacion,
                                    vehiclesFromAPI[i].fechaEliminacion,
                                    vehiclesFromAPI[i].fechaSincronizacion,
                                    vehiclesFromAPI[i].activoVehiculo,
                                    vehiclesFromAPI[i].estadoVehiculo,
                                    vehiclesFromAPI[i].empresaID,
                                    vehiclesFromAPI[i].creadoPor,
                                    vehiclesFromAPI[i].vehiculoID
                                ],
                                (res)=>{
                                    msgToReport=msgToReport + ' - vehiculoID: '+ vehiclesFromAPI[i].vehiculoID +' transaction: UPDATE SUCCESS '

                                },
                                (error)=>{
                                    msgToReport=msgToReport + ' - vehiculoID: '+ vehiclesFromAPI[i].vehiculoID +' transaction: UPDATE FAIL , reason: '+JSON.stringify(error)
                                })
                                
                        });
                    }
                } catch (error) {
                    console.log(error)
                }

                
            } 
            console.log('Summary of transaction: ' + msgToReport + "transaction No: "  +JSON.stringify(response.data.transaccionID)) ;
            postSetCodyData(token,
                            response.data.transaccionID.toString(),
                            'vehiculos',
                            globalSettings.setCodyDataResult.success.toString(),
                            msgToReport)
        }
    }
   
    
    
    
}

export const requestAndSaveMaterials =async (token:string,deviceId?:string)=>{
    let msgToReport=''

    const date = dateFormated();

    const excavacionesDB = axios.create({
        baseURL: globalSettings.Api.devEndPoint,
        params:{
            appUniqueID:'3',
            token:token,
        }
     });   

    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    const response = await excavacionesDB.get<MaterialResponse>('/codymaterial',
    config
    )
    //console.log(JSON.stringify(response.data))
    
    if (response.data.transaccionID){
            console.log(JSON.stringify(response.data))
        let materialsFromAPI:Material[]=response.data[0] as Material[]
        msgToReport=" Items received: " +materialsFromAPI.length; " - "
        if (materialsFromAPI.length>0){
            for (let i=0; i<materialsFromAPI.length; i++){
                console.log(i+' ITEM'+ JSON.stringify(materialsFromAPI[i]))
                try {
                    if  (!materialsFromAPI[i].fechaSincronizacion) { 
                        console.log('Insert')
                        let insertMatieralSentence="INSERT INTO materiales ("+
                        " nombreMaterial,"+
                        " fechaCreacion,"+
                        " fechaUltimaModificacion,"+
                        " fechaEliminacion,"+
                        " fechaSincronizacion,"+
                        " activoMaterial,"+
                        " estadoMaterial,"+
                        " EnviadoABaseDeDatosCentral,"+
                        " creadoPor,"+
                        "materialID) VALUES  (?,?, ?, ?, ?, ?, ?, ?, ?,?)"
                        const sentToCentralDB=1;
                        await (await db).transaction(
                            async(tx)=>{
                                tx.executeSql(insertMatieralSentence,[
                                    materialsFromAPI[i].nombreMaterial,
                                    materialsFromAPI[i].fechaCreacion,
                                    materialsFromAPI[i].fechaUltimaModificacion,
                                    materialsFromAPI[i].fechaEliminacion,
                                    materialsFromAPI[i].fechaSincronizacion,
                                    materialsFromAPI[i].activoMaterial,
                                    materialsFromAPI[i].estadoMaterial,
                                    sentToCentralDB,
                                    materialsFromAPI[i].creadoPor,
                                    materialsFromAPI[i].materialID
                                ],
                                (res)=>{
                                    msgToReport=msgToReport + ' - materialID: '+ materialsFromAPI[i].materialID +' transaction: INSERT SUCCESS, '
                                    console.log(+ ' - materialID: '+ materialsFromAPI[i].materialID+' transaction: INSERT SUCCESS, ' )

                                },
                                (error)=>{
                                    console.log('ERROR '+ ' - materialID: '+ materialsFromAPI[i].materialID +' transaction: INSERT FAIL , reason: '+JSON.stringify(error) )
                                    msgToReport=msgToReport + ' - materialID: '+ materialsFromAPI[i].materialID +' transaction: INSERT FAIL , reason: '+JSON.stringify(error)
                                }
                                );
                        });
                    }
                    else{
                        let updateMaterialSentence="UPDATE materiales "+
                            "SET nombreMaterial = ?,"+
                            "fechaCreacion = ?,"+
                            "fechaUltimaModificacion = ?,"+
                            "fechaEliminacion = ?,"+
                            "fechaSincronizacion = ?,"+
                            "activoMaterial = ?,"+
                            "estadoMaterial = ?,"+
                            "EnviadoABaseDeDatosCentral = ?,"+
                            "creadoPor = ? "+
                            "WHERE materialID = ?"
                        
                        await (await db).transaction(
                            async(tx)=>{
                                tx.executeSql(updateMaterialSentence, [
                                    materialsFromAPI[i].nombreMaterial,
                                    materialsFromAPI[i].fechaCreacion,
                                    materialsFromAPI[i].fechaUltimaModificacion,
                                    materialsFromAPI[i].fechaEliminacion,
                                    materialsFromAPI[i].fechaSincronizacion,
                                    materialsFromAPI[i].activoMaterial,
                                    materialsFromAPI[i].estadoMaterial,
                                    sentToCentralDB,
                                    materialsFromAPI[i].creadoPor,
                                    materialsFromAPI[i].materialID
                                ],
                                (res)=>{
                                    msgToReport=msgToReport + ' - vehiculoID: '+ materialsFromAPI[i].materialID +' transaction: UPDATE SUCCESS '

                                },
                                (error)=>{
                                    msgToReport=msgToReport + ' - vehiculoID: '+ materialsFromAPI[i].materialID+' transaction: UPDATE FAIL , reason: '+JSON.stringify(error)
                                })
                                
                        });
                    }
                } catch (error) {
                    console.log(error)
                }

                
            } 
            console.log('Summary of transaction: ' + msgToReport + "transaction No: "  +JSON.stringify(response.data.transaccionID)) ;
            
            postSetCodyData(token,
                            response.data.transaccionID.toString(),
                            'materiales',
                            globalSettings.setCodyDataResult.success.toString(),
                            msgToReport)
        }
    }
   
    
    
    
}

export const requestAndSaveDrivers =async (token:string,deviceId?:string)=>{
    let msgToReport=''

    const date = dateFormated();

    const excavacionesDB = axios.create({
        baseURL: globalSettings.Api.devEndPoint,
        params:{
            appUniqueID:'3',
            token:token,
        }
     });   

    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    const response = await excavacionesDB.get<DriversResponse>('/codychoferes',
    config
    )
    console.log(JSON.stringify(response.data))
    
    if (response.data.transaccionID){
            console.log(JSON.stringify(response.data))
        let driversFromAPI:Chofer[]=response.data[0] as Chofer[]
        msgToReport=" Items received: " +driversFromAPI.length; " - "
        if (driversFromAPI.length>0){
            for (let i=0; i<driversFromAPI.length; i++){
                console.log(i+' ITEM'+ JSON.stringify(driversFromAPI[i]))
                try {
                    if  (!driversFromAPI[i].fechaSincronizacion) { 
                        console.log('Insert')
                        let insertDriverSentence = "INSERT INTO choferes ( "+
                        "nombreChofer, "+
                        "fechaCreacion, "+
                        "fechaUltimaModificacion, "+
                        "fechaEliminacion, "+
                        "fechaSincronizacion, "+
                        "activoChofer, "+
                        "estadoChofer, "+
                        "vehiculoID, "+
                        "creadoPor, "+
                        "EnviadoABaseDeDatosCentral,"+
                        "choferID) VALUES  (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)"
                      
                        const sentToCentralDB=1;
                        await (await db).transaction(
                            async(tx)=>{
                                tx.executeSql(insertDriverSentence,[
                                    driversFromAPI[i].nombreChofer,
                                    driversFromAPI[i].fechaCreacion,
                                    driversFromAPI[i].fechaUltimaModificacion,
                                    driversFromAPI[i].fechaEliminacion,
                                    driversFromAPI[i].fechaSincronizacion,
                                    driversFromAPI[i].activoChofer,
                                    driversFromAPI[i].estadoChofer,
                                    driversFromAPI[i].vehiculoID,
                                    driversFromAPI[i].creadoPor,
                                    sentToCentralDB,
                                    driversFromAPI[i].choferID
                                ],
                                (res)=>{
                                    msgToReport=msgToReport + ' - choferID: '+ driversFromAPI[i].choferID+' transaction: INSERT SUCCESS, '
                                    console.log(+ ' - choferID: '+ driversFromAPI[i].choferID+' transaction: INSERT SUCCESS, ' )

                                },
                                (error)=>{
                                    console.log('ERROR '+ ' - choferID: '+ driversFromAPI[i].choferID +' transaction: INSERT FAIL , reason: '+JSON.stringify(error) )
                                    msgToReport=msgToReport + ' - choferID: '+ driversFromAPI[i].choferID +' transaction: INSERT FAIL , reason: '+JSON.stringify(error)
                                }
                                );
                        });
                    }
                    else{
                        let updateDriverSentence="UPDATE choferes"+
                            " SET nombreChofer = ?,"+
                            " fechaCreacion = ?,"+
                            " fechaUltimaModificacion = ?,"+
                            " fechaEliminacion = ?,"+
                            " fechaSincronizacion = ?,"+
                            " activoChofer = ?,"+
                            " estadoChofer = ?,"+
                            " vehiculoID = ?,"+
                            " creadoPor = ?,"+
                            " EnviadoABaseDeDatosCentral = ? "+
                            " WHERE choferID= ?"
                        
                        await (await db).transaction(
                            async(tx)=>{
                                tx.executeSql(updateDriverSentence, [
                                    driversFromAPI[i].nombreChofer,
                                    driversFromAPI[i].fechaCreacion,
                                    driversFromAPI[i].fechaUltimaModificacion,
                                    driversFromAPI[i].fechaEliminacion,
                                    driversFromAPI[i].fechaSincronizacion,
                                    driversFromAPI[i].activoChofer,
                                    driversFromAPI[i].estadoChofer,
                                    driversFromAPI[i].vehiculoID,
                                    driversFromAPI[i].creadoPor,
                                    sentToCentralDB,
                                    driversFromAPI[i].choferID
                                ],
                                (res)=>{
                                    msgToReport=msgToReport + ' - choferID: '+ driversFromAPI[i].choferID+' transaction: UPDATE SUCCESS '

                                },
                                (error)=>{
                                    msgToReport=msgToReport + ' - choferDI: '+ driversFromAPI[i].choferID +' transaction: UPDATE FAIL , reason: '+JSON.stringify(error)
                                })
                                
                        });
                    }
                } catch (error) {
                    console.log(error)
                }

                
            } 
            console.log('Summary of transaction: ' + msgToReport + "transaction No: "  +JSON.stringify(response.data.transaccionID)) ;
            
            postSetCodyData(token,
                            response.data.transaccionID.toString(),
                            'choferes',
                            globalSettings.setCodyDataResult.success.toString(),
                            msgToReport)
                            
        }
    }
   
    
    
    
}

export const requestAndSaveDestinations =async (token:string,deviceId?:string)=>{
    let msgToReport=''

    const date = dateFormated();

    const excavacionesDB = axios.create({
        baseURL: globalSettings.Api.devEndPoint,
        params:{
            appUniqueID:'3',
            token:token,
        }
     });   

    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    const response = await excavacionesDB.get<DestinationsResponse>('/codydestinos',
    config
    )
    console.log(JSON.stringify(response.data))
    
    if (response.data.transaccionID){
            console.log(JSON.stringify(response.data))
        let destinationsFromAPI:Destino[]=response.data[0] as Destino[]
        msgToReport=" Items received: " +destinationsFromAPI.length; " - "
        if (destinationsFromAPI.length>0){
            for (let i=0; i<destinationsFromAPI.length; i++){
                console.log(i+' ITEM'+ JSON.stringify(destinationsFromAPI[i]))
                try {
                    if  (!destinationsFromAPI[i].fechaSincronizacion) { 
                        console.log('Insert')
                        let insertDestinationsSentece="INSERT INTO destinos ("+
                        "nombreDestino, "+
                        "direccionDestino, "+
                        "codigoPostal, "+
                        "fechaCreacion, "+
                        "fechaUltimaModificacion, "+
                        "fechaEliminacion, "+
                        "fechaSincronizacion, "+
                        "activoDestino, "+
                        "estadoDestino, "+
                        "creadoPor, "+
                        "clienteID, "+
                        "destinoID) VALUES  (?,?,?,?,?,?,?,?,?,?,?,?)"

                        const sentToCentralDB=1;
                        await (await db).transaction(
                            async(tx)=>{
                                tx.executeSql(insertDestinationsSentece,[
                                    destinationsFromAPI[i].nombreDestino,
                                    destinationsFromAPI[i].direccionDestino,
                                    destinationsFromAPI[i].codigoPostal,
                                    destinationsFromAPI[i].fechaCreacion,
                                    destinationsFromAPI[i].fechaUltimaModificacion,
                                    destinationsFromAPI[i].fechaEliminacion,
                                    destinationsFromAPI[i].fechaSincronizacion,
                                    destinationsFromAPI[i].activoDestino,
                                    destinationsFromAPI[i].estadoDestino,
                                    destinationsFromAPI[i].creadoPor,
                                    destinationsFromAPI[i].clienteID,
                                    destinationsFromAPI[i].destinoID
                                ],
                                (res)=>{
                                    msgToReport=msgToReport + ' - destinoID: '+ destinationsFromAPI[i].destinoID+' transaction: INSERT SUCCESS, '
                                    console.log(+ ' - destinoID: '+ destinationsFromAPI[i].destinoID+' transaction: INSERT SUCCESS, ' )

                                },
                                (error)=>{
                                    console.log('ERROR '+ ' - destinoID: '+ destinationsFromAPI[i].destinoID +' transaction: INSERT FAIL , reason: '+JSON.stringify(error) )
                                    msgToReport=msgToReport + ' - destinoID: '+ destinationsFromAPI[i].destinoID +' transaction: INSERT FAIL , reason: '+JSON.stringify(error)
                                }
                                );
                        });
                    }
                    else{
                        let updateDriverSentence="UPDATE destinos"+
                           " SET nombreDestino = ?,"+
                           " direccionDestino = ?,"+
                           " codigoPostal = ?,"+
                           " fechaCreacion = ?,"+
                           " fechaUltimaModificacion = ?,"+
                           " fechaEliminacion = ?,"+
                           " fechaSincronizacion = ?,"+
                           " activoDestino = ?,"+
                           " estadoDestino = ?,"+
                           " creadoPor = ?,"+
                           " clienteID = ? "+
                           " WHERE destinoID=?"
                        
                        await (await db).transaction(
                            async(tx)=>{
                                tx.executeSql(updateDriverSentence, [
                                    destinationsFromAPI[i].nombreDestino,
                                    destinationsFromAPI[i].direccionDestino,
                                    destinationsFromAPI[i].codigoPostal,
                                    destinationsFromAPI[i].fechaCreacion,
                                    destinationsFromAPI[i].fechaUltimaModificacion,
                                    destinationsFromAPI[i].fechaEliminacion,
                                    destinationsFromAPI[i].fechaSincronizacion,
                                    destinationsFromAPI[i].activoDestino,
                                    destinationsFromAPI[i].estadoDestino,
                                    destinationsFromAPI[i].creadoPor,
                                    destinationsFromAPI[i].clienteID,
                                    destinationsFromAPI[i].destinoID
                                ],
                                (res)=>{
                                    msgToReport=msgToReport + ' - destinoID: '+ destinationsFromAPI[i].destinoID+' transaction: UPDATE SUCCESS '

                                },
                                (error)=>{
                                    msgToReport=msgToReport + ' - destinoID: '+ destinationsFromAPI[i].destinoID +' transaction: UPDATE FAIL , reason: '+JSON.stringify(error)
                                })
                                
                        });
                    }
                } catch (error) {
                    console.log(error)
                }

                
            } 
            console.log('Summary of transaction: ' + msgToReport + "transaction No: "  +JSON.stringify(response.data.transaccionID)) ;
            
            postSetCodyData(token,
                            response.data.transaccionID.toString(),
                            'destinos',
                            globalSettings.setCodyDataResult.success.toString(),
                            msgToReport)
                            
                            
        }
    }
   
    
    
    
}

export const requestAndSaveClients =async (token:string,deviceId?:string)=>{
    let msgToReport=''

    const date = dateFormated();

    const excavacionesDB = axios.create({
        baseURL: globalSettings.Api.devEndPoint,
        params:{
            appUniqueID:'3',
            token:token,
        }
     });   

    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    const response = await excavacionesDB.get<ClientsResponse>('/codyclientes',
    config
    )
    console.log(JSON.stringify(response.data))
    
    if (response.data.transaccionID){
            console.log(JSON.stringify(response.data))
        let clientsFromAPI:Cliente[]=response.data[0] as Cliente[]
        msgToReport=" Items received: " +clientsFromAPI.length; " - "
        if (clientsFromAPI.length>0){
            for (let i=0; i<clientsFromAPI.length; i++){
                console.log(i+' ITEM'+ JSON.stringify(clientsFromAPI[i]))
                try {
                    if  (!clientsFromAPI[i].fechaSincronizacion) { 
                        console.log('Insert')
                        let insertClientsSentence="INSERT INTO clientes ("+
                        "nombreCliente, "+
                        "direccionFiscal, "+
                        "codigoPostal, "+
                        "contacto, "+
                        "fechaCreacion, "+
                        "fechaUltimaModificacion, "+
                        "fechaEliminacion, "+
                        "fechaSincronizacion, "+
                        "activoCliente, "+
                        "estadoCliente, "+
                        "creadoPor, "+
                        "empresaID, "+
                        "EnviadoABaseDeDatosCentral, "+
                        "clienteID ) VALUES  (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                        const sentToCentralDB=1;
                        await (await db).transaction(
                            async(tx)=>{
                                tx.executeSql(insertClientsSentence,[
                                    clientsFromAPI[i].nombreCliente,
                                    clientsFromAPI[i].direccionFiscal,
                                    clientsFromAPI[i].codigoPostal,
                                    clientsFromAPI[i].contacto,
                                    clientsFromAPI[i].fechaCreacion,
                                    clientsFromAPI[i].fechaUltimaModificacion,
                                    clientsFromAPI[i].fechaEliminacion,
                                    clientsFromAPI[i].fechaSincronizacion,
                                    clientsFromAPI[i].activoCliente,
                                    clientsFromAPI[i].estadoCliente,
                                    clientsFromAPI[i].creadoPor,
                                    clientsFromAPI[i].empresaID,
                                    sentToCentralDB,
                                    clientsFromAPI[i].clienteID
                                ],
                                (res)=>{
                                    msgToReport=msgToReport + ' - clienteID: '+ clientsFromAPI[i].clienteID+' transaction: INSERT SUCCESS, '
                                    console.log(+ ' - clienteID: '+ clientsFromAPI[i].clienteID+' transaction: INSERT SUCCESS, ' )

                                },
                                (error)=>{
                                    console.log('ERROR '+ ' - clienteID: '+ clientsFromAPI[i].clienteID +' transaction: INSERT FAIL , reason: '+JSON.stringify(error) )
                                    msgToReport=msgToReport + ' - clienteID: '+ clientsFromAPI[i].clienteID +' transaction: INSERT FAIL , reason: '+JSON.stringify(error)
                                }
                                );
                        });
                    }
                    else{
                        let updateClientsSentece="UPDATE clientes"+
                            " SET nombreCliente = ?,"+
                            " direccionFiscal = ?,"+
                            " codigoPostal = ?,"+
                            " contacto = ?,"+
                            " fechaCreacion = ?,"+
                            " fechaUltimaModificacion = ?,"+
                            " fechaEliminacion = ?,"+
                            " fechaSincronizacion = ?,"+
                            " activoCliente = ?,"+
                            " estadoCliente = ?,"+
                            " creadoPor = ?,"+
                            " empresaID = ?,"+
                            " EnviadoABaseDeDatosCentral =? "+
                            " WHERE clienteID=?"
                        
                        await (await db).transaction(
                            async(tx)=>{
                                tx.executeSql(updateClientsSentece, [
                                    clientsFromAPI[i].nombreCliente,
                                    clientsFromAPI[i].direccionFiscal,
                                    clientsFromAPI[i].codigoPostal,
                                    clientsFromAPI[i].contacto,
                                    clientsFromAPI[i].fechaCreacion,
                                    clientsFromAPI[i].fechaUltimaModificacion,
                                    clientsFromAPI[i].fechaEliminacion,
                                    clientsFromAPI[i].fechaSincronizacion,
                                    clientsFromAPI[i].activoCliente,
                                    clientsFromAPI[i].estadoCliente,
                                    clientsFromAPI[i].creadoPor,
                                    clientsFromAPI[i].empresaID,
                                    sentToCentralDB,
                                    clientsFromAPI[i].clienteID
                                ],
                                (res)=>{
                                    msgToReport=msgToReport + ' - clienteID: '+ clientsFromAPI[i].clienteID+' transaction: UPDATE SUCCESS '

                                },
                                (error)=>{
                                    msgToReport=msgToReport + ' - clienteID: '+ clientsFromAPI[i].clienteID+' transaction: UPDATE FAIL , reason: '+JSON.stringify(error)
                                })
                                
                        });
                    }
                } catch (error) {
                    console.log(error)
                }

                
            } 
            console.log('Summary of transaction: ' + msgToReport + "transaction No: "  +JSON.stringify(response.data.transaccionID)) ;
            
            postSetCodyData(token,
                            response.data.transaccionID.toString(),
                            'clientes',
                            globalSettings.setCodyDataResult.success.toString(),
                            msgToReport)
                       
                            
        }
    }
   
    
    
    
}

export const requestAndSaveTickets =async (token:string,deviceId?:string)=>{
    
    let msgToReport=''

    const date = dateFormated();

    const excavacionesDB = axios.create({
        baseURL: globalSettings.Api.devEndPoint,
        params:{
            appUniqueID:'3',
            token:token,
        }
     });   

    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    const response = await excavacionesDB.get<valessResponse>('/codyvales',
    config
    )
    console.log(JSON.stringify(response.data))
    
    if (response.data.transaccionID){
            console.log(JSON.stringify(response.data))
        let ticketsFromAPI:Vale[]=response.data[0] as Vale[]
        msgToReport=" Items received: " +ticketsFromAPI.length; " - "
        if (ticketsFromAPI.length>0){
            for (let i=0; i<ticketsFromAPI.length; i++){
                console.log(i+' ITEM'+ JSON.stringify(ticketsFromAPI[i]))
                try {
                    if  (!ticketsFromAPI[i].fechaSincronizacion) { 
                        console.log('Insert')
                        let insertTicketsSentence = "INSERT INTO vales ("+
                        "bancoID, "+
                        "serie, "+
                        "folio, "+
                        "folioDigital, "+
                        "folioFisico, "+
                        "fechaVale, "+
                        "tipoUnidad, "+
                        "placa, "+
                        "numeroEconomico, "+
                        "numeroValeTriturador, "+
                        "observaciones, "+
                        "fechaCreacion, "+
                        "activoVale, "+
                        "estadoVale, "+
                        "clienteID, "+
                        "destinoID, "+
                        "vehiculoID, "+
                        "empresaID, "+
                        "creadoPor, "+
                        "EnviadoABaseDeDatosCentral, "+
                        "valeID )VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
                        
                        const sentToCentralDB=1;
                        await (await db).transaction(
                            async(tx)=>{
                                tx.executeSql(insertTicketsSentence,[
                                    ticketsFromAPI[i].bancoID, 
                                    ticketsFromAPI[i].serie, 
                                    ticketsFromAPI[i].folio, 
                                    ticketsFromAPI[i].folioDigital, 
                                    ticketsFromAPI[i].folioFisico, 
                                    ticketsFromAPI[i].fechaVale, 
                                    ticketsFromAPI[i].tipoUnidad, 
                                    ticketsFromAPI[i].placa, 
                                    ticketsFromAPI[i].numeroEconomico, 
                                    ticketsFromAPI[i].numeroValeTriturador, 
                                    ticketsFromAPI[i].observaciones, 
                                    ticketsFromAPI[i].fechaCreacion, 
                                    ticketsFromAPI[i].activoVale, 
                                    ticketsFromAPI[i].estadoVale, 
                                    ticketsFromAPI[i].clienteID, 
                                    ticketsFromAPI[i].destinoID, 
                                    ticketsFromAPI[i].vehiculoID, 
                                    ticketsFromAPI[i].empresaID, 
                                    ticketsFromAPI[i].creadoPor, 
                                    sentToCentralDB,
                                    ticketsFromAPI[i].valeID 
                                ],
                                (res)=>{
                                    console.log(+ ' - valeID: '+  ticketsFromAPI[i].valeID +' transaction: INSERT SUCCESS, ' )
                                    msgToReport=msgToReport + ' - valeID: '+  ticketsFromAPI[i].valeID +' transaction: INSERT SUCCESS, ' ;


                                },
                                (error)=>{
                                    msgToReport=msgToReport + ' - valeID: '+ ticketsFromAPI[i].valeID  +' transaction: INSERT FAIL , reason: '+JSON.stringify(error)
                                    msgToReport=msgToReport + ' - valeID: '+ ticketsFromAPI[i].valeID  +' transaction: INSERT FAIL , reason: '+JSON.stringify(error)

                                }
                                );
                        });
                    }
                    else{
                        let updateTicketsSentence="UPDATE vales"+
                            "SET bancoID = ?,"+
                            "serie = ?,"+
                            "folio = ?,"+
                            "folioDigital = ?,"+
                            "folioFisico = ?,"+
                            "fechaVale = ?,"+
                            "tipoUnidad = ?,"+
                            "placa = ?,"+
                            "numeroEconomico = ?,"+
                            "numeroValeTriturador = ?,"+
                            "observaciones = ?,"+
                            "fechaCreacion = ?,"+
                            "activoVale = ?,"+
                            "estadoVale = ?,"+
                            "clienteID = ?,"+
                            "destinoID = ?,"+
                            "vehiculoID = ?,"+
                            "empresaID = ?,"+
                            "creadoPor = ?, "+
                            "EnviadoABaseDeDatosCentral = ?"
                            " WHERE valeID= ?"                       
                        await (await db).transaction(
                            async(tx)=>{
                                tx.executeSql(updateTicketsSentence, [
                                    ticketsFromAPI[i].bancoID, ,
                                    ticketsFromAPI[i].serie, ,
                                    ticketsFromAPI[i].folio, ,
                                    ticketsFromAPI[i].folioDigital, ,
                                    ticketsFromAPI[i].folioFisico, ,
                                    ticketsFromAPI[i].fechaVale, ,
                                    ticketsFromAPI[i].tipoUnidad, ,
                                    ticketsFromAPI[i].placa, ,
                                    ticketsFromAPI[i].numeroEconomico, ,
                                    ticketsFromAPI[i].numeroValeTriturador, ,
                                    ticketsFromAPI[i].observaciones, ,
                                    ticketsFromAPI[i].fechaCreacion, ,
                                    ticketsFromAPI[i].activoVale, ,
                                    ticketsFromAPI[i].estadoVale, ,
                                    ticketsFromAPI[i].clienteID, ,
                                    ticketsFromAPI[i].destinoID, ,
                                    ticketsFromAPI[i].vehiculoID, ,
                                    ticketsFromAPI[i].empresaID, ,
                                    ticketsFromAPI[i].creadoPor, ,
                                    sentToCentralDB,
                                    ticketsFromAPI[i].valeID 
                                ],
                                (res)=>{
                                    msgToReport=msgToReport + ' - valeID: '+ ticketsFromAPI[i].valeID +' transaction: UPDATE SUCCESS '

                                },
                                (error)=>{
                                    msgToReport=msgToReport + ' - valeID: '+ ticketsFromAPI[i].valeID +' transaction: UPDATE FAIL , reason: '+JSON.stringify(error)
                                })
                                
                        });
                    }
                } catch (error) {
                    console.log(error)
                }

                
            } 
            console.log('Summary of transaction: ' + msgToReport + "transaction No: "  +JSON.stringify(response.data.transaccionID)) ;
            
            postSetCodyData(token,
                            response.data.transaccionID.toString(),
                            'vales',
                            globalSettings.setCodyDataResult.success.toString(),
                            msgToReport)
                       
                            
        }
    }
   
    
    
    
}

export const postTicketsToDB= async(empresaID:number,token:string,deviceId?:string)=>{
    const selectTicketsPendingSentence=" SELECT * FROM vales WHERE empresaID= ? AND EnviadoABaseDeDatosCentral=0"
    let ticketsPending:Vale[]=[];
    await (await db).transaction(
        async(tx)=>{
            tx.executeSql(selectTicketsPendingSentence,[
                empresaID
            ],
            (res,ResultSet)=>{
                ticketsPending =ResultSet.rows.raw() as Vale[];
                
            },
            (error)=>{
                console.log(JSON.stringify(error) )
            }
            );
    });

    console.log('ticketsPending: '+ticketsPending.length )
    console.log('ticketsPending: '+JSON.stringify(ticketsPending) )

    if (ticketsPending.length >0){ //There are pending tickets
        const date = dateFormated();

        const excavacionesDB = axios.create({
            baseURL: globalSettings.Api.devEndPoint,
            params:{
                appUniqueID:'3',
                token:token,
            }
         });   
    
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        
        for ( let i=0; i< ticketsPending.length; i++){
            let ticketDetails:{}[]=[]
            let itemsFound=false;
            const selectTicketsMaterialsPendingSentence=" select * from valesmateriales where valeId=?"
            let ticketsMaterialsPending:Valematerial[]=[];
            try {
                await (await db).transaction(
                    async(tx)=>{
                        tx.executeSql(selectTicketsMaterialsPendingSentence,[
                        ticketsPending[i].valeID.toString()
                        ],
                        (res,ResultSet)=>{
                            ticketsMaterialsPending =ResultSet.rows.raw() as Valematerial[];
                            if (ticketsMaterialsPending.length > 0){     
                                for (let j=0; j<ticketsMaterialsPending.length; j++){
                                    console.log(ticketsPending[i].valeID+' ' + JSON.stringify(ResultSet.rows.raw()))
                                    itemsFound=true;
                                    ticketDetails.push({
                                        valeMaterialID : ticketsMaterialsPending[j].valeMaterialID.toString(),
                                        folioDigital : 'N/A',
                                        materialID : ticketsMaterialsPending[j].materialID.toString(),
                                        materialNombre : ticketsMaterialsPending[j].materialNombre.toString(),
                                        cantidadm3 : ticketsMaterialsPending[j].cantidadm3.toString(),
                                    })
                                }                   
                                
                            }
                        },
                        (error)=>{
                            console.log(JSON.stringify(error) )
                        }
                        );
                });
                
                if (itemsFound){
                    console.log('tickets materials before body: ' +JSON.stringify(ticketDetails))

                    let bodyParameters = {
                        transaccionID : '1000',
                        valeID : ticketsPending[i].valeID.toString(),
                        bancoID :  ticketsPending[i].bancoID.toString(),
                        empresaID :  ticketsPending[i].empresaID.toString(),
                        serie:ticketsPending[i].serie.toString(),
                        folio : ticketsPending[i].folio.toString(),
                        folioDigital : ticketsPending[i].folioDigital.toString(),
                        folioFisico : ticketsPending[i].folioFisico.toString(),
                        fechaVale : dateFormated (ticketsPending[i].fechaVale!),
                        clienteID : ticketsPending[i].clienteID.toString(),
                        clienteNombre :ticketsPending[i].clienteNombre?ticketsPending[i].clienteNombre:"",
                        destinoID : ticketsPending[i].destinoID.toString(),
                        destinoNombre : ticketsPending[i].destinoNombre?ticketsPending[i].destinoNombre:"",
                        vehiculoID : ticketsPending[i].vehiculoID.toString(),
                        vehiculoNombre : ticketsPending[i].vehiculoNombre?ticketsPending[i].vehiculoNombre:"",
                        tipoUnidad : ticketsPending[i].tipoUnidad.toString(),
                        placa : ticketsPending[i].placa.toString(),
                        numeroEconomico : ticketsPending[i].numeroEconomico.toString(),
                        numeroValeTriturador : ticketsPending[i].numeroValeTriturador.toString(),
                        observaciones : ticketsPending[i].observaciones.toString(),
                        fechaEntradaVehiculo : ticketsPending[i].fechaEntradaVehiculo?ticketsPending[i].fechaEntradaVehiculo:"",
                        fechaSalidaVehiculo : ticketsPending[i].fechaSalidaVehiculo?ticketsPending[i].fechaSalidaVehiculo:"",
                        choferID : ticketsPending[i].choferID?ticketsPending[i].choferID:"",
                        choferNombre : ticketsPending[i].choferNombre?ticketsPending[i].choferNombre:"",
                        firma : ticketsPending[i].firma?ticketsPending[i].firma:"",
                        fechaCreacion : dateFormated(ticketsPending[i].fechaCreacion!),
                        fechaUltimaModificacion : ticketsPending[i].fechaUltimaModificacion?ticketsPending[i].fechaUltimaModificacion:"",
                        fechaEliminacion : ticketsPending[i].fechaEliminacion?ticketsPending[i].fechaEliminacion:"",
                        fechaSincronizacion : date,
                        creadoPor : ticketsPending[i].creadoPor.toString(),
                        activoVale : ticketsPending[i].activoVale.toString(),
                        estadoVale : ticketsPending[i].estadoVale.toString(),
                        detalleVales: ticketDetails
                    };
                    console.log(bodyParameters)
                    //ready to send
                    const response = await excavacionesDB.post('/setcodyvales',
                    bodyParameters,
                    config
                    )
                    console.log(JSON.stringify(response.data))
                    //If data was sent successfully, then update local db
                    /*
                    const updateTicketToDBSentence= "UPDATE vales SET EnviadoABaseDeDatosCentral=1 WHERE valeID=?"
                    await (await db).transaction(
                        async(tx)=>{
                            tx.executeSql(updateTicketToDBSentence,[
                            ticketsPending[i].valeID.toString()
                            ],
                            (res,ResultSet)=>{
                                console.log(JSON.stringify(ResultSet))
                            },
                            (error)=>{
                                console.log(JSON.stringify(error) )
                            }
                            );
                    });
                    */
                }
            } catch (error) {
                console.error(error)
                ticketDetails=[];
                itemsFound=false;

                continue
            }
            
                  
        }
        
        /*
        const response = await excavacionesDB.post('/setcodypass',
        bodyParameters,
        config
        )
        */
    }
}