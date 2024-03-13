import {useState } from 'react'
import { connectToDatabase } from '../data/dbStructure';
import { Vale } from '../interfaces/vale';

const db = connectToDatabase();

export const useTicketsDBByValeID = () => {
 const [tickets,setTickets] = useState<Vale[]>(
     []
 )
 let tempArray :Vale[]=[] ;

const getTicketsByID=async (valeId:number)=>{
  try {

     (await db).transaction((tx) => {
       tx.executeSql("SELECT * FROM vales WHERE valeID=?", [valeId]).then(
         ([tx,results]) => {
           for (let i = 0; i <results.rows.length; i++) {
             tempArray.push(results.rows.item(i) as Vale)
           }
           setTickets(tempArray);
         }
       );
     });
   } catch (error) {
     console.error(error)
     throw Error("Failed to get data from database")
   }
 
}

 
  return {
    tickets,
    getTicketsByID
  }
}
