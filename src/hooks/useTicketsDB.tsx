import {useEffect, useState } from 'react'
import { connectToDatabase } from '../data/dbStructure';
import { Vale } from '../interfaces/vale';

const db = connectToDatabase();

export const useTicketsDB = () => {
 const [tickets,setTickets] = useState<Vale[]>(
     []
 )
 let tempArray :Vale[]=[] ;

const getTickets=async ()=>{
     try {
   
        (await db).transaction((tx) => {
          tx.executeSql("SELECT * FROM vales", []).then(
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

 useEffect(() => {
    getTickets();
 }, [])
 
  return {
    tickets,
    getTickets
  }
}
