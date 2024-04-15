import React from 'react'
import { connectToDatabase } from './dbStructure';
import { ResultSet } from 'react-native-sqlite-storage';

const db = connectToDatabase();

export const getLastRowTickets = async() => {
    interface nextRowinterface{
        nextRow:number
    }
    
    let nextRow:nextRowinterface[]=[]

    let selectSentence = "select count(valeID)+1 as nextRow from vales";
    const sentToCentralDB=0;                

    await (await db).transaction(
        async(tx)=>{
            console.log('sentence to select: '+selectSentence);
            tx.executeSql(selectSentence,[
            ],
            (res,ResultSet)=>{
                if (ResultSet.rows.length>0){
                    console.log('LAST ROW: '+JSON.stringify(ResultSet.rows.item(0)))
                    nextRow.push(ResultSet.rows.item(0) as nextRowinterface)
                 }
                 else{
                     nextRow.push({
                        nextRow:1
                    })
                 } 

            },
            (tx,error)=>{
                console.log('error : '+JSON.stringify(error))

            }
            );
    });
    console.log(nextRow)
    const next= nextRow[0].nextRow;
    console.log(next)

    return next;
}
