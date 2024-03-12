import {useEffect, useState } from 'react'
import { connectToDatabase } from '../data/dbStructure';
import { Destino } from '../interfaces/destino';

const db = connectToDatabase();

export const useDestinationsDB = () => {
 const [destinations,setDestinations] = useState<Destino[]>(
     []
 )
 let tempArray :Destino[]=[] ;

const getDestinations=async ()=>{
     try {
   
        (await db).transaction((tx) => {
          tx.executeSql("SELECT * FROM destinos", []).then(
            ([tx,results]) => {
              for (let i = 0; i <results.rows.length; i++) {
                tempArray.push(results.rows.item(i) as Destino)
              }
              setDestinations(tempArray);
    
            }
          );
        });
      } catch (error) {
        console.error(error)
        throw Error("Failed to get data from database")
      }
    
    
}

 useEffect(() => {
    getDestinations();
 }, [])
 
  return {
    destinations,
    getDestinations
  }
}
