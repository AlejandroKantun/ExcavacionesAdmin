import React from 'react'

import { connectToDatabase } from './dbStructure';
import { ResultSet } from 'react-native-sqlite-storage';
const db = connectToDatabase();
interface empresaInUser{
    empresaID:number,
    usuarioID:number,
    bancoID:number,
}
export const getEmpresaIDwithUserID = async (userID:string) => {
    let empresaID=0;
    const selectSentence= "select usuarios.usuarioID,usuarios.bancoID, empresas.empresaID from usuarios INNER JOIN bancosempresas on bancosempresas.bancoID = usuarios.bancoID INNER JOIN empresas on empresas.empresaID =bancosempresas.empresaID "+
    "WHERE usuarios.usuario=?"
    var empresas:empresaInUser[]=[];

    const promise =   new Promise(
        async (resolve, reject) => {
        (await db).transaction(
            async(tx)=>{

                
                         await tx.executeSql(selectSentence, [userID],
                            (tx,results)=>{
                                if (results.rows.length >0){
                                    for (let i = 0; i <results.rows.length; i++) {
                                        empresas.push(results.rows.item(i) as empresaInUser)
                                   }
                                   resolve(empresas[0].empresaID);   
                                 }
                                 else {resolve(empresas)}
                            }
                            )
                            
        });
    });

    await promise.then((res)=>{
        return res;
    });
    return empresas;
}


