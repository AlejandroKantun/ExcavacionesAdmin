import { Vale } from '../interfaces/Vale';
import { dateFormated } from './dateFormated';
import { connectToDatabase } from './dbStructure';
import { MaterialQty } from '../hooks/useMaterialQty';
import { SaveTicketsMaterialsToLocal } from './SaveTicketsMaterialsToLocalDB';
import { date } from 'yup';


const db = connectToDatabase();
const dateCreation =new Date();
export const SaveTicketsToLocalDB = async(ticket:Vale,ticketsMaterials:MaterialQty[],byteCharacters?:any)=>{
    const today = new Date();

    let ticketId=0;
    let insertTicketsSentence = "INSERT INTO vales ("+
    "bancoID, "+
    "serie, "+
    "folio, "+
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
    "empresaNombre, "+
    "clienteNombre, "+
    "destinoNombre, "+
    "vehiculoNombre, "+
    "firma, "+
    "importe, "+
    "fechaEntradaVehiculo, "+
    "numeroTolva, "+
    "fechaSalidaVehiculo, "+
    "folioDigital, "+
    "formadepago, "+
    "choferID, "+
    "choferNombre "+

    " )VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
    
    const sentToCentralDB=0;                
    let countItemsInserted=0;
    const promise =   new Promise(
        async (resolve, reject) => {
            

            await (await db).transaction(
                async(tx)=>{
                    tx.executeSql(insertTicketsSentence,[
                        ticket.bancoID, 
                        'A', 
                        ticket.folio, 
                        ticket.folioFisico, 
                        dateFormated(ticket.fechaVale!), 
                        ticket.tipoUnidad, 
                        ticket.placa, 
                        ticket.numeroEconomico, 
                        ticket.numeroValeTriturador, 
                        ticket.observaciones, 
                        dateFormated(dateCreation), 
                        1, 
                        1, 
                        ticket.clienteID, 
                        ticket.destinoID, 
                        ticket.vehiculoID, 
                        ticket.empresaID, 
                        ticket.creadoPor, 
                        sentToCentralDB,
                        ticket.empresaID==1?ticket.empresaNombre:"",
                        ticket.clienteID==1?ticket.clienteNombre:"",
                        ticket.destinoID==1?ticket.destinoNombre:"",
                        ticket.vehiculoID==1?ticket.vehiculoNombre:"",
                        byteCharacters?byteCharacters:'',
                        ticket.Importe,
                        dateFormated(ticket.fechaEntradaVehiculo!),
                        ticket.numeroTolva,
                        byteCharacters?dateFormated(today):null,
                        ticket.folioDigital, 
                        ticket.formadepago,
                        ticket.choferID,
                        ticket.choferNombre
                    ],
                    async (res,ResultSet)=>{
                        if (ResultSet.rowsAffected >0 ){
                            console.log(' - valeID: '+  ticket.valeID +' transaction: INSERT SUCCESS, ' )
                            console.log(JSON.stringify(ResultSet))
                            
                            for (let i=0;i<ticketsMaterials.length;i++){
                                const result= await SaveTicketsMaterialsToLocal(
                                    ticketsMaterials[i].quantity,
                                    ResultSet.insertId,
                                    ticketsMaterials[i].materialID,
                                    countItemsInserted,
                                    ticketsMaterials[i].materialName,
                                    ticketsMaterials[i].newImport)
                            }
                            console.log('items inserted in materialticket '+ countItemsInserted )
                            resolve(ResultSet.insertId)
                        }
                        
                    },
                    (error)=>{
                       console.log(' - valeID: '+  ticket.valeID +' transaction: INSERT FAIL Reason:' + JSON.stringify(error) )
                    }
                    );
            });

        });
    await promise.then((res)=>{
        ticketId=res as number;
        console.log('FINAL ticketID inserted: '+ JSON.stringify(ticketId))
        return ticketId;
    })
    
    return ticketId;
}