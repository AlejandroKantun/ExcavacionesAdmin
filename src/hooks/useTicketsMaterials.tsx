import {useEffect, useState } from 'react'
import { connectToDatabase } from '../data/dbStructure';
import { Valematerial } from '../interfaces/valematerial';

const db = connectToDatabase();

export const useTicketsMaterialsDB = () => {
 const [ticketsMaterials,setTicketsMaterials] = useState<Valematerial[]>(
     []
 )
 let tempArray :Valematerial[]=[] ;

const getTicketsMaterials=async ()=>{
     try {
   
        (await db).transaction((tx) => {
          tx.executeSql("SELECT * FROM valesmateriales", []).then(
            ([tx,results]) => {
              for (let i = 0; i <results.rows.length; i++) {
                tempArray.push(results.rows.item(i) as Valematerial)
              }
              setTicketsMaterials(tempArray);
    
            }
          );
        });
      } catch (error) {
        console.error(error)
        throw Error("Failed to get data from database")
      }
    
}

 useEffect(() => {
    getTicketsMaterials();
 }, [])
 
  return {
    ticketsMaterials,
    getTicketsMaterials
  }
}
