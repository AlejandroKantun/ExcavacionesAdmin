import { Vale } from '../interfaces/Vale';
import { dateFormated } from './dateFormated';
import { connectToDatabase } from './dbStructure';
import { MaterialQty } from '../hooks/useMaterialQty';
import { SaveTicketsMaterialsToLocal } from './SaveTicketsMaterialsToLocalDB';
import { date } from 'yup';


const db = connectToDatabase();
const dateCreation =new Date();
export const UpdateTicketsOnDB = async(ticket:Vale,ticketsMaterials:MaterialQty[],byteCharacters?:any)=>{
    const today = new Date();

    let ticketId=0;
    let updateTicketSentence = "UPDATE vales SET "+
    "bancoID=?, "+
    "tipoUnidad=?, "+
    "placa=?, "+
    "numeroEconomico=?, "+
    "numeroValeTriturador=?, "+
    "observaciones=?, "+
    "clienteID=?, "+
    "destinoID=?, "+
    "vehiculoID=?, "+
    "empresaID=?, "+
    "EnviadoABaseDeDatosCentral=?, "+
    "empresaNombre=?, "+
    "clienteNombre=?, "+
    "destinoNombre=?, "+
    "vehiculoNombre=?, "+
    "firma=?, "+
    "importe=?, "+
    "numeroTolva=?, "+
    "fechaSalidaVehiculo=?, "+
    "choferID=?, "+
    "choferNombre=? "+

    " WHERE valeID=?"
    
    const sentToCentralDB=0;                
    let countItemsInserted=0;
    const promise =   new Promise(
        async (resolve, reject) => {
            

            await (await db).transaction(
                async(tx)=>{
                    tx.executeSql(updateTicketSentence,[
                        ticket.bancoID, 
                        ticket.tipoUnidad, 
                        ticket.placa, 
                        ticket.numeroEconomico, 
                        ticket.numeroValeTriturador, 
                        ticket.observaciones, 
                        ticket.clienteID, 
                        ticket.destinoID, 
                        ticket.vehiculoID, 
                        ticket.empresaID, 
                        sentToCentralDB,
                        ticket.empresaID==1?ticket.empresaNombre:"",
                        ticket.clienteID==1?ticket.clienteNombre:"",
                        ticket.destinoID==1?ticket.destinoNombre:"",
                        ticket.vehiculoID==1?ticket.vehiculoNombre:"",
                        byteCharacters?byteCharacters:'',
                        ticket.Importe,
                        ticket.numeroTolva,
                        byteCharacters?dateFormated(today):null,
                        ticket.choferID,
                        ticket.choferNombre,
                        ticket.valeID, 
                    ],
                    async (res,ResultSet)=>{
                        if (ResultSet.rowsAffected >0 ){
                            console.log(' - valeID: '+  ticket.valeID +' transaction: UPDATE SUCCESS, ' )
                            console.log(JSON.stringify(ResultSet))
                            
                            const deleteUpdateSentence ="UPDATE valesmateriales SET valeID=-1 WHERE valeID=?";
                            
                            await (await db).transaction(
                                async(tx)=>{
                                    tx.executeSql(deleteUpdateSentence,[ticket.valeID],
                                    (res,ResultSet)=>{
                                        if (ResultSet.rowsAffected >0 ){
                                            console.log(' - valeID: '+  ticket.valeID+' with rows of valesmateriales '+ ResultSet.rowsAffected  +' transaction: deleting SUCCESS, ' )
                                        }
                                        
                                    },
                                    (error)=>{
                                       console.log(' - valeID: '+  ticket.valeID+'ERROR '+  JSON.stringify(error) )
                                    }
                                    );
                            });

                            for (let i=0;i<ticketsMaterials.length;i++){
                                const result= await SaveTicketsMaterialsToLocal(
                                    ticketsMaterials[i].quantity,
                                    ticket.valeID,
                                    ticketsMaterials[i].materialID,
                                    countItemsInserted,
                                    ticketsMaterials[i].materialName,
                                    ticketsMaterials[i].newImport)
                            }
                            console.log('items inserted in materialticket '+ countItemsInserted )
                            resolve(ticket.valeID)
                        }
                        
                    },
                    (error)=>{
                       console.log(' - valeID: '+  ticket.valeID +' transaction: UPDATE FAIL Reason:' + JSON.stringify(error) )
                    }
                    );
            });

        });
    await promise.then((res)=>{
        ticketId=res as number;
        console.log('FINAL ticketID updated: '+ JSON.stringify(ticketId))
        return ticketId;
    })
    
    return ticketId;
}