import { Alert } from 'react-native';
import { connectToDatabase } from './dbStructure';
const db = connectToDatabase();

export const deleteTicketLocalDB = async (ticketID:number, reason:string) => {
    let result:unknown|string='';
    const promise =   new Promise(
        async (resolve, reject) => {
        (await db).transaction(
                        (tx)=>{
                            tx.executeSql("Update vales set observacionesEliminar= ? , estadoVale=0 where valeID=?", [reason,ticketID],
                            (transaction,ResultSet)=>{
                                    if(ResultSet.rowsAffected>0){
                                        resolve('Success' )
                                    }
                            },
                            (error)=>{
                                reject(error)
                        },
                            )                                                                                                                                
                                    
                    });
    }
    );
    await promise.then((res)=>{
        console.log(' re1s ' + res)
        result=res;
        return res;
    })
    console.log(' re2s ' + result)

    return result
}
