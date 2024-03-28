import { connectToDatabase } from './dbStructure';


const db = connectToDatabase();
const dateCreation =new Date();
export const SaveTicketsMaterialsToLocal = async(cantidadm3:number,valeId:number,materialID:number,countItemsInserted:number,materialNombre?:string,costom3?:number)=>{
    console.log('Insert')
    let insertTicketsMaterialSentence = "INSERT INTO valesmateriales ("+
    "materialNombre, "+
    "cantidadm3, "+
    "valeID, "+
    "materialID, "+
    "EnviadoABaseDeDatosCentral,"+
    "costom3"+
    " ) VALUES (?,?,?,?,?,?)"
    
    const sentToCentralDB=0;
    await (await db).transaction(
        async(tx)=>{
            tx.executeSql(insertTicketsMaterialSentence,[
                materialID==1?materialNombre:null,
                cantidadm3,
                valeId,
                materialID,
                sentToCentralDB,
                costom3
            ],
            (res,ResultSet)=>{
                if (ResultSet.rowsAffected >0 ){
                    console.log(' - valeID: '+  valeId+' with materialID '+ materialID +' transaction: INSERT SUCCESS, ' )
                    countItemsInserted=countItemsInserted+1;
                }
                
            },
            (error)=>{
               console.log(' - valeID: '+  valeId+' with materialID'+materialID + JSON.stringify(error) )
            }
            );
    });
}