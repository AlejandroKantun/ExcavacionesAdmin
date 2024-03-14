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
            tx.executeSql(selectSentence,[
            ],
            (res,ResultSet)=>{
                if (ResultSet.rows.length>0){
                    //console.log('LAST ROW: '+JSON.stringify(''))
                    nextRow.push(ResultSet.rows.item(0) as nextRowinterface)
                 } 

            },
            (error)=>{
            }
            );
    });
    console.log(nextRow)
    const next= nextRow[0].nextRow;
    console.log(next)

    return next;
}
